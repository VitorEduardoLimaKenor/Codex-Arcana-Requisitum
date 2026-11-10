import { useCallback, useRef, useState } from "react";
import type React from "react";
import { Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { RoomLimits } from "../../components/RoomLimits";
import { ROOM_RADIUS, roomsApi } from "../../services/rooms";
import { locate } from "../../services/location";
import { useAuth } from "../../state/auth";
import { Button } from "../../components/Button";
import { Field, Help, InfoButton, PageHeader } from "../../components/ui";
import { AdventureCard } from "../../components/AdventureCard";
import { useAdventures } from "../../hooks/useAdventures";
import { roomNameFor } from "../../data/adventures";
import { colors, fonts, styles } from "../../styles";
export default function CreateRoom() {
  const { user } = useAuth();
  const { adventureId } = useLocalSearchParams<{ adventureId?: string }>();
  const { adventures, ready } = useAdventures();
  const [chosenId, setChosenId] = useState<string | undefined>(adventureId);
  const [showAll, setShowAll] = useState(false);
  const chosen = adventures.find((a) => a.id === chosenId);
  // Com uma aventura já escolhida, mostra só ela até o mestre pedir para trocar.
  const visible = chosen && !showAll ? [chosen] : adventures;
  const active = useRef(false);
  useFocusEffect(
    useCallback(() => {
      active.current = true;
      return () => {
        active.current = false;
      };
    }, []),
  );
  const [group, setGroup] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const step = (n: string, title: string, info?: React.ReactNode) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Text style={{ color: colors.primary, fontFamily: fonts.mono, fontWeight: "700" }}>{n}</Text>
      <Text style={styles.section}>{title}</Text>
      {info}
    </View>
  );
  return (
    <Screen>
      <PageHeader
        eyebrow="Nova sala"
        title="Prepare o encontro"
        subtitle="Escolha a aventura e as vagas. Os alunos entram no lobby."
      />
      <View style={{ gap: 12 }}>
        {step("01", "Escolha a aventura")}
        {!ready ? (
          <Text style={styles.label}>Carregando aventuras…</Text>
        ) : (
          <View style={{ gap: 8 }} accessibilityRole="radiogroup">
            {visible.map((adventure) => (
              <AdventureCard
                key={adventure.id}
                adventure={adventure}
                selection
                selected={adventure.id === chosenId}
                onPress={() => {
                  setChosenId(adventure.id);
                  setShowAll(false);
                }}
              />
            ))}
            {chosen && !showAll && (
              <Button variant="ghost" title="Trocar aventura" onPress={() => setShowAll(true)} />
            )}
          </View>
        )}
        {chosen && (
          <Field
            label="Turma (opcional)"
            hint={`A sala vai se chamar “${roomNameFor(chosen, group)}”.`}
            value={group}
            onChangeText={setGroup}
            maxLength={30}
            editable={!busy}
            placeholder="Ex.: Turma A · noite"
          />
        )}
      </View>
      <View style={{ gap: 12 }}>
        {step("02", "Vagas e grupos")}
        <View style={styles.card}>
          {!!stage && (
            <Text accessibilityLiveRegion="polite" style={[styles.body, { color: colors.primary }]}>
              {stage}
            </Text>
          )}
          <RoomLimits
            initial={{ capacity: 12, groupCount: 3, groupSize: 4 }}
            busy={busy}
            label="Criar sala aqui"
            onSave={async (settings) => {
              if (!user?.token)
                throw Error("Entre com uma conta online de mestre.");
              if (!chosen) throw Error("Escolha uma aventura no passo 01.");
              setBusy(true);
              setStage("Obtendo a localização do encontro…");
              try {
                const coords = await locate(ROOM_RADIUS);
                if (!active.current) return;
                setStage("Criando sua sala…");
                const room = await roomsApi.create(user, {
                  ...settings,
                  ...coords,
                  name: roomNameFor(chosen, group),
                  description: chosen.summary.slice(0, 1000),
                  radius: ROOM_RADIUS,
                });
                if (active.current)
                  router.replace({
                    pathname: "/lobby",
                    params: { roomId: room.id },
                  });
              } finally {
                setBusy(false);
                setStage("");
              }
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={[styles.notice, { flex: 1 }]}>
              📍 Sua localização vira o centro da sala, com raio de {ROOM_RADIUS} m.
            </Text>
            <InfoButton title="Como a sala usa o GPS">
              <Help>
                Os alunos precisam estar a até {ROOM_RADIUS} m de você para entrar,
                inclusive quem usa o código. Crie a sala de dentro da sala de aula.
              </Help>
            </InfoButton>
          </View>
        </View>
      </View>
    </Screen>
  );
}

