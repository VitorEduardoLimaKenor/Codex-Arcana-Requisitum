import { useState, type PropsWithChildren, type ReactNode } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
  type TextInputProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { alpha, colors, fonts, styles } from "../styles";

/** Etiqueta curta em fonte mono, usada para status e bônus. */
export function Chip({
  label,
  color = colors.muted,
  solid = false,
}: {
  label: string;
  color?: string;
  solid?: boolean;
}) {
  return (
    <View
      style={[
        local.chip,
        {
          borderColor: alpha(color, 0.4),
          backgroundColor: solid ? color : alpha(color, 0.1),
        },
      ]}
    >
      <Text
        style={[local.chipText, { color: solid ? colors.primaryInk : color }]}
      >
        {label}
      </Text>
    </View>
  );
}

/** Painel inferior para conteúdo secundário (ajuda, formulários curtos). */
export function Sheet({
  visible,
  title,
  onClose,
  children,
  footer,
}: PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
}>) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={local.backdrop}>
        <Pressable
          accessibilityLabel="Fechar"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          style={[local.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
        >
          <View style={local.handle} />
          <View style={local.sheetHeader}>
            <Text style={[styles.section, { flex: 1 }]}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              onPress={onClose}
              hitSlop={8}
              style={local.close}
            >
              <Text style={{ color: colors.muted, fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 14, paddingBottom: 8 }}
          >
            {children}
          </ScrollView>
          {footer && <View style={{ gap: 8, paddingTop: 12 }}>{footer}</View>}
        </View>
      </View>
    </Modal>
  );
}

