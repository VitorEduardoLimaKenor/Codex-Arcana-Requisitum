import { useLocalSearchParams } from "expo-router";
import { CharacterScreen } from "../../screens/CharacterScreen";
import { navigation } from "../../navigation";
import { useCharacters } from "../../state/characters";
import { advanceAtMilestone } from "../../data/codex";

export default function CharacterRoute() {
  const { characterId } = useLocalSearchParams<{ characterId: string }>();
  const { characters, update } = useCharacters();
  const character = characters.find((c) => c.id === characterId);
  return (
    <CharacterScreen
      navigation={navigation}
      route={{ params: { characterId } }}
      character={character}
      onNoteChange={(note) => {
        if (character) void update({ ...character, note }).catch(() => {});
      }}
      onAdvance={(milestone) => {
        if (character)
          void update(advanceAtMilestone(character, milestone)).catch(() => {});
      }}
    />
  );
}
