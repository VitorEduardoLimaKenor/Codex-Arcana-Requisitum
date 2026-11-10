import { request } from "../services/api";
import { createAuthAttempts } from "../services/authAttempts";
import { createContext, useContext, useState, type ReactNode } from "react";
import { login, register, type User, type Role } from "../services/accounts";
const Context = createContext<null | {
  user: User | null;
  signIn: (
    email: string,
    password: string,
    role: Role,
    signal: AbortSignal,
  ) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    role: Role,
    signal: AbortSignal,
  ) => Promise<void>;
  signOut: () => void;
}>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [gate] = useState(() => createAuthAttempts<User>(setUser));
  return (
    <Context.Provider
      value={{
        user,
        signIn: (email, password, role, signal) =>
          gate.run(() => login(email, password, role, signal), signal),
        signUp: (name, email, password, role, signal) =>
          gate.run(() => register(name, email, password, role, signal), signal),
        signOut: () => {
          if (user?.token)
            void request("POST", "/auth/logout", user.token).catch(() => {});
          gate.invalidate();
          setUser(null);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const auth = useContext(Context);
  if (!auth) throw Error("Provider de autenticação ausente");
  return auth;
}
