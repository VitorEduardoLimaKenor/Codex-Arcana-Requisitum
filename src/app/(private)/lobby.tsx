import { GroupName } from "../../components/GroupName";
import { ApiError } from "../../services/api";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, AppState, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import { Disclosure } from "../../components/Disclosure";
import { RoomLimits } from "../../components/RoomLimits";
import { roomsApi, roomState, type Room, type Member } from "../../services/rooms";
import { useAuth } from "../../state/auth";
import { CharacterAvatar } from "../../components/CharacterPicker";
import { classLook } from "../../components/ClassCard";
import {
  Chip,
  Help,
  InfoButton,
  Initials,
  PageHeader,
  Progress,
  SectionHeader,
  Sheet,
} from "../../components/ui";
import { alpha, colors, fonts, glow, styles } from "../../styles";
export default function Lobby() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);
  const [confirm, setConfirm] = useState<{
    kind: "remove" | "leave" | "delete";
    id?: string;
    name?: string;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [gone, setGone] = useState(false);
  const mutating = useRef(false);
  const active = useRef(false);
  useFocusEffect(
    useCallback(() => {
      let stopped = false;
      void attempt;
      active.current = true;
      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout>;
      async function refresh() {
        try {
          if (
            user?.token &&
            roomId &&
            !mutating.current &&
            AppState.currentState === "active"
          ) {
            const value = await roomsApi.read(user, roomId, controller.signal);
            if (!stopped)
              setRoom((old) =>
                !old || value.version >= old.version ? value : old,
              );
          }
        } catch (e) {
          if (!controller.signal.aborted) {
            if (
              e instanceof ApiError &&
              [401, 403, 404].includes(e.status ?? 0)
            )
              setRoom(null);
            // A sala deixou de existir (o mestre excluiu): não adianta tentar de novo.
            if (e instanceof ApiError && e.status === 404) setGone(true);
            setError(
              e instanceof Error
                ? e.message
                : "Não foi possível atualizar o lobby.",
            );
          }
        } finally {
          if (!stopped) timer = setTimeout(() => void refresh(), 3000);
        }
      }
      void refresh();
      return () => {
        stopped = true;
        active.current = false;
        controller.abort();
        clearTimeout(timer);
        // Mestre saiu do lobby: a sala fecha para novos jogadores.
        if (user?.token && user.role === "master" && roomId)
          void roomsApi.presence(user, roomId, false).catch(() => {});
      };
    }, [user, roomId, attempt]),
  );
  const groupName = (number: number) =>
    room?.groups.find((g) => g.number === number)?.name ?? `Grupo ${number}`;
  const mine = !!room && room.masterId === user?.id;
  const me = room?.members.find((m) => m.id === user?.id);
  async function action(
    kind: "assign" | "remove" | "settings" | "status" | "rename-group",
    data: object,
  ) {
    if (!room || !user || mutating.current) return;
    mutating.current = true;
    setBusy(true);
    setError("");
    try {
      const value = await roomsApi.act(user, room, kind, data);
      if (active.current) {
        setRoom((old) => (!old || value.version >= old.version ? value : old));
        setSelected(null);
        setConfirm(null);
      }
    } catch (e) {
      if (active.current) {
        setError(e instanceof Error ? e.message : "Não foi possível salvar.");
        setAttempt((a) => a + 1);
      }
      throw e;
    } finally {
      mutating.current = false;
      if (active.current) setBusy(false);
    }
  }
  function member(m: Member) {
    const isMe = m.id === user?.id;
    const content = (
      <>
        {m.hero ? (
          <CharacterAvatar
            character={m.hero}
            size={40}
            ring={classLook[m.hero.classId].color}
          />
        ) : (
          <Initials name={m.name} color={isMe ? colors.primary : colors.accent} />
        )}
        <View style={{ flex: 1, gap: 1 }}>
          <Text style={styles.body} numberOfLines={1}>
            {m.name}
          </Text>
          {!!m.hero && (
            <Text
              numberOfLines={1}
              style={{ color: classLook[m.hero.classId].color, fontFamily: fonts.mono, fontSize: 11 }}
            >
              {m.hero.name.split(",")[0]} · {classLook[m.hero.classId].title}
            </Text>
          )}
        </View>
        {isMe && (
          <View style={{ justifyContent: "center" }}>
            <Chip label="VOCÊ" color={colors.primary} />
          </View>
        )}
        {mine && <Text style={{ color: colors.faint, fontSize: 18 }}>⋯</Text>}
      </>
    );
    return mine ? (
      <Pressable
        key={m.id}
        accessibilityRole="button"
        accessibilityLabel={`Organizar ${m.name}`}
        disabled={busy}
        onPress={() => setSelected(m)}
        style={({ pressed }) => [local.member, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    ) : (
      <View key={m.id} style={local.member}>
        {content}
      </View>
    );
  }
  if (!room && gone)
    return (
      <Screen
        footer={<Button title="Voltar às salas" onPress={() => router.replace("/rooms")} />}
      >
        <View style={{ alignItems: "center", gap: 12, paddingTop: 48 }}>
          <Text style={{ fontSize: 40, color: colors.faint }}>■</Text>
          <Text style={[styles.title, styles.centeredText]}>Sala encerrada</Text>
          <Text style={[styles.subtitle, styles.centeredText]}>
            O mestre excluiu esta sala. Procure a próxima aventura da sua turma.
          </Text>
        </View>
      </Screen>
    );
  if (!room)
    return (
      <Screen>
        <PageHeader eyebrow="Lobby" title="Abrindo a aventura…" />
        {error ? (
          <>
            <Text style={styles.error}>{error}</Text>
            <Button title="Tentar novamente" onPress={() => setAttempt((a) => a + 1)} />
            <Button variant="ghost" title="Voltar às salas" onPress={() => router.replace("/rooms")} />
          </>
        ) : (
          <ActivityIndicator color={colors.primary} />
        )}
      </Screen>
    );
  const waiting = room.members.filter((m) => m.groupNo === null);
  const status = {
    open: { label: "● ENTRADAS ABERTAS", color: colors.primary },
    paused: { label: "❚❚ ENTRADAS PAUSADAS", color: colors.warning },
    closed: {
      label: room.masterOnline === false ? "■ FECHADA · MESTRE AUSENTE" : "■ FECHADA",
      color: colors.faint,
    },
  }[roomState(room)];
  return (
    <>
      <Screen
        footer={
          !mine ? (
            <Button
              variant="ghost"
              title="Sair desta aventura"
              disabled={busy}
              onPress={() => setConfirm({ kind: "leave" })}
            />
          ) : undefined
        }
      >
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Chip label={status.label} color={status.color} />
            <View style={{ flex: 1 }} />
            <View style={local.live}>
              <View style={local.liveDot} />
              <Text style={local.liveText}>AO VIVO</Text>
            </View>
          </View>
          <Text style={styles.title}>{room.name}</Text>
          <Text style={styles.label}>
            Mestre {room.masterName}
            {room.description ? ` · ${room.description}` : ""}
          </Text>
        </View>

        {/* Ticket com o código */}
        <View style={[styles.card, local.ticket]}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.eyebrow, { color: colors.faint }]}>Código da sala</Text>
            <Text selectable style={local.code}>
              {room.code}
            </Text>
          </View>
          <View style={local.ticketDivider} />
          <View style={{ alignItems: "center", gap: 2, minWidth: 70 }}>
            <Text style={local.count}>
              {room.count}
              <Text style={{ color: colors.faint, fontSize: 16 }}>/{room.capacity}</Text>
            </Text>
            <Text style={[styles.eyebrow, { color: colors.faint, fontSize: 10 }]}>Jogadores</Text>
          </View>
        </View>

        {!mine && (
          <View
            style={[
              styles.card,
              local.myGroup,
              me?.groupNo
                ? { borderColor: alpha(colors.primary, 0.5), boxShadow: glow(colors.primary, 0.15) }
                : null,
            ]}
          >
            {me?.hero ? (
              <CharacterAvatar
                character={me.hero}
                size={52}
                ring={me.groupNo ? colors.primary : colors.warning}
              />
            ) : (
              <Text style={{ fontSize: 22, color: me?.groupNo ? colors.primary : colors.warning }}>
                {me?.groupNo ? "✓" : "⏳"}
              </Text>
            )}
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.section, me?.groupNo ? { color: colors.primary } : null]}>
                {me?.groupNo ? `Você está em ${groupName(me.groupNo)}` : "Aguardando o mestre"}
              </Text>
              <Text style={styles.label}>
                {me?.hero ? `Jogando com ${me.hero.name.split(",")[0]}. ` : ""}
                {me?.groupNo
                  ? "Junte-se aos colegas do seu grupo."
                  : "O mestre vai colocar você em um grupo. Fique nesta tela."}
              </Text>
            </View>
          </View>
        )}

        {!!error && (
          <View style={[styles.card, { borderColor: alpha(colors.error, 0.4) }]}>
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
            <Button small secondary title="Atualizar lobby" onPress={() => setAttempt((a) => a + 1)} />
          </View>
        )}

        <View style={{ gap: 10 }}>
          <SectionHeader
            title="Grupos"
            info={
              <InfoButton title="Formação dos grupos">
                <Help>
                  {mine
                    ? "Toque em um aluno para movê-lo de grupo ou removê-lo. Para trocar alunos entre grupos cheios, deixe um deles temporariamente no lobby."
                    : "Somente o mestre altera a formação. A tela atualiza sozinha a cada 3 segundos."}
                </Help>
              </InfoButton>
            }
            action={
              <Text style={{ color: colors.faint, fontFamily: fonts.mono, fontSize: 12 }}>
                {room.groupCount} × {room.groupSize}
              </Text>
            }
          />

          {(mine || waiting.length > 0) && (
            <View style={[styles.card, { gap: 4, borderStyle: "dashed" }]}>
              <Text style={[styles.eyebrow, { color: colors.warning, marginBottom: 4 }]}>
                Aguardando · {waiting.length}
              </Text>
              {waiting.length ? (
                waiting.map(member)
              ) : (
                <Text style={styles.label}>Ninguém aguardando.</Text>
              )}
            </View>
          )}

          {Array.from({ length: room.groupCount }, (_, i) => i + 1).map((group) => {
            const people = room.members.filter((m) => m.groupNo === group);
            const isMine = me?.groupNo === group;
            return (
              <View
                key={group}
                style={[styles.card, { gap: 8 }, isMine && { borderColor: colors.primary }]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <GroupName
                      name={groupName(group)}
                      editable={mine && room.status !== "closed"}
                      busy={busy}
                      onSave={(name) => action("rename-group", { groupNo: group, name })}
                    />
                  </View>
                  <Text style={local.groupCount}>
                    {people.length}/{room.groupSize}
                  </Text>
                </View>
                <Progress value={people.length / room.groupSize} />
                {people.length ? (
                  people.map(member)
                ) : (
                  <Text style={[styles.label, { paddingVertical: 6 }]}>Vazio</Text>
                )}
              </View>
            );
          })}
        </View>

        {mine && (
          <View style={{ gap: 8 }}>
            <Text style={[styles.eyebrow, { color: colors.faint }]}>{"// "}Gerenciar</Text>
            <Disclosure
              title="Procurando sala por perto"
              subtitle={`${room.seekers?.length ?? 0} aluno(s) com GPS ativo`}
            >
              {room.seekers?.length ? (
                room.seekers.map((s) => (
                  <View key={s.id} style={local.member}>
                    <Initials name={s.name} color={colors.violet} />
                    <Text style={[styles.body, { flex: 1 }]}>{s.name}</Text>
                    <Text style={local.groupCount}>~{s.distance} m</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.label}>Nenhum aluno procurando agora.</Text>
              )}
              <Text style={styles.notice}>
                Alunos que ativaram a busca nos últimos dois minutos. Eles entram por
                conta própria.
              </Text>
            </Disclosure>
            <Disclosure title="Vagas e grupos" subtitle={`${room.capacity} jogadores · ${room.groupCount} grupos`}>
              <RoomLimits
                key={room.id}
                initial={room}
                busy={busy}
                onSave={(settings) => action("settings", settings)}
              />
            </Disclosure>
            <Disclosure title="Entradas e sala" subtitle={status.label.replace(/^\S+ /, "")}>
              <Button
                secondary
                disabled={busy}
                title={room.status === "open" ? "Pausar novas entradas" : "Reabrir entradas"}
                onPress={() =>
                  void action("status", {
                    status: room.status === "open" ? "locked" : "open",
                  }).catch(() => {})
                }
              />
              <Text style={styles.notice}>
                A sala fecha sozinha quando você sai do lobby.
              </Text>
              <Button
                variant="danger"
                disabled={busy}
                title="Excluir sala"
                onPress={() => setConfirm({ kind: "delete" })}
              />
            </Disclosure>
          </View>
        )}
      </Screen>

      <Sheet
        visible={!!selected}
        title={`Organizar ${selected?.name ?? ""}`}
        onClose={() => {
          if (!busy) setSelected(null);
        }}
        footer={
          <Button
            variant="danger"
            title="Remover da sala"
            disabled={busy}
            onPress={() => {
              if (!selected) return;
              const target = selected;
              setSelected(null);
              setConfirm({ kind: "remove", id: target.id, name: target.name });
            }}
          />
        }
      >
        <Text style={[styles.eyebrow, { color: colors.faint }]}>Mover para</Text>
        {Array.from({ length: room.groupCount }, (_, i) => i + 1).map((group) => {
          const count = room.members.filter((m) => m.groupNo === group).length;
          const current = selected?.groupNo === group;
          const full = count >= room.groupSize && !current;
          return (
            <Pressable
              key={group}
              accessibilityRole="button"
              accessibilityLabel={`${groupName(group)}, ${count} de ${room.groupSize}`}
              disabled={busy || full || room.status === "closed"}
              onPress={() =>
                void action("assign", { userId: selected?.id, groupNo: group }).catch(() => {})
              }
              style={({ pressed }) => [
                local.option,
                current && { borderColor: colors.primary },
                (full || room.status === "closed") && { opacity: 0.4 },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.body, { flex: 1, fontWeight: "600" }]}>{groupName(group)}</Text>
              <Text style={local.groupCount}>
                {current ? "atual · " : full ? "cheio · " : ""}
                {count}/{room.groupSize}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          disabled={busy || selected?.groupNo === null}
          onPress={() =>
            void action("assign", { userId: selected?.id, groupNo: null }).catch(() => {})
          }
          style={({ pressed }) => [
            local.option,
            { borderStyle: "dashed" },
            selected?.groupNo === null && { opacity: 0.4 },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.body, { flex: 1, fontWeight: "600" }]}>Deixar aguardando no lobby</Text>
        </Pressable>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </Sheet>

      <Sheet
        visible={!!confirm}
        title={
          confirm?.kind === "leave"
            ? "Sair da aventura?"
            : confirm?.kind === "delete"
              ? "Excluir esta sala?"
              : `Remover ${confirm?.name ?? ""}?`
        }
        onClose={() => {
          if (!busy) setConfirm(null);
        }}
        footer={
          <>
            <Button
              variant="destructive"
              title={
                busy
                  ? "Aguarde…"
                  : confirm?.kind === "delete"
                    ? "Sim, excluir sala"
                    : confirm?.kind === "leave"
                      ? "Sim, sair"
                      : "Sim, remover"
              }
              disabled={busy}
              onPress={async () => {
                if (confirm?.kind === "remove") {
                  await action("remove", { userId: confirm.id }).catch(() => {});
                } else if (confirm?.kind === "delete" && user) {
                  setBusy(true);
                  try {
                    await roomsApi.remove(user, room.id);
                    router.replace("/rooms");
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Não foi possível excluir.");
                  } finally {
                    setBusy(false);
                  }
                } else if (user) {
                  setBusy(true);
                  try {
                    await roomsApi.leave(user, room.id);
                    router.replace("/rooms");
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Não foi possível sair.");
                  } finally {
                    setBusy(false);
                  }
                }
              }}
            />
            <Button variant="ghost" title="Cancelar" disabled={busy} onPress={() => setConfirm(null)} />
          </>
        }
      >
        <Help>
          {confirm?.kind === "delete"
            ? "Os jogadores saem da sala e os grupos são apagados. Não dá para desfazer."
            : "A vaga e a posição no grupo serão liberadas."}
        </Help>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </Sheet>
    </>
  );
}

const local = StyleSheet.create({
  member: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    minHeight: 48,
  },
  live: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.error,
    boxShadow: glow(colors.error, 0.8),
  },
  liveText: { color: colors.muted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1 },
  ticket: { flexDirection: "row", alignItems: "center", gap: 16 },
  ticketDivider: {
    width: 1,
    alignSelf: "stretch",
    borderLeftWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
  },
  code: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 6,
  },
  count: { color: colors.text, fontSize: 26, fontWeight: "800" },
  myGroup: { flexDirection: "row", alignItems: "center", gap: 14 },
  groupCount: { color: colors.muted, fontFamily: fonts.mono, fontSize: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
});
