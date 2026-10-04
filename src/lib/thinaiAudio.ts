"use client";

/**
 * Authentic Procedural Sangam Audio Synthesis Engine for the 5 Thinai Landscapes
 * 
 * Uses Web Audio API to create zero-latency, offline-capable, authentic acoustic signatures:
 * - Kurinji (குறிஞ்சி): High mountain breeze & crystal yazh harp (Malahari / Nattai notes)
 * - Mullai (முல்லை): Warm pastoral bamboo flute & twilight foliage (Mohanam / Sadhari notes)
 * - Marutham (மருதம்): Resonant fertile temple bell & river harp (Harikambhoji / Maruthappan notes)
 * - Neytal (நெய்தல்): Oceanic rolling surf wave wash & deep coastal yazh strings (Sevvazhippan / Vilari notes)
 * - Palai (பாலை): Ancient bronze singing bowl & desert heat drone (Kharaharapriya / Palaippan notes)
 * - Yazhi Core (யாழ் மையம்): Sovereign celestial harmonic chord uniting all 5 elements
 */

let sharedAudioCtx: AudioContext | null = null;
let isMutedState = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/** Check if Thinai audio is currently muted */
export function isThinaiAudioMuted(): boolean {
  if (typeof window === "undefined") return false;
  return isMutedState || localStorage.getItem("yazhi:thinai:muted") === "true";
}

/** Toggle mute/unmute state */
export function toggleThinaiAudio(): boolean {
  if (typeof window === "undefined") return false;
  isMutedState = !isThinaiAudioMuted();
  localStorage.setItem("yazhi:thinai:muted", String(isMutedState));
  return isMutedState;
}

/** Set explicit mute state */
export function setThinaiAudioMuted(muted: boolean) {
  isMutedState = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("yazhi:thinai:muted", String(muted));
  }
}

/**
 * Play a specific Thinai landscape soundscape
 * @param key "kurinji" | "mullai" | "marutham" | "neytal" | "palai" | "yazhi" | "core"
 */
