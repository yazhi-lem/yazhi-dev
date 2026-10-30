/**
 * Yazh (யாழ்): the harp of the Sangam poems, in its plainest carved form —
 * one S-shaped body. A scroll curls at the top; the arm sweeps over and
 * down the back into a broad belly, the resonator, which turns forward and
 * ends in a small scroll of its own. Seven strings hang from the arm to the
 * belly, the longest at the back. It stands on a low plate.
 *
 * The pointer picks the string under it and plucks it; its neighbours
 * sound in sympathy, later and softer the further they are. At rest the
 * longest string is lit. The slider is the stagger of the sympathy, in
 * milliseconds. Every pluck is also announced on the stage as a
 * "yazh:pluck" event — { string, count, gain, delay, human } — so a host can
 * give the yazh a voice; `string` counts from the lowest note, and `human`
 * is false while the figure plays its tour.
 *
 * Rules leaned on: 01 (the pick reads the strings' rest positions),
 * 02 (stagger by distance), 04 (the plucked string is the bright stroke),
 * 07 (the loop sleeps once the strings are still), 09 (the body is one
 * silhouette with one crease, the resonator's board).
 */
import HL from "../kernel.js";

const { Cam, fit, proj, facing, rings, poly, open, prism, mk, solid, put, pointer, register, disposer } = HL;

const N = 7, PB = 3, AMP = 3.6, DECAY = 1.1;

/** cubic Bézier in the x–z plane */
function bez(a, b, c, d, t) {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}

/** a spiral in the x–z plane: from angle a0, `turns` round, radius r0 → r1 */
function spiral(cx, cz, r0, r1, a0, turns, dir, n = 40) {
  const out = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n, a = a0 + dir * t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t;
    out.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
  }
  return out;
}

