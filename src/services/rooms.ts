import type { User } from "./accounts";
import { request } from "./api";
import type { Character, ClassId } from "../data/codex";
/** Raio padrão de toda sala: cobre a sala de aula sem pedir ajuste ao mestre. */
export const ROOM_RADIUS = 100;
export type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};
export type RoomSummary = {
  id: string;
  name: string;
  description: string;
  masterId: string;
  masterName: string;
  capacity: number;
  groupCount: number;
  groupSize: number;
  radius: number;
  status: "open" | "locked" | "closed";
  /** O mestre está no lobby agora; sem ele a sala fica fechada. */
  masterOnline?: boolean;
  version: number;
  count: number;
  distance?: number;
};
/** Personagem com que o jogador entrou na sala. */
export type Hero = { name: string; classId: ClassId; templateId?: string };
export type Member = {
  id: string;
  name: string;
  groupNo: number | null;
  hero?: Hero | null;
};
export type Room = RoomSummary & {
  code: string;
  groups: { number: number; name: string }[];
  members: Member[];
  seekers?: { id: string; name: string; distance: number }[];
};
export type RoomSettings = {
  capacity: number;
  groupCount: number;
  groupSize: number;
};
function token(user: User) {
  if (!user.token)
    throw Error("Entre com uma conta online para usar as salas.");
  return user.token;
}
export const roomsApi = {
  list: (user: User, signal?: AbortSignal) =>
    request<RoomSummary[]>("GET", "/rooms", token(user), undefined, signal),
  nearby: (user: User, coords: Coordinates, signal?: AbortSignal) =>
    request<RoomSummary[]>(
      "POST",
      "/rooms/nearby",
      token(user),
      coords,
      signal,
    ),
  stopSeeking: (user: User) => request("DELETE", "/seeking", token(user)),
  create: (
    user: User,
    data: RoomSettings &
      Coordinates & { name: string; description: string; radius: number },
  ) => request<Room>("POST", "/rooms", token(user), data),
  read: (user: User, id: string, signal?: AbortSignal) =>
    request<Room>("GET", `/rooms/${id}`, token(user), undefined, signal),
  join: (user: User, id: string, coords: Coordinates, hero?: Hero) =>
    request<Room>("POST", `/rooms/${id}/join`, token(user), { ...coords, hero }),
  joinCode: (user: User, code: string, coords: Coordinates, hero?: Hero) =>
    request<Room>("POST", "/rooms/join-code", token(user), { code, ...coords, hero }),
  act: (
    user: User,
    room: Pick<RoomSummary, "id" | "version">,
    action: "assign" | "remove" | "settings" | "status" | "rename-group",
    data: object,
  ) =>
    request<Room>("POST", `/rooms/${room.id}/${action}`, token(user), {
      ...data,
      version: room.version,
    }),
  leave: (user: User, id: string) =>
    request("POST", `/rooms/${id}/leave`, token(user)),
  /** Mestre avisa que saiu (ou voltou) do lobby. */
  presence: (user: User, id: string, present: boolean) =>
    request<RoomSummary>("POST", `/rooms/${id}/presence`, token(user), { present }),
  remove: (user: User, id: string) =>
    request("DELETE", `/rooms/${id}`, token(user)),
};

/** Dados do personagem enviados ao entrar (a ficha completa fica no aparelho). */
export function heroOf(character: Character): Hero {
  return {
    name: character.name,
    classId: character.classId,
    ...(character.templateId ? { templateId: character.templateId } : {}),
  };
}

/** Estado que a interface mostra: sem o mestre no lobby, a sala está fechada. */
export function roomState(r: RoomSummary): "open" | "paused" | "closed" {
  if (r.status === "closed" || r.masterOnline === false) return "closed";
  return r.status === "locked" ? "paused" : "open";
}
