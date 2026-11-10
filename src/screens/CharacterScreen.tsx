import { AttributeGrid } from "../components/AttributeCard";
import { portraitOf } from "../data/characterImages";
import { useAttributePreference } from "../hooks/useAttributePreference";
import { characterClass, templates } from "../data/characters";
import { Portrait } from "../components/Portrait";
import { useCharacters } from "../state/characters";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ScreenProps } from "../navigation";
import { type Character, getModel, getStats, signed } from "../data/codex";
import { ClassContents } from "../components/ClassContents";
import { ClassBadge, classLook } from "../components/ClassCard";
import { DeleteCharacter } from "../components/DeleteCharacter";
import { DiceRoller } from "../components/DiceRoller";
import { Disclosure } from "../components/Disclosure";
import { FaceImage } from "../components/FaceImage";
import { MilestoneProgress } from "../components/MilestoneProgress";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { Chip, Field, Help, InfoButton, SectionHeader } from "../components/ui";
import { colors, fadeToBackground, fonts, styles } from "../styles";

type Props = ScreenProps<"Character"> & {
  character: Character | undefined;
  onAdvance: (milestone: string) => void;
  onNoteChange: (note: string) => void;
};

export function CharacterScreen({
  character,
  onNoteChange,
  onAdvance,
  navigation,
}: Props) {
  const { update } = useCharacters();
  const [roll, setRoll] = useState<
    { name: string; modifier: number } | null | undefined
  >(undefined);
  const {
    showMath,
    toggle,
    disabled,
    error: preferenceError,
  } = useAttributePreference();
  if (!character)
    return (
      <Screen>
        <Text style={styles.section}>Ficha não encontrada</Text>
        <Button title="Voltar ao início" onPress={() => navigation.popToTop()} />
      </Screen>
    );
  const chosen = characterClass(character);
  const look = classLook[chosen.id];
  const stats = getStats(chosen, character.level);
  const model = getModel(chosen);
  const source = portraitOf(character);
  const [shortName, epithet] = character.name.split(", ");
  const description = templates.find((t) => t.id === character.templateId)?.description;

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <Screen
        footer={
          <Button icon="🎲" title="Rolar dados" onPress={() => setRoll(null)} />
        }
      >
        {/* Herói */}
        <View style={local.hero}>
          {source ? (
            <FaceImage source={source} accessibilityLabel={`Retrato de ${character.name}`} />
          ) : (
            <View style={[StyleSheet.absoluteFill, local.center]}>
              <ClassBadge classId={chosen.id} large />
            </View>
          )}
          <View style={[StyleSheet.absoluteFill, { backgroundImage: fadeToBackground }]} />
        </View>
        <View style={{ gap: 8, marginTop: -64 }}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Chip label={`${look.icon}  ${look.title.toUpperCase()}`} color={look.color} />
            <Chip label={`NV ${character.level}`} color={colors.primary} />
            {character.example && <Chip label="EXEMPLO" />}
          </View>
          <Text style={local.name}>{shortName}</Text>
          {!!epithet && <Text style={[styles.eyebrow, { color: look.color }]}>{epithet}</Text>}
          {!!description && <Text style={styles.label}>{description}</Text>}
        </View>

        {/* Status */}
        <View style={[styles.card, local.statsCard]}>
          <View style={local.stress}>
            <Text style={local.stressValue}>{stats.stress}</Text>
            <Text style={local.statLabel}>ESTRESSE</Text>
          </View>
          <View style={local.divider} />
          <View style={local.miniStats}>
            {[
              ["INI", stats.initiative],
              ["CNF", stats.confidence],
              ["QLD", stats.quality],
              ["PRF", stats.proficiency],
            ].map(([label, value]) => (
              <View key={label} style={local.mini}>
                <Text style={local.miniValue}>{signed(Number(value))}</Text>
                <Text style={local.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
          <View style={{ position: "absolute", top: 10, right: 10 }}>
            <InfoButton title="Estatísticas">
              <Help>
                <Text style={{ color: colors.text, fontWeight: "700" }}>Estresse</Text> é
                sua resistência à pressão do projeto. Você perde pontos quando o
                projeto desgasta e, a zero, entra em colapso. Anote perdas no caderno.
              </Help>
              <Help>
                <Text style={{ color: colors.text, fontWeight: "700" }}>INI</Text> Iniciativa
                (COM + LID) ·{" "}
                <Text style={{ color: colors.text, fontWeight: "700" }}>CNF</Text> Confiança
                (EMP + ETI) ·{" "}
                <Text style={{ color: colors.text, fontWeight: "700" }}>QLD</Text> Qualidade
                (MOD + ANA) ·{" "}
                <Text style={{ color: colors.text, fontWeight: "700" }}>PRF</Text> Proficiência,
                somada aos testes das técnicas que você domina.
              </Help>
            </InfoButton>
          </View>
        </View>

        <MilestoneProgress
          level={character.level}
          milestone={character.milestone}
          onAdvance={onAdvance}
        />

        {/* Atributos */}
        <View style={{ gap: 12 }}>
          <SectionHeader
            title="Atributos"
            info={
              <InfoButton title="Como usar os atributos">
                <Help>
                  Quando o Mestre pedir um teste, toque no atributo: o app rola
                  um d20 e soma o modificador (o número grande).
                </Help>
                <Help>
                  Exemplo: dado 11 + COM +3 + proficiência +2 = 16. Contra CD 15,
                  sucesso.
                </Help>
                <Help>
                  “Detalhes” mostra o valor total, a base e o bônus da classe e o
                  custo em pontos (36 no total).
                </Help>
              </InfoButton>
            }
            action={
              <Pressable
                accessibilityRole="button"
                aria-pressed={showMath}
                disabled={disabled}
                onPress={() => void toggle()}
                hitSlop={8}
              >
                <Text style={{ color: colors.accent, fontSize: 14, fontWeight: "600" }}>
                  {showMath ? "Ocultar detalhes" : "Detalhes"}
                </Text>
              </Pressable>
            }
          />
          {!!preferenceError && <Text style={styles.error}>{preferenceError}</Text>}
          <AttributeGrid
            model={model}
            showMath={showMath}
            onPress={(item) => setRoll({ name: item.name, modifier: item.modifier })}
          />
          <Text style={[styles.notice, styles.centeredText]}>
            Toque em um atributo para rolar d20 + modificador
          </Text>
        </View>

        {/* Caderno */}
        <Field
          label="Caderno"
          hint="Salvo automaticamente."
          multiline
          textAlignVertical="top"
          maxLength={2000}
          value={character.note}
          onChangeText={onNoteChange}
          placeholder="Uma pista, uma ideia, uma dúvida…"
          style={{ minHeight: 110 }}
        />

        {/* Mais */}
        <View style={{ gap: 8 }}>
          <Text style={[styles.eyebrow, { color: colors.faint }]}>{"// "}Mais</Text>
          <ClassContents characterClass={chosen} />
          <Disclosure title="Personalizar retrato">
            <Portrait
              character={character}
              onChange={(portrait) => update({ ...character, portrait })}
            />
          </Disclosure>
          <Button variant="ghost" title="Guia: entender minha ficha" onPress={() => navigation.navigate("Guide")} />
          <DeleteCharacter
            id={character.id}
            name={shortName}
            onDeleted={() => navigation.popToTop()}
          />
        </View>
      </Screen>
      {roll !== undefined && (
        <DiceRoller
          characterName={shortName}
          attribute={roll}
          proficiency={stats.proficiency}
          onClose={() => setRoll(undefined)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const local = StyleSheet.create({
  hero: {
    marginHorizontal: -20,
    marginTop: -12,
    height: 340,
    backgroundColor: colors.raised,
    overflow: "hidden",
  },
  center: { alignItems: "center", justifyContent: "center" },
  name: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.8,
  },
  statsCard: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 16 },
  stress: { alignItems: "center", minWidth: 72 },
  stressValue: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "800",
    color: colors.primary,
    fontVariant: ["tabular-nums"],
  },
  divider: { width: 1, alignSelf: "stretch", backgroundColor: colors.border },
  miniStats: { flex: 1, flexDirection: "row", justifyContent: "space-between", paddingRight: 24 },
  mini: { alignItems: "center", gap: 2 },
  miniValue: { fontSize: 18, fontWeight: "700", color: colors.text },
  statLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.faint,
    fontWeight: "600",
  },
});