/** distance from p to the segment ab, in screen units */
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stagger = value;

  const C = Cam(26, 0.4, 1.66);
  fit(C, [[-52, -14, -PB], [60, 14, -PB], [-40, 0, 176], [56, 0, 120]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const at = ([x, z]) => P(x, 0, z);

  // the low plate it stands on
  const [pr, pi] = rings(-44, -12, 52, 12, 12, 1.8);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // the spine of the body, top scroll to foot scroll:
  // the arm over the top, down the back, round the belly, up to the front
  const arm = [], back = [], belly = [];
  for (let k = 0; k <= 20; k++) arm.push(bez([-26, 156], [-4, 176], [44, 172], [48, 128], k / 20));
  for (let k = 1; k <= 22; k++) back.push(bez([48, 128], [52, 80], [48, 26], [14, 12], k / 22));
  for (let k = 1; k <= 18; k++) belly.push(bez([14, 12], [-16, 2], [-42, 14], [-40, 40], k / 18));
  const spine = arm.concat(back, belly);
  const last = spine.length - 1;
  const deep = arm.length + back.length; // where the resonator is broadest

  // width along the body: a slim arm, a fuller back, the belly broadest
  // the ends taper into their scrolls
  const width = (k) =>
    (2.6 + (k / last) * 2.4 + Math.exp(-(((k - deep) / 9) ** 2)) * 7) * (0.45 + 0.55 * Math.min(1, k / 5, (last - k) / 5));
  const edge = (side) =>
    spine.map((p, k) => {
      const q = spine[Math.min(last, k + 1)], o = spine[Math.max(0, k - 1)];
      const dx = q[0] - o[0], dz = q[1] - o[1], l = Math.hypot(dx, dz) || 1;
      const w = width(k) * side;
      return [p[0] - (dz / l) * w, p[1] + (dx / l) * w];
    });
  const outer = edge(1), inner = edge(-1); // inner faces the strings

  mk("path", { class: "sil", d: poly(outer.concat(inner.slice().reverse()).map(at)) }, g);
  // the scrolls at either end
  // the scrolls carry each end of the body on round into a curl
  const curl = (from, cx, cz, dir, r1, turns) =>
    spiral(cx, cz, Math.hypot(from[0] - cx, from[1] - cz), r1, Math.atan2(from[1] - cz, from[0] - cx), turns, dir);
  mk("path", { class: "nf sil", d: open(curl(spine[0], -23, 147, 1, 2, 1.05).map(at)) }, g);
  mk("path", { class: "nf sil", d: open(curl(spine[last], -33, 45, -1, 1.6, 1.05).map(at)) }, g);
  // the resonator's board: one crease along the belly
  const board = [];
  for (let k = arm.length + 8; k <= last - 4; k++) {
    const c = spine[k], o = inner[k];
    board.push([c[0] + (o[0] - c[0]) * 0.35, c[1] + (o[1] - c[1]) * 0.35]);
  }
  mk("path", { class: "nf lo", d: open(board.map(at)) }, g);

  // strings: from the arm's underside down to the belly, at even steps across
  const zAt = (pts, x) => pts.reduce((b, p) => (Math.abs(p[0] - x) < Math.abs(b[0] - x) ? p : b))[1];
  const armUnder = inner.slice(2, arm.length + 2);
  const bellyTop = inner.slice(arm.length + 10);
  const strings = Array.from({ length: N }, (_, i) => {
    const x = -12 + i * 7.4;
    const s = { i, a: [x, 0, zAt(bellyTop, x)], b: [x + 1.5, 0, zAt(armUnder, x + 1.5)], el: null, amp: 0, t0: 0, phase: 0 };
    s.len = s.b[2] - s.a[2];
    // a tie where each string meets the arm
    mk("path", { class: "nf", d: open([P(s.b[0] - 1.6, 0, s.b[2] + 0.4), P(s.b[0] + 1.6, 0, s.b[2] + 0.4)]) }, g);
    return s;
  });
  for (const s of strings) s.el = mk("path", { class: "nf" }, g);
  const longest = strings.reduce((a, b) => (b.len > a.len ? b : a));
  // pitch order: the longest string is the lowest note
  const byPitch = strings.slice().sort((a, b) => b.len - a.len);
  for (const s of strings) s.note = byPitch.indexOf(s);

  function drawString(s, now) {
    const t = (now - s.t0) / 1000;
    const live = s.amp > 0 && t >= 0;
    const a = live ? s.amp * Math.exp(-t / DECAY) * Math.cos(t * 34 + s.phase) : 0;
    const pts = [];
    for (let k = 0; k <= 12; k++) {
      const u = k / 12;
      pts.push(P(s.a[0] + (s.b[0] - s.a[0]) * u, a * Math.sin(Math.PI * u), s.a[2] + (s.b[2] - s.a[2]) * u));
    }
    s.el.setAttribute("d", open(pts));
    return live && s.amp * Math.exp(-t / DECAY) > 0.04;
  }

  let lit = null;
  function light(s) {
    if (s === lit) return;
    lit?.el.classList.remove("hi");
    lit = s;
    lit.el.classList.add("hi");
  }
  light(longest);

  const B = register(stage, (_dt, now) => {
    let ringing = false;
    for (const s of strings) if (drawString(s, now)) ringing = true;
    return ringing;
  });
  bag.add(B.unregister);

  // hit test on the strings' rest positions: the nearest string to the pointer
  const rest = strings.map((s) => [P(...s.a), P(...s.b)]);
  function hit(p) {
    let best = -1, bd = Infinity;
    rest.forEach(([a, b], i) => {
      const d = segDist(p, a, b);
      if (d < bd) { bd = d; best = i; }
    });
    return bd < 9 ? best : -1;
  }

  let act = -2;
  function pluck(a, human) {
    if (a === act) return;
    act = a;
    if (a < 0) { light(longest); read.textContent = "rest"; return; }
    const now = performance.now();
    for (const s of strings) {
      const d = Math.abs(s.i - a);
      if (d > 3) continue;
      const gain = d === 0 ? 1 : 0.28 / d;
      s.amp = AMP * gain;
      s.t0 = now + d * stagger;
      s.phase = d * 0.7;
      stage.dispatchEvent(new CustomEvent("yazh:pluck", { detail: { string: s.note, count: N, gain, delay: d * stagger, human } }));
    }
    light(strings[a]);
    read.textContent = `string ${String(strings[a].note + 1).padStart(2, "0")}`;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p, e) => pluck(hit(p), !!e?.isTrusted), leave: () => pluck(-1, false) }));
  bag.add(() => svg.replaceChildren());
  // draw the rest pose once
  strings.forEach((s) => drawString(s, performance.now()));

  return {
    set: (v) => { stagger = v; },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "yazh",
  means: "A Sangam yazh: one carved S-shaped body, a scroll at the top and a resonating belly below, with seven strings between them. The string under the pointer is plucked and its neighbours sound after it.",
  rules: [1, 2, 4, 7, 9],
  range: [30, 60, 110],
  tour: [[176, 168], [194, 166], [212, 164], [230, 162], null],
  mount,
};

export default figure;
