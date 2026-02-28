import { useState, useCallback, useEffect, useRef } from 'react';

export interface RestoredURLState {
  gameState: string;
  participants: string[];
  /** Raw URLSearchParams for game-specific fields */
  params: URLSearchParams;
}

/**
 * URL-based game state persistence hook.
 *
 * Common params: `s` (gameState), `p` (participants, comma-separated).
 * Each game adds its own extra params via `sync()`.
 *
 * @param onRestore Called synchronously within the mount effect when URL state exists.
 *   Use this to call your setState functions so they batch with the initialized flag.
 */
export function useGameURL(
  onRestore: (data: RestoredURLState) => void
) {
  const [initialized, setInitialized] = useState(false);
  const onRestoreRef = useRef(onRestore);
  onRestoreRef.current = onRestore;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    const p = params.get('p');
    if (s && p) {
      const participants = p.split(',').filter(Boolean);
      if (participants.length > 0) {
        onRestoreRef.current({ gameState: s, participants, params });
      }
    }
    setInitialized(true);
  }, []);

  const sync = useCallback(
    (gameState: string, participants: string[], extra?: Record<string, string>) => {
      if (gameState === 'setup') {
        window.history.replaceState(null, '', window.location.pathname);
        return;
      }
      const params = new URLSearchParams();
      params.set('s', gameState);
      params.set('p', participants.join(','));
      if (extra) {
        for (const [k, v] of Object.entries(extra)) {
          if (v != null) params.set(k, v);
        }
      }
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    },
    []
  );

  const clear = useCallback(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  return { initialized, sync, clear };
}