export function playThinaiSound(key: string) {
  if (isThinaiAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.22, now);
  masterGain.connect(ctx.destination);

  switch (key) {
    case "kurinji": {
      // 🏔️ Kurinji: High Mountain Breeze & Crystal Harp (Malahari / Nattai Pentatonic Chime)
      // Notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Gentle attack and crystalline decay
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.18 / (idx + 1), now + idx * 0.08 + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.2);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.3);
      });

      // Mountain wind noise sweep
      playWindSweep(ctx, masterGain, now, 900, 1600, 1.8, 0.06);
      break;
    }

    case "mullai": {
      // 🌳 Mullai: Warm Pastoral Bamboo Flute & Twilight Foliage (Mohanam: G4, A4, C5, D5)
      const fluteNotes = [392.0, 440.0, 523.25, 587.33];
      fluteNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        // Flute vibrato LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(5.4, now);
        lfoGain.gain.setValueAtTime(3.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now + idx * 0.12);
        lfo.stop(now + idx * 0.12 + 2.4);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.12 + 0.06);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.4);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 2.5);
      });

      // Evening twilight cricket / breeze shimmer
      playBandpassNoise(ctx, masterGain, now, 3800, 8, 1.5, 0.03);
      break;
    }

    case "marutham": {
      // 🌾 Marutham: Dawn Temple Bell & Fertile River Delta Harp (Harikambhoji: C4, E4, G4, D5)
      // Metallic FM synthesis for bronze bell
      const bellFreqs = [261.63, 392.0, 587.33];
      bellFreqs.forEach((carrierFreq, idx) => {
        const carrier = ctx.createOscillator();
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();
        const noteGain = ctx.createGain();

        carrier.type = "sine";
        carrier.frequency.setValueAtTime(carrierFreq, now + idx * 0.06);

        // Modulator at 1.414x (golden ratio bell overtone)
        modulator.type = "sine";
        modulator.frequency.setValueAtTime(carrierFreq * 1.414, now + idx * 0.06);

        modGain.gain.setValueAtTime(carrierFreq * 2.8, now + idx * 0.06);
        modGain.gain.exponentialRampToValueAtTime(1, now + idx * 0.06 + 1.2);

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.25 / (idx + 1), now + idx * 0.06 + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 2.8);

        carrier.connect(noteGain);
        noteGain.connect(masterGain);

        carrier.start(now + idx * 0.06);
        modulator.start(now + idx * 0.06);
        carrier.stop(now + idx * 0.06 + 2.9);
        modulator.stop(now + idx * 0.06 + 2.9);
      });
      break;
    }

    case "neytal": {
      // 🌊 Neytal: Ocean Wave Surf & Melancholic Coastal Yazh (Sevvazhippan / Vilari: D3, A3, F4)
      // Rolling ocean breaker surf noise
      playOceanWave(ctx, masterGain, now, 2.6, 0.12);

      // Low coastal yazh strings (D3 146.83Hz, A3 220Hz, F4 349.23Hz)
      const yazhStrings = [146.83, 220.0, 349.23];
      yazhStrings.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + 0.2 + i * 0.15);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.2 + i * 0.15 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2 + i * 0.15 + 2.6);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + 0.2 + i * 0.15);
        osc.stop(now + 0.2 + i * 0.15 + 2.7);
      });
      break;
    }

    case "palai": {
      // 🏜️ Palai: Ancient Bronze Singing Bowl & Desert Heatwave Drone (Kharaharapriya: 216Hz, 324Hz, 540Hz)
      const bowlFreqs = [216.0, 324.0, 540.0, 756.0];
      bowlFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Subtle tremolo pulsation simulating shimmering desert heatwave
        const tremolo = ctx.createOscillator();
        const tremoloGain = ctx.createGain();
        tremolo.frequency.setValueAtTime(2.6 + i * 0.3, now);
        tremoloGain.gain.setValueAtTime(0.04, now);
        tremolo.connect(tremoloGain);
        tremoloGain.connect(gain.gain);
        tremolo.start(now);
        tremolo.stop(now + 3.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2 / (i + 1), now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 3.1);
      });

      // Warm desert wind whisper
      playWindSweep(ctx, masterGain, now, 450, 750, 2.5, 0.05);
      break;
    }

    case "yazhi":
    case "core":
    default: {
      // ✨ Yazhi Sovereign Core: Celestial Harmonic Chord (All 5 Elements in Grand Harmony)
      const sovereignChord = [130.81, 261.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      sovereignChord.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i < 2 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(f, now + i * 0.04);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.18 / (i * 0.4 + 1), now + i * 0.04 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 2.8);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 2.9);
      });
      break;
    }
  }
}

/** Helper: Generate shaped sweeping wind noise */
function playWindSweep(
  ctx: AudioContext,
  dest: AudioNode,
  startTime: number,
  startFreq: number,
  endFreq: number,
  duration: number,
  peakVol: number
) {
  try {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(4.0, startTime);
    filter.frequency.setValueAtTime(startFreq, startTime);
    filter.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration * 0.6);
    filter.frequency.exponentialRampToValueAtTime(startFreq * 0.7, startTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(peakVol, startTime + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(startTime);
    noise.stop(startTime + duration);
  } catch {
    // Graceful fallback if buffer allocation fails
  }
}

/** Helper: High-frequency bandpass noise shimmer */
function playBandpassNoise(
  ctx: AudioContext,
  dest: AudioNode,
  startTime: number,
  centerFreq: number,
  q: number,
  duration: number,
  peakVol: number
) {
  try {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(centerFreq, startTime);
    filter.Q.setValueAtTime(q, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(peakVol, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(startTime);
    noise.stop(startTime + duration);
  } catch {}
}

/** Helper: Realistic rolling ocean wave surge */
function playOceanWave(
  ctx: AudioContext,
  dest: AudioNode,
  startTime: number,
  duration: number,
  peakVol: number
) {
  try {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Brown noise for deep water texture
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    // Sweeps up like a rolling surge, crests, and recedes gently
    filter.frequency.setValueAtTime(140, startTime);
    filter.frequency.exponentialRampToValueAtTime(650, startTime + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(110, startTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(peakVol, startTime + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(startTime);
    noise.stop(startTime + duration);
  } catch {}
}
