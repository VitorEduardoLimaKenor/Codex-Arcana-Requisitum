import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { diceSides, rollDie, type DieSides } from "../data/dice";
import { signed } from "../data/codex";
import { alpha, colors, fonts, glow, styles } from "../styles";
import { Button } from "./Button";
import { Footer } from "./Footer";
import { Help, InfoButton } from "./ui";

type Props = {
  characterName: string;
  attribute: { name: string; modifier: number } | null;
  proficiency: number;
  onClose: () => void;
};

export function DiceRoller({ characterName, attribute, proficiency, onClose }: Props) {
  const [sides, setSides] = useState<DieSides>(20);
  const [trained, setTrained] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof rollDie> | null>(null);
  const [count, setCount] = useState(0);
  const natural =
    result && sides === 20 && (result.face === 20 || result.face === 1)
      ? result.face === 20
        ? { label: "20 NATURAL · TRIUNFO", color: colors.primary }
        : { label: "1 NATURAL · REVÉS", color: colors.error }
      : null;
  const tone = natural?.color ?? colors.primary;
  return (
    <Modal animationType="slide" visible onRequestClose={onClose}>
      <SafeAreaView style={styles.page}>
        <View style={local.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar à ficha"
            onPress={onClose}
            hitSlop={10}
            style={local.close}
          >
            <Text style={{ color: colors.text, fontSize: 18 }}>✕</Text>
          </Pressable>
          <Text style={[styles.eyebrow, { flex: 1, textAlign: "center" }]}>
            {characterName}
          </Text>
          <InfoButton title="Como ler o resultado">
            <Help>
              O Mestre indica a Classe de Dificuldade (CD). Total igual ou maior
              que a CD é sucesso. Até 4 abaixo pode ser sucesso parcial; de 5 a 9
              abaixo, falha.
            </Help>
            <Help>
              Dez ou mais acima é triunfo; dez ou mais abaixo, revés. Um 20
              natural é sempre triunfo e um 1 natural, revés.
            </Help>
          </InfoButton>
        </View>
        <View style={local.body}>
          <View style={{ alignItems: "center", gap: 6 }}>
            <Text style={[styles.title, styles.centeredText]}>
              {attribute ? attribute.name : "Dados avulsos"}
            </Text>
            <Text style={[styles.subtitle, styles.centeredText]}>
              {attribute
                ? `d20 ${signed(attribute.modifier)} de modificador`
                : "Sem bônus somados"}
            </Text>
          </View>

          {!attribute && (
            <View style={local.segment} accessibilityRole="radiogroup">
              {diceSides.map((die) => (
                <Pressable
                  key={die}
                  accessibilityRole="radio"
                  accessibilityLabel={`d${die}`}
                  aria-checked={sides === die}
                  accessibilityState={{ checked: sides === die }}
                  onPress={() => {
                    setSides(die);
                    setResult(null);
                  }}
                  style={[local.segmentItem, sides === die && local.segmentActive]}
                >
                  <Text
                    style={[
                      local.segmentText,
                      sides === die && { color: colors.primaryInk },
                    ]}
                  >
                    d{die}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View
            accessibilityLiveRegion="polite"
            style={{ alignItems: "center", gap: 18 }}
          >
            <View
              style={[
                local.die,
                {
                  borderColor: result ? tone : colors.borderStrong,
                  boxShadow: result ? glow(tone, 0.45) : undefined,
                },
              ]}
            >
              <Text style={[local.dieValue, { color: result ? tone : colors.faint }]}>
                {result ? result.total : `d${sides}`}
              </Text>
            </View>
            {natural ? (
              <Text style={[styles.eyebrow, { color: natural.color }]}>{natural.label}</Text>
            ) : (
              <Text style={[styles.eyebrow, { color: colors.faint }]}>
                {result ? `Rolagem #${count}` : "Pronto para rolar"}
              </Text>
            )}
            {result && (
              <Text style={local.breakdown}>
                🎲 {result.face}
                {attribute ? `  ${signed(result.modifier)} atr.` : ""}
                {attribute && trained ? `  +${result.proficiency} prof.` : ""}
                {"  "}= {result.total}
              </Text>
            )}
          </View>

          {attribute && (
            <Pressable
              accessibilityRole="switch"
              aria-checked={trained}
              accessibilityState={{ checked: trained }}
              onPress={() => {
                setTrained(!trained);
                setResult(null);
              }}
              style={[styles.card, local.toggleRow]}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.body, { fontWeight: "600" }]}>
                  Somar proficiência (+{proficiency})
                </Text>
                <Text style={styles.notice}>Só quando o teste usar uma técnica sua.</Text>
              </View>
              <View style={[local.switch, trained && local.switchOn]}>
                <View style={[local.knob, trained && local.knobOn]} />
              </View>
            </Pressable>
          )}
        </View>
        <Footer>
          <Button
            icon="🎲"
            title={result ? "Rolar novamente" : `Rolar d${sides}`}
            onPress={() => {
              setResult(
                rollDie(sides, attribute?.modifier ?? 0, attribute && trained ? proficiency : 0),
              );
              setCount((value) => value + 1);
            }}
          />
        </Footer>
      </SafeAreaView>
    </Modal>
  );
}

const local = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  segment: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    minWidth: 72,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.text, fontFamily: fonts.mono, fontWeight: "700", fontSize: 15 },
  die: {
    width: 168,
    height: 168,
    borderRadius: 44,
    borderWidth: 2,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  dieValue: {
    fontSize: 64,
    lineHeight: 76,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  breakdown: { color: colors.muted, fontFamily: fonts.mono, fontSize: 14 },
  toggleRow: { flexDirection: "row", alignItems: "center" },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.borderStrong,
    padding: 3,
  },
  switchOn: { backgroundColor: alpha(colors.primary, 0.9) },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.text },
  knobOn: { transform: [{ translateX: 20 }], backgroundColor: colors.primaryInk },
});
