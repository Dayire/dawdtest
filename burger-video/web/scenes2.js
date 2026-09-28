// contiguous-US map projection shared by two scenes (equirectangular, lon scaled by cos(38deg))
function usMap(k, x0, y0) {
  const kx = k * Math.cos(38 * Math.PI / 180);
  const proj = (lon, lat) => [(lon + 125) * kx, (50.5 - lat) * k];
  const inBox = r => { const b = bbox(r); return b[0] > -135 && b[2] < -50 && b[1] > 10 && (b[2] - b[0]) < 100; };
  const paths = countryPaths(proj, (c, r) => inBox(r) || (c.name === 'Canada' && bbox(r)[0] < -100 && bbox(r)[2] > -60) || (c.name === 'United States of America' && bbox(r)[0] > -130 && bbox(r)[1] > 24));
  const wpx = 59 * kx, hpx = 27 * k;
  const svgHTML = `<svg viewBox="0 0 ${wpx} ${hpx}" width="${wpx}" height="${hpx}" style="overflow:hidden;display:block">` +
    paths.map(o => {
      const us = o.c.name === 'United States of America';
      return `<path d="${o.d}" fill="${us ? C.cream : 'rgba(0,0,0,.18)'}" stroke="${C.ink}" stroke-width="${us ? 3.5 : 2}" stroke-linejoin="round"/>`;
    }).join('') + '</svg>';
  return { proj: (lon, lat) => { const p = proj(lon, lat); return [p[0] + x0, p[1] + y0]; }, svgHTML, wpx, hpx };
}

