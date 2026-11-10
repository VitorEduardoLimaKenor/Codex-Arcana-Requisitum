import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AttributeGrid, topStrengths } from "../../components/AttributeCard";
import { characterImages } from "../../data/characterImages";
import { templates } from "../../data/characters";
import { getClass, getModel, signed } from "../../data/codex";
import { useCharacters } from "../../state/characters";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { classLook } from "../../components/ClassCard";
import { FaceImage } from "../../components/FaceImage";
import { Chip, Help, InfoButton, Sheet } from "../../components/ui";
import { alpha, colors, fadeTo, fonts, glow, styles } from "../../styles";

const newCharacterId = (templateId: string) => `${templateId}-${Date.now()}`;

export default function Choose() {
  const { classId } = useLocalSearchParams();
  const { update } = useCharacters();
  const roster = templates.filter((t) => !classId || t.classId === classId);
  const [selectedId, setSelectedId] = useState(roster[0]?.id);
  const [showAll, setShowAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const item = roster.find((t) => t.id === selectedId) ?? roster[0];
  const cls = getClass(item.classId);
  const look = classLook[item.classId];
  const model = getModel({ ...cls, base: item.base });
  const [shortName, epithet] = item.name.split(", ");

  async function choose() {
    setBusy(true);
    try {
      const id = newCharacterId(item.id);
      await update({
        id,
        name: item.name,
        classId: item.classId,
        templateId: item.id,
        level: 1,
        note: "",
        milestone: "",
      });
      router.replace({ pathname: "/character", params: { characterId: id } });
    } catch {
      setError("Não foi possível guardar a ficha. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      footer={
        <>
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Button
            title={busy ? "Salvando…" : `Jogar com ${shortName}`}
            arrow={!busy}
            disabled={busy}
            onPress={() => void choose()}
          />
        </>
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={[styles.title, { flex: 1 }]}>Escolha seu personagem</Text>
        <InfoButton title="Como funcionam os personagens">
          <Help>
            Cada personagem é um modelo pronto de nível 1, com 36 pontos já
            distribuídos entre 12 atributos e o bônus da classe (+2 e +1).
          </Help>
          <Help>
            Você pode ter mais de um. A ficha fica salva na sua conta, neste
            aparelho.
          </Help>
        </InfoButton>
      </View>

      {/* Preview do personagem selecionado */}
      <View
        style={[
          local.preview,
          { borderColor: alpha(look.color, 0.5), boxShadow: glow(look.color, 0.14) },
        ]}
      >
        <View style={local.art}>
          <FaceImage
            source={characterImages[item.id]}
            accessibilityLabel={`Retrato de ${item.name}`}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundImage: fadeTo(colors.card) },
            ]}
          />
          <View style={local.artChip}>
            <Chip label={`${look.icon}  ${look.title.toUpperCase()}`} color={look.color} />
          </View>
        </View>
        <View style={{ padding: 18, paddingTop: 0, gap: 8 }}>
          <Text style={local.name}>{shortName}</Text>
          {!!epithet && (
            <Text style={[styles.eyebrow, { color: look.color }]}>{epithet}</Text>
          )}
          <Text style={styles.label}>{item.description}</Text>
          <View style={local.strengths}>
            {topStrengths(model).map((a) => (
              <View key={a.id} style={local.strength}>
                <Text style={local.strengthMod}>{signed(a.modifier)}</Text>
                <Text style={local.strengthId}>{a.id}</Text>
                <Text numberOfLines={1} style={styles.notice}>
                  {a.name}
                </Text>
              </View>
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowAll(true)}
            hitSlop={6}
            style={{ paddingVertical: 6 }}
          >
            <Text style={{ color: colors.accent, fontWeight: "600" }}>
              Ver os 12 atributos →
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Roster */}
      <View style={{ gap: 12 }}>
        <Text style={[styles.eyebrow, { color: colors.faint }]}>
          {"// "}
          {roster.length} disponíveis
        </Text>
        <View style={local.grid} accessibilityRole="radiogroup">
          {roster.map((t) => {
            const active = t.id === item.id;
            const tone = classLook[t.classId].color;
            return (
              <Pressable
                key={t.id}
                accessibilityRole="radio"
                accessibilityLabel={t.name}
                aria-checked={active}
                accessibilityState={{ checked: active }}
                onPress={() => setSelectedId(t.id)}
                style={({ pressed }) => [local.thumb, pressed && styles.pressed]}
              >
                <View
                  style={[
                    local.thumbImage,
                    {
                      borderColor: active ? tone : "transparent",
                      opacity: active ? 1 : 0.55,
                    },
                  ]}
                >
                  <Image source={characterImages[t.id]} style={styles.fill} />
                </View>
                <Text
                  numberOfLines={1}
                  style={[local.thumbName, active && { color: colors.text }]}
                >
                  {t.name.split(",")[0]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Sheet visible={showAll} title={`Atributos de ${shortName}`} onClose={() => setShowAll(false)}>
        <AttributeGrid model={model} />
        <Text style={styles.notice}>
          O número grande é o modificador, somado ao d20 nos testes. “+2/+1” é o
          bônus da classe.
        </Text>
      </Sheet>
    </Screen>
  );
}

const local = StyleSheet.create({
  preview: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  art: { height: 260, backgroundColor: colors.raised, overflow: "hidden" },
  artChip: {
    position: "absolute",
    top: 14,
    left: 14,
    borderRadius: 999,
    backgroundColor: alpha(colors.background, 0.85),
  },
  name: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.6,
  },
  strengths: { flexDirection: "row", gap: 8, marginTop: 6 },
  strength: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 10,
    gap: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  strengthMod: { color: colors.primary, fontSize: 20, fontWeight: "800" },
  strengthId: { color: colors.text, fontFamily: fonts.mono, fontSize: 12, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  thumb: { width: "17.5%", alignItems: "center", gap: 6 },
  thumbImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
    backgroundColor: colors.raised,
  },
  thumbName: { color: colors.faint, fontSize: 11, fontWeight: "600" },
});
