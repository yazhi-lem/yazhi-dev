/**
 * Peaks (குறிஞ்சி · Kurinji): a range of seven tapered peaks on a long
 * ridge plate. The pointer's position along the range picks a peak; it rises
 * on its spring and its neighbours rise after it, the nearest most. The
 * kurinji bloom, a small cluster of dots, sits on the highest summit at rest
 * and moves to the peak the pointer chooses. The slider is the reach, in
 * peaks.
 *
 * Rules leaned on: 01 (nearest rest centre on screen), 03 (clamped lift),
 * 05 (an uneven range at rest), 09 (a tapered solid is the hull of its foot
 * and its top, with one crease).
 */
import HL from "../kernel.js";

const {
  Cam, fit, proj, facing, rings, rrect, prism, ringAt, run, hull, poly, open,
  spring, stepS, mk, solid, put, pointer, register, disposer, flatDot, place,
} = HL;

const N = 7, STEP = 24, FW = 36, FD = 30, TW = 9, TD = 8, LIFT = 26, PB = 5;
const REST = [24, 36, 52, 44, 60, 34, 20];
const WOBBLE = [3, -4, 2, -3, 1, 4, -2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;

  const X1 = (N - 1) * STEP;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-FW / 2 - 8, -FD / 2 - 10, -PB], [X1 + FW / 2 + 8, FD / 2 + 10, -PB], [X1 / 2, 0, 60 + LIFT]], 200, 176);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [pr, pi] = rings(-FW / 2 - 8, -FD / 2 - 10, X1 + FW / 2 + 8, FD / 2 + 10, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // back to front along +x (the nearer end of the range is the larger x)
  const peaks = REST.map((h0, i) => {
    const cx = i * STEP, cy = WOBBLE[i];
    const foot = rrect(cx - FW / 2, cy - FD / 2, cx + FW / 2, cy + FD / 2, 12, 6);
    const top = rrect(cx - TW / 2, cy - TD / 2, cx + TW / 2, cy + TD / 2, 2.6, 4);
    const inner = rrect(cx - TW / 2 + 0.9, cy - TD / 2 + 0.9, cx + TW / 2 - 0.9, cy + TD / 2 - 0.9, 1.8, 4);
    return { i, cx, cy, h0, foot, top, inner, sp: spring(h0, { eps: 0.05 }), el: solid(g), drawn: NaN };
  });

  // the bloom: a 3 × 3 cluster riding the chosen summit, moved in paint order to just after it
  const bloom = mk("g", {}, g), dots = [];
  for (let k = 0; k < 9; k++) dots.push(flatDot(bloom, C, 1.05, k === 4 ? "dot" : "dot m"));
  const highest = peaks.reduce((a, b) => (b.h0 > a.h0 ? b : a));
  let want = highest, on = null;

  function drawPeak(p) {
    const h = p.sp.x;
    if (h === p.drawn) return;
    p.drawn = h;
    const sil = poly(hull(ringAt(P, p.foot, 0).concat(ringAt(P, p.top, h))));
    const crease = open(ringAt(P, run(p.inner, front), h));
    put(p.el, { sil, crease });
  }
  function drawBloom() {
    if (want !== on) {
      on = want;
      on.el.g.after(bloom);
      peaks.forEach((p) => p.el.sil.classList.toggle("hi", p === on));
    }
    const z = on.sp.x + 0.4;
    dots.forEach((d, k) => place(d, P(on.cx + ((k % 3) - 1) * 2.6, on.cy + (Math.floor(k / 3) - 1) * 2.6, z)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const p of peaks) { if (stepS(p.sp, dt)) m = true; drawPeak(p); }
    drawBloom();
    return m;
  });
  bag.add(B.unregister);

  // hit test: the peak whose REST summit is nearest the pointer's screen x, within the range's band
  const restX = peaks.map((p) => P(p.cx, p.cy, 0)[0]);
  const yTop = P(0, 0, 70)[1], yBot = P(X1, 0, -PB)[1] + 24;
  function hit([x, y]) {
    if (y < yTop - 30 || y > yBot) return -1;
    let best = -1, bd = Infinity;
    restX.forEach((rx, i) => { const d = Math.abs(x - rx); if (d < bd) { bd = d; best = i; } });
    return bd < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    for (const p of peaks) {
      if (a < 0) { p.sp.t = p.h0; continue; }
      const u = Math.abs(p.i - a) / reach;
      const f = u <= 1 ? 1 - u * 0.7 : Math.max(0, 0.3 - (u - 1) * 0.3);
      p.sp.t = Math.min(p.h0 + LIFT * f, 64 + LIFT * 0.5);
    }
    want = a < 0 ? highest : peaks[a];
    read.textContent = a < 0 ? "rest" : `peak ${String(a + 1).padStart(2, "0")}`;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; if (act >= 0) { const a = act; act = -2; setActive(a); } },
    destroy: bag.dispose,
  };
}

const figure = {
  name: "peaks",
  means: "A range of seven peaks: the one under the pointer rises with its neighbours, and the kurinji bloom moves to its summit.",
  rules: [1, 3, 5, 9],
  range: [0.8, 1.5, 2.6],
  tour: [[120, 150], [200, 170], [280, 200], null],
  mount,
};

export default figure;
