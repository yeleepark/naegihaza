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
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
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

  // Slot tick — mechanical reel notch click
  const playSlotTick = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Short square wave burst — mechanical notch feel
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 300 + Math.random() * 200;
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);

      // Low-pass noise for notch friction texture
      const bufLen = ctx.sampleRate * 0.02;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.2;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 1500;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.06, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      noise.connect(lpf);
      lpf.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Slot spin — lever pull: descending clunk + ascending whir
  const playSlotSpin = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Descending clunk (square 400→100Hz, ~0.08s)
      const clunk = ctx.createOscillator();
      const clunkGain = ctx.createGain();
      clunk.type = 'square';
      clunk.frequency.setValueAtTime(400, now);
      clunk.frequency.exponentialRampToValueAtTime(100, now + 0.08);
      clunkGain.gain.setValueAtTime(0.12, now);
      clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      clunk.connect(clunkGain);
      clunkGain.connect(ctx.destination);
      clunk.start(now);
      clunk.stop(now + 0.1);

      // Ascending whir (sine 100→600Hz, ~0.15s)
      const whir = ctx.createOscillator();
      const whirGain = ctx.createGain();
      whir.type = 'sine';
      whir.frequency.setValueAtTime(100, now + 0.06);
      whir.frequency.exponentialRampToValueAtTime(600, now + 0.21);
      whirGain.gain.setValueAtTime(0.001, now + 0.06);
      whirGain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      whirGain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
      whir.connect(whirGain);
      whirGain.connect(ctx.destination);
      whir.start(now + 0.06);
      whir.stop(now + 0.23);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Roulette spin — flick the wheel
  const playRouletteSpin = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Descending sine sweep (800→200Hz, ~0.15s)
      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.type = 'sine';
      sweep.frequency.setValueAtTime(800, now);
      sweep.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      sweepGain.gain.setValueAtTime(0.15, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      sweep.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweep.start(now);
      sweep.stop(now + 0.18);

      // Light noise whoosh
      const bufLen = ctx.sampleRate * 0.12;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 1200;
      bpf.Q.value = 0.8;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.1, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      noise.connect(bpf);
      bpf.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Roulette tick — ball crossing a segment divider
  const playRouletteTick = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Short triangle wave burst (~0.03s, 800-1200Hz random)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 800 + Math.random() * 400;
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Breakout — celebration fireworks
  const playBreakoutWin = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // 1. Launch whistle — rising sine sweep
      const whistle = ctx.createOscillator();
      const whistleGain = ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(400, now);
      whistle.frequency.exponentialRampToValueAtTime(2400, now + 0.3);
      whistleGain.gain.setValueAtTime(0.12, now);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      whistle.connect(whistleGain);
      whistleGain.connect(ctx.destination);
      whistle.start(now);
      whistle.stop(now + 0.32);

      // 2. Pops — staggered sine bursts simulating firework pops
      const popFreqs = [880, 1100, 660, 1320, 780, 1500, 950, 1200];
      for (let i = 0; i < popFreqs.length; i++) {
        const pop = ctx.createOscillator();
        const popGain = ctx.createGain();
        pop.type = 'sine';
        const t = now + 0.3 + i * 0.06 + Math.random() * 0.03;
        pop.frequency.setValueAtTime(popFreqs[i], t);
        pop.frequency.exponentialRampToValueAtTime(popFreqs[i] * 0.5, t + 0.08);
        popGain.gain.setValueAtTime(0.1, t);
        popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        pop.connect(popGain);
        popGain.connect(ctx.destination);
        pop.start(t);
        pop.stop(t + 0.1);
      }

      // 3. Sparkles — high-frequency random pings scattering
      for (let i = 0; i < 10; i++) {
        const spark = ctx.createOscillator();
        const sparkGain = ctx.createGain();
        spark.type = 'sine';
        const t = now + 0.5 + Math.random() * 0.6;
        const freq = 2000 + Math.random() * 4000;
        spark.frequency.setValueAtTime(freq, t);
        sparkGain.gain.setValueAtTime(0.04 + Math.random() * 0.03, t);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        spark.connect(sparkGain);
        sparkGain.connect(ctx.destination);
        spark.start(t);
        spark.stop(t + 0.12);
      }

      // 4. Shimmer tail — gentle chord that fades out
      const chordFreqs = [1047, 1319, 1568]; // C6, E6, G6
      chordFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.8);
        gain.gain.setValueAtTime(0.05, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.8);
        osc.stop(now + 1.8);
      });
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Win sounds — all games use the same fireworks celebration
  const playSlotWin = playBreakoutWin;
  const playRouletteWin = playBreakoutWin;

  // Block break — crunch with glass shatter
  const playBlockBreak = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Sharp crack
      const crack = ctx.createOscillator();
      const crackGain = ctx.createGain();
      crack.type = 'square';
      crack.frequency.setValueAtTime(800 + Math.random() * 400, now);
      crack.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      crackGain.gain.setValueAtTime(0.1, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      crack.connect(crackGain);
      crackGain.connect(ctx.destination);
      crack.start(now);
      crack.stop(now + 0.05);

      // Shatter noise
      const bufLen = ctx.sampleRate * 0.06;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = 2000;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.1, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      noise.connect(hpf);
      hpf.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Wall bounce — short rubber thud
  const playWallBounce = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Bomb tick — triangle wave 1000Hz, 40ms double click (clock tick feel)
  const playBombTick = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Double click: two short triangle pings
      [0, 0.04].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 1000 + Math.random() * 100;
        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.03);
      });
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Bomb explode — bass thump + white noise burst + square wave crack
  const playBombExplode = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // 1. Bass thump (sine 200→40Hz, ~0.3s)
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(200, now);
      bass.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.start(now);
      bass.stop(now + 0.4);

      // 2. White noise burst (~0.2s)
      const bufLen = ctx.sampleRate * 0.25;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 3000;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.2, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      noise.connect(lpf);
      lpf.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);

      // 3. Square wave crack (800→100Hz, ~0.08s)
      const crack = ctx.createOscillator();
      const crackGain = ctx.createGain();
      crack.type = 'square';
      crack.frequency.setValueAtTime(800, now);
      crack.frequency.exponentialRampToValueAtTime(100, now + 0.08);
      crackGain.gain.setValueAtTime(0.15, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      crack.connect(crackGain);
      crackGain.connect(ctx.destination);
      crack.start(now);
      crack.stop(now + 0.1);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Heartbeat pulse — low-frequency lub-dub for tension
  const playHeartbeatPulse = useCallback(() => {
    if (!getSnapshot()) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Lub (55→35Hz sine, 120ms)
      const lub = ctx.createOscillator();
      const lubGain = ctx.createGain();
      lub.type = 'sine';
      lub.frequency.setValueAtTime(55, now);
      lub.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      lubGain.gain.setValueAtTime(0.18, now);
      lubGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      lub.connect(lubGain);
      lubGain.connect(ctx.destination);
      lub.start(now);
      lub.stop(now + 0.15);

      // Dub (70→45Hz sine, 120ms, offset 150ms)
      const dub = ctx.createOscillator();
      const dubGain = ctx.createGain();
      dub.type = 'sine';
      dub.frequency.setValueAtTime(70, now + 0.15);
      dub.frequency.exponentialRampToValueAtTime(45, now + 0.27);
      dubGain.gain.setValueAtTime(0.14, now + 0.15);
      dubGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      dub.connect(dubGain);
      dubGain.connect(ctx.destination);
      dub.start(now + 0.15);
      dub.stop(now + 0.3);
    } catch {
      // Audio not supported
    }
  }, [getAudioCtx]);

  // Bomb win — reuse fireworks celebration
  const playBombWin = playBreakoutWin;

  const playFanfare = playSlotWin;

  return { enabled, setEnabled, playTick, playSlotTick, playSlotSpin, playBlockBreak, playWallBounce, playFanfare, playSlotWin, playRouletteSpin, playRouletteTick, playRouletteWin, playBreakoutWin, playBombTick, playBombExplode, playBombWin, playHeartbeatPulse };
}
