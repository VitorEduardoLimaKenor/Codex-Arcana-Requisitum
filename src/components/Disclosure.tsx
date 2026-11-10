import { useState, type PropsWithChildren } from "react";
import { Pressable, Text, View } from "react-native";
import { colors, styles } from "../styles";

export function Disclosure({
  title,
  subtitle,
  children,
}: { title: string; subtitle?: string } & PropsWithChildren) {
  const [open, setOpen] = useState(false);
  return (
    <View
      style={[
        styles.card,
        { paddingVertical: 4, gap: 0 },
        open && { borderColor: colors.borderStrong },
      ]}
    >
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
          minHeight: 52,
        }}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[styles.body, { fontWeight: "600" }]}>{title}</Text>
          {!!subtitle && <Text style={styles.notice}>{subtitle}</Text>}
        </View>
        <Text
          aria-hidden
          style={{
            color: open ? colors.primary : colors.faint,
            fontSize: 18,
            transform: [{ rotate: open ? "90deg" : "0deg" }],
          }}
        >
          ›
        </Text>
      </Pressable>
      {open && <View style={{ gap: 12, paddingBottom: 14 }}>{children}</View>}
    </View>
  );
}
