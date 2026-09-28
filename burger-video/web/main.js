// ---- frame renderer: window.renderFrame(n) draws frame n (30 fps) deterministically ----
const SC = [];           // built scenes
let ready = false;

function boot() {
  const host = document.getElementById('scenes');
  TIMELINE.scenes.forEach(T => {
    const root = h('div', { class: 'scene', id: 'sc-' + T.id }, host);
    const def = SCENES[T.id];
    if (!def) throw new Error('no scene ' + T.id);
    const update = def(root, T);
    SC.push({ T, root, update });
  });
  ready = true;
}

// ---- footage: clips listed in footage/manifest.js are pre-extracted to frame sequences by render.py ----
// {scene, t0, t1, dir, frames, mode: 'full'|'window', rect:[x,y,w,h], rot, treatment}
function drawFootage(scene, tl) {
  const box = document.getElementById('footage');
  const items = (window.FOOTAGE || []).filter(f => f.scene === scene.T.id && tl >= f.t0 && tl <= f.t1);
  box.style.display = items.length ? 'block' : 'none';
  box.innerHTML = '';
  const jobs = [];
  items.forEach(f => {
    const idx = Math.min(f.frames - 1, Math.floor((tl - f.t0) * FPS * (f.speed || 1)) % f.frames);
    const url = `../build/footage/${f.dir}/${String(idx + 1).padStart(5, '0')}.jpg`;
    const fin = clamp((tl - f.t0) / .35), fout = clamp((f.t1 - tl) / .35);
    const c = h('div', { class: 'clip' }, box);
    const [x, y, w, hh] = f.mode === 'window' ? f.rect : [0, 0, W, H];
    c.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;background-image:url(${url});opacity:${fin * fout};` +
      (f.mode === 'window' ? `transform:rotate(${f.rot || 0}deg) scale(${.94 + .06 * fin});border:14px solid #FBF6EA;box-shadow:10px 12px 0 rgba(0,0,0,.3);` : '') +
      // "archival" treatment so mixed sources feel like one film
      `filter:${f.filter || 'sepia(.35) contrast(1.08) saturate(.85)'};`;
    if (f.mode === 'full') {   // vignette-y multiply tint so overlays stay legible
      h('div', { class: 'fill', style: 'background:linear-gradient(rgba(20,12,4,.35),rgba(20,12,4,.15) 50%,rgba(20,12,4,.45))' }, c);
    }
    jobs.push(new Promise(res => { const im = new Image(); im.onload = im.onerror = res; im.src = url; }));
  });
  return Promise.all(jobs);
}

window.renderFrame = async function (n) {
  if (!ready) boot();
  const t = n / FPS;
  let cur = SC[SC.length - 1];
  for (const s of SC) if (t >= s.T.start && t < s.T.start + s.T.dur) { cur = s; break; }
  SC.forEach(s => { s.root.style.display = s === cur ? 'block' : 'none'; });
  const tl = t - cur.T.start;
  cur.update(tl);
  await drawFootage(cur, tl);
  // grain jitter so it "boils" like film
  const r = seeded(n * 7 + 3);
  document.getElementById('grain').style.transform = `translate(${Math.floor(r() * 180)}px,${Math.floor(r() * 180)}px)`;
  // global fade in / out
  const total = TIMELINE.total;
  document.getElementById('fade').style.opacity = Math.max(1 - clamp(t / .6), clamp((t - (total - 1.6)) / 1.4));
  await document.fonts.ready;
  return true;
};
window.TOTAL_FRAMES = Math.ceil(TIMELINE.total * FPS);