/** Botão “?” que abre uma explicação sem poluir a tela. */
export function InfoButton({
  title,
  children,
  label = "?",
}: PropsWithChildren<{ title: string; label?: string }>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ajuda: ${title}`}
        hitSlop={10}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          label === "?" ? local.info : local.infoText,
          pressed && styles.pressed,
        ]}
      >
        <Text
          style={
            label === "?"
              ? { color: colors.muted, fontSize: 13, fontWeight: "700" }
              : { color: colors.accent, fontSize: 14, fontWeight: "600" }
          }
        >
          {label}
        </Text>
      </Pressable>
      <Sheet visible={open} title={title} onClose={() => setOpen(false)}>
        {children}
      </Sheet>
    </>
  );
}

/** Parágrafo padrão dentro de painéis de ajuda. */
export function Help({ children }: PropsWithChildren) {
  return <Text style={[styles.body, { color: colors.muted }]}>{children}</Text>;
}

/** Cabeçalho de seção: título, ajuda opcional e ação à direita. */
export function SectionHeader({
  title,
  info,
  action,
}: {
  title: string;
  info?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <View style={local.sectionHeader}>
      <Text style={styles.section}>{title}</Text>
      {info}
      <View style={{ flex: 1 }} />
      {action}
    </View>
  );
}

/** Cabeçalho de página: código mono, título e apoio. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  color,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  color?: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      {!!eyebrow && (
        <Text style={[styles.eyebrow, color ? { color } : null]}>
          {"// "}
          {eyebrow}
        </Text>
      )}
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

export type Step = { label: string; done: boolean };
/** Trilha de progresso da jornada (estilo missão). */
export function StepTracker({ steps }: { steps: Step[] }) {
  const current = steps.findIndex((s) => !s.done);
  return (
    <View
      style={local.tracker}
      accessibilityLabel={`Progresso: ${steps.filter((s) => s.done).length} de ${steps.length} etapas`}
    >
      {steps.map((step, index) => {
        const active = index === current;
        const tone = step.done
          ? colors.primary
          : active
            ? colors.text
            : colors.faint;
        return (
          <View key={step.label} style={local.trackerItem}>
            <View
              style={[
                local.trackerBar,
                {
                  backgroundColor: step.done
                    ? colors.primary
                    : active
                      ? alpha(colors.primary, 0.35)
                      : colors.border,
                },
              ]}
            />
            <Text numberOfLines={1} style={[local.trackerText, { color: tone }]}>
              {step.done ? "✓ " : `${index + 1}. `}
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/** Atalho compacto em grade. */
export function Tile({
  icon,
  title,
  subtitle,
  color = colors.accent,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.card, local.tile, pressed && styles.pressed]}
    >
      <View style={[local.tileIcon, { backgroundColor: alpha(color, 0.12) }]}>
        <Text aria-hidden style={{ color, fontSize: 16, fontWeight: "800" }}>
          {icon}
        </Text>
      </View>
      <View style={{ gap: 2 }}>
        <Text style={[styles.body, { fontWeight: "700" }]}>{title}</Text>
        <Text style={styles.label}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

/** Retratos sobrepostos, como um grupo de jogadores. */
export function PortraitStack({
  sources,
  size = 40,
}: {
  sources: ImageSourcePropType[];
  size?: number;
}) {
  return (
    <View style={{ flexDirection: "row" }} aria-hidden>
      {sources.map((source, index) => (
        <Image
          key={index}
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: colors.card,
            marginLeft: index ? -size / 3 : 0,
          }}
        />
      ))}
    </View>
  );
}

/** Iniciais em círculo para membros sem retrato. */
export function Initials({
  name,
  color = colors.accent,
  size = 36,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <View
      aria-hidden
      style={[
        local.initials,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: alpha(color, 0.14) },
      ]}
    >
      <Text style={{ color, fontWeight: "800", fontSize: Math.round(size * 0.36) }}>{letters}</Text>
    </View>
  );
}

/** Campo de formulário com rótulo. */
export function Field({
  label,
  hint,
  trailing,
  ...input
}: TextInputProps & { label: string; hint?: string; trailing?: ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={local.fieldLabel}>{label}</Text>
      <View style={{ justifyContent: "center" }}>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.faint}
          {...input}
          style={[styles.input, trailing ? { paddingRight: 88 } : null, input.style]}
        />
        {trailing && <View style={local.trailing}>{trailing}</View>}
      </View>
      {!!hint && <Text style={styles.notice}>{hint}</Text>}
    </View>
  );
}

/** Seletor numérico com − e +. */
export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <View style={local.stepper}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.body, { fontWeight: "600" }]}>{label}</Text>
        <Text style={styles.notice}>
          {min}–{max}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Diminuir ${label}`}
        disabled={disabled || value <= min}
        onPress={() => onChange(clamp(value - 1))}
        style={({ pressed }) => [
          local.stepButton,
          (disabled || value <= min) && { opacity: 0.35 },
          pressed && styles.pressed,
        ]}
      >
        <Text style={local.stepGlyph}>−</Text>
      </Pressable>
      <TextInput
        accessibilityLabel={label}
        keyboardType="number-pad"
        editable={!disabled}
        maxLength={3}
        value={draft ?? String(value)}
        onChangeText={setDraft}
        onBlur={() => {
          const n = Number(draft);
          if (draft !== null && Number.isInteger(n)) onChange(clamp(n));
          setDraft(null);
        }}
        style={local.stepValue}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Aumentar ${label}`}
        disabled={disabled || value >= max}
        onPress={() => onChange(clamp(value + 1))}
        style={({ pressed }) => [
          local.stepButton,
          (disabled || value >= max) && { opacity: 0.35 },
          pressed && styles.pressed,
        ]}
      >
        <Text style={local.stepGlyph}>+</Text>
      </Pressable>
    </View>
  );
}

/** Barra de progresso fina. */
export function Progress({ value, color = colors.primary }: { value: number; color?: string }) {
  return (
    <View style={local.track}>
      <View
        style={{
          height: "100%",
          borderRadius: 4,
          width: `${Math.min(Math.max(value, 0), 1) * 100}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

/** Divisor com texto central (“ou”). */
export function Divider({ label }: { label?: string }) {
  return (
    <View style={local.divider}>
      <View style={local.dividerLine} />
      {!!label && <Text style={[styles.eyebrow, { color: colors.faint }]}>{label}</Text>}
      <View style={local.dividerLine} />
    </View>
  );
}

const local = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  chipText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "#000000B3",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: "88%",
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.raised,
  },
  info: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: { minHeight: 32, justifyContent: "center" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  tracker: { flexDirection: "row", gap: 8 },
  trackerItem: { flex: 1, gap: 8 },
  trackerBar: { height: 4, borderRadius: 2 },
  trackerText: { fontSize: 11, fontFamily: fonts.mono, fontWeight: "600" },
  tile: { flex: 1, padding: 16, gap: 14 },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: { fontSize: 13, color: colors.muted, fontWeight: "600" },
  trailing: { position: "absolute", right: 6 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  stepGlyph: { color: colors.text, fontSize: 20, fontWeight: "600" },
  stepValue: {
    width: 52,
    textAlign: "center",
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: fonts.mono,
    paddingVertical: 6,
  },
  track: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  divider: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
});