// ============ 4. WHO INVENTED IT: five rival claims, no receipts ============
SCENES.claims = (root, T) => {
  const s = i => T.segs[i].t0;
  h('div', { class: 'fill', style: `background:${C.teal}` }, root);
  h('div', { class: 'fill dots-w', style: 'opacity:.6' }, root);
  const q = put(root, '?', 1500, -120, 900, `font-size:1100px;color:rgba(0,0,0,.14)`, 'a big');
  const head = h('div', { class: 'a big', html: 'Who invented<br>the burger?', style: `left:120px;top:330px;font-size:150px;color:${C.cream};transform-origin:0 0;text-shadow:8px 9px 0 rgba(0,0,0,.28)` }, root);

  const MAP = usMap(19.5, 1350 - 59 * 19.5 * Math.cos(38 * Math.PI / 180) / 2, 250);
  const mapEl = h('div', { class: 'a cut', style: `left:${MAP.proj(-125, 50.5)[0]}px;top:${MAP.proj(-125, 50.5)[1]}px`, html: MAP.svgHTML }, root);

  const claims = [
    { yr: '1885', who: 'Charlie Nagreen', where: 'Seymour, Wisconsin', ll: [-88.33, 44.51], rot: -4 },
    { yr: '1885', who: 'The Menches brothers', where: 'Hamburg, New York', ll: [-78.83, 42.72], rot: 3 },
    { yr: '1891', who: 'Oscar Weber Bilby', where: 'Tulsa, Oklahoma', ll: [-95.99, 36.15], rot: -2 },
    { yr: '1900', who: 'Louis Lassen', where: 'New Haven, Connecticut', ll: [-72.93, 41.31], rot: 4 },
    { yr: '1880s', who: 'Fletcher Davis', where: 'Athens, Texas', ll: [-95.83, 32.2], rot: -3 },
  ];
  const cards = claims.map(c => {
    const el = h('div', { class: 'a cut', style: `left:260px;top:340px;width:640px;height:390px;background:${C.paper};border:8px solid ${C.ink};padding:26px 36px` }, root);
    el.innerHTML = `<div class="big" style="font-size:${c.yr.length > 4 ? 150 : 190}px;height:190px;display:flex;align-items:center;color:${C.ketchup};letter-spacing:-.02em">${c.yr}</div>
      <div style="font:800 40px Inter;margin-top:8px">${c.who}</div>
      <div style="font:600 32px Inter;opacity:.7;margin-top:6px">${c.where}</div>`;
    return el;
  });
  const pins = claims.map(c => { const [x, y] = MAP.proj(...c.ll); return { x, y, el: h('div', { class: 'a', html: pinSVG(46), style: 'transform-origin:50% 100%' }, root), ring: h('div', { class: 'a', style: 'width:90px;height:90px;border-radius:50%;border:5px solid #D6402D' }, root) }; });
  const dim = h('div', { class: 'fill', style: 'background:rgba(10,50,50,.72)' }, root);
  const stamp = put(root, '<div style="border:16px solid #D6402D;padding:14px 40px;border-radius:14px;transform:rotate(-9deg);background:#F4EBD8">NO<br>RECEIPTS</div>', 960, 330, 900, `font-size:170px;color:#D6402D;text-align:center;text-shadow:6px 7px 0 rgba(0,0,0,.3);background:none`, 'a big');

  return t => {
    tf(q, { y: 120 + 20 * Math.sin(t), o: 1 });
    const hp = pop(t, .6, .6);
    const shrink = P(t, 3.4, .7, E.io);
    head.style.transform = `translate(${lerp(0, -70, shrink)}px,${lerp(0, -280, shrink)}px) scale(${lerp(hp, .4, shrink)})`;
    head.style.opacity = clamp(hp * 3);
    const mp = P(t, 3.7, .8, E.out5);
    tf(mapEl, { x: (1 - mp) * 900, o: mp });

    const idx = i => s(2 + i);
    cards.forEach((c, i) => {
      const t0 = idx(i), p = P(t, t0, .32, E.out5), age = claims.reduce((n, _, j) => n + (j > i && t >= idx(j) ? 1 : 0), 0);
      const back = t >= t0 ? age : 0;
      tf(c, { x: -34 * back - 20 + (i % 2 ? 14 : 0), y: -26 * back + (1 - p) * -260, s: lerp(1.5, 1, p), r: claims[i].rot * (1 + back * .4), o: t >= t0 ? clamp(p * 4) : 0 });
    });
    pins.forEach((p, i) => {
      const t0 = idx(i) + .12, k = P(t, t0, .5, E.bounce);
      tf(p.el, { x: p.x - 23, y: p.y - 56 - (1 - k) * 150, o: t >= t0 ? 1 : 0 });
      const rk = clamp((t - t0 - .3) / .9);
      tf(p.ring, { x: p.x - 45, y: p.y - 45, s: .2 + rk * 1.1, o: t >= t0 + .3 ? (1 - rk) * .9 : 0 });
    });
    // punchline
    const sp = P(t, s(7) + .05, .22, E.out5);
    tf(stamp, { s: lerp(3.2, 1, sp), o: sp > 0 ? 1 : 0 });
    dim.style.opacity = P(t, s(7) + .1, .3);
    const shake = t > s(7) + .2 && t < s(7) + .6 ? Math.sin(t * 90) * 10 * (1 - (t - s(7) - .2) / .4) : 0;
    root.style.transform = `translate(${shake}px,${shake * .6}px)`;
  };
};

