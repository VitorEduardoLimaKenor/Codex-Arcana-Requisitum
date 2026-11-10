import type { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import { styles } from "../styles";
import { Footer } from "./Footer";

// Na web, a rolagem é feita pelo navegador, sem ScrollView.
export function Screen({
  children,
  footer,
}: PropsWithChildren<{ footer?: ReactNode }>) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <View style={styles.content}>{children}</View>
      </div>
      {footer && <Footer>{footer}</Footer>}
    </div>
  );
}
