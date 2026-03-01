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
      const now = ctx.currentTime;

      // Coin clink — metallic ping with harmonics
      const fundamental = 2200 + Math.random() * 300;
      [1, 2.4, 3.8].forEach((harmonic, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = fundamental * harmonic;
        const vol = [0.12, 0.06, 0.03][i];
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      });

      // Noise burst for metallic texture
      const bufferSize = ctx.sampleRate * 0.02;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = 4000;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      noise.connect(hpf);
      hpf.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Slot — jackpot jingle with coin shower
  const playSlotWin = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      const notes = [
        { freq: 880, time: 0, dur: 0.25 },
        { freq: 1109, time: 0.12, dur: 0.25 },
        { freq: 1319, time: 0.24, dur: 0.25 },
        { freq: 1760, time: 0.36, dur: 0.5 },
        { freq: 2093, time: 0.48, dur: 0.6 },
        { freq: 2637, time: 0.6, dur: 0.8 },
      ];

      notes.forEach(({ freq, time, dur }) => {
        [1, 2, 3.5].forEach((h, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq * h;
          const vol = [0.1, 0.04, 0.02][i];
          const start = now + time;
          gain.gain.setValueAtTime(vol, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + dur);
        });
      });

      for (let i = 0; i < 8; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 3000 + Math.random() * 2000;
        const start = now + 0.7 + i * 0.06;
        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.06);
      }
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Roulette — casino bell ding-ding-ding
  const playRouletteWin = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Triple bell ring
      for (let i = 0; i < 3; i++) {
        const start = now + i * 0.2;
        [1, 2.76, 4.13].forEach((h, j) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = 1400 * h;
          const vol = [0.12, 0.05, 0.02][j];
          gain.gain.setValueAtTime(vol, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.4);
        });
      }

      // Sustained shimmer chord
      [1760, 2217, 2637].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = now + 0.6;
        gain.gain.setValueAtTime(0.07, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 1.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 1.0);
      });
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Breakout — retro arcade victory
  const playBreakoutWin = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Fast ascending arpeggio (8-bit style)
      const notes = [523, 659, 784, 1047, 1319, 1568, 2093];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        const start = now + i * 0.07;
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.12);
      });

      // Final power chord
      [2093, 2637, 3136].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        const start = now + 0.55;
        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  const playFanfare = playSlotWin;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!getSnapshot()) return;
    try {
      navigator?.vibrate?.(pattern);
    } catch {
      // Vibration not supported
    }
  }, []);

  return { enabled, setEnabled, playTick, playFanfare, playSlotWin, playRouletteWin, playBreakoutWin, vibrate };
}
