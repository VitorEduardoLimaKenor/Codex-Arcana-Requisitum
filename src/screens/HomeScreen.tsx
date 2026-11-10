import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../state/auth";
import { useCharacters } from "../state/characters";
import { useCallback, useState } from "react";
import { characterImages, portraitOf } from "../data/characterImages";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { ScreenProps } from "../navigation";
import { type Character } from "../data/codex";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ClassBadge, classLook } from "../components/ClassCard";
import { PortraitStack, SectionHeader, StepTracker, Tile } from "../components/ui";
import { CharacterPicker } from "../components/CharacterPicker";
import { FaceImage } from "../components/FaceImage";
import { roomsApi } from "../services/rooms";
import { alpha, colors, fadeTo, fonts, glow, styles } from "../styles";

const crew = ["hero-1", "hero-3", "hero-5", "hero-7", "hero-9"].map(
  (id) => characterImages[id],
);

export function HomeScreen({
  navigation,
  characters,
}: ScreenProps<"Home"> & { characters: Character[] }) {
  const { user } = useAuth();
  const { legacy, claimLegacy } = useCharacters();
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const hasCharacter = characters.length > 0;
  // O jogador escolhe com quem jogar; só há escolha automática com um personagem.
  const [pickedId, setPickedId] = useState<string | undefined>();
  const picked =
    characters.find((c) => c.id === pickedId) ??
    (characters.length === 1 ? characters[0] : undefined);
  const [inRoom, setInRoom] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (user?.token)
        roomsApi
          .list(user)
          .then((rooms) => active && setInRoom(rooms.length > 0))
          .catch(() => {});
      return () => {
        active = false;
      };
    }, [user]),
  );
  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <Screen>
      <View style={{ gap: 6 }}>
        <Text style={styles.eyebrow}>{"// "}Olá, {firstName}</Text>
        <Text style={styles.title}>
          {hasCharacter ? "Pronto para a próxima sessão?" : "Vamos montar seu personagem."}
        </Text>
      </View>

      <StepTracker
        steps={[
          { label: "Personagem", done: hasCharacter },
          { label: "Sala", done: hasCharacter && inRoom },
        ]}
      />

      {legacy > 0 && (
        <View style={[styles.card, { borderColor: alpha(colors.warning, 0.4) }]}>
          <Text style={styles.body}>
            {legacy} ficha(s) de antes do login estão neste aparelho.
          </Text>
          <Button
            small
            secondary
            title={importing ? "Importando…" : "Importar para minha conta"}
            disabled={importing}
            onPress={async () => {
              setImporting(true);
              try {
                await claimLegacy();
              } catch {
                setImportError("Não foi possível importar as fichas.");
              } finally {
                setImporting(false);
              }
            }}
          />
          {!!importError && <Text style={styles.error}>{importError}</Text>}
        </View>
      )}

      {/* Missão atual: sempre uma única ação principal. */}
      <View
        style={[
          local.quest,
          { borderColor: alpha(colors.primary, 0.45), boxShadow: glow(colors.primary, 0.12) },
        ]}
      >
        {picked ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Abrir ficha de ${picked.name}`}
            onPress={() => navigation.navigate("Character", { characterId: picked.id })}
            style={local.questArt}
          >
            {portraitOf(picked) ? (
              <FaceImage source={portraitOf(picked)!} />
            ) : (
              <View style={[StyleSheet.absoluteFill, local.center]}>
                <ClassBadge classId={picked.classId} large />
              </View>
            )}
            <View style={[StyleSheet.absoluteFill, { backgroundImage: fadeTo(colors.card) }]} />
          </Pressable>
        ) : (
          <View style={[local.questArt, local.center, { height: 120 }]}>
            <PortraitStack
              sources={
                hasCharacter
                  ? characters.slice(0, 5).flatMap((c) => portraitOf(c) ?? [])
                  : crew
              }
              size={56}
            />
          </View>
        )}
        <View style={local.questBody}>
          <Text style={styles.eyebrow}>
            ▶ Missão {hasCharacter ? "02" : "01"}
          </Text>
          <Text style={styles.section}>
            {hasCharacter ? "Entre na sala da sua turma" : "Escolha seu personagem"}
          </Text>
          {hasCharacter ? (
            <>
              <Text style={styles.label}>Com quem você vai jogar hoje?</Text>
              <CharacterPicker
                characters={characters}
                selectedId={picked?.id}
                onSelect={(c) => setPickedId(c.id)}
              />
            </>
          ) : (
            <Text style={styles.label}>
              10 profissionais de tecnologia prontos para jogar. Escolha o seu em segundos.
            </Text>
          )}
          <View style={{ marginTop: 6 }}>
            {hasCharacter ? (
              <Button
                title={picked ? `Entrar com ${picked.name.split(",")[0]}` : "Escolha um personagem"}
                arrow={!!picked}
                disabled={!picked}
                onPress={() =>
                  picked &&
                  router.push({ pathname: "/rooms", params: { characterId: picked.id } })
                }
              />
            ) : (
              <Button
                title="Escolher personagem"
                arrow
                onPress={() => navigation.navigate("CreateCharacter")}
              />
            )}
          </View>
        </View>
      </View>

      {hasCharacter && (
        <View style={{ gap: 12 }}>
          <SectionHeader
            title="Suas fichas"
            action={
              <Text style={{ color: colors.faint, fontFamily: fonts.mono, fontSize: 12 }}>
                {characters.length}
              </Text>
            }
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            style={{ marginHorizontal: -20 }}
          >
            <View style={{ width: 10 }} />
            {characters.map((item) => {
              const look = classLook[item.classId];
              const source = portraitOf(item);
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir ficha de ${item.name}`}
                  onPress={() => navigation.navigate("Character", { characterId: item.id })}
                  style={({ pressed }) => [local.hero, pressed && styles.pressed]}
                >
                  {source ? (
                    <Image source={source} style={local.heroImage} />
                  ) : (
                    <View style={[local.heroImage, local.center]}>
                      <ClassBadge classId={item.classId} />
                    </View>
                  )}
                  <View style={{ padding: 10, gap: 2 }}>
                    <Text numberOfLines={1} style={[styles.body, { fontWeight: "700" }]}>
                      {item.name.split(",")[0]}
                    </Text>
                    <Text style={{ color: look.color, fontFamily: fonts.mono, fontSize: 11 }}>
                      {look.title.toUpperCase()} · NV{item.level}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Escolher novo personagem"
              onPress={() => navigation.navigate("CreateCharacter")}
              style={({ pressed }) => [local.hero, local.newHero, pressed && styles.pressed]}
            >
              <Text style={{ color: colors.primary, fontSize: 28 }}>+</Text>
              <Text style={styles.label}>Novo</Text>
            </Pressable>
            <View style={{ width: 10 }} />
          </ScrollView>
        </View>
      )}

      <View style={{ gap: 12 }}>
        <SectionHeader title="Explorar" />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Tile
            icon="✦"
            title="Classes"
            subtitle="5 papéis na equipe"
            onPress={() => navigation.navigate("Classes")}
          />
          <Tile
            icon="?"
            title="Como jogar"
            subtitle="Regras em 2 min"
            color={colors.violet}
            onPress={() => navigation.navigate("Guide")}
          />
        </View>
      </View>
    </Screen>
  );
}

const local = StyleSheet.create({
  quest: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  questArt: { height: 170, backgroundColor: colors.raised, overflow: "hidden" },
  questBody: { padding: 18, paddingTop: 4, gap: 6 },
  center: { alignItems: "center", justifyContent: "center" },
  hero: {
    width: 132,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  heroImage: { width: "100%", height: 132, backgroundColor: colors.raised },
  newHero: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
    backgroundColor: "transparent",
  },
});
