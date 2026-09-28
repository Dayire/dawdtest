const SCENES = {};

// full-screen colour wipe used as a scene-to-scene transition (reveals the scene underneath, left to right)
function wipeIn(root, color, d = .55) {
  const p = h('div', { class: 'fill', style: `background:${color};transform-origin:right center;z-index:50` }, root);
  const p2 = h('div', { class: 'fill', style: `background:${C.ink};transform-origin:right center;z-index:49` }, root);
  return t => { p.style.transform = `scaleX(${1 - P(t, 0, d, E.io)})`; p2.style.transform = `scaleX(${1 - P(t, .12, d, E.io)})`; };
}

// ============ 1. COLD OPEN: "the most American meal" -> not American, not ham -> title ============
SCENES.hook = (root, T) => {
  const s = i => T.segs[i].t0;
  h('div', { class: 'fill', style: 'background:radial-gradient(ellipse at 50% 55%,#4a3422 0%,#241c15 48%,#14110e 100%)' }, root);
  const glow = h('div', { class: 'a', style: 'left:410px;top:80px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(242,182,50,.30),transparent 65%)' }, root);
  h('div', { class: 'fill dots-w', style: 'opacity:.35' }, root);

  const kick = put(root, 'the most<br>American meal', 960, 330, 1500, 'text-align:center;color:#F4EBD8;font-size:120px;line-height:1.05;', 'a serif');
  const burger = put(root, burgerSVG({ w: 660 }), 960, 280, 660, '', 'a cut');
  const fries = put(root, friesSVG(300), 470, 450, 300, '', 'a cut');
  const shake = put(root, shakeSVG(250), 1450, 410, 250, '', 'a cut');

  const amer = put(root, 'AMERICAN', 960, 70, 1700, 'text-align:center;color:#F4EBD8;font-size:200px;', 'a big');
  const strike = h('div', { class: 'a', style: 'left:300px;top:150px;width:1320px;height:28px;background:#D6402D;transform-origin:left center;border-radius:4px;box-shadow:5px 6px 0 rgba(0,0,0,.45)' }, root);
  const hb = put(root, '<span class="hm" style="position:relative;display:inline-block">HAM<i class="st"></i></span>BURGER', 960, 70, 1700, 'text-align:center;color:#F4EBD8;font-size:200px;', 'a big');
  const st = $(hb, '.st');
  st.style.cssText = 'position:absolute;left:-16px;right:-16px;top:44%;height:28px;background:#D6402D;border-radius:4px;transform-origin:left center;box-shadow:4px 5px 0 rgba(0,0,0,.45)';
  const zero = put(root, '<span class="chip red" style="font-size:46px;padding:18px 34px">0% ham</span>', 1560, 300, 500, 'text-align:center', 'a');

  const title = h('div', { class: 'a', style: 'left:800px;top:250px;width:1060px;text-align:left' }, root);
  const tChip = h('div', { html: '<span class="chip gold" style="font-size:36px">A history of the</span>', style: 'margin-bottom:26px' }, title);
  const tBig = h('div', { class: 'big', text: 'Burger', style: `font-size:215px;color:${C.mustard};text-shadow:9px 10px 0 ${C.ketchup}` }, title);
  const rule = h('div', { style: `margin-top:34px;height:8px;width:100%;background:${C.cream};transform-origin:left` }, title);

  return t => {
    tf(glow, { s: 1 + .04 * Math.sin(t * .8) });
    tf(kick, { y: (1 - P(t, 1.4, 1.4)) * 28, o: win(t, 1.4, 3.95, .6) });

    const bp = pop(t, s(1), .6), push = 1 + .05 * clamp((t - 4) / 10), mv = P(t, 14.2, .9, E.io);
    tf(burger, { x: lerp(0, -510, mv), y: (1 - bp) * 140 + mv * 20, s: lerp(bp * push, .78, mv), o: clamp(bp * 3) });
    const fp = pop(t, s(1) + .85, .5), fx = P(t, s(2) - .2, .7, E.in);
    tf(fries, { x: -760 * fx, y: (1 - fp) * 120, s: fp, r: -6 * (1 - fp) - 4 * fx, o: clamp(fp * 3) });
    const sp = pop(t, s(1) + 1.55, .5), sx = P(t, s(2) - .1, .7, E.in);
    tf(shake, { x: 760 * sx, y: (1 - sp) * 120, s: sp, r: 8 * (1 - sp) + 4 * sx, o: clamp(sp * 3) });

    // "AMERICAN" then struck through, swapped for "HAM-burger" with HAM struck
    const a = pop(t, s(2) + 1.55, .35) * (1 - P(t, s(3) + .05, .3, E.in));
    tf(amer, { y: -P(t, s(3) + .05, .3, E.in) * 60, s: a > 0 ? .85 + .15 * a : 0, o: clamp(a * 3) });
    tf(strike, { r: -3, sx: P(t, s(2) + 2.0, .3, E.out), o: 1 - P(t, s(3) + .05, .2) });
    const hp = pop(t, s(3) + .1, .4) * (1 - P(t, 14.25, .3));
    tf(hb, { s: .85 + .15 * hp, o: clamp(hp * 3) });
    st.style.transform = `rotate(-4deg) scaleX(${P(t, s(3) + 2.35, .22)})`;
    const zp = pop(t, s(3) + 2.55, .35) * (1 - P(t, 14.25, .3));
    tf(zero, { s: zp * (1 + .0), r: 7, o: clamp(zp * 4) });

    const tp = P(t, 15.0, .5);
    tf(title, { x: (1 - tp) * 90, o: tp });
    tChip.style.opacity = P(t, 15.0, .4);
    tBig.style.transform = `translateY(${(1 - P(t, 15.2, .6, E.out5)) * 40}px)`; tBig.style.opacity = P(t, 15.2, .4);
    rule.style.transform = `scaleX(${P(t, 15.9, .8, E.io)})`;
  };
};

