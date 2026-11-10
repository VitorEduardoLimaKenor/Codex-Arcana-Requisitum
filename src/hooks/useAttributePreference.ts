import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../state/auth";
export function useAttributePreference() {
  const { user } = useAuth();
  const key = `@codex/preferences/attribute-math/v1/${user?.id}`;
  const [showMath, setShowMath] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (active) {
          setShowMath(raw === "true");
          setReady(true);
        }
      })
      .catch(() => {
        if (active) {
          setReady(true);
          setError("Não foi possível recuperar sua preferência.");
        }
      });
    return () => {
      active = false;
    };
  }, [key]);
  async function toggle() {
    if (!ready || saving) return;
    setSaving(true);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(!showMath));
      setShowMath(!showMath);
      setError("");
    } catch {
      setError("Não foi possível salvar sua preferência. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }
  return { showMath, toggle, disabled: !ready || saving, error };
}
