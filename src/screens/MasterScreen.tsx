import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { AdventureCard } from "../components/AdventureCard";
import { useAuth } from "../state/auth";
import { useAdventures } from "../hooks/useAdventures";
import { Help, InfoButton, SectionHeader } from "../components/ui";
import { alpha, colors, fadeTo, fonts, glow, styles } from "../styles";

export function MasterScreen() {
  const { user } = useAuth();
  const { adventures, ready, error } = useAdventures();
  const firstName = user?.name.split(" ")[0] ?? "";
  return (
    <Screen>
      <View style={{ gap: 6 }}>
        <Text style={[styles.eyebrow, { color: colors.violet }]}>
          {"// "}Mestre {firstName}
        </Text>
        <Text style={styles.title}>A próxima história está nas suas mãos.</Text>
      </View>

      {/* Missão principal: abrir a sala com uma aventura pronta. */}
      <View
        style={[
          styles.card,
          local.quest,
          { borderColor: alpha(colors.primary, 0.45), boxShadow: glow(colors.primary, 0.12) },
        ]}
      >
        <View style={local.questArt}>
          <Image
            source={require("../../assets/images/codex-banner.png")}
            resizeMode="cover"
            aria-hidden
            style={styles.fill}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundImage: fadeTo(colors.card, 20) }]} />
        </View>
        <View style={{ padding: 18, paddingTop: 6, gap: 6 }}>
          <Text style={styles.eyebrow}>▶ Missão do dia</Text>
          <Text style={styles.section}>Abra a sala da sua turma</Text>
          <Text style={styles.label}>
            Escolha uma aventura, compartilhe o código e organize os grupos.
          </Text>
          <View style={{ marginTop: 6, gap: 4 }}>
            <Button title="Criar sala" arrow onPress={() => router.push("/create-room")} />
            <Button variant="ghost" title="Ver minhas salas" onPress={() => router.push("/rooms")} />
          </View>
        </View>
      </View>

      {/* Biblioteca de aventuras */}
      <View style={{ gap: 12 }}>
        <SectionHeader
          title="Aventuras"
          info={
            <InfoButton title="Biblioteca de aventuras">
              <Help>
                Aventuras prontas para usar em sala: cada uma traz objetivos de
                aprendizagem, roteiro em cenas, personagens do mestre e testes
                sugeridos.
              </Help>
              <Help>
                Ao criar uma sala, basta escolher a aventura. As que você
                cadastrar ficam salvas na sua conta, neste aparelho.
              </Help>
            </InfoButton>
          }
          action={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cadastrar aventura"
              hitSlop={8}
              onPress={() => router.push("/adventure-new")}
            >
              <Text style={{ color: colors.accent, fontWeight: "600" }}>+ Cadastrar</Text>
            </Pressable>
          }
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        {!ready ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <View style={{ gap: 10 }}>
            {adventures.map((adventure) => (
              <AdventureCard
                key={adventure.id}
                adventure={adventure}
                onPress={() =>
                  router.push({ pathname: "/adventure", params: { id: adventure.id } })
                }
              />
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/adventure-new")}
              style={({ pressed }) => [local.add, pressed && styles.pressed]}
            >
              <Text style={{ color: colors.accent, fontSize: 18 }}>+</Text>
              <Text style={{ color: colors.muted, fontWeight: "600" }}>Cadastrar nova aventura</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Como mestrar: o essencial em 3 passos e o guia completo. */}
      <View style={{ gap: 12 }}>
        <SectionHeader title="Como mestrar" />
        <View style={[styles.card, { gap: 14 }]}>
          {[
            ["01", "Escolha a aventura", "Leia o roteiro e os segredos dos personagens."],
            ["02", "Abra a sala", "Crie na sala de aula e mostre o código à turma."],
            ["03", "Conduza a sessão", "Interprete os personagens e peça testes quando houver risco."],
          ].map(([n, title, text]) => (
            <View key={n} style={{ flexDirection: "row", gap: 14 }}>
              <Text style={{ color: colors.violet, fontFamily: fonts.mono, fontWeight: "700", marginTop: 2 }}>
                {n}
              </Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.body, { fontWeight: "700" }]}>{title}</Text>
                <Text style={styles.label}>{text}</Text>
              </View>
            </View>
          ))}
          <Button
            secondary
            icon="◎"
            title="Guia do mestre"
            onPress={() => router.push("/master-guide")}
          />
        </View>
      </View>
    </Screen>
  );
}

const local = StyleSheet.create({
  quest: { padding: 0, gap: 0, overflow: "hidden", borderRadius: 24 },
  questArt: { height: 110, backgroundColor: colors.raised, overflow: "hidden" },
  add: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 56,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
  },
});
