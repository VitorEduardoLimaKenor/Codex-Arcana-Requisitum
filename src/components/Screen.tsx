import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles";
import { Footer } from "./Footer";

/** Tela rolável. `footer` fica fixo embaixo, com a ação principal. */
export function Screen({
  children,
  footer,
}: PropsWithChildren<{ footer?: ReactNode }>) {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.page}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
      {footer && <Footer>{footer}</Footer>}
    </SafeAreaView>
  );
}
