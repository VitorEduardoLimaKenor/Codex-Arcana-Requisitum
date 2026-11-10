import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../state/auth";
import { colors } from "../styles";
export const unstable_settings = { initialRouteName: "index" };
function Navigation() {
  const { user } = useAuth();
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
          headerBackButtonDisplayMode: "minimal",
          contentStyle: { backgroundColor: colors.background },
          title: "",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Protected guard={!user}>
          <Stack.Screen
            name="sign-in"
            options={{ title: "" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(private)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
export default function Layout() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
