'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'sound-enabled';

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEY) !== 'false';
}

function getServerSnapshot(): boolean {
  return true;
}

function subscribe(callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export function useSound() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(value));
    // trigger re-render by dispatching a storage event manually
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  }, []);

  const playTick = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'square';
      oscillator.frequency.value = 800 + Math.random() * 400;
      gain.gain.value = 0.08;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.02);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  const playFanfare = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = 'square';
        oscillator.frequency.value = freq;

        const startTime = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!getSnapshot()) return;
    try {
      navigator?.vibrate?.(pattern);
    } catch {
      // Vibration not supported
    }
  }, []);

  return { enabled, setEnabled, playTick, playFanfare, vibrate };
}
