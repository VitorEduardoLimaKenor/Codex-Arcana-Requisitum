import { onlineEnabled } from "../services/api";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { Chip, Field, Help, InfoButton } from "../components/ui";
import { useAuth } from "../state/auth";
import { colors, styles } from "../styles";
export default function SignIn() {
  const { role: requested } = useLocalSearchParams();
  const role = requested === "master" ? "master" : "player";
  const { signIn, signUp } = useAuth();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef<AbortController | null>(null);
  const cancel = useCallback(() => {
    pending.current?.abort();
    pending.current = null;
    setBusy(false);
  }, []);
  useFocusEffect(useCallback(() => () => cancel(), [cancel]));
  async function submit() {
    if (pending.current) return;
    setError("");
    if (creating && password !== confirm) {
      setError("As senhas precisam ser iguais.");
      return;
    }
    const request = new AbortController();
    pending.current = request;
    Keyboard.dismiss();
    setBusy(true);
    const timeout = setTimeout(() => {
      if (pending.current !== request) return;
      cancel();
      setError(
        "A operação demorou mais que o esperado. Tente novamente. Se a conta já foi salva, use Entrar.",
      );
    }, 45000);
    try {
      // Entrega um quadro à interface antes de iniciar o cálculo da senha.
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      if (request.signal.aborted) return;
      if (creating) await signUp(name, email, password, role, request.signal);
      else await signIn(email, password, role, request.signal);
    } catch (e) {
      if (!request.signal.aborted)
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível entrar. Tente novamente.",
        );
    } finally {
      clearTimeout(timeout);
      if (pending.current === request) {
        pending.current = null;
        setBusy(false);
      }
    }
  }
  const isMaster = role === "master";
  const tone = isMaster ? colors.violet : colors.primary;
  function switchMode(next: boolean) {
    if (next === creating) return;
    setCreating(next);
    setError("");
    setPassword("");
    setConfirm("");
  }
  const toggle = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
      onPress={() => setVisible(!visible)}
      disabled={busy}
      hitSlop={6}
      style={{ paddingHorizontal: 10, paddingVertical: 8 }}
    >
      <Text style={{ color: colors.accent, fontSize: 13, fontWeight: "600" }}>
        {visible ? "Ocultar" : "Mostrar"}
      </Text>
    </Pressable>
  );
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Modal
        visible={busy}
        transparent
        animationType="fade"
        onRequestClose={cancel}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000CC",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={[
              styles.card,
              { width: "100%", maxWidth: 420, alignSelf: "center", alignItems: "center", padding: 28, gap: 14 },
            ]}
            accessibilityViewIsModal
            accessibilityLiveRegion="polite"
          >
            <ActivityIndicator
              size="large"
              color={tone}
              accessibilityLabel="Processando sua conta"
            />
            <Text style={[styles.section, styles.centeredText]}>
              {creating ? "Criando sua conta…" : "Verificando sua conta…"}
            </Text>
            <Text style={[styles.label, styles.centeredText]}>
              Protegendo sua senha. Pode levar alguns segundos.
            </Text>
            <Button
              variant="ghost"
              title="Cancelar"
              onPress={() => {
                cancel();
                setError("Operação cancelada. Você pode tentar novamente.");
              }}
            />
          </View>
        </View>
      </Modal>
      <Screen
        footer={
          <Button
            title={busy ? "Aguarde…" : creating ? "Criar conta" : "Entrar"}
            arrow={!busy}
            onPress={() => void submit()}
            disabled={busy || !email.trim() || !password || (creating && !name.trim())}
          />
        }
      >
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Chip label={isMaster ? "◎ MESTRE" : "✦ JOGADOR"} color={tone} />
            <View style={{ flex: 1 }} />
            <InfoButton title="Onde fica minha conta?">
              <Help>
                {onlineEnabled
                  ? "Você está entrando no servidor de aventuras. Contas criadas antes apenas no aparelho precisam de um novo cadastro online."
                  : "A conta vale para o perfil escolhido e fica salva apenas neste aparelho. Configure o servidor para acessar salas compartilhadas."}
              </Help>
            </InfoButton>
          </View>
          <Text style={styles.title}>
            {creating ? "Crie sua conta" : "Bem-vindo de volta"}
          </Text>
          <Text style={styles.subtitle}>
            {creating
              ? "Leva menos de um minuto."
              : "Entre para continuar sua jornada."}
          </Text>
        </View>

        <View style={local.segment} accessibilityRole="tablist">
          {[
            { value: false, label: "Entrar" },
            { value: true, label: "Criar conta" },
          ].map((tab) => (
            <Pressable
              key={tab.label}
              accessibilityRole="tab"
              aria-selected={creating === tab.value}
              accessibilityState={{ selected: creating === tab.value }}
              disabled={busy}
              onPress={() => switchMode(tab.value)}
              style={[local.tab, creating === tab.value && local.tabActive]}
            >
              <Text
                style={[
                  local.tabText,
                  creating === tab.value && { color: colors.text },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ gap: 16 }}>
          {creating && (
            <Field
              label="Seu nome"
              editable={!busy}
              value={name}
              onChangeText={setName}
              maxLength={60}
              autoComplete="name"
            />
          )}
          <Field
            label="E-mail"
            editable={!busy}
            value={email}
            onChangeText={setEmail}
            maxLength={254}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            placeholder="voce@email.com"
          />
          <Field
            label="Senha"
            hint={creating ? "Mínimo de 8 caracteres." : undefined}
            editable={!busy}
            value={password}
            onChangeText={setPassword}
            maxLength={128}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoComplete={creating ? "new-password" : "current-password"}
            trailing={toggle}
          />
          {creating && (
            <Field
              label="Confirme a senha"
              editable={!busy}
              value={confirm}
              onChangeText={setConfirm}
              maxLength={128}
              secureTextEntry={!visible}
              autoCapitalize="none"
              autoComplete="new-password"
            />
          )}
          {!!error && (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          )}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const local = StyleSheet.create({
  segment: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 10,
  },
  tabActive: { backgroundColor: colors.raised },
  tabText: { color: colors.muted, fontWeight: "600", fontSize: 14 },
});
