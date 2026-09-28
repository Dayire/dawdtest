// ---- tiny animation toolkit: every scene is a pure function of time ----
const W = 1920, H = 1080, FPS = 30;
const C = {
  ink: '#1d1a17', cream: '#F4EBD8', paper: '#FBF6EA', ketchup: '#D6402D', mustard: '#F2B632',
  pickle: '#5E8C3A', lettuce: '#86B94A', bun: '#E29A3F', bunHi: '#F2BE73', patty: '#6A3A21',
  cheese: '#F7C948', tomato: '#D9432F', teal: '#2B7A78', sky: '#A9CBC4', steel: '#B8C0C6',
};
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  lin: t => t,
  out: t => 1 - Math.pow(1 - t, 3),
  out5: t => 1 - Math.pow(1 - t, 5),
  in: t => t * t * t,
  io: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  elastic: t => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1),
  bounce: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; },
};
// progress of an animation that starts at t0 and lasts d seconds
const P = (t, t0, d, f = E.out) => f(clamp((t - t0) / d));
// 1 while t in [a,b], with soft fades of length f at both ends
const win = (t, a, b, f = .25) => clamp((t - a) / f) * clamp((b - t) / f);
const seeded = (s => () => (s = (s * 16807) % 2147483647) / 2147483647);

function h(tag, attrs = {}, parent) {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'style') e.style.cssText = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k];
    else if (k === 'text') e.textContent = attrs[k];
    else e.setAttribute(k, attrs[k]);
  }
  if (parent) parent.appendChild(e);
  return e;
}
// place an element (absolutely positioned) by its centre
function put(parent, html, x, y, w, extra = '', cls = 'a') {
  const e = h('div', { class: cls, style: `left:${x - w / 2}px;top:${y}px;width:${w}px;${extra}`, html });
  parent.appendChild(e);
  return e;
}
function tf(e, { x = 0, y = 0, s = 1, sx, sy, r = 0, o = 1 } = {}) {
  e.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${sx ?? s},${sy ?? s})`;
  e.style.opacity = o;
}
// same but for elements inside an <svg>
function stf(e, { x = 0, y = 0, s = 1, sx, sy, r = 0, o = 1 } = {}) {
  e.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${sx ?? s},${sy ?? s})`;
  e.style.opacity = o;
}
const $ = (root, sel) => root.querySelector(sel);
const $$ = (root, sel) => [...root.querySelectorAll(sel)];

// pop-in: overshoot scale, used for chips, cards, icons
function pop(t, t0, d = .45) { return P(t, t0, d, E.back); }
// count-up formatted with thousands separators
const fmt = n => Math.round(n).toLocaleString('en-US');

// ---- map helpers ----
const merc = lat => (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
function ringPath(ring, proj) {
  let d = '';
  ring.forEach(([lon, lat], i) => { const [x, y] = proj(lon, lat); d += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2); });
  return d + 'Z';
}
function countryPaths(proj, filter = () => true) {
  return WORLD.map(c => ({ c, d: c.polys.filter(r => filter(c, r)).map(r => ringPath(r, proj)).join('') })).filter(o => o.d);
}
const bbox = ring => ring.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [1e9, 1e9, -1e9, -1e9]);
function largestRing(c) { return c.polys.reduce((a, b) => (bbox(b)[2] - bbox(b)[0]) * (bbox(b)[3] - bbox(b)[1]) > (bbox(a)[2] - bbox(a)[0]) * (bbox(a)[3] - bbox(a)[1]) ? b : a); }
function centroid(ring) { const b = bbox(ring); return [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]; }

// deterministic point-in-polygon for scattering dots on land
function inRing(pt, ring) {
  let ins = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}
