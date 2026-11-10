import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { colors } from "../styles";

/** Barra fixa no rodapé com a ação principal da tela. */
export function Footer({ children }: PropsWithChildren) {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      <View style={{ width: "100%", maxWidth: 600, alignSelf: "center", gap: 8 }}>
        {children}
      </View>
    </View>
  );
}
