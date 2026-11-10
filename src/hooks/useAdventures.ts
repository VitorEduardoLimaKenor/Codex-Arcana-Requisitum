import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useAuth } from "../state/auth";
import { builtInAdventures, type Adventure } from "../data/adventures";

function parse(raw: string | null): Adventure[] {
  if (!raw) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw Error("Formato inválido");
  return data.filter(
    (a): a is Adventure =>
      a && typeof a.id === "string" && typeof a.title === "string" && a.custom === true,
  );
}

/** Aventuras do sistema + as cadastradas pelo mestre neste aparelho. */
export function useAdventures() {
  const { user } = useAuth();
  const key = `@codex/adventures/v1/${user?.id}`;
  const [custom, setCustom] = useState<Adventure[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  // Recarrega ao voltar para a tela (ex.: depois de cadastrar uma aventura).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      AsyncStorage.getItem(key)
        .then((raw) => {
          if (!active) return;
          setCustom(parse(raw));
          setError("");
          setReady(true);
        })
        .catch(() => {
          if (!active) return;
          setError("Não foi possível carregar suas aventuras.");
          setReady(true);
        });
      return () => {
        active = false;
      };
    }, [key]),
  );

  async function persist(next: Adventure[]) {
    await AsyncStorage.setItem(key, JSON.stringify(next));
    setCustom(next);
  }

  return {
    adventures: [...custom, ...builtInAdventures],
    custom,
    ready,
    error,
    add: (adventure: Adventure) => persist([adventure, ...custom]),
    update: (adventure: Adventure) =>
      persist(custom.map((a) => (a.id === adventure.id ? adventure : a))),
    remove: (id: string) => persist(custom.filter((a) => a.id !== id)),
  };
}
