/** Tiny synthesized sound effects (Web Audio), no files needed. */
let ctx: AudioContext | null = null;
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.15, delay = 0, slideTo?: number) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  tick: () => tone(1400, 0.035, "square", 0.05),
  click: () => tone(600, 0.06, "triangle", 0.12),
  open: () => tone(220, 0.25, "sawtooth", 0.08, 0, 660),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, "triangle", 0.16, i * 0.09)),
  lose: () => [392, 330, 262].forEach((f, i) => tone(f, 0.28, "sawtooth", 0.08, i * 0.12)),
  coin: () => {
    tone(988, 0.08, "square", 0.08);
    tone(1319, 0.2, "square", 0.08, 0.08);
  },
};