// ============ 2. HAMBURG: a port city, a dish, and the ships ============
SCENES.hamburg = (root, T) => {
  const s = i => T.segs[i].t0;
  const proj = (lon, lat) => [lon, -merc(lat)];
  const HAM = [10.0, 53.55], NY = [-74.0, 40.7];
  h('div', { class: 'fill', style: `background:${C.sky}` }, root);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'fill'); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('preserveAspectRatio', 'none');
  root.appendChild(svg);
  const paths = countryPaths(proj, (c, r) => c.name !== 'Antarctica' && (bbox(r)[2] - bbox(r)[0]) < 300);
  let grat = '';
  for (let lon = -180; lon <= 180; lon += 10) grat += `<path d="M${lon} -100V0" />`;
  for (let lat = 0; lat <= 80; lat += 10) { const y = -merc(lat); grat += `<path d="M-180 ${y}H180"/>`; }
  svg.innerHTML = `<g stroke="#fff" stroke-opacity=".45" stroke-width="1.5" vector-effect="non-scaling-stroke" fill="none">${grat.replace(/<path /g, '<path vector-effect="non-scaling-stroke" ')}</g>` +
    paths.map(o => `<path d="${o.d}" fill="${o.c.name === 'Germany' ? C.mustard : '#EBDDB8'}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`).join('') + '<g id="route"></g>';
  const route = svg.querySelector('#route');
  root.appendChild(h('div', { class: 'fill dots', style: 'opacity:.25;pointer-events:none' }));

  // camera: anchor a lon/lat to a screen point at a given zoom (degrees of longitude across the frame)
  const view = (lon, lat, sx, sy, wdeg) => { const hdeg = wdeg * H / W; const [X, Y] = proj(lon, lat); return { cx: X + (W / 2 - sx) / W * wdeg, cy: Y + (H / 2 - sy) / H * hdeg, w: wdeg }; };
  const V1 = view(HAM[0], HAM[1], 640, 560, 17), V1b = view(HAM[0], HAM[1], 640, 560, 13.5);
  const V2 = { cx: -33, cy: -merc(48), w: 112 };
  const cam = (a, b, k) => ({ w: Math.exp(lerp(Math.log(a.w), Math.log(b.w), k)), cx: lerp(a.cx, b.cx, k), cy: lerp(a.cy, b.cy, k) });
  const toScreen = (lon, lat, v) => { const [X, Y] = proj(lon, lat), hd = v.w * H / W; return [(X - (v.cx - v.w / 2)) / v.w * W, (Y - (v.cy - hd / 2)) / hd * H]; };

  const rings = [0, 1, 2].map(() => h('div', { class: 'a', style: 'width:120px;height:120px;border-radius:50%;border:6px solid #D6402D' }, root));
  const dot = h('div', { class: 'a', style: 'width:34px;height:34px;border-radius:50%;background:#D6402D;border:6px solid #1d1a17' }, root);
  const chipH = h('div', { class: 'a', html: '<span class="chip">Hamburg, Germany</span>' }, root);
  const nyDot = h('div', { class: 'a', style: 'width:34px;height:34px;border-radius:50%;background:#D6402D;border:6px solid #1d1a17' }, root);
  const chipNY = h('div', { class: 'a', html: '<span class="chip red">New York</span>' }, root);
  const ships = [0, 1, 2].map(() => h('div', { class: 'a cut-s', html: shipSVG(170) }, root));
  const mini = h('div', { class: 'a cut-s', html: steakPlateSVG(200) }, root);

  const plate = put(root, steakPlateSVG(560), 1420, 380, 560, '', 'a cut');
  const lab1 = put(root, 'chopped, seasoned beef', 1440, 235, 800, `font-size:66px;color:${C.ink};text-align:center;transform:rotate(-4deg)`, 'a hand');
  const lab2 = put(root, 'onions', 1745, 640, 300, `font-size:70px;color:${C.ink};text-align:center;transform:rotate(3deg)`, 'a hand');
  const name = put(root, 'Hamburg steak', 1420, 800, 900, `font-size:110px;color:${C.ink};text-align:center;`, 'a serif');
  const mark = h('div', { class: 'a', style: `left:1000px;top:922px;width:840px;height:22px;background:${C.mustard};transform-origin:left;z-index:-1;border-radius:4px` }, root);
  const wp = wipeIn(root, C.cream);

  const bez = (u) => { // route in world coords: quadratic curve arcing north
    const A = proj(...HAM), B = proj(...NY), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - 16];
    return [(1 - u) * (1 - u) * A[0] + 2 * (1 - u) * u * M[0] + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * (1 - u) * u * M[1] + u * u * B[1]];
  };
  const toScreenXY = (p, v) => { const hd = v.w * H / W; return [(p[0] - (v.cx - v.w / 2)) / v.w * W, (p[1] - (v.cy - hd / 2)) / hd * H]; };

  return t => {
    wp(t);
    const zoomK = P(t, s(3) + .4, 2.7, E.io);
    const slow = cam(V1, V1b, P(t, 0, s(3) + .4, E.lin));
    const v = cam(slow, V2, zoomK);
    const hd = v.w * H / W;
    svg.setAttribute('viewBox', `${v.cx - v.w / 2} ${v.cy - hd / 2} ${v.w} ${hd}`);

    const [hx, hy] = toScreen(HAM[0], HAM[1], v);
    const dp = pop(t, .9, .5);
    tf(dot, { x: hx - 17, y: hy - 17, s: dp * (zoomK > 0 ? lerp(1, .8, zoomK) : 1), o: dp });
    rings.forEach((r, i) => { const k = ((t - 1 - i * .7) % 2.1) / 2.1; const on = t > 1 && k >= 0; tf(r, { x: hx - 60, y: hy - 60, s: .3 + k * 1.1, o: on ? (1 - k) * .8 * (1 - zoomK) : 0 }); });
    tf(chipH, { x: hx - 120, y: hy - 130 - (1 - pop(t, 1.1, .5)) * 20, s: pop(t, 1.1, .5), o: (1 - P(t, s(3) + .4, .4)) * clamp(pop(t, 1.1, .5) * 3) });

    // the dish
    const pp = pop(t, s(1) + .8, .6), pex = P(t, s(3) + .5, .8, E.in);
    tf(plate, { x: 900 * pex, y: (1 - pp) * 60, s: pp, r: -6 * (1 - pp), o: clamp(pp * 3) });
    tf(lab1, { s: pop(t, s(1) + 1.6, .35), o: clamp(pop(t, s(1) + 1.6, .35) * 3) * (1 - pex) });
    tf(lab2, { s: pop(t, s(1) + 3.6, .35), o: clamp(pop(t, s(1) + 3.6, .35) * 3) * (1 - pex) });
    const np = pop(t, s(2) + .1, .45);
    tf(name, { s: np, o: clamp(np * 3) * (1 - pex) });
    mark.style.transform = `scaleX(${P(t, s(2) + .5, .5, E.out)})`; mark.style.opacity = 1 - pex;

    // route + ships
    const ru = P(t, s(3) + 1.1, 3.4, E.io);
    let d = '';
    for (let i = 0; i <= 60; i++) { const u = Math.min(i / 60, ru); const p = bez(u); d += (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2); }
    route.innerHTML = ru > 0 ? `<path d="${d}" fill="none" stroke="${C.ketchup}" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 16" vector-effect="non-scaling-stroke"/>` : '';
    ships.forEach((sh, i) => {
      const u = clamp((t - (s(3) + 1.4) - i * .45) / 3.1); const p = toScreenXY(bez(E.io(u)), v);
      const bob = Math.sin(t * 3 + i) * 5;
      tf(sh, { x: p[0] - 115, y: p[1] - 100 + bob, sx: -1, sy: 1, o: u > 0 && u < 1 ? clamp(u * 8) * clamp((1 - u) * 8) : 0 });
    });
    const [nx, ny] = toScreen(NY[0], NY[1], v);
    const nk = pop(t, s(3) + 3.0, .4);
    tf(nyDot, { x: nx - 17, y: ny - 17, s: nk, o: zoomK > .6 ? nk : 0 });
    tf(chipNY, { x: nx - 70, y: ny + 40, s: nk, o: zoomK > .6 ? clamp(nk * 3) : 0 });
    const mk = pop(t, s(4) + .35, .5);
    tf(mini, { x: nx - 100, y: ny - 190 - (1 - mk) * 60, s: mk, o: clamp(mk * 3) });
  };
};

