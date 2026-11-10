import type { ReactNode } from "react";
import { useAuth } from "../state/auth";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { Screen } from "../components/Screen";
import { PortraitStack } from "../components/ui";
import { characterImages } from "../data/characterImages";
import { alpha, colors, fadeToBackground, fonts, glow, styles } from "../styles";

const crew = ["hero-0", "hero-2", "hero-4", "hero-6", "hero-8"].map(
  (id) => characterImages[id],
);

/** Leve brilho no canto superior do card, na cor do papel. */
const wash = (color: string) =>
  `linear-gradient(135deg, ${alpha(color, 0.16)} 0%, ${alpha(color, 0)} 55%)`;

function RoleCard({
  role,
  color,
  title,
  description,
  cta,
  art,
}: {
  role: "player" | "master";
  color: string;
  title: string;
  description: string;
  cta: string;
  art: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. Entrar ou criar conta.`}
      onPress={() => router.push({ pathname: "/sign-in", params: { role } })}
      style={({ pressed }) => [
        styles.card,
        local.role,
        {
          borderColor: alpha(color, 0.45),
          boxShadow: glow(color, 0.12),
          backgroundImage: wash(color),
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={local.art}>{art}</View>
      <Text style={styles.section}>{title}</Text>
      <Text style={styles.label}>{description}</Text>
      <View style={local.ctaRow}>
        <Text style={[local.cta, { color }]}>{cta}</Text>
        <View style={[local.arrow, { backgroundColor: alpha(color, 0.14) }]}>
          <Text style={{ color, fontSize: 16, fontWeight: "700" }}>→</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function Welcome() {
  const { user } = useAuth();
  if (user) return <Redirect href="/home" />;
  return (
    <Screen>
      <View style={local.hero}>
        <Image
          source={require("../../assets/images/codex-banner.png")}
          resizeMode="cover"
          aria-hidden
          style={local.heroArt}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundImage: fadeToBackground }]} />
      </View>
      <View style={{ gap: 12, marginTop: -36 }}>
        <Text style={styles.eyebrow}>◆ Codex Arcana</Text>
        <Text style={local.headline}>
          Engenharia de requisitos,{"\n"}
          <Text style={{ color: colors.primary }}>em modo RPG.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Monte sua equipe, enfrente desafios de projeto e role os dados.
        </Text>
      </View>

      <Text style={[styles.eyebrow, { color: colors.faint, marginTop: 8 }]}>
        {"// "}Como você vai jogar?
      </Text>

      <RoleCard
        role="player"
        color={colors.primary}
        title="Sou jogador"
        description="Escolha um personagem, entre na sala da turma e jogue."
        cta="Começar"
        art={<PortraitStack sources={crew} size={44} />}
      />

      <RoleCard
        role="master"
        color={colors.violet}
        title="Sou mestre"
        description="Crie a aventura, organize os grupos e conduza a história."
        cta="Conduzir"
        art={
          <View style={local.masterArt} aria-hidden>
            <View style={local.masterRing}>
              <Image
                source={require("../../assets/images/master-avatar.png")}
                style={local.masterAvatar}
              />
              <View style={local.masterBadge}>
                <Text style={{ color: colors.primaryInk, fontSize: 11, fontWeight: "900" }}>◎</Text>
              </View>
            </View>
          </View>
        }
      />

      <Text style={[styles.notice, styles.centeredText]}>
        Suas contas e fichas ficam neste aparelho.
      </Text>
    </Screen>
  );
}

const local = StyleSheet.create({
  hero: {
    marginHorizontal: -20,
    marginTop: -12,
    height: 220,
    overflow: "hidden",
  },
  heroArt: { width: "100%", height: "100%" },
  headline: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.8,
  },
  role: { gap: 6, padding: 20 },
  art: { minHeight: 64, justifyContent: "center", marginBottom: 8 },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cta: { fontFamily: fonts.mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  masterArt: { flexDirection: "row", alignItems: "center" },
  masterRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
    borderWidth: 2,
    borderColor: colors.violet,
    boxShadow: glow(colors.violet, 0.45),
  },
  masterAvatar: { width: "100%", height: "100%", borderRadius: 32 },
  masterBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.violet,
    borderWidth: 2,
    borderColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
});
