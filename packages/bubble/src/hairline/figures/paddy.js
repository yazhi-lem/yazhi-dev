/**
 * Paddy (மருதம் · Marutham): nine paddy plots terraced down a gentle slope,
 * each with a 3 × 3 planting of seedlings. The pointer is projected onto each
 * plot's own resting top, nearest plot first, so a plot is picked where it
 * was drawn. The picked plot floods and rises; its neighbours follow it, the
 * nearest first, like wind moving across a field. The slider is the stagger
 * between neighbours, in milliseconds.
 *
 * Rules leaned on: 01 (hit on the rest tops), 02 (stagger by distance),
 * 05 (terraces, one lit plot at rest), 06 (painted back to front), 08 (a
 * choice rides the 700ms tween).
 */
import HL from "../kernel.js";

const {
  Cam, fit, proj, facing, rings, rrect, ringAt, open, prism, unproj, tween, tset, tval, tdone,
  mk, solid, put, pointer, register, disposer, flatDot, place,
} = HL;

const N = 3, CELL = 46, PLOT = 39, PB = 5, LIFT = 9;
// three terraces stepping down toward the viewer, a little uneven across
const TERRACE = [19, 12, 5];
const ACROSS = [2, 0, 3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stagger = value;

  const EXT = N * CELL;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-6, -6, -PB], [EXT + 6, EXT + 6, -PB], [EXT + 6, -6, -PB], [-6, EXT + 6, -PB], [0, 0, TERRACE[0] + LIFT + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [pr, pi] = rings(-6, -6, EXT + 6, EXT + 6, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  const plots = [];
  // diagonal by diagonal from the far corner: appending is painting back to front
  for (let s = 0; s <= 2 * (N - 1); s++) for (let i = 0; i < N; i++) {
    const j = s - i;
    if (j < 0 || j >= N) continue;
    const x0 = i * CELL + (CELL - PLOT) / 2, y0 = j * CELL + (CELL - PLOT) / 2;
    const [ring, inner] = rings(x0, y0, x0 + PLOT, y0 + PLOT, 7, 1.8);
    const h0 = TERRACE[j] + ACROSS[i];
    const el = solid(g);
    // the water line: a dashed ring inside the bund, drawn only while the plot is flooded
    const water = mk("path", { class: "nf dash" }, el.g);
    const shore = rrect(x0 + 4.5, y0 + 4.5, x0 + PLOT - 4.5, y0 + PLOT - 4.5, 4, 3);
    const sprouts = mk("g", {}, g);
    const dots = [];
    for (let k = 0; k < 9; k++) dots.push(flatDot(sprouts, C, 1.1, "dot off"));
    plots.push({ i, j, x0, y0, h0, ring, inner, el, water, shore, wet: false, dots, rise: tween(0), drawn: NaN });
  }
  const restPlot = plots.find((p) => p.i === 1 && p.j === 0);

  function draw(p, now) {
    const z = p.h0 + tval(p.rise, now);
    if (z === p.drawn) return;
    p.drawn = z;
    put(p.el, prism(P, front, p.ring, p.inner, 0, z));
    p.water.setAttribute("d", p.wet ? open(ringAt(P, p.shore.concat(p.shore[0]), z)) : "");
    const step = PLOT / 4;
    p.dots.forEach((d, k) => place(d, P(p.x0 + step * (1 + (k % 3)), p.y0 + step * (1 + Math.floor(k / 3)), z)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of plots) { draw(p, now); if (!tdone(p.rise, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit test on the REST pose, nearest plot first: unproject onto that plot's resting top
  const nearFirst = plots.slice().reverse();
  function hit([x, y]) {
    for (const p of nearFirst) {
      const [u, v] = unproj(C, x, y, p.h0);
      if (u >= p.x0 - 2 && u <= p.x0 + PLOT + 2 && v >= p.y0 - 2 && v <= p.y0 + PLOT + 2) return p;
    }
    return null;
  }

  let act;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a || act || restPlot;
    act = a;
    for (const p of plots) {
      const d = Math.abs(p.i - from.i) + Math.abs(p.j - from.j);
      const to = !a ? 0 : d === 0 ? LIFT : d === 1 ? LIFT * 0.45 : d === 2 ? LIFT * 0.15 : 0;
      tset(p.rise, to, now, d * stagger);
      p.el.sil.classList.toggle("hi", p === (a || restPlot));
      p.wet = !!a && d === 0;
      p.drawn = NaN;
      const cls = !a ? "dot off" : d === 0 ? "dot" : d === 1 ? "dot m" : "dot off";
      p.dots.forEach((dot) => dot.setAttribute("class", cls));
    }
    read.textContent = a ? `plot ${a.i}·${a.j}` : "rest";
    B.wake();
  }
  setActive(null);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stagger = v; },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "paddy",
  means: "Nine terraced paddy plots: the one under the pointer floods and rises, and its neighbours follow, nearest first.",
  rules: [1, 2, 5, 6],
  range: [20, 45, 80],
  tour: [[150, 120], [200, 170], [250, 220], null],
  mount,
};

export default figure;
