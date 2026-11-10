import { useLocalSearchParams } from "expo-router";
import { ClassDetailScreen } from "../../screens/ClassesScreen";
import { navigation } from "../../navigation";
import { classes } from "../../data/codex";
export default function Detail() {
  const { classId } = useLocalSearchParams();
  const chosen = classes.find((c) => c.id === classId) ?? classes[0];
  return (
    <ClassDetailScreen
      navigation={navigation}
      route={{ params: { classId: chosen.id } }}
    />
  );
}
