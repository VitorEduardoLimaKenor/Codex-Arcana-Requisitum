import { PropsWithChildren } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles";

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
