/**
 * Cairn (பாலை · Palai): six rounded stones stacked on a sand plinth, the
 * waymarker of the drylands. The pointer's height picks a stone; every stone
 * above it lifts away together, staggered out from the one picked, so you
 * can see where the stack was built from. At rest the capstone is lit.
 * The slider is the gap, in world units.
 *
 * Rules leaned on: 01 (the pick reads the rest pose), 02 (stagger by
 * distance), 05 (an uneven, composed stack at rest), 08 (a choice on the
 * 700ms tween), 09 (each stone a silhouette and one crease).
 */
import HL from "../kernel.js";

const {
  Cam, fit, proj, facing, rings, prism, tween, tset, tval, tdone,
  mk, solid, put, pointer, register, disposer, flatDot, place,
} = HL;

// footprint (w × d), height, and offset of each stone, bottom to top
const STONES = [
  { w: 58, d: 48, h: 14, dx: 0, dy: 0 },
  { w: 44, d: 38, h: 12, dx: 5, dy: -4 },
  { w: 52, d: 40, h: 7, dx: -4, dy: 3 },
  { w: 34, d: 30, h: 12, dx: 3, dy: 1 },
  { w: 28, d: 22, h: 10, dx: -3, dy: -2 },
  { w: 17, d: 15, h: 9, dx: 1, dy: 2 },
];
const PL = 92, PB = 5, GAP_MAX = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value;

  const top = STONES.reduce((z, s) => z + s.h, 0);
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-PL / 2, -PL / 2, -PB], [PL / 2, PL / 2, -PB], [PL / 2, -PL / 2, -PB], [-PL / 2, PL / 2, -PB], [0, 0, top + GAP_MAX + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the plinth: a low plate of sand, with three grains lying on it
  const [pr, pi] = rings(-PL / 2, -PL / 2, PL / 2, PL / 2, 14, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));
  for (const [x, y] of [[-34, 28], [30, -32], [34, 22]]) place(flatDot(g, C, 0.9, "dot off"), P(x, y, 0));

  let z = 0;
  const stones = STONES.map((s) => {
    const x0 = s.dx - s.w / 2, y0 = s.dy - s.d / 2;
    const [ring, inner] = rings(x0, y0, x0 + s.w, y0 + s.d, Math.min(s.w, s.d) * 0.5, 1.7);
    const st = { ...s, ring, inner, z0: z, el: solid(g), lift: tween(0), drawn: NaN };
    z += s.h;
    return st;
  });
  const N = stones.length;

  // hit test on the REST pose: each stone's rest centre on screen; the pointer's height picks the nearest
  const restY = stones.map((s) => P(s.dx, s.dy, s.z0 + s.h / 2)[1]);
  const restX = P(0, 0, 0)[0];
  function hit([x, y]) {
    if (Math.abs(x - restX) > 90) return -1;
    let best = -1, bd = Infinity;
    restY.forEach((ry, i) => {
      const d = Math.abs(y - ry);
      if (d < bd) { bd = d; best = i; }
    });
    return bd < 26 ? best : -1;
  }

  function draw(s, now) {
    const lift = tval(s.lift, now);
    if (lift === s.drawn) return;
    s.drawn = lift;
    put(s.el, prism(P, front, s.ring, s.inner, s.z0 + lift, s.z0 + s.h + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of stones) { draw(s, now); if (!tdone(s.lift, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    stones.forEach((s, i) => {
      tset(s.lift, a >= 0 && i > a ? gap : 0, now, Math.abs(i - from) * 45);
      s.el.sil.classList.toggle("hi", a < 0 ? i === N - 1 : i === a);
    });
    read.textContent = a < 0 ? "rest" : `stone ${String(a + 1).padStart(2, "0")}`;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      gap = v;
      if (act >= 0) { const a = act; act = -2; setActive(a); }
    },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "cairn",
  means: "A cairn of six stones: the pointer's height picks one, and the stones above it lift away.",
  rules: [1, 2, 5, 9],
  range: [8, 14, 22],
  tour: [[200, 210], [200, 160], [200, 112], null],
  mount,
};

export default figure;
