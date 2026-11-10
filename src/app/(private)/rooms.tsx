import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  heroOf,
  roomsApi,
  roomState,
  type Coordinates,
  type RoomSummary,
} from "../../services/rooms";
import { locate } from "../../services/location";
import { useAuth } from "../../state/auth";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import { Chip, Divider, Field, Help, InfoButton, PageHeader, Sheet } from "../../components/ui";
import { CharacterAvatar, CharacterPicker } from "../../components/CharacterPicker";
import { classLook } from "../../components/ClassCard";
import { useOptionalCharacters } from "../../state/characters";
import { alpha, colors, fonts, glow, styles } from "../../styles";
export default function Rooms() {
  const { user } = useAuth();
  // Personagem escolhido na Home (o jogador pode trocar aqui antes de entrar).
  const { characterId } = useLocalSearchParams<{ characterId?: string }>();
  const characters = useOptionalCharacters()?.characters ?? [];
  const [heroId, setHeroId] = useState(characterId);
  const [pickHero, setPickHero] = useState(false);
  const hero =
    characters.find((c) => c.id === heroId) ??
    (characters.length === 1 ? characters[0] : undefined);
  const [mine, setMine] = useState<RoomSummary[]>([]);
  const [nearby, setNearby] = useState<RoomSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [toDelete, setToDelete] = useState<RoomSummary | null>(null);
  const coordinates = useRef<Coordinates | null>(null);
  const active = useRef(false);
  const searchVersion = useRef(0);
  useFocusEffect(
    useCallback(() => {
      let stopped = false;
      if (!user?.token) {
        setTimeout(() => {
          if (!stopped) setLoading(false);
        }, 0);
      }
      active.current = true;
      let timer: ReturnType<typeof setTimeout>;
      const controller = new AbortController();
      async function refresh() {
        try {
          if (user?.token && AppState.currentState === "active") {
            setMine(await roomsApi.list(user, controller.signal));
            const version = searchVersion.current;
            if (coordinates.current) {
              const result = await roomsApi.nearby(
                user,
                coordinates.current,
                controller.signal,
              );
              if (!stopped && version === searchVersion.current)
                setNearby(result);
            }
            if (!stopped) setError("");
          }
        } catch (e) {
          if (!controller.signal.aborted)
            setError(
              e instanceof Error
                ? e.message
                : "Não foi possível carregar as salas.",
            );
        } finally {
          if (!stopped) {
            setLoading(false);
            timer = setTimeout(() => void refresh(), 8000);
          }
        }
      }
      void refresh();
      return () => {
        stopped = true;
        active.current = false;
        controller.abort();
        clearTimeout(timer);
        coordinates.current = null;
        searchVersion.current++;
        if (user?.token) void roomsApi.stopSeeking(user).catch(() => {});
      };
    }, [user]),
  );
  async function search() {
    if (!user) return;
    setBusy(true);
    setError("");
    const version = ++searchVersion.current;
    try {
      const coords = await locate();
      if (!active.current || version !== searchVersion.current) return;
      const result = await roomsApi.nearby(user, coords);
      if (active.current && version === searchVersion.current) {
        coordinates.current = coords;
        setNearby(result);
        setSearching(true);
      }
    } catch (e) {
      if (active.current)
        setError(
          e instanceof Error ? e.message : "Não foi possível localizar salas.",
        );
    } finally {
      if (active.current) setBusy(false);
    }
  }
  async function enter(room: RoomSummary) {
    if (!user) return;
    setBusy(true);
    setError("");
    try {
      if (!coordinates.current)
        throw Error("Busque novamente as salas próximas.");
      const fresh = await locate(room.radius);
      if (!active.current) return;
      const joined = await roomsApi.join(user, room.id, fresh, hero && heroOf(hero));
      router.push({ pathname: "/lobby", params: { roomId: joined.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  }
  async function joinByCode() {
    if (!user) return;
    setBusy(true);
    setError("");
    try {
      const coords = await locate();
      if (!active.current) return;
      const joined = await roomsApi.joinCode(user, code.trim(), coords, hero && heroOf(hero));
      router.push({ pathname: "/lobby", params: { roomId: joined.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  }
  function stopSearch() {
    if (!user) return;
    coordinates.current = null;
    searchVersion.current++;
    setSearching(false);
    setNearby([]);
    void roomsApi
      .stopSeeking(user)
      .catch(() =>
        setError(
          "Não foi possível encerrar a busca no servidor. Ela expira automaticamente em dois minutos.",
        ),
      );
  }
  async function openRoom(r: RoomSummary) {
    if (!user) return;
    setBusy(true);
    setError("");
    try {
      // Reabrir = liberar entradas e ir ao lobby (lá o mestre fica presente).
      if (r.status !== "open") await roomsApi.act(user, r, "status", { status: "open" });
      router.push({ pathname: "/lobby", params: { roomId: r.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível abrir a sala.");
    } finally {
      setBusy(false);
    }
  }
  async function deleteRoom() {
    if (!user || !toDelete) return;
    setBusy(true);
    try {
      await roomsApi.remove(user, toDelete.id);
      setMine((list) => list.filter((r) => r.id !== toDelete.id));
      setToDelete(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível excluir a sala.");
      setToDelete(null);
    } finally {
      setBusy(false);
    }
  }
  function card(r: RoomSummary, joined = false) {
    const status = statusLook[roomState(r)];
    const owner = joined && r.masterId === user?.id;
    const info = (
      <View style={{ flex: 1, gap: 6 }}>
        <Chip label={status.label} color={status.color} />
        <Text style={styles.section} numberOfLines={1}>
          {r.name}
        </Text>
        <Text style={local.meta}>
          {owner ? "" : `${r.masterName} · `}
          {r.count}/{r.capacity} jogadores
          {r.distance !== undefined ? ` · ~${r.distance} m` : ""}
        </Text>
      </View>
    );
    if (owner)
      return (
        <View key={r.id} style={[styles.card, { gap: 14 }]}>
          {info}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Button
                small
                icon="▶"
                title={roomState(r) === "open" ? "Abrir lobby" : "Reabrir sala"}
                disabled={busy}
                onPress={() => void openRoom(r)}
              />
            </View>
            <Button
              small
              variant="danger"
              title="Excluir"
              accessibilityLabel={`Excluir a sala ${r.name}`}
              disabled={busy}
              onPress={() => setToDelete(r)}
            />
          </View>
        </View>
      );
    return (
      <Pressable
        key={r.id}
        accessibilityRole="button"
        accessibilityLabel={`${joined ? "Abrir lobby" : "Entrar no lobby"} de ${r.name}`}
        disabled={busy || (!joined && !hero)}
        onPress={() =>
          joined
            ? router.push({ pathname: "/lobby", params: { roomId: r.id } })
            : void enter(r)
        }
        style={({ pressed }) => [styles.card, local.room, pressed && styles.pressed]}
      >
        {info}
        <View style={local.go}>
          <Text style={{ color: colors.primary, fontSize: 18, fontWeight: "700" }}>→</Text>
        </View>
      </Pressable>
    );
  }
  const isMaster = user?.role === "master";
  const others = nearby.filter((r) => !mine.some((m) => m.id === r.id));
  return (
    <Screen>
      <PageHeader
        eyebrow={isMaster ? "Suas salas" : "Encontre sua mesa"}
        title={isMaster ? "Reúna sua turma" : "Entre na sala da turma"}
        subtitle={
          isMaster
            ? "Crie uma sala e compartilhe o código com os alunos."
            : "Busque salas por perto ou use o código do mestre."
        }
      />
      {!isMaster && characters.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hero ? `Jogando com ${hero.name}. Trocar personagem.` : "Escolher personagem"}
          onPress={() => setPickHero(true)}
          style={({ pressed }) => [
            styles.card,
            local.heroBar,
            hero
              ? { borderColor: alpha(classLook[hero.classId].color, 0.45) }
              : { borderColor: alpha(colors.warning, 0.5) },
            pressed && styles.pressed,
          ]}
        >
          {hero ? (
            <CharacterAvatar character={hero} size={48} ring={classLook[hero.classId].color} />
          ) : (
            <View style={local.heroEmpty}>
              <Text style={{ color: colors.warning, fontSize: 20, fontWeight: "800" }}>?</Text>
            </View>
          )}
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.eyebrow, { color: colors.faint }]}>
              {hero ? "Jogando com" : "Antes de entrar"}
            </Text>
            <Text style={[styles.body, { fontWeight: "700" }]} numberOfLines={1}>
              {hero ? hero.name.split(",")[0] : "Escolha seu personagem"}
            </Text>
          </View>
          <Text style={{ color: colors.accent, fontWeight: "600" }}>{hero ? "Trocar" : "Escolher"}</Text>
        </Pressable>
      )}
      {!user?.token ? (
        <View style={[styles.card, { alignItems: "center", paddingVertical: 28 }]}>
          <Text style={{ fontSize: 28, color: colors.faint }}>⌁</Text>
          <Text style={[styles.section, styles.centeredText]}>Modo offline</Text>
          <Text style={[styles.label, styles.centeredText]}>
            As salas funcionam entre celulares com uma conta do servidor.
            Configure o servidor e faça um cadastro online.
          </Text>
        </View>
      ) : (
        <>
          {!!error && (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          )}

          {isMaster && (
            <Button
              icon="+"
              title="Criar nova sala"
              onPress={() => router.push("/create-room")}
            />
          )}

          {(isMaster || mine.length > 0) && (
            <View style={{ gap: 10 }}>
              <Text style={[styles.eyebrow, { color: colors.faint }]}>
                {"// "}
                {isMaster ? `Criadas · ${mine.length}` : "Continue de onde parou"}
              </Text>
              {loading && <ActivityIndicator color={colors.primary} />}
              {!loading && mine.length === 0 && (
                <Text style={styles.label}>Nenhuma sala ainda. Crie a primeira acima.</Text>
              )}
              {mine.map((r) => card(r, true))}
              {isMaster && mine.length > 0 && (
                <Text style={styles.notice}>
                  A sala fica fechada enquanto você não está no lobby. Reabra quando a
                  turma estiver pronta.
                </Text>
              )}
            </View>
          )}

          {!isMaster && (
            <>
              <View
                style={[
                  styles.card,
                  local.radarCard,
                  searching && { borderColor: alpha(colors.primary, 0.5) },
                ]}
              >
                <View style={local.radar} aria-hidden>
                  {[120, 84, 48].map((size) => (
                    <View
                      key={size}
                      style={[
                        local.ring,
                        {
                          width: size,
                          height: size,
                          borderRadius: size / 2,
                          borderColor: alpha(colors.primary, searching ? 0.5 : 0.22),
                        },
                      ]}
                    />
                  ))}
                  <View
                    style={[
                      local.dot,
                      searching && { boxShadow: glow(colors.primary, 0.8) },
                    ]}
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={styles.section}>Salas por perto</Text>
                  <InfoButton title="Privacidade da busca">
                    <Help>
                      Enquanto esta tela estiver aberta, seu nome fica visível aos
                      mestres próximos. Sua posição não aparece para os outros
                      jogadores.
                    </Help>
                    <Help>
                      A localização confirma que você está na sala de aula. O GPS
                      pode ficar impreciso dentro de prédios.
                    </Help>
                  </InfoButton>
                </View>
                <Text style={[styles.label, styles.centeredText]}>
                  {searching
                    ? others.length
                      ? `${others.length} sala(s) encontrada(s).`
                      : "Nenhuma sala com vagas por perto ainda."
                    : "Use o GPS para encontrar a sala do seu mestre."}
                </Text>
                <View style={{ alignSelf: "stretch", gap: 4 }}>
                  <Button
                    title={busy ? "Buscando…" : searching ? "Buscar de novo" : "Buscar pelo GPS"}
                    disabled={busy || !hero}
                    secondary={searching}
                    onPress={() => void search()}
                  />
                  {searching && (
                    <Button variant="ghost" title="Parar de procurar" disabled={busy} onPress={stopSearch} />
                  )}
                </View>
              </View>

              {others.map((r) => card(r))}

              <Divider label="ou" />

              <View style={[styles.card, { gap: 14 }]}>
                <Field
                  label="Tem o código da sala?"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={6}
                  value={code}
                  onChangeText={setCode}
                  placeholder="ABC123"
                  style={local.code}
                />
                <Button
                  secondary
                  title="Entrar com código"
                  disabled={busy || !hero || code.trim().length !== 6}
                  onPress={() => void joinByCode()}
                />
              </View>
            </>
          )}
        </>
      )}
      <Sheet
        visible={pickHero}
        title="Com quem você vai jogar?"
        onClose={() => setPickHero(false)}
      >
        <CharacterPicker
          characters={characters}
          selectedId={hero?.id}
          onSelect={(c) => {
            setHeroId(c.id);
            setPickHero(false);
          }}
        />
        <Help>
          O mestre e o seu grupo veem este personagem no lobby. Já está numa sala?
          Entre de novo pelo código para trocar.
        </Help>
      </Sheet>
      <Sheet
        visible={!!toDelete}
        title={`Excluir “${toDelete?.name ?? ""}”?`}
        onClose={() => {
          if (!busy) setToDelete(null);
        }}
        footer={
          <>
            <Button
              variant="destructive"
              title={busy ? "Excluindo…" : "Sim, excluir sala"}
              disabled={busy}
              onPress={() => void deleteRoom()}
            />
            <Button variant="ghost" title="Cancelar" disabled={busy} onPress={() => setToDelete(null)} />
          </>
        }
      >
        <Help>
          Os jogadores saem da sala e os grupos são apagados. O código deixa de
          funcionar. Não dá para desfazer.
        </Help>
      </Sheet>
    </Screen>
  );
}

const statusLook = {
  open: { label: "● ABERTA", color: colors.primary },
  paused: { label: "❚❚ PAUSADA", color: colors.warning },
  closed: { label: "■ FECHADA", color: colors.faint },
} as const;

const local = StyleSheet.create({
  room: { flexDirection: "row", alignItems: "center", gap: 14 },
  heroBar: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  heroEmpty: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: alpha(colors.warning, 0.6),
    alignItems: "center",
    justifyContent: "center",
  },
  meta: { color: colors.muted, fontFamily: fonts.mono, fontSize: 12 },
  go: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: alpha(colors.primary, 0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  radarCard: { alignItems: "center", gap: 10, paddingVertical: 24 },
  radar: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  ring: { position: "absolute", borderWidth: 1 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: 22,
    letterSpacing: 6,
    textAlign: "center",
  },
});
