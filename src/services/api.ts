import { create, isAxiosError } from "axios";
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(
  /\/$/,
  "",
);
export const onlineEnabled = !!API_URL;
const client = create({ baseURL: API_URL, timeout: 15000 });
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export function apiError(error: unknown): Error {
  if (isAxiosError(error)) {
    return new ApiError(
      typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : error.code === "ERR_CANCELED"
          ? "Operação cancelada."
          : "Não foi possível conectar ao servidor de salas. Verifique sua conexão.",
      error.response?.status,
    );
  }
  return error instanceof Error
    ? error
    : Error("Não foi possível concluir a operação.");
}
export async function request<T>(
  method: string,
  path: string,
  token?: string,
  data?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  if (!onlineEnabled)
    throw Error("O servidor de salas ainda não foi configurado neste app.");
  try {
    return (
      await client.request<T>({
        method,
        url: path,
        data,
        signal,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    ).data;
  } catch (error) {
    throw apiError(error);
  }
}
