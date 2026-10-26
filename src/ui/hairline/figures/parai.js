/**
 * Parai (பறை): the frame drum that every tinai has its own kind of, laid
 * on its back so the skin faces up, with the lacing pegs around its rim.
 * The pointer is projected onto the skin, which never moves; where it
 * lands, the skin is struck and rings run out from the strike, clipped to
 * the skin, the newest brightest. The read-out names where it was struck,
 * centre or rim. The slider is how fast the rings travel, in world units a
 * second.
 *
 * Rules leaned on: 01 (hit on the resting skin), 04 (rings brighten and
 * fade by stroke class alone), 07 (the loop sleeps when the skin is still),
 * 09 (a round solid is a silhouette and one crease).
 */
import HL from "../kernel.js";

const {
  Cam, fit, proj, facing, circ, prism, unproj, open,
  mk, solid, put, pointer, register, disposer, flatDot, place,
} = HL;

const R = 50, H = 17, PB = 4, LIFE = 1.4, PEGS = 16;

/** a ring of world points, centred anywhere */
const ringPts = (cx, cy, r, n = 72) =>
  Array.from({ length: n + 1 }, (_, k) => {
    const a = (k / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let speed = value;

  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-R - 10, -R - 10, -PB], [R + 10, R + 10, -PB], [R + 10, -R - 10, -PB], [-R - 10, R + 10, -PB], [0, 0, H + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a round mat for it to sit on
  put(solid(g), prism(P, front, circ(R + 12), circ(R + 9.8), -PB, 0));

  // the drum: the frame as a round solid, the skin's inner edge as its crease
  const frame = circ(R), skinEdge = circ(R - 3.2);
  put(solid(g), prism(P, front, frame, skinEdge, 0, H));
  // lacing pegs around the rim
  for (let k = 0; k < PEGS; k++) {
    const a = (k / PEGS) * Math.PI * 2;
    place(flatDot(g, C, 1.1, "dot m"), P(Math.cos(a) * (R - 1.6), Math.sin(a) * (R - 1.6), H));
  }
  // the beaten patch at the centre, one faint ring
  mk("path", { class: "nf lo", d: open(ringPts(0, 0, 9).map(([x, y]) => P(x, y, H))) }, g);

  const layer = mk("g", {}, g);
  const waves = [];

  /** the part of a ring that lies on the skin, as separate runs */
  function onSkin(cx, cy, r) {
    const runs = [];
    let cur = [];
    for (const [x, y] of ringPts(cx, cy, r)) {
      if (x * x + y * y < (R - 3.4) ** 2) cur.push(P(x, y, H));
      else if (cur.length) { runs.push(cur); cur = []; }
    }
    if (cur.length) runs.push(cur);
    return runs.map(open).join("");
  }

  const B = register(stage, (_dt, now) => {
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      const t = (now - w.t0) / 1000;
      if (t > LIFE) { w.el.remove(); waves.splice(i, 1); continue; }
      const r = 1.5 + t * speed;
      w.el.setAttribute("d", onSkin(w.x, w.y, r));
      w.el.setAttribute("class", t < LIFE * 0.3 ? "nf hi" : t < LIFE * 0.65 ? "nf" : "nf lo");
    }
    return waves.length > 0;
  });
  bag.add(B.unregister);

  let last = 0, lastAt = null;
  function strike(at) {
    const now = performance.now();
    if (lastAt && now - last < 140 && Math.hypot(at[0] - lastAt[0], at[1] - lastAt[1]) < 10) return;
    last = now;
    lastAt = at;
    for (const delay of [0, 90]) waves.push({ x: at[0], y: at[1], t0: now + delay, el: mk("path", { class: "nf hi" }, layer) });
    while (waves.length > 8) waves.shift().el.remove();
    const d = Math.hypot(at[0], at[1]) / R;
    read.textContent = d < 0.45 ? "strike · centre" : "strike · rim";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const w = unproj(C, p[0], p[1], H);
      if (w[0] * w[0] + w[1] * w[1] < (R - 4) ** 2) strike(w);
    },
    leave: () => { read.textContent = "rest"; lastAt = null; },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { speed = v; },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "parai",
  means: "A parai frame drum, skin up: the pointer strikes the skin and rings run out from the strike.",
  rules: [1, 4, 7, 9],
  range: [24, 40, 64],
  tour: [[200, 160], [170, 175], [235, 150], null],
  mount,
};

export default figure;
