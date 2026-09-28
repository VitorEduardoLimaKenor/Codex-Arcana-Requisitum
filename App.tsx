import { useRef, useState } from "react";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { advanceAtMilestone, initialCharacters, type Character } from "./src/data/codex";
import type { Routes } from "./src/navigation";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ClassesScreen, ClassDetailScreen } from "./src/screens/ClassesScreen";
import { CreateCharacterScreen } from "./src/screens/CreateCharacterScreen";
import { CharacterScreen } from "./src/screens/CharacterScreen";
import { GuideScreen } from "./src/screens/GuideScreen";
import { colors } from "./src/styles";
const Stack = createNativeStackNavigator<Routes>();
const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.header,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
  },
};
export default function App() {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const nextId = useRef(1);
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.header },
            headerTintColor: colors.text,
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "700",
            },
            headerBackButtonDisplayMode: "minimal",
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Home" options={{ title: "Codex Arcana" }}>
            {(props) => <HomeScreen {...props} characters={characters} />}
          </Stack.Screen>
          <Stack.Screen
            name="Classes"
            component={ClassesScreen}
            options={{ title: "Classes" }}
          />
          <Stack.Screen
            name="ClassDetail"
            component={ClassDetailScreen}
            options={{ title: "Conheça a classe" }}
          />
          <Stack.Screen
            name="CreateCharacter"
            options={{ title: "Criar ficha" }}
          >
            {(props) => (
              <CreateCharacterScreen
                {...props}
                onCreate={(name, classId) => {
                  const id = `character-${nextId.current++}`;
                  setCharacters((current) => [
                    ...current,
                    { id, name, classId, level: 1, milestone: "", note: "" },
                  ]);
                  return id;
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Character" options={{ title: "Minha ficha" }}>
            {(props) => (
              <CharacterScreen
                key={props.route.params.characterId}
                {...props}
                character={characters.find(
                  (item) => item.id === props.route.params.characterId,
                )}
                onAdvance={(milestone) =>
                  setCharacters((current) => current.map((item) =>
                    item.id === props.route.params.characterId ? advanceAtMilestone(item, milestone) : item,
                  ))
                }
                onNoteChange={(note) =>
                  setCharacters((current) =>
                    current.map((item) =>
                      item.id === props.route.params.characterId
                        ? { ...item, note }
                        : item,
                    ),
                  )
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Guide"
            component={GuideScreen}
            options={{ title: "Guia do sistema" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
