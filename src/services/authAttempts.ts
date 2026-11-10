// Impede que uma tentativa antiga ou cancelada altere a sessão atual.
export function createAuthAttempts<T>(commit: (value: T) => void) {
  let version = 0;
  return {
    invalidate() {
      version += 1;
    },
    async run(operation: () => Promise<T>, signal: AbortSignal) {
      const current = ++version;
      if (signal.aborted) return;
      const value = await operation();
      if (!signal.aborted && current === version) commit(value);
    },
  };
}
