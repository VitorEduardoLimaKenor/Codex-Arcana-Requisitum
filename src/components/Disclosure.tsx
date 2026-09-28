import { useState, type PropsWithChildren } from "react";
import { Pressable, Text, View } from "react-native";
import { colors, styles } from "../styles";

export function Disclosure({
  title,
  children,
}: { title: string } & PropsWithChildren) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        aria-expanded={open}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          minHeight: 44,
        }}
      >
        <Text style={[styles.body, { flex: 1, fontWeight: "700" }]}>
          {title}
        </Text>
        <Text aria-hidden style={{ color: colors.primary, fontSize: 24 }}>
          {open ? "−" : "+"}
        </Text>
      </Pressable>
      {open && children}
    </View>
  );
}
