import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Text } from "react-native";
import {
  readCharacters,
  saveCharacter,
  deleteCharacter,
  legacyCount,
  importLegacy,
} from "../services/database";
import type { Character } from "../data/codex";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { styles } from "../styles";
const Context = createContext<null | {
  characters: Character[];
  legacy: number;
  claimLegacy: () => Promise<void>;
  update: (c: Character) => Promise<void>;
  remove: (id: string) => Promise<void>;
}>(null);
export function CharactersProvider({
  children,
  ownerId,
}: {
  children: ReactNode;
  ownerId: string;
}) {
  const [legacy, setLegacy] = useState(0);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const queue = useRef(Promise.resolve());
  const load = useCallback(() => {
    return Promise.all([readCharacters(ownerId), legacyCount()])
      .then(([stored, count]) => {
        setLegacy(count);
        setCharacters(stored);
        setError("");
        setReady(true);
      })
      .catch(() =>
        setError("Não foi possível abrir as fichas. Tente novamente."),
      );
  }, [ownerId]);
  useEffect(() => {
    void load();
  }, [load]);
  async function update(c: Character) {
    setCharacters((old) => [c, ...old.filter((x) => x.id !== c.id)]);
    const task = queue.current.then(() => saveCharacter(c, ownerId));
    queue.current = task.catch(() => {});
    try {
      await task;
      setError("");
    } catch {
      setError("Não foi possível salvar. Tente editar novamente.");
      throw new Error("Falha ao salvar");
    }
  }
  async function remove(id: string) {
    const task = queue.current.then(() => deleteCharacter(id, ownerId));
    queue.current = task.catch(() => {});
    await task;
    setCharacters((old) => old.filter((c) => c.id !== id));
  }
  if (!ready)
    return (
      <Screen>
        <Text style={styles.body}>{error || "Abrindo seu códice…"}</Text>
        {!!error && (
          <Button title="Tentar novamente" onPress={() => void load()} />
        )}
      </Screen>
    );
  return (
    <Context.Provider
      value={{
        characters,
        update,
        remove,
        legacy,
        claimLegacy: async () => {
          await importLegacy(ownerId);
          await load();
        },
      }}
    >
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      {children}
    </Context.Provider>
  );
}
/** Para telas usadas também pelo mestre, que não tem fichas. */
export function useOptionalCharacters() {
  return useContext(Context);
}
export function useCharacters() {
  const value = useContext(Context);
  if (!value) throw new Error("Provider ausente");
  return value;
}
