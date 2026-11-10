import { Stack } from "expo-router";
import { useAuth } from "../../state/auth";
import { CharactersProvider } from "../../state/characters";
import { Platform, Pressable, Text } from "react-native";
import { colors, fonts } from "../../styles";
// Na web o header não tem recuo lateral próprio.
const edge = Platform.OS === "web" ? 16 : 0;
function SignOut({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: edge,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={{ color: colors.muted, fontFamily: fonts.mono, fontSize: 12 }}>
        sair ⏻
      </Text>
    </Pressable>
  );
}
function PrivateStack() {
  const { user, signOut } = useAuth();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontSize: 16, fontWeight: "600" },
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: colors.background },
        title: "",
        headerRight: () => <SignOut onPress={signOut} />,
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: "",
          headerLeft: () => (
            <Text style={{ color: colors.primary, fontFamily: fonts.mono, fontSize: 13, fontWeight: "700", letterSpacing: 1.5, marginLeft: edge }}>
              ◆ CODEX
            </Text>
          ),
        }}
      />
      <Stack.Screen name="rooms" options={{ title: "Salas" }} />
      <Stack.Screen name="lobby" options={{ title: "Lobby" }} />
      <Stack.Screen name="classes" options={{ title: "Classes" }} />
      <Stack.Screen name="class-detail" options={{ title: "" }} />
      <Stack.Screen name="guide" options={{ title: "Como jogar" }} />
      <Stack.Protected guard={user?.role === "master"}>
        <Stack.Screen
          name="create-room"
          options={{ title: "Nova sala" }}
        />
        <Stack.Screen name="adventure" options={{ title: "" }} />
        <Stack.Screen name="adventure-new" options={{ title: "Nova aventura" }} />
        <Stack.Screen name="master-guide" options={{ title: "Guia do mestre" }} />
      </Stack.Protected>
      <Stack.Protected guard={user?.role === "player"}>
        <Stack.Screen
          name="choose"
          options={{ title: "Seleção" }}
        />
        <Stack.Screen name="character" options={{ title: "" }} />
      </Stack.Protected>
    </Stack>
  );
}
export default function PrivateLayout() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "player" ? (
    <CharactersProvider key={user.id} ownerId={user.id}>
      <PrivateStack />
    </CharactersProvider>
  ) : (
    <PrivateStack />
  );
}
