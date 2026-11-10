import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "./Button";
import { Chip, Field, Help, Progress, Sheet } from "./ui";
import { colors, fonts, styles } from "../styles";

type Props = {
  level: 1 | 2;
  milestone: string;
  onAdvance: (milestone: string) => void;
};

/** Barra de evolução (nível 1 → 2) com o registro do marco em um painel. */
export function MilestoneProgress({ level, milestone, onAdvance }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [approved, setApproved] = useState(false);
  const ready = !!draft.trim() && approved;
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ color: colors.primary, fontFamily: fonts.mono, fontWeight: "700" }}>
          NV {level}
        </Text>
        <View style={{ flex: 1 }}>
          <Progress value={level === 2 ? 1 : 0.5} />
        </View>
        <Text
          style={{
            color: level === 2 ? colors.primary : colors.faint,
            fontFamily: fonts.mono,
            fontWeight: "700",
          }}
        >
          NV 2
        </Text>
      </View>
      {level === 2 ? (
        <View style={{ gap: 6 }}>
          <Chip label="NÍVEL MÁXIMO DESTA VERSÃO" color={colors.primary} />
          <Text style={styles.body}>Marco: {milestone}</Text>
          <Text style={styles.notice}>
            Combine com o Mestre o refinamento de uma habilidade inicial e anote no caderno.
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={[styles.label, { flex: 1 }]}>
            Suba de nível quando o Mestre reconhecer uma conquista da equipe.
          </Text>
          <Button small secondary title="Registrar marco" onPress={() => setOpen(true)} />
        </View>
      )}
      <Sheet
        visible={open}
        title="Registrar marco"
        onClose={() => setOpen(false)}
        footer={
          <Button
            title="Avançar para o nível 2"
            disabled={!ready}
            onPress={() => {
              if (!ready) return;
              onAdvance(draft.trim());
              setDraft("");
              setApproved(false);
              setOpen(false);
            }}
          />
        }
      >
        <Help>
          A equipe avança ao concluir uma etapa importante, como aprovar uma
          entrega. O Estresse máximo é recalculado; a proficiência continua +2.
        </Help>
        <Field
          label="Qual marco foi concluído?"
          value={draft}
          onChangeText={setDraft}
          maxLength={120}
          placeholder="Ex.: Requisitos aprovados pelo cliente"
        />
        <Pressable
          accessibilityRole="checkbox"
          aria-checked={approved}
          accessibilityState={{ checked: approved }}
          accessibilityLabel="O Mestre autorizou o avanço da equipe"
          onPress={() => setApproved(!approved)}
          style={{ minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12 }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              borderWidth: 1.5,
              borderColor: approved ? colors.primary : colors.borderStrong,
              backgroundColor: approved ? colors.primary : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {approved && <Text style={{ color: colors.primaryInk, fontWeight: "900" }}>✓</Text>}
          </View>
          <Text style={[styles.body, { flex: 1 }]}>O Mestre autorizou o avanço</Text>
        </Pressable>
      </Sheet>
    </View>
  );
}
