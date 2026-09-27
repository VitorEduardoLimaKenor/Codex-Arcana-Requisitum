import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

type Props = {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
};
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      <View
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 5,
          height: 1,
          backgroundColor: "#FFFFFF20",
        }}
      />
      <View
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 4,
          height: 1,
          backgroundColor: "#2D180F30",
        }}
      />
      <View aria-hidden style={[styles.rivet, { left: 9 }]} />
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>
        {title}
      </Text>
      <View aria-hidden style={[styles.rivet, { right: 9 }]} />
    </Pressable>
  );
}