// ============ 5. 1906 crash, then the clean white castle ============
SCENES.reputation = (root, T) => {
  const s = i => T.segs[i].t0;
  const gA = h('div', { class: 'fill' }, root), gB = h('div', { class: 'fill' }, root);

  // ---------- A: murky ----------
  h('div', { class: 'fill', style: 'background:linear-gradient(#2b241d 0%,#4a4028 62%,#6b5a30 100%)' }, gA);
  h('div', { class: 'fill dots-w', style: 'opacity:.35' }, gA);
  const yr = put(gA, '1906', 620, 200, 1100, `font-size:330px;color:${C.cream};text-align:center;text-shadow:10px 11px 0 rgba(0,0,0,.45)`, 'a big');
  const burger = put(gA, burgerSVG({ w: 520 }), 1440, 260, 520, 'filter:sepia(.75) saturate(.55) brightness(.82) drop-shadow(9px 11px 0 rgba(0,0,0,.4))', 'a');
  const qs = [[1180, 160, 110], [1700, 210, 130], [1360, 90, 90]].map(([x, y, sz]) => put(gA, '?', x, y, 200, `font-size:${sz * 1.6}px;color:${C.ketchup};text-align:center;text-shadow:5px 6px 0 rgba(0,0,0,.4)`, 'a big'));
  const eyes = h('div', { class: 'a', style: 'left:1320px;top:290px;width:240px;height:110px' }, gA);
  eyes.innerHTML = [0, 1].map(i => `<div style="position:absolute;left:${i * 132}px;top:0;width:108px;height:108px;border-radius:50%;background:#fff;border:6px solid ${C.ink};overflow:hidden"><div class="pu" style="position:absolute;left:34px;top:34px;width:40px;height:40px;border-radius:50%;background:${C.ink}"></div></div>`).join('');
  const pupils = $$(eyes, '.pu');
  const book = h('div', { class: 'a cut', style: `left:330px;top:290px;width:400px;height:560px;background:#7A1F1A;border:8px solid #3a0d0b;border-radius:8px 18px 18px 8px;padding:40px 30px;text-align:center;color:#E9C46A` }, gA);
  book.innerHTML = `<div style="border:4px solid #E9C46A;height:100%;padding:34px 16px"><div class="serif" style="font-size:78px;line-height:.95">THE<br>JUNGLE</div><div style="height:4px;background:#E9C46A;margin:34px 40px"></div><div style="font:800 28px Inter;letter-spacing:.2em">UPTON<br>SINCLAIR</div></div>`;
  const factory = h('div', { class: 'a', style: 'left:0;top:790px;width:1920px', html: factorySVG(1920) }, gA);
  const smoke = Array.from({ length: 9 }, (_, i) => h('div', { class: 'a', style: `left:${[170, 400, 730][i % 3] - 40}px;top:760px;width:80px;height:80px;border-radius:50%;background:#7c746a` }, gA));

  // ---------- transition ----------
  const panel = h('div', { class: 'fill', style: 'background:#fff;z-index:60;transform:scaleX(0)' }, root);

  // ---------- B: clean ----------
  h('div', { class: 'fill', style: 'background:linear-gradient(#EAF4F7,#CFE6EC)' }, gB);
  h('div', { class: 'fill dots', style: 'opacity:.18' }, gB);
  const castle = put(gB, castleSVG(1080), 960, 210, 1080, '', 'a cut');
  const chip = put(gB, '<span class="chip" style="font-size:38px">White Castle &middot; Wichita, Kansas &middot; 1921</span>', 960, 120, 1400, 'text-align:center', 'a');
  const sparks = [[330, 330, 60], [1590, 300, 74], [640, 250, 44], [1300, 230, 52], [260, 640, 46], [1660, 650, 56]].map(([x, y, sz]) => put(gB, sparkle(sz * 1.5, C.mustard), x, y, sz * 1.5, '', 'a'));
  const grill = put(gB, grillWindowSVG(1100), 960, 170, 1100, '', 'a cut');
  const steam = $$(grill, '.st');
  const shine = h('div', { class: 'a', style: 'left:400px;top:190px;width:120px;height:420px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);transform:skewX(-20deg);mix-blend-mode:screen' }, gB);
  const nothing = put(gB, 'nothing to hide', 960, 770, 1400, `font-size:170px;color:${C.ink};text-align:center;transform:rotate(-3deg)`, 'a hand');
  const und = h('div', { class: 'a', style: `left:560px;top:975px;width:800px;height:16px;background:${C.ketchup};transform-origin:left;border-radius:8px` }, gB);

  return t => {
    const A = t < 14.5;
    gA.style.display = A ? 'block' : 'none'; gB.style.display = A ? 'none' : 'block';
    // wipe: covers left->right (14.0-14.5), then uncovers (14.5-15.1)
    const cov = P(t, 14.0, .5, E.io), unc = P(t, 14.55, .55, E.io);
    panel.style.transformOrigin = t < 14.5 ? 'left center' : 'right center';
    panel.style.transform = `scaleX(${t < 14.5 ? cov : 1 - unc})`;

    if (A) {
      const yp = pop(t, .7, .55), shr = P(t, s(1) - .1, .6, E.io);
      tf(yr, { x: lerp(0, -430, shr), y: lerp(0, -170, shr), s: lerp(yp, .42, shr), o: clamp(yp * 3) });
      const bp = pop(t, 1.5, .6), toC = P(t, 11.2, .7, E.io);
      tf(burger, { x: lerp(0, -480, toC), y: lerp(0, 60, toC) + (1 - bp) * 140, s: lerp(bp, 1.25, toC), o: clamp(bp * 3) });
      qs.forEach((q, i) => { const p = pop(t, 2.0 + i * .2, .4) * (1 - P(t, 3.3, .3)) + pop(t, 8.6 + i * .3, .4) * (1 - P(t, 11.2, .3)); tf(q, { s: p, r: (i - 1) * 12 + Math.sin(t * 3 + i) * 5, o: clamp(p * 3) }); });
      const bk = P(t, s(1) + .1, .8, E.out5), bex = P(t, 11.1, .5, E.in);
      tf(book, { x: (1 - bk) * -900 - bex * 900, r: lerp(-9, -5, bk), o: bk });
      const fa = P(t, 5.6, .9, E.out5), fex = P(t, 11.1, .5, E.in);
      tf(factory, { y: (1 - fa) * 300 + fex * 300 });
      smoke.forEach((p, i) => { const k = ((t - 6.2 - i * .5) % 3) / 3; tf(p, { x: Math.sin(k * 5 + i) * 30, y: -k * 380, s: .5 + k * 2.4, o: t > 6.4 && t < 11.1 && k >= 0 ? (1 - k) * .55 : 0 }); });
      const ep = pop(t, s(2) + .15, .35);
      tf(eyes, { x: lerp(0, -480, toC) + 0, y: lerp(0, 60, toC) + 0, s: lerp(1, 1.25, toC) * ep, o: clamp(ep * 3) });
      const look = Math.sin((t - s(2)) * 2.4);
      pupils.forEach(p => { p.style.left = (34 + look * 26) + 'px'; p.style.top = (34 + Math.abs(look) * 4) + 'px'; });
    } else {
      const cp = P(t, 15.1, .8, E.out5), cex = P(t, 19.2, .6, E.in);
      tf(castle, { y: (1 - cp) * 700 + cex * 800, s: 1 - .0, o: 1 });
      const chp = pop(t, s(3) + 2.6, .45) * (1 - P(t, 19.2, .3));
      tf(chip, { s: chp, o: clamp(chp * 3) });
      sparks.forEach((p, i) => { const k = ((t - 16 - i * .35) % 1.6) / 1.6; const on = t > 16 && k >= 0; const on2 = t < 23 ? 1 : 0; tf(p, { s: on && on2 ? Math.sin(k * Math.PI) * 1.1 : 0, r: k * 90, o: on && on2 ? 1 : 0 }); });
      const gp = P(t, s(4) + .1, .7, E.out5), gex = P(t, 25.3, .5, E.in);
      tf(grill, { y: (1 - gp) * 700 + gex * 300, s: lerp(.9, 1, gp), o: clamp(gp * 4) });
      steam.forEach((p, i) => { const k = ((t * .9 + i * .27) % 1); p.style.transform = `translateY(${-k * 40}px)`; p.style.opacity = t > s(4) + .4 ? Math.sin(k * Math.PI) : 0; });
      tf(shine, { x: lerp(-100, 1200, P(t, s(5) - .2, 1.2, E.io)), o: gp > .5 && t < 25.3 ? .9 : 0 });
      const np = pop(t, s(5) + .05, .5);
      tf(nothing, { s: np, r: -3, o: clamp(np * 3) });
      und.style.transform = `scaleX(${P(t, s(5) + .55, .5)})`;
    }
  };
};
