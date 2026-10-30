/**
 * Tide (நெய்தல் · Neytal): seven boats at their moorings on a strip of
 * shallow water. The pointer is projected onto the water, which never moves,
 * and a swell follows it along the moorings: the wave lines lift into a crest
 * and the boats nearest it ride up on their own springs, slow and loose like
 * water. At rest the tallest mast is lit. The slider is the swell's reach, in
 * boats.
 *
 * Rules leaned on: 01 (hit on the water plane), 03 (a falloff with a floor),
 * 07 (the springs sleep when the sea is calm), 08 (the pointer rides springs),
 * 09 (a hull is the hull of its keel ring and its deck ring).
 */
import HL from "../kernel.js";

const {
  Cam, fit, proj, facing, rings, rrect, ringAt, run, hull, poly, open, seg, prism,
  unproj, spring, stepS, mk, solid, put, pointer, register, disposer,
} = HL;

const N = 7, STEP = 25, SWELL = 16, PB = 4, W = 40, HULL = 7;
const MAST = [26, 33, 22, 40, 29, 21, 30];
const BOB = [0.6, -0.4, 0.2, 0.8, -0.6, 0.3, -0.2];
const SPRING = { k: 55, c: 10 };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;

  const X1 = (N - 1) * STEP, XA = -STEP * 0.8, XB = X1 + STEP * 0.8;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[XA, -W, -PB], [XB, W, -PB], [XB, -W, -PB], [XA, W, -PB], [0, 0, 40 + HULL + SWELL], [X1, 0, 40 + HULL + SWELL]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [pr, pi] = rings(XA, -W, XB, W, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // the swell: one crest position and one height, both on loose springs
  const crest = spring(X1 / 2, SPRING), amp = spring(0, SPRING);
  const lift = (x) => amp.x * Math.exp(-(((x - crest.x) / (reach * STEP)) ** 2));

  // wave lines: the ones behind the boats paint first, the ones in front after
  const LINES = [-32, -22, 22, 32];
  const back = LINES.filter((y) => y < 0).map((y) => ({ y, el: mk("path", { class: "nf lo" }, g) }));

  const boats = MAST.map((m, i) => {
    const cx = i * STEP, cy = i % 2 ? 3 : -3;
    const keel = rrect(cx - 3.5, cy - 9, cx + 3.5, cy + 9, 3.5, 4);
    const deck = rrect(cx - 7, cy - 15, cx + 7, cy + 15, 7, 5);
    const inner = rrect(cx - 5.6, cy - 13.6, cx + 5.6, cy + 13.6, 5.6, 5);
    const el = solid(g);
    const mast = mk("path", { class: "sil nf" }, el.g);
    return { i, cx, cy, m, keel, deck, inner, el, mast, sp: spring(BOB[i], SPRING), drawn: NaN };
  });
  const tallest = boats.reduce((a, b) => (b.m > a.m ? b : a));

  const fore = LINES.filter((y) => y > 0).map((y) => ({ y, el: mk("path", { class: "nf lo" }, g) }));
  const lines = back.concat(fore);

  function drawBoat(b) {
    const z = b.sp.x;
    if (z === b.drawn) return;
    b.drawn = z;
    const sil = poly(hull(ringAt(P, b.keel, z).concat(ringAt(P, b.deck, z + HULL))));
    const crease = open(ringAt(P, run(b.inner, front), z + HULL));
    put(b.el, { sil, crease });
    b.mast.setAttribute("d", seg(P(b.cx, b.cy + 2, z + HULL), P(b.cx, b.cy + 2, z + HULL + b.m)));
  }
  function drawLines() {
    for (const l of lines) {
      const pts = [];
      for (let x = XA + 6; x <= XB - 6; x += 3) pts.push(P(x, l.y, lift(x) * (1 - Math.abs(l.y) / 80)));
      l.el.setAttribute("d", open(pts));
    }
  }

  let lit = null;
  function light(b) {
    if (b === lit) return;
    lit?.mast.classList.remove("hi");
    lit = b;
    lit.mast.classList.add("hi");
  }
  light(tallest);

  const B = register(stage, (dt) => {
    let m = false;
    if (stepS(crest, dt)) m = true;
    if (stepS(amp, dt)) m = true;
    for (const b of boats) {
      b.sp.t = BOB[b.i] + lift(b.cx);
      if (stepS(b.sp, dt)) m = true;
      drawBoat(b);
    }
    drawLines();
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    if (over === null) {
      amp.t = 0;
      light(tallest);
      read.textContent = "rest";
    } else {
      crest.t = over;
      amp.t = SWELL;
      const i = Math.max(0, Math.min(N - 1, Math.round(over / STEP)));
      light(boats[i]);
      read.textContent = `boat ${String(i + 1).padStart(2, "0")}`;
    }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [u, v] = unproj(C, p[0], p[1], 0);
      over = u < XA - 8 || u > XB + 8 || Math.abs(v) > W + 14 ? null : Math.max(0, Math.min(X1, u));
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; B.wake(); },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "tide",
  means: "Seven boats at their moorings: a swell follows the pointer along the water and the nearest boats ride up on it.",
  rules: [1, 3, 7, 8],
  range: [0.8, 1.6, 2.6],
  tour: [[120, 150], [200, 175], [280, 205], null],
  mount,
};

export default figure;
