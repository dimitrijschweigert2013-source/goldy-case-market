/**
 * Sound effects built with Web Audio (no files): short noise clicks, metallic bells and
 * thuds, run through a compressor and a small room reverb so they sound like a real case site.
 */
let ctx: AudioContext | null = null;
let out: AudioNode | null = null;
let wet: AudioNode | null = null;
let noiseBuf: AudioBuffer | null = null;

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    const master = ctx.createGain();
    master.gain.value = 0.9;
    comp.connect(master).connect(ctx.destination);
    out = comp;
    // short room reverb from decaying noise
    const len = Math.floor(ctx.sampleRate * 0.9);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    const verb = ctx.createConvolver();
    verb.buffer = ir;
    const verbGain = ctx.createGain();
    verbGain.gain.value = 0.22;
    verb.connect(verbGain).connect(comp);
    wet = verb;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const n = noiseBuf.getChannelData(0);
    for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function send(node: AudioNode, reverb = true) {
  node.connect(out!);
  if (reverb) node.connect(wet!);
}

/** Envelope gain: fast attack, exponential decay. */
function env(a: AudioContext, t: number, vol: number, dur: number, attack = 0.002) {
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  return g;
}

function noise(dur: number, vol: number, filter: BiquadFilterType, freq: number, q = 1, delay = 0, freqTo?: number, reverb = true) {
  const a = ac();
  if (!a || !noiseBuf) return;
  const t = a.currentTime + delay;
  const src = a.createBufferSource();
  src.buffer = noiseBuf;
  const f = a.createBiquadFilter();
  f.type = filter;
  f.frequency.setValueAtTime(freq, t);
  if (freqTo) f.frequency.exponentialRampToValueAtTime(freqTo, t + dur);
  f.Q.value = q;
  const g = env(a, t, vol, dur, Math.min(0.01, dur / 4));
  src.connect(f).connect(g);
  send(g, reverb);
  src.start(t);
  src.stop(t + dur + 0.05);
}

function osc(freq: number, dur: number, vol: number, type: OscillatorType = "sine", delay = 0, freqTo?: number, reverb = true) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (freqTo) o.frequency.exponentialRampToValueAtTime(freqTo, t + dur);
  const g = env(a, t, vol, dur);
  o.connect(g);
  send(g, reverb);
  o.start(t);
  o.stop(t + dur + 0.05);
}

/** Metallic bell: inharmonic partials with different decays. */
function bell(freq: number, vol: number, delay = 0, dur = 1.1) {
  [
    [1, 1, 1],
    [2.0, 0.5, 0.7],
    [2.76, 0.35, 0.5],
    [5.4, 0.18, 0.3],
  ].forEach(([m, v, d]) => osc(freq * m!, dur * d!, vol * v!, "sine", delay));
}

let lastTick = 0;

export const sfx = {
  /** Reel / wheel tick: a crisp plastic clack. */
  tick: () => {
    const a = ac();
    if (!a) return;
    if (a.currentTime - lastTick < 0.025) return;
    lastTick = a.currentTime;
    noise(0.03, 0.35, "bandpass", 3200, 2.5, 0, undefined, false);
    osc(1900, 0.02, 0.06, "triangle", 0, 1200, false);
  },
  /** UI click when picking a skin or button. */
  click: () => {
    noise(0.025, 0.18, "highpass", 2500, 0.7, 0, undefined, false);
    osc(720, 0.05, 0.08, "sine", 0, 480, false);
  },
  /** Case opening / spin start: a whoosh with a low thump. */
  open: () => {
    noise(0.45, 0.22, "bandpass", 300, 0.9, 0, 3500);
    osc(110, 0.25, 0.3, "sine", 0, 55);
  },
  /** Win: bright two-bell chime with sparkle. */
  win: () => {
    bell(880, 0.12);
    bell(1318.5, 0.11, 0.09);
    bell(1760, 0.09, 0.18, 1.4);
    noise(0.6, 0.05, "highpass", 7000, 0.5, 0.18);
  },
  /** Loss: soft low thud and a falling muted tone. */
  lose: () => {
    osc(150, 0.35, 0.35, "sine", 0, 60);
    noise(0.12, 0.12, "lowpass", 600, 0.7);
    osc(330, 0.5, 0.06, "triangle", 0.08, 196);
  },
  /** Robux in: two quick coin pings. */
  coin: () => {
    bell(1975, 0.07, 0, 0.5);
    bell(2637, 0.07, 0.07, 0.7);
  },
};
