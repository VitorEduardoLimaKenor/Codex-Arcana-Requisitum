import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import { AdventureIcon, NpcAvatar } from "../../components/AdventureCard";
import { Field, Help, InfoButton, PageHeader, SectionHeader, Sheet } from "../../components/ui";
import { useAdventures } from "../../hooks/useAdventures";
import { cameraAvailable, pickPhoto } from "../../services/photos";
import {
  adventureColors,
  adventureIcons,
  adventureLevels,
  createAdventure,
  levelColors,
  SESSION_LENGTH,
  type Adventure,
  type AdventureLevel,
  type Npc,
} from "../../data/adventures";
import { alpha, colors, fonts, styles } from "../../styles";

const NPC_COLOR = colors.accent;
const emptyNpc: Npc = { name: "", role: "", secret: "" };

const newAdventure = (input: Parameters<typeof createAdventure>[0]) =>
  createAdventure({ ...input, now: Date.now() });

/** Painel para cadastrar ou editar um personagem do mestre. */
function NpcSheet({
  value,
  onClose,
  onSave,
}: {
  value: { index: number | null; npc: Npc } | null;
  onClose: () => void;
  onSave: (npc: Npc) => void;
}) {
  const [draft, setDraft] = useState<Npc>(emptyNpc);
  const [lastValue, setLastValue] = useState(value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Reinicia o rascunho sempre que o painel abre para outro personagem.
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value?.npc ?? emptyNpc);
    setError("");
  }
  async function photo(source: "camera" | "library") {
    setBusy(true);
    setError("");
    try {
      const image = await pickPhoto(source);
      if (image) setDraft((d) => ({ ...d, image }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível usar a foto.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Sheet
      visible={!!value}
      title={value?.index === null ? "Novo personagem" : "Editar personagem"}
      onClose={onClose}
      footer={
        <Button
          title="Salvar personagem"
          disabled={busy || draft.name.trim().length < 2}
          onPress={() => onSave(draft)}
        />
      }
    >
      <View style={local.photoRow}>
        <NpcAvatar npc={{ ...draft, name: draft.name || "?" }} size={88} color={NPC_COLOR} />
        <View style={{ flex: 1, gap: 8 }}>
          {cameraAvailable && (
            <Button
              small
              secondary
              icon="◉"
              title="Tirar foto"
              disabled={busy}
              onPress={() => void photo("camera")}
            />
          )}
          <Button
            small
            secondary
            icon="▦"
            title={busy ? "Carregando…" : "Escolher da galeria"}
            disabled={busy}
            onPress={() => void photo("library")}
          />
          {!!draft.image && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setDraft((d) => ({ ...d, image: undefined }))}
              hitSlop={6}
            >
              <Text style={{ color: colors.error, fontSize: 13, fontWeight: "600" }}>
                Remover foto
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Field
        label="Nome"
        value={draft.name}
        onChangeText={(name) => setDraft((d) => ({ ...d, name }))}
        maxLength={40}
        placeholder="Ex.: Dona Célia"
      />
      <Field
        label="Quem é"
        value={draft.role}
        onChangeText={(role) => setDraft((d) => ({ ...d, role }))}
        maxLength={60}
        placeholder="Ex.: Bibliotecária há 20 anos"
      />
      <Field
        label="O que precisa ou esconde"
        hint="Só você vê. A turma descobre interpretando e fazendo boas perguntas."
        multiline
        textAlignVertical="top"
        value={draft.secret}
        onChangeText={(secret) => setDraft((d) => ({ ...d, secret }))}
        maxLength={300}
        placeholder="Ex.: Teme que o novo sistema torne seu trabalho dispensável."
        style={{ minHeight: 80 }}
      />
    </Sheet>
  );
}

type IconChoice = Pick<Adventure, "icon" | "color" | "iconImage">;

/** Painel para escolher o ícone: símbolo + cor, ou uma imagem própria. */
function IconSheet({
  visible,
  value,
  onChange,
  onClose,
}: {
  visible: boolean;
  value: IconChoice;
  onChange: (value: IconChoice) => void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function image(source: "camera" | "library") {
    setBusy(true);
    setError("");
    try {
      const iconImage = await pickPhoto(source);
      if (iconImage) onChange({ ...value, iconImage });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível usar a imagem.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Sheet
      visible={visible}
      title="Ícone da aventura"
      onClose={onClose}
      footer={<Button title="Pronto" onPress={onClose} />}
    >
      <View style={{ alignItems: "center", paddingVertical: 4 }}>
        <AdventureIcon adventure={value} size={88} />
      </View>
      <Text style={local.label}>Símbolo</Text>
      <View style={local.grid} accessibilityRole="radiogroup">
        {adventureIcons.map((icon) => {
          const active = !value.iconImage && value.icon === icon;
          return (
            <Pressable
              key={icon}
              accessibilityRole="radio"
              accessibilityLabel={`Símbolo ${icon}`}
              aria-checked={active}
              accessibilityState={{ checked: active }}
              onPress={() => onChange({ ...value, icon, iconImage: undefined })}
              style={[
                local.glyph,
                active && { borderColor: value.color, backgroundColor: alpha(value.color, 0.12) },
              ]}
            >
              <Text style={{ color: active ? value.color : colors.muted, fontSize: 20, fontWeight: "800" }}>
                {icon}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={local.label}>Cor</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }} accessibilityRole="radiogroup">
        {adventureColors.map((color) => {
          const active = value.color === color;
          return (
            <Pressable
              key={color}
              accessibilityRole="radio"
              accessibilityLabel={`Cor ${color}`}
              aria-checked={active}
              accessibilityState={{ checked: active }}
              onPress={() => onChange({ ...value, color })}
              style={[
                local.swatch,
                { backgroundColor: color },
                active && { borderColor: colors.text, transform: [{ scale: 1.1 }] },
              ]}
            />
          );
        })}
      </View>
      <Text style={local.label}>Ou use uma imagem</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {cameraAvailable && (
          <View style={{ flex: 1 }}>
            <Button small secondary icon="◉" title="Câmera" disabled={busy} onPress={() => void image("camera")} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Button
            small
            secondary
            icon="▦"
            title={busy ? "Carregando…" : "Galeria"}
            disabled={busy}
            onPress={() => void image("library")}
          />
        </View>
      </View>
      {!!value.iconImage && (
        <Button
          small
          variant="danger"
          title="Remover imagem e usar o símbolo"
          onPress={() => onChange({ ...value, iconImage: undefined })}
        />
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </Sheet>
  );
}

function Form({ initial }: { initial?: Adventure }) {
  const { add, update } = useAdventures();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [level, setLevel] = useState<AdventureLevel>(initial?.level ?? "Iniciante");
  const [look, setLook] = useState<IconChoice>({
    icon: initial?.icon ?? adventureIcons[0],
    color: initial?.color ?? adventureColors[0],
    iconImage: initial?.iconImage,
  });
  const [iconOpen, setIconOpen] = useState(false);
  const [npcs, setNpcs] = useState<Npc[]>(initial?.npcs ?? []);
  const [objectives, setObjectives] = useState(initial?.objectives.join("\n") ?? "");
  const [scenes, setScenes] = useState(
    initial?.scenes.map((s) => (s.text ? `${s.title}: ${s.text}` : s.title)).join("\n") ?? "",
  );
  const [masterNotes, setMasterNotes] = useState(initial?.masterNotes ?? "");
  const [editingNpc, setEditingNpc] = useState<{ index: number | null; npc: Npc } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const valid = title.trim().length >= 3 && summary.trim().length >= 10;

  async function save() {
    if (!valid) return;
    setBusy(true);
    setError("");
    try {
      const input = { title, summary, level, objectives, scenes, masterNotes, npcs, ...look };
      const adventure = initial
        ? createAdventure({ ...input, id: initial.id })
        : newAdventure(input);
      await (initial ? update(adventure) : add(adventure));
      router.replace({ pathname: "/adventure", params: { id: adventure.id } });
    } catch {
      setError("Não foi possível salvar. Fotos muito grandes? Tente remover alguma.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      footer={
        <>
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Button
            title={busy ? "Salvando…" : initial ? "Salvar alterações" : "Salvar aventura"}
            disabled={!valid || busy}
            onPress={() => void save()}
          />
        </>
      }
    >
      <PageHeader
        eyebrow={initial ? "Editar aventura" : "Nova aventura"}
        title={initial ? initial.title : "Cadastre sua aventura"}
        subtitle={`Cada aventura cabe em ${SESSION_LENGTH.replace("1 sessão · ", "uma aula de ")}. Só título e resumo são obrigatórios.`}
      />
      <View style={[styles.card, { gap: 16 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Escolher ícone da aventura"
          onPress={() => setIconOpen(true)}
          style={({ pressed }) => [local.iconRow, pressed && styles.pressed]}
        >
          <View>
            <AdventureIcon adventure={look} size={64} />
            <View style={local.iconBadge}>
              <Text style={{ color: colors.primaryInk, fontSize: 11, fontWeight: "900" }}>✎</Text>
            </View>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.body, { fontWeight: "700" }]}>Ícone</Text>
            <Text style={styles.label}>Toque para escolher um símbolo, uma cor ou uma imagem.</Text>
          </View>
          <Text style={{ color: colors.faint, fontSize: 22 }}>›</Text>
        </Pressable>
        <Field
          label="Título"
          value={title}
          onChangeText={setTitle}
          maxLength={80}
          placeholder="Ex.: O app da biblioteca"
        />
        <Field
          label="Resumo para a turma"
          hint="Aparece para os alunos na sala."
          multiline
          textAlignVertical="top"
          value={summary}
          onChangeText={setSummary}
          maxLength={1000}
          placeholder="O problema, quem está envolvido e o que a equipe precisa descobrir."
          style={{ minHeight: 110 }}
        />
        <View style={{ gap: 8 }}>
          <Text style={local.label}>Nível</Text>
          <View style={{ flexDirection: "row", gap: 8 }} accessibilityRole="radiogroup">
            {adventureLevels.map((option) => {
              const active = option === level;
              const color = levelColors[option];
              return (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  aria-checked={active}
                  accessibilityState={{ checked: active }}
                  onPress={() => setLevel(option)}
                  style={[
                    local.option,
                    active && { borderColor: color, backgroundColor: alpha(color, 0.1) },
                  ]}
                >
                  <Text style={[local.optionText, active && { color }]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <SectionHeader
          title="Personagens"
          info={
            <InfoButton title="Personagens do mestre">
              <Help>
                São as pessoas que você interpreta durante a aventura: clientes,
                usuários, gestores. Cada uma tem algo que precisa ou esconde, e a
                turma descobre fazendo boas perguntas.
              </Help>
            </InfoButton>
          }
          action={
            <Text style={{ color: colors.faint, fontFamily: fonts.mono, fontSize: 12 }}>
              {npcs.length}
            </Text>
          }
        />
        {npcs.map((npc, index) => (
          // Duas áreas irmãs (editar e remover): botão dentro de botão é inválido na web.
          <View key={`${npc.name}-${index}`} style={[styles.card, local.npc]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Editar ${npc.name}`}
              onPress={() => setEditingNpc({ index, npc })}
              style={({ pressed }) => [local.npcMain, pressed && styles.pressed]}
            >
              <NpcAvatar npc={npc} size={48} color={NPC_COLOR} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.body, { fontWeight: "700" }]} numberOfLines={1}>
                  {npc.name}
                </Text>
                {!!npc.role && (
                  <Text style={styles.label} numberOfLines={1}>
                    {npc.role}
                  </Text>
                )}
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remover ${npc.name}`}
              hitSlop={10}
              onPress={() => setNpcs((list) => list.filter((_, i) => i !== index))}
              style={local.remove}
            >
              <Text style={{ color: colors.muted, fontSize: 14 }}>✕</Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={() => setEditingNpc({ index: null, npc: emptyNpc })}
          style={({ pressed }) => [local.add, pressed && styles.pressed]}
        >
          <Text style={{ color: colors.accent, fontSize: 18 }}>+</Text>
          <Text style={{ color: colors.muted, fontWeight: "600" }}>Adicionar personagem</Text>
        </Pressable>
      </View>

      <Text style={[styles.eyebrow, { color: colors.faint }]}>{"// "}Opcional</Text>
      <View style={[styles.card, { gap: 16 }]}>
        <Field
          label="Objetivos de aprendizagem"
          hint="Um por linha."
          multiline
          textAlignVertical="top"
          value={objectives}
          onChangeText={setObjectives}
          maxLength={1500}
          placeholder={"Conduzir uma entrevista\nPriorizar requisitos"}
          style={{ minHeight: 90 }}
        />
        <Field
          label="Roteiro"
          hint="Uma cena por linha. Use “Título: descrição” se quiser detalhar."
          multiline
          textAlignVertical="top"
          value={scenes}
          onChangeText={setScenes}
          maxLength={3000}
          placeholder={"A primeira reunião: o cliente explica o problema\nO protótipo"}
          style={{ minHeight: 110 }}
        />
        <Field
          label="Notas do mestre"
          hint="Visíveis só para você."
          multiline
          textAlignVertical="top"
          value={masterNotes}
          onChangeText={setMasterNotes}
          maxLength={3000}
          placeholder="Testes, reviravoltas, dicas de condução…"
          style={{ minHeight: 90 }}
        />
      </View>

      <IconSheet
        visible={iconOpen}
        value={look}
        onChange={setLook}
        onClose={() => setIconOpen(false)}
      />
      <NpcSheet
        value={editingNpc}
        onClose={() => setEditingNpc(null)}
        onSave={(npc) => {
          setNpcs((list) =>
            editingNpc?.index === null || editingNpc === null
              ? [...list, npc]
              : list.map((item, i) => (i === editingNpc.index ? npc : item)),
          );
          setEditingNpc(null);
        }}
      />
    </Screen>
  );
}

export default function AdventureForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { custom, ready } = useAdventures();
  if (!id) return <Form />;
  if (!ready) return <Screen>{null}</Screen>;
  const initial = custom.find((a) => a.id === id);
  // Remonta o formulário quando a aventura carrega, para preencher os campos.
  return initial ? <Form key={initial.id} initial={initial} /> : <Form />;
}

const local = StyleSheet.create({
  label: { fontSize: 13, color: colors.muted, fontWeight: "600" },
  option: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  optionText: { color: colors.muted, fontFamily: fonts.mono, fontSize: 12, fontWeight: "700" },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  iconRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  // 16 símbolos em 2 linhas de 8, sem esticar a última linha.
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 8 },
  glyph: {
    width: "11.5%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: "transparent",
  },
  npc: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  npcMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  remove: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
  },
});