// ============ 3. STEAK -> SANDWICH ============
SCENES.sandwich = (root, T) => {
  const s = i => T.segs[i].t0;
  h('div', { class: 'fill', style: `background:${C.mustard}` }, root);
  h('div', { class: 'fill dots', style: 'opacity:.55' }, root);
  const menu = h('div', { class: 'a cut', style: `left:640px;top:70px;width:640px;height:820px;background:${C.paper};border:8px solid ${C.ink};padding:44px 52px;` }, root);
  menu.innerHTML = `<div class="serif" style="font-size:84px;text-align:center;letter-spacing:.06em">MENU</div>
    <div style="height:6px;background:${C.ink};margin:14px 0 30px"></div>` +
    [['Consommé', 300], ['Roast beef', 340], ['Hamburg steak', 420], ['Boiled ham', 260], ['Apple pie', 300]].map(([n, w], i) =>
      `<div style="position:relative;height:96px;display:flex;align-items:center"><div class="mk" style="position:absolute;left:-10px;top:14px;height:68px;width:0;background:#F7C948;border-radius:6px;display:${i === 2 ? 'block' : 'none'}"></div>
       <div class="serif" style="position:relative;font-size:56px;${i === 2 ? '' : 'opacity:.42'}">${n}</div></div>`).join('');
  const mk = $$(menu, '.mk')[2];
  const chip = put(root, '<span class="chip" style="font-size:44px;padding:20px 36px">Late 1800s</span>', 1500, 470, 600, 'text-align:center', 'a');

  const plate = put(root, steakPlateSVG(820), 960, 260, 820, '', 'a cut');
  const fork = put(root, forkSVG(520), 460, 250, 70, '', 'a cut');
  const knife = put(root, knifeSVG(520), 1460, 250, 70, '', 'a cut');

  const burger = put(root, burgerSVG({ w: 700 }), 960, 200, 700, '', 'a cut');
  const L = {}; ['bunB', 'patty', 'cheese', 'tomato', 'lettuce', 'bunT'].forEach(k => L[k] = $(burger, '.' + k));
  const chips = [['Worker', 400, 270], ['Farmer', 1520, 250], ['Fairgoer', 1480, 640]].map(([n, x, y]) =>
    put(root, `<span class="chip light" style="font-size:44px;padding:18px 34px">${n}</span>`, x, y, 500, 'text-align:center', 'a'));
  const note = put(root, 'portable!', 960, 740, 800, `font-size:150px;color:${C.ink};text-align:center;transform:rotate(-3deg)`, 'a hand');
  const und = h('div', { class: 'a', style: `left:640px;top:915px;width:640px;height:14px;background:${C.ketchup};transform-origin:left;border-radius:6px` }, root);

  return t => {
    // menu
    const mp = P(t, .6, .8, E.out5), mex = P(t, 5.5, .6, E.in);
    tf(menu, { y: (1 - mp) * 1000 + mex * 1100, r: lerp(-6, 2, mp) - 4 * mex });
    mk.style.width = `${P(t, 2.0, .55) * 470}px`;
    const cp = pop(t, 4.4, .4);
    tf(chip, { s: cp * (1 - mex), r: 5, o: clamp(cp * 3) * (1 - mex) });

    // knife & fork
    const pp = pop(t, 5.6, .55), ex = P(t, 8.0, .5, E.in);
    tf(plate, { y: (1 - pp) * 80 + ex * 40, s: pp * (1 - ex * .3), o: clamp(pp * 3) * (1 - P(t, 8.05, .3)) });
    const fp = P(t, 5.9, .5, E.out5), kp = P(t, 6.1, .5, E.out5);
    const cut = Math.sin(clamp((t - 6.7) / .7) * Math.PI * 3) * 6 * clamp(1 - (t - 6.7) / .8);
    tf(fork, { x: (1 - fp) * -700 - 700 * ex, y: cut, r: 8 * (1 - fp), o: fp });
    tf(knife, { x: (1 - kp) * 700 + 700 * ex, y: -cut, r: -8 * (1 - kp), o: kp });

    // assembly: patty in, bottom bun rises, top bun drops
    const patP = pop(t, 8.0, .4);
    stf(L.patty, { y: (1 - patP) * -30, o: clamp(patP * 3) });
    ['cheese', 'tomato', 'lettuce'].forEach(k => stf(L[k], { o: 0 }));
    const bb = P(t, 8.3, .45, E.back);
    stf(L.bunB, { y: (1 - bb) * 260, o: clamp(bb * 4) });
    const bt = P(t, 9.1, .55, E.bounce);
    const sq = 1 - .12 * Math.sin(clamp((t - 9.55) / .3) * Math.PI);
    stf(L.bunT, { y: (1 - bt) * -520 + 50, sy: t > 9.5 ? sq : 1, sx: t > 9.5 ? 1 / sq : 1, o: clamp((t - 9.1) * 8) });
    const hop = Math.sin(clamp((t - 10.4) / .7) * Math.PI) * -46;
    const show = clamp((t - 8) * 5);
    tf(burger, { y: hop, o: show });
    chips.forEach((c, i) => { const p = pop(t, 10.5 + i * .7, .4); tf(c, { s: p, r: i === 1 ? 4 : -4, o: clamp(p * 3) }); });
    const np = pop(t, 12.15, .4);
    tf(note, { s: np, r: -3, o: clamp(np * 3) });
    und.style.transform = `scaleX(${P(t, 12.5, .4)})`;
  };
};
