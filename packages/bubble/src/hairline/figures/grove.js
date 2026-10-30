/**
 * Grove (முல்லை · Mullai): twenty-five trees on a forest floor, each a thin
 * trunk under a rounded canopy. The pointer is projected onto the ground,
 * which never moves, and the trees grow toward it on their own springs, the
 * nearest most. At rest the grove is two clumps of different ages; the
 * tallest tree is lit. The slider is the reach, in trees.
 *
 * Rules leaned on: 01 (hit on the ground plane), 03 (a falloff with a floor),
 * 05 (an uneven grove at rest), 06 (painted back to front), 09.
 */
import HL from "../kernel.js";

const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  mk, pointer, put, register, disposer, solid,
} = HL;

const N = 5, CELL = 22, TRUNK = 2.6, CAN = 19, HMAX = 56, EXT = N * CELL, PB = 5;

/** 1 under the pointer, .35 at half the reach, a floor of .12 beyond. */
const falloff = (u) => (u <= 0 ? 1 : u <= 0.5 ? 1 - u * 1.3 : u <= 1 ? 0.35 - (u - 0.5) * 0.46 : 0.12);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value * CELL, over = null;

  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-6, -6, -PB], [EXT + 6, EXT + 6, -PB], [EXT + 6, -6, -PB], [-6, EXT + 6, -PB], [0, 0, HMAX + 10]], 200, 172);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, EXT + 6, EXT + 6, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  const trees = [];
  // diagonal by diagonal from the far corner: appending is painting back to front
  for (let s = 0; s <= 2 * (N - 1); s++) for (let i = 0; i < N; i++) {
    const j = s - i;
    if (j < 0 || j >= N) continue;
    const u = i / (N - 1), v = j / (N - 1);
    // two clumps: an old stand at the back left, a young one front right
    const h0 = 16 + 22 * Math.exp(-((u - 0.2) ** 2 + (v - 0.25) ** 2) / 0.09) + 10 * Math.exp(-((u - 0.85) ** 2 + (v - 0.75) ** 2) / 0.05);
    const cx = (i + 0.5) * CELL, cy = (j + 0.5) * CELL;
    // a little jitter so the grove is planted, not printed
    const jx = Math.sin(i * 7.1 + j * 3.3) * 2.2, jy = Math.cos(i * 2.7 + j * 5.9) * 2.2;
    const tr = rings(cx + jx - TRUNK / 2, cy + jy - TRUNK / 2, cx + jx + TRUNK / 2, cy + jy + TRUNK / 2, 1.2, 0.5);
    const cw = CAN * (0.82 + 0.18 * ((i * 3 + j * 5) % 4) / 3);
    const cr = rings(cx + jx - cw / 2, cy + jy - cw / 2, cx + jx + cw / 2, cy + jy + cw / 2, cw * 0.5, 1.6);
    trees.push({ i, j, h0, tr, cr, cw, sp: spring(h0, { eps: 0.04 }), trunk: solid(g), can: solid(g), drawn: NaN });
  }
  const tallest = trees.reduce((a, b) => (b.h0 > a.h0 ? b : a));

  function draw(t) {
    const h = Math.max(10, t.sp.x);
    if (h === t.drawn) return;
    t.drawn = h;
    // a short, wide crown on a visible trunk; growth goes mostly into the trunk
    const crown = clamp(h * 0.32, 6, 11), stem = h - crown;
    put(t.trunk, prism(P, front, t.tr[0], t.tr[1], 0, stem + 1));
    put(t.can, prism(P, front, t.cr[0], t.cr[1], stem, h));
  }

  let lit = tallest;
  function light(t) {
    if (t === lit) return;
    lit.can.sil.classList.remove("hi");
    lit = t;
    lit.can.sil.classList.add("hi");
  }
  tallest.can.sil.classList.add("hi");

  const B = register(stage, (dt) => {
    let m = false;
    for (const t of trees) { if (stepS(t.sp, dt)) m = true; draw(t); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const t of trees) {
      if (!over) { t.sp.t = t.h0; continue; }
      const d = Math.hypot((t.i + 0.5) * CELL - over[0], (t.j + 0.5) * CELL - over[1]);
      t.sp.t = Math.max(t.h0 * 0.7, HMAX * falloff(d / R));
    }
    if (over) {
      const i = clamp(Math.floor(over[0] / CELL), 0, N - 1), j = clamp(Math.floor(over[1] / CELL), 0, N - 1);
      light(trees.find((t) => t.i === i && t.j === j));
      read.textContent = `tree ${i}·${j}`;
    } else {
      light(tallest);
      read.textContent = "rest";
    }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const w = unproj(C, p[0], p[1], 0);
      over = w[0] < -10 || w[1] < -10 || w[0] > EXT + 10 || w[1] > EXT + 10 ? null : w;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v * CELL; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "grove",
  means: "A grove of twenty-five trees that grow toward the pointer, the nearest most.",
  rules: [1, 3, 5, 6],
  range: [1.2, 2, 3.2],
  tour: [[175, 215], [255, 200], [215, 250], null],
  mount,
};

export default figure;
