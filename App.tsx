import { useState } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initialNotes, character } from "./src/data/mock";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CharacterScreen } from "./src/screens/CharacterScreen";
import { NotesScreen, NewNoteScreen } from "./src/screens/NotesScreen";
import { colors } from "./src/styles";

export type Routes = {
  Home: undefined;
  Character: undefined;
  Notes: undefined;
  NewNote: undefined;
};
const Stack = createNativeStackNavigator<Routes>();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
  },
};

export default function App() {
  const [notes, setNotes] = useState(initialNotes);
  const [health, setHealth] = useState(character.maxHealth);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: "700" },
            headerBackButtonDisplayMode: "minimal",
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Home" options={{ title: "Caderno de aventuras" }}>
            {(props) => <HomeScreen {...props} noteCount={notes.length} />}
          </Stack.Screen>
          <Stack.Screen name="Character" options={{ title: "Minha ficha" }}>
            {() => (
              <CharacterScreen health={health} onHealthChange={setHealth} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Notes" options={{ title: "Diário da campanha" }}>
            {(props) => (
              <NotesScreen
                {...props}
                notes={notes}
                onToggleFavorite={(id) =>
                  setNotes((current) =>
                    current.map((note) =>
                      note.id === id
                        ? { ...note, favorite: !note.favorite }
                        : note,
                    ),
                  )
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="NewNote" options={{ title: "Nova anotação" }}>
            {(props) => (
              <NewNoteScreen
                {...props}
                onSave={(title, text) =>
                  setNotes((current) => [
                    {
                      id: String(Date.now()),
                      title,
                      text,
                      session: "Anotação livre",
                      favorite: false,
                    },
                    ...current,
                  ])
                }
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
