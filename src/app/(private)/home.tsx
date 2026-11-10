import { useAuth } from "../../state/auth";
import { MasterScreen } from "../../screens/MasterScreen";
import { HomeScreen } from "../../screens/HomeScreen";
import { navigation } from "../../navigation";
import { useCharacters } from "../../state/characters";
function PlayerHome() {
  return (
    <HomeScreen
      navigation={navigation}
      route={{ params: undefined }}
      characters={useCharacters().characters}
    />
  );
}

export default function Home() {
  const { user } = useAuth();
  return user?.role === "master" ? <MasterScreen /> : <PlayerHome />;
}
