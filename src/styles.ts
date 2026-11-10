import { Platform, StyleSheet } from "react-native";

// Paleta escura de "terminal": superfícies quase pretas, linhas finas e
// um único neon (menta) reservado para ações.
export const colors = {
  background: "#090C13",
  card: "#10141E",
  raised: "#161B28",
  primary: "#43F2B3",
  primaryInk: "#04201A",
  text: "#EEF1F7",
  muted: "#8B94A8",
  faint: "#5A6377",
  border: "#202839",
  borderStrong: "#2D3850",
  accent: "#10D9EF",
  violet: "#9D8CFF",
  header: "#090C13",
  selected: "#0F2A24",
  error: "#FF8597",
  warning: "#FFC970",
};

export const fonts = {
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "ui-monospace, SFMono-Regular, Menlo, monospace",
  }),
};

export const alpha = (hex: string, value: number) =>
  hex +
  Math.round(value * 255)
    .toString(16)
    .padStart(2, "0");

export const glow = (color: string, strength = 0.35) =>
  `0 0 24px ${alpha(color, strength)}`;

// Esmaece imagens para a cor de fundo indicada.
export const fadeTo = (color: string, from = 35) =>
  `linear-gradient(180deg, ${alpha(color, 0)} ${from}%, ${color} 100%)`;
export const fadeToBackground = fadeTo(colors.background);

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  // Imagem que preenche o contêiner (absoluteFill em <Image> não recorta na web).
  fill: { width: "100%", height: "100%" },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 20,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingBottom: 40,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.muted },
  centeredText: {
    alignSelf: "stretch",
    flexShrink: 0,
    textAlign: "center",
  },
  section: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  grow: { flex: 1 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    minHeight: 52,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.primaryInk,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: colors.raised,
    borderColor: colors.borderStrong,
  },
  secondaryText: { color: colors.text },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  label: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  notice: {
    color: colors.faint,
    fontSize: 12,
    lineHeight: 18,
  },
  error: { color: colors.error, fontSize: 14, lineHeight: 20 },
});
