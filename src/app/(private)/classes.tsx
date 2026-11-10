import { ClassesScreen } from "../../screens/ClassesScreen";
import { navigation } from "../../navigation";
export default function Classes() {
  return (
    <ClassesScreen navigation={navigation} route={{ params: undefined }} />
  );
}
