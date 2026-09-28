const sm = (a, b, x) => clamp((x - a) / (b - a));

// sample n points on land inside a country's biggest ring (seeded => identical every frame/run)
function landPoints(c, ring, n, rnd) {
  const b = bbox(ring), out = []; let guard = 0;
  while (out.length < n && guard++ < 4000) { const p = [lerp(b[0], b[2], rnd()), lerp(b[1], b[3], rnd())]; if (inRing(p, ring)) out.push(p); }
  return out;
}

// ============ 6. POST-WAR: the car, the drive-in, the assembly line ============
SCENES.postwar = (root, T) => {
  const s = i => T.segs[i].t0;
  const G = k => h('div', { class: 'fill', id: 'g' + k }, root);
  const gA = G('A'), gB = G('B'), gC = G('C'), gD = G('D'), gE = G('E');

  // ---- A: the car. fast, loud, colour ----
  h('div', { class: 'fill', style: 'background:#F26B4F' }, gA);
  const rays = h('div', { class: 'a', style: `left:-500px;top:-700px;width:2900px;height:2900px;background:repeating-conic-gradient(rgba(255,255,255,.14) 0 7deg,transparent 7deg 14deg)` }, gA);
  h('div', { class: 'a', style: `left:0;top:790px;width:1920px;height:300px;background:${C.ink}` }, gA);
  const dashA = h('div', { class: 'a', style: `left:-240px;top:930px;width:2400px;height:22px;background:repeating-linear-gradient(90deg,${C.cream} 0 130px,transparent 130px 260px)` }, gA);
  const speed = Array.from({ length: 7 }, (_, i) => h('div', { class: 'a', style: `left:0;top:${300 + i * 68}px;width:${500 + (i % 3) * 260}px;height:10px;background:#fff;border-radius:6px;opacity:.85` }, gA));
  const carA = put(gA, carSVG(1000, C.teal), 960, 470, 1000, '', 'a cut');

  // ---- B: driving, scrolling suburbs, drive-in ----
  h('div', { class: 'fill', style: 'background:linear-gradient(#8ED0E6,#EAF6F3)' }, gB);
  const sun = h('div', { class: 'a', style: `left:1420px;top:110px;width:230px;height:230px;border-radius:50%;background:${C.mustard};box-shadow:0 0 0 24px rgba(242,182,50,.3)` }, gB);
  const hillP = 'M0 320' + Array.from({ length: 3 }, (_, i) => `Q${160 + i * 640} 120 ${320 + i * 640} 320T${640 + i * 640} 320`).join('') + 'V400H0Z';
  const hills = h('div', { class: 'a', style: 'left:0;top:440px;width:3840px;height:400px', html: `<svg viewBox="0 0 1920 400" width="3840" height="400" preserveAspectRatio="none"><path d="${hillP}" fill="#6FB39F" stroke="${C.ink}" stroke-width="4"/></svg>` }, gB);
  const cols = ['#F2B632', '#D6402D', '#F4EBD8', '#86B94A', '#F4A6B5'];
  const houseStrip = h('div', { class: 'a', style: 'left:0;top:590px;width:4600px;height:260px' }, gB);
  houseStrip.innerHTML = Array.from({ length: 16 }, (_, i) => `<svg style="position:absolute;left:${i * 300}px;top:0" viewBox="0 0 240 200" width="240" height="200">
    <rect x="20" y="80" width="200" height="110" fill="${cols[i % 5]}" ${ST}/><path d="M6 86L120 10L234 86Z" fill="#3b2f4a" ${ST}/><rect x="98" y="128" width="46" height="62" fill="${C.ink}"/><rect x="34" y="106" width="42" height="36" fill="#D6EEF2" ${ST.replace('5', '3')}/><rect x="164" y="106" width="42" height="36" fill="#D6EEF2" ${ST.replace('5', '3')}/></svg>`).join('');
  h('div', { class: 'a', style: `left:0;top:820px;width:1920px;height:260px;background:#2c2a28` }, gB);
  h('div', { class: 'a', style: `left:0;top:812px;width:1920px;height:14px;background:${C.cream}` }, gB);
  const dashB = h('div', { class: 'a', style: `left:-240px;top:950px;width:2400px;height:18px;background:repeating-linear-gradient(90deg,${C.mustard} 0 110px,transparent 110px 220px)` }, gB);
  const carB = put(gB, carSVG(760, C.ketchup), 600, 580, 760, '', 'a cut');
  const sign = h('div', { class: 'a cut', style: 'left:1500px;top:250px;width:420px;height:560px' }, gB);
  sign.innerHTML = `<div style="position:absolute;left:190px;top:140px;width:34px;height:420px;background:#555;border:5px solid ${C.ink}"></div>
    <div style="position:absolute;left:0;top:0;width:420px;height:210px;background:${C.mustard};border:8px solid ${C.ink};border-radius:20px;text-align:center;padding-top:36px"><div class="big" style="font-size:78px">Drive-in</div><div style="font:800 32px Inter;letter-spacing:.2em;margin-top:10px;color:${C.ketchup}">BURGERS &rarr;</div></div>`;

  // ---- C: menu shrinks, then the assembly line ----
  h('div', { class: 'fill', style: `background:${C.cream}` }, gC);
  h('div', { class: 'fill dots', style: 'opacity:.4' }, gC);
  const chip48 = put(gC, '<span class="chip" style="font-size:38px">1948 &middot; San Bernardino, California</span>', 960, 60, 1400, 'text-align:center', 'a');
  const board = h('div', { class: 'a cut', style: `left:260px;top:170px;width:1400px;height:760px;background:#22303a;border:14px solid ${C.ink};border-radius:14px` }, gC);
  const rnd = seeded(11);
  const bars = Array.from({ length: 24 }, (_, i) => h('div', { class: 'a', style: `left:${60 + Math.floor(i / 12) * 660}px;top:${64 + (i % 12) * 52}px;width:${300 + Math.floor(rnd() * 260)}px;height:26px;background:${C.cream};border-radius:6px;opacity:.85` }, board));
  const prices = bars.map((b, i) => h('div', { class: 'a', style: `left:${60 + Math.floor(i / 12) * 660 + 610}px;top:${64 + (i % 12) * 52}px;width:${20 + Math.floor(rnd() * 20)}px;height:26px;background:${C.mustard};border-radius:6px` }, board));
  const trio = [['Burgers', burgerSVG({ w: 300 }), 240], ['Fries', friesSVG(190), 700], ['Shakes', shakeSVG(170), 1160]].map(([n, svg, x], i) => {
    const el = h('div', { class: 'a', style: `left:${x - 200}px;top:${i === 0 ? 100 : 60}px;width:400px;text-align:center` }, board);
    el.innerHTML = `<div class="cut-s" style="height:340px;display:flex;align-items:flex-end;justify-content:center">${svg}</div><div class="big" style="font-size:70px;color:${C.cream};margin-top:34px">${n}</div>`;
    return el;
  });
  const belt = h('div', { class: 'a', style: `left:0;top:690px;width:1920px;height:96px;background:#2c2a28;border-top:8px solid ${C.ink};border-bottom:8px solid ${C.ink}` }, gC);
  const beltMk = h('div', { class: 'a', style: `left:-120px;top:732px;width:2200px;height:10px;background:repeating-linear-gradient(90deg,#8a8580 0 40px,transparent 40px 80px)` }, gC);
  const mach = [['Grill', C.ketchup, 420], ['Dress', C.mustard, 960], ['Wrap', C.teal, 1500]].map(([n, col, x]) => {
    const el = h('div', { class: 'a cut', style: `left:${x - 150}px;top:330px;width:300px;height:340px` }, gC);
    el.innerHTML = `<div style="position:absolute;inset:0;background:${col};border:8px solid ${C.ink};border-radius:16px"></div>
      <div style="position:absolute;left:40px;right:40px;top:36px;height:70px;background:rgba(255,255,255,.35);border:6px solid ${C.ink};border-radius:8px"></div>
      <div class="big" style="position:absolute;left:0;right:0;top:150px;text-align:center;font-size:64px;color:${n === 'Dress' ? C.ink : '#fff'}">${n}</div>`;
    return el;
  });
  const items = [0, 1, 2].map(() => {
    const el = h('div', { class: 'a', style: 'left:0;top:594px;width:170px;height:100px' }, gC);
    el.innerHTML = `<div class="p0" style="position:absolute;left:20px;top:40px;width:130px;height:44px;border-radius:24px;background:${C.patty};border:5px solid ${C.ink}"></div>
      <div class="p1" style="position:absolute;left:0;top:0;width:170px">${burgerSVG({ w: 170 })}</div>
      <div class="p2" style="position:absolute;left:14px;top:22px;width:142px;height:68px;background:${C.paper};border:5px solid ${C.ink};border-radius:10px"><div style="margin:20px 0 0 0;height:14px;background:${C.ketchup}"></div></div>`;
    return { el, p: [$(el, '.p0'), $(el, '.p1'), $(el, '.p2')] };
  });

  // ---- D: Ray Kroc / 1955 ----
  h('div', { class: 'fill', style: `background:${C.mustard}` }, gD);
  h('div', { class: 'fill dots', style: 'opacity:.5' }, gD);
  const mixer = put(gD, mixerSVG(800), 640, 240, 800, '', 'a cut');
  const blades = $$(mixer, '.blade');
  const salesman = put(gD, 'milkshake-machine salesman', 640, 740, 900, `font-size:86px;color:${C.ink};text-align:center;transform:rotate(-2deg)`, 'a hand');
  const ray = put(gD, '<span class="chip" style="font-size:66px;padding:26px 50px">Ray Kroc</span>', 1440, 340, 700, 'text-align:center', 'a');
  const shop = put(gD, shopSVG(700), 520, 220, 700, '', 'a cut');
  const y55 = put(gD, '1955', 1350, 150, 700, `font-size:270px;color:${C.ink};text-align:center;text-shadow:10px 11px 0 ${C.ketchup}`, 'a big');
  const dp = put(gD, '<span class="chip red" style="font-size:52px;padding:22px 40px">Des Plaines, Illinois</span>', 1350, 520, 900, 'text-align:center', 'a');

  // ---- E: the dots multiply ----
  h('div', { class: 'fill', style: `background:${C.teal}` }, gE);
  h('div', { class: 'fill dots-w', style: 'opacity:.6' }, gE);
  const MAP = usMap(30, (1920 - 59 * 30 * Math.cos(38 * Math.PI / 180)) / 2, 150);
  h('div', { class: 'a cut', style: `left:${MAP.proj(-125, 50.5)[0]}px;top:${MAP.proj(-125, 50.5)[1]}px`, html: MAP.svgHTML }, gE);
  const us = WORLD.find(c => c.name === 'United States of America');
  const main = us.polys.filter(r => bbox(r)[0] > -130 && bbox(r)[1] > 24).sort((a, b) => b.length - a.length)[0];
  const r2 = seeded(5), pts = landPoints(us, main, 320, r2);
  const N = 8.3, dotsE = pts.map((p, k) => { const [x, y] = MAP.proj(p[0], p[1]); return { tk: 23.7 + Math.log2(k + 1) / N * 2.4, el: h('div', { class: 'a', style: `left:${x - 11}px;top:${y - 11}px;width:22px;height:22px;border-radius:50%;background:${k % 3 ? C.mustard : C.ketchup};border:4px solid ${C.ink}` }, gE) }; });

  return t => {
    const ph = t < 2.6 ? 'A' : t < 7.65 ? 'B' : t < 16.3 ? 'C' : t < 23.4 ? 'D' : 'E';
    [['A', gA], ['B', gB], ['C', gC], ['D', gD], ['E', gE]].forEach(([k, g]) => g.style.display = k === ph ? 'block' : 'none');

    if (ph === 'A') {
      tf(rays, { r: t * 9 });
      const u = P(t, .35, 1.9, E.io);
      tf(carA, { x: lerp(-1300, 1300, u), y: Math.sin(t * 30) * 4, r: -1.5 });
      $$(carA, '.wheel').forEach(w => { w.style.transformBox = 'fill-box'; w.style.transformOrigin = '50% 50%'; w.style.transform = `rotate(${t * 900}deg)`; });
      speed.forEach((b, i) => tf(b, { x: lerp(-700, 2400, clamp(((t * 1.6 + i * .21) % 1))) * (u > 0 && u < 1 ? 1 : 0) }));
      tf(dashA, { x: -((t * 2400) % 260) });
    }
    if (ph === 'B') {
      const lt = t - 2.6;
      tf(hills, { x: -((lt * 70) % 1280) });
      tf(houseStrip, { x: -((lt * 300) % 1200) });
      tf(dashB, { x: -((lt * 620) % 220) });
      const ci = P(t, 2.6, .5, E.out);
      tf(carB, { x: lerp(-500, 0, ci), y: Math.sin(lt * 9) * 3, r: Math.sin(lt * 4) * .6 });
      $$(carB, '.wheel').forEach(w => { w.style.transformBox = 'fill-box'; w.style.transformOrigin = '50% 50%'; w.style.transform = `rotate(${lt * 500}deg)`; });
      tf(sun, { s: 1 + .03 * Math.sin(lt * 2) });
      const sp = P(t, 5.9, 1.3, E.out5);
      tf(sign, { x: (1 - sp) * 700, o: sp > 0 ? 1 : 0 });
    }
    if (ph === 'C') {
      const cp = pop(t, 7.95, .45);
      tf(chip48, { s: cp, o: clamp(cp * 3) * (1 - P(t, 14.1, .3)) });
      const bp = P(t, 8.05, .7, E.out5), bex = P(t, 14.1, .5, E.in);
      tf(board, { y: (1 - bp) * 1100 + bex * 1100, r: lerp(-3, 0, bp), o: 1 });
      bars.forEach((b, i) => { const on = P(t, 8.5 + i * .04, .2), off = P(t, 10.7 + ((i * 7) % 24) * .05, .2, E.in); tf(b, { x: -off * 30, o: on * (1 - off) }); tf(prices[i], { o: on * (1 - off) }); });
      trio.forEach((el, i) => { const p = pop(t, 11.9 + i * .55, .5); tf(el, { s: p, y: (1 - p) * 60, o: clamp(p * 3) }); });
      // assembly line (from 13.8)
      const mv = P(t, 14.3, .5, E.out5);
      [belt, beltMk].forEach((e, i) => tf(e, { y: (1 - mv) * 300 + (i ? 0 : 0), o: mv }));
      tf(beltMk, { x: -((t * 340) % 80), y: (1 - mv) * 300, o: mv });
      mach.forEach((m, i) => { const p = pop(t, 14.4 + i * .18, .5); tf(m, { s: p, y: (1 - p) * -60, o: clamp(p * 3) }); });
      items.forEach((it, i) => {
        const x = ((t - 14.7) * 340 + i * 640) % 1920 - 130;
        const st = x < 610 ? 0 : x < 1340 ? 1 : 2;
        it.p.forEach((e, j) => e.style.display = j === st ? 'block' : 'none');
        tf(it.el, { x, y: st === 1 ? -10 : 0, o: t > 14.7 && x > -125 ? 1 : 0 });
      });
    }
    if (ph === 'D') {
      const mp = pop(t, 16.45, .55), out = P(t, 19.7, .5, E.in);
      tf(mixer, { x: -1300 * out, y: (1 - mp) * 90, s: mp, o: clamp(mp * 3) });
      blades.forEach((b, i) => { b.style.transformBox = 'fill-box'; b.style.transformOrigin = '50% 50%'; b.style.transform = `scaleX(${.35 + .65 * Math.abs(Math.cos(t * 22 + i * 1.3))})`; });
      const sp = pop(t, 16.9, .45);
      tf(salesman, { x: -1300 * out, s: sp, r: -2, o: clamp(sp * 3) });
      const rp = pop(t, s(3) + 1.4, .45);
      tf(ray, { x: 900 * out, s: rp, r: 3, o: clamp(rp * 3) * (1 - out) });
      const shp = P(t, 19.8, .6, E.out5);
      tf(shop, { x: (1 - shp) * -1300, y: (1 - shp) * 0, o: shp });
      const yp = pop(t, 20.1, .5);
      tf(y55, { s: yp, r: -3, o: clamp(yp * 3) });
      const dpp = pop(t, 21.6, .45);
      tf(dp, { s: dpp, r: 3, o: clamp(dpp * 3) });
    }
    if (ph === 'E') {
      dotsE.forEach(d => { const p = pop(t, d.tk, .3); tf(d.el, { s: p, o: t >= d.tk ? 1 : 0 }); });
    }
  };
};

