/**
 * Olai (ஓலைச்சுவடி): a palm-leaf manuscript, the form the Sangam poems
 * survived in — a stack of long, narrow leaves between two wooden boards,
 * strung on a cord through a hole near one end. The pointer's height picks
 * a leaf; every leaf above it swings open round the cord, fanning further
 * the higher it lies, so you can see where you are in the book. At rest the
 * top board is lit. The slider is the fan's spread, in degrees per leaf.
 *
 * Rules leaned on: 01 (the pick reads the stack at rest), 02 (stagger by
 * distance from the leaf picked), 06 (painted bottom to top), 08 (a choice
 * rides the 700ms tween).
 */
import HL from "../kernel.js";

const {
  Cam, fit, proj, facing, rings, prism, tween, tset, tval, tdone,
  mk, solid, put, pointer, register, disposer, flatDot, place,
} = HL;

const L = 150, W = 20, LEAF = 1.6, BOARD = 4, N = 10, PB = 4, HOLE = -L / 2 + 26;

/** a footprint ring turned by `deg` about the cord at (HOLE, 0) */
function turn(ring, deg) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({
    u: HOLE + (q.u - HOLE) * c - q.v * s,
    v: (q.u - HOLE) * s + q.v * c,
    nu: q.nu * c - q.nv * s,
    nv: q.nu * s + q.nv * c,
  }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spread = value;

  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-L / 2 - 8, -W - 14, -PB], [L / 2 + 8, W + 14, -PB], [-L / 2 - 8, W + 14, -PB], [L / 2 + 8, -W - 14, -PB], [0, 0, 32]], 200, 176);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [pr, pi] = rings(-L / 2 - 8, -W - 14, L / 2 + 8, W + 14, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // bottom board, the leaves, the top board: each a thin plate, painted bottom to top
  const outline = rings(-L / 2, -W / 2, L / 2, W / 2, 6, 1.4);
  const boardOutline = rings(-L / 2 - 2, -W / 2 - 1.5, L / 2 + 2, W / 2 + 1.5, 7, 1.6);
  const layers = [];
  let z = 0;
  const add = (kind, h, ring) => {
    const el = solid(g);
    const hole = flatDot(g, C, 1.3, "dot off");
    layers.push({ kind, z0: z, h, ring, el, hole, open: tween(0), drawn: NaN });
    z += h;
  };
  add("board", BOARD, boardOutline);
  for (let i = 0; i < N; i++) add("leaf", LEAF, outline);
  add("board", BOARD, boardOutline);
  const top = layers.length - 1;
  // the cord, from the top board's hole, trailing off the side
  const cord = mk("path", { class: "nf" }, g);

  function draw(l, now) {
    const deg = tval(l.open, now);
    const lift = Math.min(1, deg / 6) * 1.2;
    const key = deg + lift;
    if (key === l.drawn) return;
    l.drawn = key;
    const [ring, inner] = l.ring;
    put(l.el, prism(P, front, turn(ring, deg), turn(inner, deg), l.z0 + lift, l.z0 + l.h + lift));
    place(l.hole, P(HOLE, 0, l.z0 + l.h + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const l of layers) { draw(l, now); if (!tdone(l.open, now)) moving = true; }
    const t = layers[top].z0 + layers[top].h + Math.min(1, tval(layers[top].open, now) / 6) * 1.2;
    cord.setAttribute("d", `M${P(HOLE, 0, t).join(" ")}Q${P(HOLE - 18, 10, t + 6).join(" ")} ${P(HOLE - 30, 26, 0).join(" ")}`);
    return moving;
  });
  bag.add(B.unregister);

  // hit test on the rest stack: the pointer's height over the stack's middle picks a layer
  const yOf = (i) => P(0, 0, layers[i].z0 + layers[i].h / 2)[1];
  const xMid = P(0, 0, 0)[0];
  function hit([x, y]) {
    if (Math.abs(x - xMid) > 150) return -1;
    const y0 = yOf(0), y1 = yOf(top);
    // stretch the stack's few pixels over a comfortable band
    const band0 = y0 + 44, band1 = y1 - 44;
    if (y > band0 || y < band1) return -1;
    return Math.round(((band0 - y) / (band0 - band1)) * top);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    layers.forEach((l, i) => {
      tset(l.open, a >= 0 && i > a ? (i - a) * spread : 0, now, Math.abs(i - from) * 35);
      l.el.sil.classList.toggle("hi", a < 0 ? i === top : i === a);
      l.hole.setAttribute("class", a >= 0 && i === a ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : layers[a].kind === "board" ? (a === 0 ? "back board" : "front board") : `leaf ${String(a).padStart(2, "0")}`;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { spread = v; if (act >= 0) { const a = act; act = -2; setActive(a); } },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "olai",
  means: "A palm-leaf manuscript between two boards: the pointer picks a leaf and the leaves above it fan open round the cord.",
  rules: [1, 2, 6, 8],
  range: [2.5, 5, 9],
  tour: [[200, 190], [200, 170], [200, 150], null],
  mount,
};

export default figure;
