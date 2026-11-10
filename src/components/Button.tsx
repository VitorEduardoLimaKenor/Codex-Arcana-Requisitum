import { Pressable, StyleSheet, Text } from "react-native";
import { colors, glow, styles } from "../styles";

/** danger = link vermelho; destructive = botão vermelho sólido (confirmações). */
type Variant = "primary" | "secondary" | "ghost" | "danger" | "destructive";
type Props = {
  title: string;
  onPress: () => void;
  /** Atalho mantido por compatibilidade: equivale a variant="secondary". */
  secondary?: boolean;
  variant?: Variant;
  disabled?: boolean;
  /** Mostra uma seta no fim do botão, indicando avanço. */
  arrow?: boolean;
  icon?: string;
  small?: boolean;
  accessibilityLabel?: string;
};

export function Button({
  title,
  onPress,
  secondary = false,
  variant,
  disabled = false,
  arrow = false,
  icon,
  small = false,
  accessibilityLabel,
}: Props) {
  const kind: Variant = variant ?? (secondary ? "secondary" : "primary");
  const textColor =
    kind === "primary"
      ? colors.primaryInk
      : kind === "destructive"
        ? "#2A070D"
      : kind === "danger"
        ? colors.error
        : kind === "ghost"
          ? colors.muted
          : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        kind === "primary" && !disabled && { boxShadow: glow(colors.primary, 0.28) },
        kind === "secondary" && styles.secondaryButton,
        kind === "destructive" && {
          backgroundColor: colors.error,
          borderColor: colors.error,
          boxShadow: disabled ? undefined : glow(colors.error, 0.25),
        },
        (kind === "ghost" || kind === "danger") && local.ghost,
        small && local.small,
        pressed && styles.pressed,
        disabled && local.disabled,
      ]}
    >
      {!!icon && (
        <Text aria-hidden style={[local.icon, { color: textColor }]}>
          {icon}
        </Text>
      )}
      <Text
        style={[
          styles.buttonText,
          { color: textColor },
          small && local.smallText,
          (kind === "ghost" || kind === "danger") && local.ghostText,
        ]}
      >
        {title}
      </Text>
      {arrow && (
        <Text aria-hidden style={[local.icon, { color: textColor }]}>
          →
        </Text>
      )}
    </Pressable>
  );
}

const local = StyleSheet.create({
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    minHeight: 44,
    paddingVertical: 10,
  },
  ghostText: { fontSize: 15, fontWeight: "600" },
  small: { minHeight: 38, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12 },
  smallText: { fontSize: 14 },
  disabled: { opacity: 0.4 },
  icon: { fontSize: 17, fontWeight: "700" },
});
