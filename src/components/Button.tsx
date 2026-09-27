import { Pressable, Text } from "react-native";
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
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>
        {title}
      </Text>
    </Pressable>
  );
}
