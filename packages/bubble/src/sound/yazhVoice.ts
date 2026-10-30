/** The yazh's voice: soft plucked strings, synthesised in the browser —
    nothing is downloaded. Each string is a Karplus–Strong string excited by
    a soft, finger-like pluck (low-passed noise, combed at the plucking
    point), so it rings warm and round like gut or nylon rather than steel.
    The body adds a low resonance, and a short room reverb lets the notes
    bloom and overlap the way a sufi guitar's do.

    Tuned to Sempaalai pann (≈ Harikambhoji) from D3, the scale the yazh
    is most often reconstructed in: D E F♯ G A B C. String 0 is the lowest.

    Browsers only allow sound after a person acts, so nothing here makes an
    AudioContext until `wake()` is called from a click or key press. */

const SEMPAALAI = [146.83, 164.81, 185.0, 196.0, 220.0, 246.94, 261.63];
const SECONDS = 3.4;

let ctx: AudioContext | null = null;
let input: GainNode | null = null;
const strings = new Map<number, AudioBuffer>();

/** one string, rendered once and kept */
function render(c: AudioContext, freq: number): AudioBuffer {
  const sr = c.sampleRate;
  const len = Math.floor(sr * SECONDS);
  const out = c.createBuffer(1, len, sr);
  const y = out.getChannelData(0);
  const period = Math.max(2, Math.round(sr / freq));
  // the pluck: noise, softened by a one-pole low-pass (a fingertip, not a
  // plectrum), then combed at a fifth of the string to hollow the tone
  const exc = new Float32Array(period);
  let lp = 0;
  for (let i = 0; i < period; i++) {
    lp += 0.38 * (Math.random() * 2 - 1 - lp);
    exc[i] = lp;
  }
  const at = Math.max(1, Math.round(period * 0.2));
  const line = new Float32Array(period);
  for (let i = 0; i < period; i++) line[i] = exc[i] - 0.6 * exc[(i + period - at) % period];
  // ring time: low strings a little longer, as on a real harp
  const t60 = 2.6 + (220 / freq) * 0.5;
  const loss = Math.pow(10, -3 / (t60 * freq));
  let idx = 0;
  let prev = 0;
  for (let n = 0; n < len; n++) {
    const cur = line[idx];
    const next = line[(idx + 1) % period];
    // average two neighbours (the string's damping), slightly weighted for warmth
    const v = loss * (0.55 * cur + 0.45 * next);
    line[idx] = v;
    // a gentle attack so the first sample never clicks
    const env = n < 64 ? n / 64 : 1;
    prev = prev + 0.6 * (cur - prev);
    y[n] = prev * env * 0.9;
    idx = (idx + 1) % period;
  }
  return out;
}

/** a short, soft room: decaying stereo noise, darker as it fades */
function room(c: AudioContext): AudioBuffer {
  const sr = c.sampleRate, len = Math.floor(sr * 2.6);
  const ir = c.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / len;
      lp += (0.5 - 0.42 * t) * (Math.random() * 2 - 1 - lp);
      d[i] = lp * Math.pow(1 - t, 2.6);
    }
  }
  return ir;
}

/** Makes the audio graph. Call from a person's gesture; safe to call again. */
export async function wake(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return false;
  if (!ctx) {
    ctx = new Ctor();
    const body = ctx.createBiquadFilter();
    body.type = "peaking";
    body.frequency.value = 210;
    body.Q.value = 0.9;
    body.gain.value = 4;
    const soft = ctx.createBiquadFilter();
    soft.type = "lowpass";
    soft.frequency.value = 3400;
    soft.Q.value = 0.5;
    const master = ctx.createGain();
    master.gain.value = 0.55;
    const verb = ctx.createConvolver();
    verb.buffer = room(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    input = ctx.createGain();
    input.connect(body).connect(soft);
    soft.connect(master);
    soft.connect(verb).connect(wet).connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") await ctx.resume();
  return ctx.state === "running";
}

/** Plucks string `i` (0 = lowest) at `gain` 0…1, after `delayMs`. Silent
    until `wake()` has run. */
export function pluck(i: number, gain = 1, delayMs = 0) {
  if (!ctx || !input || ctx.state !== "running") return;
  const n = SEMPAALAI.length;
  const step = ((i % n) + n) % n;
  const freq = SEMPAALAI[step] * 2 ** Math.floor(i / n);
  let buf = strings.get(freq);
  if (!buf) {
    buf = render(ctx, freq);
    strings.set(freq, buf);
  }
  const when = ctx.currentTime + Math.max(0, delayMs) / 1000;
  // two voices a hair apart in tune and in the stereo field: a warmer, wider string
  for (const [cents, pan] of [[-2.5, -0.18], [2.5, 0.18]] as const) {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = 2 ** (cents / 1200);
    const g = ctx.createGain();
    g.gain.value = 0.5 * Math.min(1, Math.max(0, gain));
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    src.connect(g).connect(p).connect(input);
    src.start(when);
  }
}

/** A soft run up the strings: how the yazh says it is listening. */
export function strum(count = 7, gap = 95) {
  for (let i = 0; i < count; i++) pluck(i, 0.55, i * gap);
}

export const YAZH_SCALE = { name: "Sempaalai pann (≈ Harikambhoji)", tonic: "D3", hz: SEMPAALAI };
