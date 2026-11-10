import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import { Disclosure } from "../../components/Disclosure";
import { AdventureIcon, AdventureMeta, NpcAvatar } from "../../components/AdventureCard";
import { Help, InfoButton, SectionHeader, Sheet } from "../../components/ui";
import { useAdventures } from "../../hooks/useAdventures";
import { attributes } from "../../data/codex";
import { alpha, colors, fonts, styles } from "../../styles";

export default function AdventureDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { adventures, ready, remove } = useAdventures();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState<number[]>([]);
  const adventure = adventures.find((a) => a.id === id);

  if (!adventure)
    return (
      <Screen>
        {ready ? (
          <>
            <Text style={styles.section}>Aventura não encontrada</Text>
            <Button title="Voltar" onPress={() => router.back()} />
          </>
        ) : (
          <ActivityIndicator color={colors.primary} />
        )}
      </Screen>
    );

  return (
    <Screen
      footer={
        <Button
          title="Usar em uma sala"
          arrow
          onPress={() =>
            router.push({ pathname: "/create-room", params: { adventureId: adventure.id } })
          }
        />
      }
    >
      <View
        style={[
          local.hero,
          {
            borderColor: alpha(adventure.color, 0.35),
            backgroundImage: `linear-gradient(160deg, ${alpha(adventure.color, 0.18)} 0%, ${alpha(adventure.color, 0)} 60%)`,
          },
        ]}
      >
        <AdventureIcon adventure={adventure} size={64} />
        <Text style={styles.title}>{adventure.title}</Text>
        <Text style={styles.subtitle}>{adventure.tagline}</Text>
        <AdventureMeta adventure={adventure} showLength />
      </View>

      <View style={{ gap: 10 }}>
        <SectionHeader
          title="Para a turma"
          info={
            <InfoButton title="Para a turma">
              <Help>Este texto aparece para os alunos na sala e no lobby.</Help>
            </InfoButton>
          }
        />
        <Text style={[styles.body, { color: colors.muted }]}>{adventure.summary}</Text>
      </View>

      {adventure.objectives.length > 0 && (
        <View style={{ gap: 10 }}>
          <SectionHeader title="Objetivos" />
          <View style={[styles.card, { gap: 10 }]}>
            {adventure.objectives.map((objective) => (
              <View key={objective} style={{ flexDirection: "row", gap: 10 }}>
                <Text style={{ color: colors.primary, fontWeight: "800" }}>✓</Text>
                <Text style={[styles.body, { flex: 1 }]}>{objective}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {adventure.scenes.length > 0 && (
        <View style={{ gap: 10 }}>
          <SectionHeader title="Roteiro" />
          <View>
            {adventure.scenes.map((scene, index) => {
              const last = index === adventure.scenes.length - 1;
              return (
                <View key={scene.title + index} style={{ flexDirection: "row", gap: 14 }}>
                  <View style={{ alignItems: "center" }}>
                    <View style={[local.node, { borderColor: adventure.color }]}>
                      <Text style={[local.nodeText, { color: adventure.color }]}>
                        {index + 1}
                      </Text>
                    </View>
                    {!last && <View style={local.line} />}
                  </View>
                  <View style={{ flex: 1, gap: 4, paddingBottom: last ? 0 : 20 }}>
                    <Text style={[styles.body, { fontWeight: "700" }]}>{scene.title}</Text>
                    {!!scene.text && <Text style={styles.label}>{scene.text}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {adventure.npcs.length > 0 && (
        <View style={{ gap: 10 }}>
          <SectionHeader
            title="Personagens"
            info={
              <InfoButton title="Personagens do mestre">
                <Help>
                  Você interpreta estas pessoas durante a aventura. Toque em uma
                  para ver o que ela precisa ou esconde — a turma deve descobrir
                  fazendo boas perguntas.
                </Help>
              </InfoButton>
            }
          />
          {adventure.npcs.map((npc, index) => {
            const open = revealed.includes(index);
            return (
              <Pressable
                key={`${npc.name}-${index}`}
                accessibilityRole="button"
                aria-expanded={open}
                accessibilityState={{ expanded: open }}
                accessibilityLabel={`${npc.name}. ${open ? "Ocultar" : "Ver"} o que esconde.`}
                onPress={() =>
                  setRevealed((list) =>
                    open ? list.filter((i) => i !== index) : [...list, index],
                  )
                }
                style={({ pressed }) => [
                  styles.card,
                  local.npc,
                  open && { borderColor: alpha(colors.warning, 0.4) },
                  pressed && styles.pressed,
                ]}
              >
                <NpcAvatar npc={npc} size={56} color={adventure.color} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={[styles.body, { fontWeight: "700" }]}>{npc.name}</Text>
                  {!!npc.role && <Text style={styles.label}>{npc.role}</Text>}
                  {!!npc.secret && (
                    <Text
                      style={[
                        local.secret,
                        { color: open ? colors.warning : colors.faint },
                      ]}
                    >
                      {open ? `🔓 ${npc.secret}` : "🔒 toque para ver o que esconde"}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {(adventure.tests.length > 0 || !!adventure.masterNotes) && (
        <View style={{ gap: 8 }}>
          <Text style={[styles.eyebrow, { color: colors.faint }]}>{"// "}Só para o mestre</Text>
          {adventure.tests.length > 0 && (
            <Disclosure title="Testes sugeridos" subtitle={`${adventure.tests.length} testes`}>
              {adventure.tests.map((test) => (
                <View key={test.when} style={{ flexDirection: "row", gap: 12 }}>
                  <View style={local.test}>
                    <Text style={local.testAttr}>{test.attribute}</Text>
                    <Text style={local.testDc}>CD {test.dc}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.body}>{test.when}</Text>
                    <Text style={styles.notice}>
                      {attributes.find((a) => a.id === test.attribute)?.name}
                    </Text>
                  </View>
                </View>
              ))}
            </Disclosure>
          )}
          {!!adventure.masterNotes && (
            <Disclosure title="Notas do mestre">
              <Text style={[styles.body, { color: colors.muted }]}>{adventure.masterNotes}</Text>
            </Disclosure>
          )}
        </View>
      )}

      {adventure.custom && (
        <View style={{ gap: 4 }}>
          <Button
            secondary
            icon="✎"
            title="Editar aventura"
            onPress={() =>
              router.push({ pathname: "/adventure-new", params: { id: adventure.id } })
            }
          />
          <Button variant="danger" title="Excluir aventura" onPress={() => setConfirm(true)} />
        </View>
      )}

      <Sheet
        visible={confirm}
        title={`Excluir “${adventure.title}”?`}
        onClose={() => {
          if (!busy) setConfirm(false);
        }}
        footer={
          <>
            <Button
              variant="destructive"
              title={busy ? "Excluindo…" : "Sim, excluir"}
              disabled={busy}
              onPress={async () => {
                setBusy(true);
                try {
                  await remove(adventure.id);
                  setConfirm(false);
                  router.back();
                } catch {
                  setError("Não foi possível excluir. Tente novamente.");
                } finally {
                  setBusy(false);
                }
              }}
            />
            <Button variant="ghost" title="Cancelar" disabled={busy} onPress={() => setConfirm(false)} />
          </>
        }
      >
        <Help>Salas já criadas com ela continuam funcionando.</Help>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </Sheet>
    </Screen>
  );
}

const local = StyleSheet.create({
  npc: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  secret: { fontSize: 13, lineHeight: 19, marginTop: 2 },
  hero: {
    gap: 10,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: colors.card,
  },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  nodeText: { fontFamily: fonts.mono, fontWeight: "700", fontSize: 12 },
  line: { width: 1.5, flex: 1, backgroundColor: colors.border, marginVertical: 4 },
  test: {
    width: 64,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  testAttr: { color: colors.text, fontFamily: fonts.mono, fontWeight: "700" },
  testDc: { color: colors.primary, fontFamily: fonts.mono, fontSize: 11 },
});
