/**
 * Vilakku (குத்துவிளக்கு): the standing oil lamp — a turned base, a stem
 * with two knops, a shallow bowl with five wicks round its rim, and a finial
 * rising from the oil. The pointer is projected onto the plane of the rim
 * and its direction from the lamp's axis picks a wick; that wick catches
 * and the flame passes round the bowl to the others, nearest first. At rest
 * one wick burns, the one facing you. The slider is the delay between one
 * wick and the next, in milliseconds.
 *
 * The lamp is a turned solid, so its outline is taken from the profile:
 * each ring projects to an ellipse, the sides are the ellipses' horizontal
 * extremes, the foot is the front half of the bottom ellipse and the rim
 * the back half of the top one.
 *
 * Rules leaned on: 01 (the pick reads the rim plane, which never moves),
 * 02 (stagger by distance round the bowl), 05 (one flame at rest),
 * 08 (a choice rides the 700ms tween).
 */
import HL from "../kernel.js";

const {
  Cam, fit, proj, unproj, tween, tset, tval, tdone, poly, open,
  mk, pointer, register, disposer, flatDot, place,
} = HL;

const RIM = 57, WICKS = 5;
// [height, radius], foot to rim
const FOOT = [[0, 25], [3.4, 25]];
const BODY = [
  [3.4, 21], [5, 19.5], [7.5, 13], [10.5, 6.5], [13, 3.4], [25, 3.2], [26.5, 6], [28.5, 6.6], [30.5, 4.2],
  [32, 3], [43, 3], [44.5, 5.2], [46.5, 5.2], [48, 3.2], [50, 4.5], [52.5, 12], [55, 16.5], [RIM, 18.5],
];
// the finial, rising from the oil
const FINIAL = [[RIM, 2.2], [69, 1.8], [71, 4.2], [74, 5.4], [77, 4], [79.5, 1.6], [81.5, 0]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stagger = value;

  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-26, -26, 0], [26, 26, 0], [26, -26, 0], [-26, 26, 0], [0, 0, 90]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const cx = P(0, 0, 0)[0], cy = (z) => P(0, 0, z)[1];
  const rx = (r) => r * C.S, ry = (r) => r * C.S * C.k;

  /** the outline of a turned solid from its profile */
  function turned(profile) {
    const [z0, r0] = profile[0], [z1, r1] = profile[profile.length - 1];
    const pts = [];
    for (let k = 0; k <= 24; k++) {
      const a = Math.PI - (k / 24) * Math.PI; // front half of the foot, left to right
      pts.push([cx + rx(r0) * Math.cos(a), cy(z0) + ry(r0) * Math.sin(a)]);
    }
    for (const [z, r] of profile.slice(1)) pts.push([cx + rx(r), cy(z)]);
    for (let k = 1; k < 24; k++) {
      const a = -(k / 24) * Math.PI; // back half of the top, right to left
      pts.push([cx + rx(r1) * Math.cos(a), cy(z1) + ry(r1) * Math.sin(a)]);
    }
    for (const [z, r] of profile.slice(1).reverse()) pts.push([cx - rx(r), cy(z)]);
    return poly(pts);
  }
  const frontHalf = (z, r) =>
    open(Array.from({ length: 25 }, (_, k) => {
      const a = Math.PI - (k / 24) * Math.PI;
      return [cx + rx(r) * Math.cos(a), cy(z) + ry(r) * Math.sin(a)];
    }));

  // the foot is its own disc, so its top shows behind the dome
  mk("path", { class: "sil", d: turned(FOOT) }, g);
  mk("path", { class: "sil", d: turned(BODY) }, g);
  // the oil surface, a little below the rim: the one crease of the bowl
  mk("path", { class: "nf", d: frontHalf(RIM, 18.5) }, g);
  mk("path", { class: "nf lo", d: open(Array.from({ length: 49 }, (_, k) => {
    const a = (k / 48) * Math.PI * 2;
    return [cx + rx(16) * Math.cos(a), cy(RIM - 0.6) + ry(16) * Math.sin(a)];
  })) }, g);
  mk("path", { class: "sil", d: turned(FINIAL) }, g);

  // five wicks round the rim; each has a dot and a flame
  const wicks = Array.from({ length: WICKS }, (_, i) => {
    const a = Math.PI / 4 + (i / WICKS) * Math.PI * 2; // world angle; the first faces the viewer
    const at = P(Math.cos(a) * 19.5, Math.sin(a) * 19.5, RIM + 0.4);
    const dot = flatDot(g, C, 1.2, "dot m");
    place(dot, at);
    return { i, a, at, dot, flame: mk("path", { class: "hi" }, g), burn: tween(0), drawn: NaN };
  });
  // paint the far wicks first so the near flames sit in front
  wicks.slice().sort((p, q) => p.at[1] - q.at[1]).forEach((w) => { w.flame.remove(); g.append(w.flame); });
  const facingYou = wicks.reduce((p, q) => (q.at[1] > p.at[1] ? q : p));

  function drawFlame(w, now) {
    const b = tval(w.burn, now);
    if (b === w.drawn) return;
    w.drawn = b;
    if (b < 0.04) { w.flame.setAttribute("d", ""); return; }
    const [x, y] = w.at, h = 4.2 * b * C.S, wd = 1.15 * b * C.S;
    w.flame.setAttribute("d", `M${x} ${y - 1}C${x + wd} ${y - h * 0.35} ${x + wd * 0.5} ${y - h * 0.75} ${x} ${y - h}C${x - wd * 0.5} ${y - h * 0.75} ${x - wd} ${y - h * 0.35} ${x} ${y - 1}Z`);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const w of wicks) { drawFlame(w, now); if (!tdone(w.burn, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const ring = (p, q) => { const d = Math.abs(p - q) % WICKS; return Math.min(d, WICKS - d); };
  let act;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    for (const w of wicks) {
      const d = a ? ring(w.i, a.i) : w === facingYou ? 0 : 99;
      tset(w.burn, d < 99 ? 1 : 0, now, a ? d * stagger : 0);
      w.dot.setAttribute("class", (a ? true : w === facingYou) ? "dot" : "dot m");
    }
    read.textContent = a ? `wick ${a.i + 1} of ${WICKS}` : "rest";
    B.wake();
  }
  setActive(null);

  // hit: the pointer's direction from the axis, on the rim plane
  bag.add(pointer(stage, {
    move: (p) => {
      const [u, v] = unproj(C, p[0], p[1], RIM);
      const r = Math.hypot(u, v);
      if (r > 70 || p[1] > cy(0) + 30 || p[1] < cy(100)) { setActive(null); return; }
      const ang = Math.atan2(v, u);
      let best = wicks[0], bd = Infinity;
      for (const w of wicks) {
        const d = Math.abs(Math.atan2(Math.sin(ang - w.a), Math.cos(ang - w.a)));
        if (d < bd) { bd = d; best = w; }
      }
      setActive(best);
    },
    leave: () => setActive(null),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stagger = v; },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "vilakku",
  means: "A standing oil lamp with five wicks: the wick toward the pointer catches and the flame passes round the bowl.",
  rules: [1, 2, 5, 8],
  range: [60, 130, 240],
  tour: [[150, 120], [260, 110], [210, 70], null],
  mount,
};

export default figure;
