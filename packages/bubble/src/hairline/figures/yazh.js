/**
 * Yazh (யாழ்): the bow harp of the Sangam poems, after which the yazh of
 * each tinai is named. A boat-shaped resonator, a neck that rises from one
 * end and bends forward over it, ending in a curl, and seven strings between
 * them. The pointer's place along the instrument picks a string and plucks
 * it; its neighbours sound in sympathy, later and softer the further they
 * are. At rest the longest string is lit. The slider is the stagger of the
 * sympathy, in milliseconds.
 *
 * Rules leaned on: 01 (the pick reads the strings' rest positions),
 * 02 (stagger by distance), 04 (the plucked string is the bright stroke),
 * 07 (the loop sleeps once the strings are still), 09 (the resonator is the
 * hull of its keel and its deck, with one crease).
 */
import HL from "../kernel.js";

const {
  Cam, fit, proj, facing, rings, rrect, ringAt, run, hull, poly, open, prism,
  mk, solid, put, pointer, register, disposer,
} = HL;

const N = 7, DECK = 9, PB = 4, AMP = 4.2, DECAY = 0.9;

/** cubic Bézier in the x–z plane */
function bez(a, b, c, d, t) {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stagger = value;

  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-74, -20, -PB], [64, 20, -PB], [-74, 20, -PB], [64, -20, -PB], [-60, 0, 112], [30, 0, 112]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a low plate for it to rest on
  const [pr, pi] = rings(-74, -22, 64, 22, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // the resonator: hull of a narrow keel and a wide deck, one crease on the deck
  const keel = rrect(-50, -7, 50, 7, 7, 6);
  const deck = rrect(-60, -13, 58, 13, 13, 6);
  const lip = rrect(-58.6, -11.6, 56.6, 11.6, 11.6, 6);
  put(solid(g), {
    sil: poly(hull(ringAt(P, keel, 0).concat(ringAt(P, deck, DECK)))),
    crease: open(ringAt(P, run(lip, front), DECK)),
  });
  // the bridge the strings leave from
  mk("path", { class: "nf", d: open([P(-42, 0, DECK), P(46, 0, DECK)]) }, g);

  // the neck: a band along a curve that rises from the back and leans forward
  const A = [-54, DECK], B1 = [-74, 96], B2 = [6, 118], E = [50, 66];
  const spine = [];
  for (let k = 0; k <= 48; k++) spine.push(bez(A, B1, B2, E, k / 48));
  const band = (off) =>
    spine.map((p, k) => {
      const q = spine[Math.min(48, k + 1)], o = spine[Math.max(0, k - 1)];
      const dx = q[0] - o[0], dz = q[1] - o[1], l = Math.hypot(dx, dz) || 1;
      return P(p[0] - (dz / l) * off, 0, p[1] + (dx / l) * off);
    });
  const outer = band(2.6), inner = band(-2.6);
  mk("path", { class: "sil", d: poly(outer.concat(inner.reverse())) }, g);
  // the curl at the tip, where the carvers put a yali's head
  const curl = [];
  for (let k = 0; k <= 20; k++) {
    const a = -Math.PI / 2 + (k / 20) * Math.PI * 1.6, r = 7 - k * 0.22;
    curl.push(P(E[0] + 4 + Math.cos(a) * r, 0, E[1] - 4 - Math.sin(a) * r));
  }
  mk("path", { class: "nf sil", d: open(curl) }, g);

  // strings: from the bridge up to the neck, on the upper run of the curve
  const upper = spine.filter((_, k) => k > 14);
  const neckZ = (x) => upper.reduce((b, p) => (Math.abs(p[0] - x) < Math.abs(b[0] - x) ? p : b))[1];
  const strings = Array.from({ length: N }, (_, i) => {
    const x = -36 + i * 13;
    return { i, x, top: neckZ(x) - 2.6, el: mk("path", { class: "nf" }, g), amp: 0, t0: 0, phase: 0 };
  });
  const longest = strings.reduce((a, b) => (b.top > a.top ? b : a));

  function drawString(s, now) {
    const t = (now - s.t0) / 1000;
    const live = s.amp > 0 && t >= 0;
    const a = live ? s.amp * Math.exp(-t / DECAY) * Math.cos(t * 38 + s.phase) : 0;
    const pts = [];
    for (let k = 0; k <= 10; k++) {
      const u = k / 10;
      pts.push(P(s.x, a * Math.sin(Math.PI * u), DECK + (s.top - DECK) * u));
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

  // hit test on the strings' rest positions: nearest by screen x, within the instrument's height
  const restX = strings.map((s) => P(s.x, 0, (DECK + s.top) / 2)[0]);
  const yTop = P(0, 0, 120)[1], yBot = P(60, 0, -PB)[1] + 10;
  function hit([x, y]) {
    if (y < yTop || y > yBot) return -1;
    let best = -1, bd = Infinity;
    restX.forEach((rx, i) => { const d = Math.abs(x - rx); if (d < bd) { bd = d; best = i; } });
    return bd < 14 ? best : -1;
  }

  let act = -2;
  function pluck(a) {
    if (a === act) return;
    act = a;
    if (a < 0) { light(longest); read.textContent = "rest"; return; }
    const now = performance.now();
    for (const s of strings) {
      const d = Math.abs(s.i - a);
      if (d > 3) continue;
      s.amp = d === 0 ? AMP : AMP * 0.28 / d;
      s.t0 = now + d * stagger;
      s.phase = d * 0.7;
    }
    light(strings[a]);
    read.textContent = `string ${String(a + 1).padStart(2, "0")}`;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => pluck(hit(p)), leave: () => pluck(-1) }));
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
  means: "A Sangam yazh, the bow harp: the string under the pointer is plucked and its neighbours sound after it.",
  rules: [1, 2, 4, 7],
  range: [30, 60, 110],
  tour: [[150, 170], [190, 175], [235, 180], [270, 185], null],
  mount,
};

export default figure;
