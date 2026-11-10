import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Character } from "../data/codex";
import { portraitOf } from "../data/characterImages";
import { ClassBadge, classLook } from "./ClassCard";
import { alpha, colors, fonts, styles } from "../styles";

/** Avatar redondo do personagem (foto, ilustração ou símbolo da classe). */
export function CharacterAvatar({
  character,
  size = 56,
  ring,
}: {
  character: Pick<Character, "classId" | "portrait" | "templateId">;
  size?: number;
  ring?: string;
}) {
  const source = portraitOf(character);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: ring ?? "transparent",
        padding: 2,
      }}
    >
      {source ? (
        <Image source={source} style={{ width: "100%", height: "100%", borderRadius: size / 2 }} />
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ClassBadge classId={character.classId} />
        </View>
      )}
    </View>
  );
}

/** Fileira de personagens para escolher com qual jogar. */
export function CharacterPicker({
  characters,
  selectedId,
  onSelect,
}: {
  characters: Character[];
  selectedId?: string;
  onSelect: (character: Character) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 14, paddingVertical: 4 }}
      accessibilityRole="radiogroup"
    >
      {characters.map((character) => {
        const active = character.id === selectedId;
        const look = classLook[character.classId];
        return (
          <Pressable
            key={character.id}
            accessibilityRole="radio"
            accessibilityLabel={`Jogar com ${character.name}`}
            aria-checked={active}
            accessibilityState={{ checked: active }}
            onPress={() => onSelect(character)}
            style={({ pressed }) => [local.item, pressed && styles.pressed]}
          >
            <CharacterAvatar
              character={character}
              size={60}
              ring={active ? look.color : colors.border}
            />
            {active && (
              <View style={[local.check, { backgroundColor: look.color }]}>
                <Text style={{ color: colors.primaryInk, fontSize: 10, fontWeight: "900" }}>✓</Text>
              </View>
            )}
            <Text
              numberOfLines={1}
              style={[local.name, { color: active ? colors.text : colors.muted }]}
            >
              {character.name.split(",")[0]}
            </Text>
            <Text style={[local.cls, { color: active ? look.color : alpha(look.color, 0.6) }]}>
              {look.title.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const local = StyleSheet.create({
  item: { width: 72, alignItems: "center", gap: 4 },
  check: {
    position: "absolute",
    top: 42,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 12, fontWeight: "700" },
  cls: { fontSize: 9, fontFamily: fonts.mono, letterSpacing: 0.5 },
});
