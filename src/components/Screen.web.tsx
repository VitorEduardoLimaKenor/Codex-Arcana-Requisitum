import { PropsWithChildren } from "react";
import { View } from "react-native";
import { styles } from "../styles";

// Na web, a rolagem é feita pelo navegador, sem ScrollView.
export function Screen({ children }: PropsWithChildren) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <View style={styles.content}>{children}</View>
    </div>
  );
}