// ============ 7. GLOBAL: the dots go worldwide; the Big Mac Index ============
SCENES.global = (root, T) => {
  const s = i => T.segs[i].t0;
  h('div', { class: 'fill', style: 'background:radial-gradient(ellipse at 50% 45%,#1f2c3a,#0d141c)' }, root);
  const X = lon => (lon + 170) / 360 * W, Y = lat => 170 + (84 - lat) * (W / 360);
  const mapEl = h('div', { class: 'a', style: 'left:0;top:0;width:1920px;height:1080px' }, root);
  const paths = countryPaths((lon, lat) => [X(lon), Y(lat)], (c, r) => c.name !== 'Antarctica' && (bbox(r)[2] - bbox(r)[0]) < 300);
  mapEl.innerHTML = `<svg viewBox="0 0 1920 1080" width="1920" height="1080">${paths.map(o => `<path d="${o.d}" fill="#26333f" stroke="#3f5266" stroke-width="1.6" stroke-linejoin="round"/>`).join('')}</svg>`;
  const hero = h('div', { class: 'a' }, root);
  h('div', { class: 'a', style: 'left:410px;top:60px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(242,182,50,.35),transparent 62%)' }, hero);
  const bigmac = put(hero, burgerSVG({ w: 520, mode: 'bigmac' }), 960, 170, 520, '', 'a cut');
  const heroChip = put(hero, '<span class="chip gold" style="font-size:44px;padding:20px 36px">The Big Mac &middot; 1967</span>', 960, 830, 900, 'text-align:center', 'a');

  // restaurant dots, ordered by distance from the US so they ripple outward
  const rnd = seeded(23), dots = [], US = [-98, 39];
  WORLD.forEach(c => {
    if (c.name === 'Antarctica' || c.name.startsWith('Fr. S.')) return;
    const ring = largestRing(c), b = bbox(ring), n = clamp(Math.round(Math.sqrt((b[2] - b[0]) * (b[3] - b[1])) / 9), 1, 7);
    landPoints(c, ring, n, rnd).forEach(p => dots.push({ p, d: Math.hypot((p[0] - US[0]) * .8, p[1] - US[1]) }));
  });
  const dmax = Math.max(...dots.map(d => d.d));
  dots.forEach(d => { d.tk = 3.2 + Math.pow(d.d / dmax, .9) * 4.2 + rnd() * .25; d.el = h('div', { class: 'a', style: `left:${X(d.p[0]) - 8}px;top:${Y(d.p[1]) - 8}px;width:16px;height:16px;border-radius:50%;background:${rnd() > .5 ? C.mustard : C.ketchup};box-shadow:0 0 14px 4px rgba(242,182,50,.55)` }, root); });

  const band = h('div', { class: 'a', style: 'left:0;top:930px;width:1920px;height:150px;background:linear-gradient(transparent,rgba(8,12,17,.92) 40%)' }, root);
  const c1 = h('div', { class: 'a', style: 'left:150px;top:945px;width:800px;display:flex;align-items:center;gap:24px' }, root);
  const n1 = h('div', { class: 'big', style: `font-size:120px;color:${C.cream}` }, c1); h('span', { class: 'chip gold', html: 'restaurants', style: 'font-size:30px' }, c1);
  const c2 = h('div', { class: 'a', style: 'left:1090px;top:945px;width:800px;display:flex;align-items:center;gap:24px' }, root);
  const n2 = h('div', { class: 'big', style: `font-size:120px;color:${C.cream}` }, c2); h('span', { class: 'chip red', html: 'countries', style: 'font-size:30px' }, c2);
  const idxChip = put(root, '<span class="chip gold" style="font-size:46px;padding:20px 38px">The Big Mac Index</span>', 960, 60, 900, 'text-align:center', 'a');
  const idxSub = put(root, '1986 &middot; The Economist', 960, 168, 900, `font:800 30px Inter;letter-spacing:.2em;text-transform:uppercase;color:${C.cream};text-align:center;opacity:.85`, 'a');
  const cur = [['$', -100, 40], ['€', 15, 47], ['£', -9, 56], ['¥', 147, 41], ['₹', 79, 23], ['R$', -52, -11], ['₩', 124, 33], ['A$', 134, -25]].map(([sym, lon, lat], i) => {
    const el = h('div', { class: 'a', style: `left:${X(lon) - 52}px;top:${Y(lat) - 52}px;width:104px;height:104px` }, root);
    el.innerHTML = `<div class="big cut-s" style="width:104px;height:104px;border-radius:50%;background:${C.cream};border:7px solid ${C.ink};display:flex;align-items:center;justify-content:center;font-size:${sym.length > 1 ? 40 : 54}px;letter-spacing:0">${sym}</div>
      <div class="cut-s" style="position:absolute;left:62px;top:-26px">${burgerSVG({ w: 56 })}</div>`;
    return el;
  });

  return t => {
    const hp = pop(t, .4, .6), hex = P(t, 2.9, .5, E.in);
    tf(hero, { y: hex * 80, s: lerp(1, .6, hex), o: (1 - hex) });
    tf(bigmac, { y: (1 - hp) * 150, s: hp, r: (1 - hp) * -10, o: clamp(hp * 3) });
    tf(heroChip, { s: pop(t, .9, .4), o: clamp(pop(t, .9, .4) * 3) });
    mapEl.style.opacity = P(t, 2.9, .6);
    const dim = 1 - .55 * P(t, 8.9, .6);
    dots.forEach(d => { const p = pop(t, d.tk, .45); tf(d.el, { s: p * (1 + .0), o: (t >= d.tk ? 1 : 0) * dim }); });
    band.style.opacity = P(t, 3.6, .5) * (1 - P(t, 8.9, .4));
    tf(c1, { o: P(t, 3.6, .5) * (1 - P(t, 8.9, .4)), y: (1 - P(t, 3.6, .5)) * 30 });
    const a1 = P(t, 4.5, 1.5, E.io);
    n1.textContent = fmt(a1 * 40000) + (a1 >= 1 ? '+' : '');
    tf(c2, { o: P(t, 7.2, .5) * (1 - P(t, 8.9, .4)), y: (1 - P(t, 7.2, .5)) * 30 });
    const a2 = P(t, 7.3, .9, E.io);
    n2.textContent = Math.round(a2 * 100) + (a2 >= 1 ? '+' : '');
    const ip = pop(t, 9.0, .45);
    tf(idxChip, { s: ip, o: clamp(ip * 3) });
    tf(idxSub, { y: (1 - P(t, 9.4, .4)) * 16, o: P(t, 9.4, .4) });
    cur.forEach((c, i) => { const p = pop(t, 11.3 + i * .48, .45); tf(c, { s: p, r: (i % 2 ? 1 : -1) * 6 * (1 - p), o: clamp(p * 3) }); });
  };
};
