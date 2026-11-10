import { onlineEnabled, request } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { pbkdf2Async } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
export type Role = "master" | "player";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
};
type Account = User & { salt: string; hash: string };
const key = "@codex/accounts/v1";
const rounds = 210000;
function checkCancelled(signal?: AbortSignal) {
  if (signal?.aborted) {
    const error = new Error("Operação cancelada.");
    error.name = "AbortError";
    throw error;
  }
}
async function accounts(): Promise<Account[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      (a) =>
        a &&
        typeof a.id === "string" &&
        typeof a.email === "string" &&
        typeof a.name === "string" &&
        typeof a.salt === "string" &&
        typeof a.hash === "string" &&
        ["master", "player"].includes(a.role),
    )
  )
    throw Error("Não foi possível ler as contas deste aparelho.");
  return parsed;
}
function publicUser(a: Account): User {
  return { id: a.id, name: a.name, email: a.email, role: a.role };
}
async function hashPassword(password: string, salt: string) {
  return bytesToHex(
    await pbkdf2Async(sha256, password, salt, {
      c: rounds,
      dkLen: 32,
      asyncTick: 10,
    }),
  );
}
export async function register(
  name: string,
  email: string,
  password: string,
  role: Role,
  signal?: AbortSignal,
): Promise<User> {
  checkCancelled(signal);
  if (onlineEnabled)
    return request<User>(
      "POST",
      "/auth/register",
      undefined,
      { name, email, password, role },
      signal,
    );
  name = name.trim();
  email = email.trim().toLowerCase();
  if (name.length < 2 || name.length > 60)
    throw Error("Informe um nome entre 2 e 60 caracteres.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    throw Error("Informe um e-mail válido.");
  if (password.length < 8 || password.length > 128)
    throw Error("Use uma senha entre 8 e 128 caracteres.");
  const current = await accounts();
  if (current.some((a) => a.email === email && a.role === role))
    throw Error(
      "Já existe uma conta com este e-mail neste perfil. Entre com sua senha.",
    );
  const salt = randomUUID();
  const account = {
    id: randomUUID(),
    name,
    email,
    role,
    salt,
    hash: await hashPassword(password, salt),
  };
  checkCancelled(signal);
  // Releitura evita sobrescrever uma conta criada enquanto a senha era derivada.
  const latest = await accounts();
  checkCancelled(signal);
  if (latest.some((a) => a.email === email && a.role === role))
    throw Error(
      "Já existe uma conta com este e-mail neste perfil. Entre com sua senha.",
    );
  await AsyncStorage.setItem(key, JSON.stringify([...latest, account]));
  checkCancelled(signal);
  return publicUser(account);
}
export async function login(
  email: string,
  password: string,
  role: Role,
  signal?: AbortSignal,
): Promise<User> {
  checkCancelled(signal);
  if (onlineEnabled)
    return request<User>(
      "POST",
      "/auth/login",
      undefined,
      { email, password, role },
      signal,
    );
  const account = (await accounts()).find(
    (a) => a.email === email.trim().toLowerCase() && a.role === role,
  );
  if (!account || (await hashPassword(password, account.salt)) !== account.hash)
    throw Error("E-mail ou senha incorretos para este perfil.");
  checkCancelled(signal);
  return publicUser(account);
}
