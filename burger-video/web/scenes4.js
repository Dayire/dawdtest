// hand-drawn arrow that "draws itself": returns an <svg> string; animate via the returned path's dashoffset
function arrowPath(x1, y1, x2, y2, bend = -60) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + bend;
  const ang = Math.atan2(y2 - my, x2 - mx), hl = 34;
  const hd = `M${x2 - hl * Math.cos(ang - .5)} ${y2 - hl * Math.sin(ang - .5)}L${x2} ${y2}L${x2 - hl * Math.cos(ang + .5)} ${y2 - hl * Math.sin(ang + .5)}`;
  return { line: `M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}`, head: hd };
}

// ============ 8. NOW: how many, what's new, what's the same ============
SCENES.now = (root, T) => {
  const s = i => T.segs[i].t0;
  h('div', { class: 'fill', style: `background:${C.cream}` }, root);
  h('div', { class: 'fill dots', style: 'opacity:.5' }, root);
  const numG = h('div', { class: 'a', style: 'left:260px;top:170px;width:1400px;height:700px;transform-origin:0 0' }, root);
  const num = h('div', { class: 'big', style: `text-align:center;font-size:470px;color:${C.ink};text-shadow:12px 13px 0 ${C.ketchup};white-space:nowrap` }, numG);
  const bill = h('div', { class: 'big', text: 'billion', style: `text-align:center;font-size:170px;color:${C.ink};margin-top:6px` }, numG);
  const chipY = h('div', { style: 'text-align:center;margin-top:34px', html: '<span class="chip" style="font-size:40px;padding:20px 38px">burgers a year, roughly</span>' }, numG);

  const trio = [460, 960, 1460].map(x => put(root, burgerSVG({ w: 380 }), x, 330, 380, '', 'a cut'));
  const perWeek = put(root, 'a week, for every person', 960, 800, 1200, `font-size:110px;color:${C.ink};text-align:center;transform:rotate(-2deg)`, 'a hand');
  const wUnd = h('div', { class: 'a', style: `left:520px;top:930px;width:880px;height:16px;background:${C.mustard};transform-origin:left;border-radius:8px` }, root);

  const big = put(root, burgerSVG({ w: 700 }), 960, 190, 700, '', 'a cut');
  const L = {}; ['bunB', 'patty', 'cheese', 'tomato', 'lettuce', 'bunT'].forEach(k => L[k] = $(big, '.' + k));
  const pattyRect = $(L.patty, 'rect');
  const chip16 = put(root, '<span class="chip red" style="font-size:44px;padding:20px 36px">2016 &middot; Plant-based</span>', 960, 60, 900, 'text-align:center', 'a');
  const leaves = [[520, 330, -30], [1400, 300, 40], [600, 760, 20], [1330, 730, -50], [960, 110, 10]].map(([x, y, r]) => put(root, leafSVG(96), x, y, 96, '', 'a cut-s'));

  // smash
  const griddle = h('div', { class: 'a', style: `left:0;top:700px;width:1920px;height:380px;background:linear-gradient(#8F9AA3,#6c757d);border-top:10px solid ${C.ink}` }, root);
  const lace = h('div', { class: 'a', style: 'left:860px;top:500px;width:200px;height:200px;border-radius:50%;background:#8A5230' }, root);
  const ball = h('div', { class: 'a', style: `left:860px;top:500px;width:200px;height:200px;border-radius:50%;background:${C.patty};border:7px solid ${C.ink}` }, root);
  const spat = put(root, spatulaSVG(440), 960, 380, 440, '', 'a cut');
  const chipSm = put(root, '<span class="chip gold" style="font-size:48px;padding:22px 40px">Smash burgers</span>', 960, 90, 900, 'text-align:center', 'a');
  const wisps = [0, 1, 2, 3, 4].map(i => h('div', { class: 'a', style: `left:${800 + i * 80}px;top:520px;width:26px;height:110px;border-radius:14px;background:rgba(255,255,255,.85)` }, root));

  // the formula
  const svg = h('div', { class: 'a', style: 'left:0;top:0;width:1920px;height:1080px', html: '<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="overflow:visible"></svg>' }, root).firstChild;
  const arrows = [[1230, 590, 1010, 610, 40], [1230, 800, 1010, 800, -30], [1230, 300, 1000, 340, -50]].map(([x1, y1, x2, y2, b]) => {
    const a = arrowPath(x1, y1, x2, y2, b);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = `<path d="${a.line}" pathLength="1" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/><path d="${a.head}" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`;
    svg.appendChild(g); return g;
  });
  const words = [['ground meat', 1500, 500], ['bread', 1440, 720], ['something on top', 1560, 200]].map(([w, x, y]) => put(root, w, x, y, 700, `font-size:104px;color:${C.ink};text-align:center;transform:rotate(-2deg)`, 'a hand'));

  return t => {
    // 1: the number
    const np = pop(t, .9, .55), cnt = P(t, 1.0, 1.3, E.out), shr = P(t, s(1) - .05, .55, E.io);
    num.textContent = '≈50'.replace('50', String(Math.round(cnt * 50)));
    numG.style.transform = `translate(${lerp(0, -230, shr)}px,${lerp(0, -150, shr)}px) scale(${lerp(np, .26, shr)})`;
    numG.style.opacity = clamp(np * 3) * (1 - P(t, 7.0, .3));
    // 2: three a week
    trio.forEach((b, i) => { const p = pop(t, 4.4 + i * .5, .5), ex = P(t, 7.3, .4, E.in); tf(b, { y: (1 - p) * 140 - Math.abs(Math.sin(clamp((t - 4.4 - i * .5 - .5) / .6) * Math.PI)) * 40 + ex * 900, s: p, o: clamp(p * 3) }); });
    const pw = pop(t, 5.9, .45), pwx = P(t, 7.3, .3);
    tf(perWeek, { s: pw, r: -2, o: clamp(pw * 3) * (1 - pwx) });
    wUnd.style.transform = `scaleX(${P(t, 6.2, .5)})`; wUnd.style.opacity = 1 - pwx;

    // 3-4: one burger, three lives
    const bp = P(t, 7.6, .6, E.back), toBottom = P(t, 13.05, .45, E.in), toFormula = P(t, 16.4, .7, E.io);
    const explode = P(t, 17.1, .8, E.back);
    const wob = t < 9.4 ? Math.sin((t - 7.6) * 5) * 3 * (1 - clamp((t - 7.6) / 1.5)) : 0;
    const back = t > 13.0 ? (1 - P(t, 16.3, .01)) : 1;
    const onScreen = t >= 7.5 && (t < 13.5 || t >= 16.3);
    tf(big, { x: lerp(0, -340, toFormula), y: (1 - bp) * 160 + toBottom * 900 * (t < 16.4 ? 1 : 0), s: lerp(bp, .92, toFormula), r: wob, o: onScreen ? clamp(bp * 3) : 0 });
    const pl = P(t, 10.4, .5);
    pattyRect.setAttribute('fill', t < 10.4 || t >= 16.3 ? C.patty : `rgb(${Math.round(lerp(106, 154, pl))},${Math.round(lerp(58, 59, pl))},${Math.round(lerp(33, 59, pl))})`);
    const off = { bunT: -70, lettuce: -35, tomato: -16, cheese: 2, patty: 30, bunB: 78 };
    Object.keys(L).forEach(k => stf(L[k], { y: off[k] * explode }));
    const c16 = pop(t, 9.6, .45) * (1 - P(t, 13.05, .3));
    tf(chip16, { s: c16, o: clamp(c16 * 3) });
    leaves.forEach((l, i) => { const p = pop(t, 10.5 + i * .18, .5) * (1 - P(t, 13.05, .3)); tf(l, { s: p, r: [-30, 40, 20, -50, 10][i] + Math.sin(t * 2 + i) * 8, y: Math.sin(t * 2.4 + i) * 10, o: clamp(p * 3) }); });

    // 5: smash
    const g = P(t, 13.0, .5, E.out5), gex = P(t, 16.25, .4, E.in);
    tf(griddle, { y: (1 - g) * 400 + gex * 400 });
    const drop = P(t, 13.25, .55, E.bounce), press = P(t, 14.0, .12, E.out), release = P(t, 14.85, .3);
    const flat = press;
    const y0 = lerp(-600, 0, drop);
    [ball, lace].forEach((el, i) => {
      const k = i ? 1.12 : 1;
      tf(el, { y: y0 + (flat * 72) + gex * 400, sx: lerp(1, 2.6 * k, flat), sy: lerp(1, .28 * k, flat), o: t >= 13.25 && t < 16.4 ? 1 : 0 });
    });
    const sx = P(t, 13.45, .45, E.out5), sy = press * 225 - release * 330;
    tf(spat, { x: lerp(900, 117, sx) + (P(t, 15.2, .4, E.in) * 900), y: -80 + sy, r: -8 + press * 8, o: t >= 13.45 && t < 16.25 ? 1 : 0 });
    const cs = pop(t, 13.9, .4) * (1 - gex);
    tf(chipSm, { s: cs, o: clamp(cs * 3) });
    wisps.forEach((w, i) => { const k = ((t * 1.2 + i * .23) % 1); tf(w, { y: -k * 190, sx: 1 + k, o: t > 14.05 && t < 16.2 ? Math.sin(k * Math.PI) * .8 : 0 }); });

    // 6: the formula
    const tt = [[18.4, 0, 0], [19.1, 1, 1], [19.75, 2, 2]];
    tt.forEach(([t0, ai, wi]) => {
      const a = P(t, t0, .55, E.io), wp = pop(t, t0 + .3, .4);
      const [p1, p2] = arrows[ai].children; p1.setAttribute('stroke-dashoffset', 1 - a); p2.setAttribute('opacity', a > .95 ? 1 : 0);
      tf(words[wi], { s: wp, r: -2, o: clamp(wp * 3) });
    });
  };
};

// ============ 9. OUTRO: timeline, the stack, the long argument ============
SCENES.outro = (root, T) => {
  const s = i => T.segs[i].t0;
  h('div', { class: 'fill', style: 'background:radial-gradient(ellipse at 50% 55%,#4a3422 0%,#241c15 48%,#14110e 100%)' }, root);
  const glow = h('div', { class: 'a', style: 'left:410px;top:80px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(242,182,50,.26),transparent 65%)' }, root);
  h('div', { class: 'fill dots-w', style: 'opacity:.3' }, root);

  const line = h('div', { class: 'a', style: `left:180px;top:536px;width:1560px;height:10px;background:${C.cream};transform-origin:left;border-radius:5px` }, root);
  const nodes = [
    { x: 330, when: s(0) + .25, yr: '1800s', lb: 'Hamburg', col: C.mustard },
    { x: 700, when: s(1) + .25, yr: '1885–1900', lb: 'Five claims', col: C.ketchup },
    { x: 1120, when: s(2) + .85, yr: '1921', lb: 'White Castle', col: '#fff' },
    { x: 1510, when: s(2) + 2.3, yr: '1955', lb: 'The franchise', col: C.teal },
  ].map(n => {
    const el = h('div', { class: 'a', style: `left:${n.x - 200}px;top:330px;width:400px;height:420px;text-align:center` }, root);
    el.innerHTML = `<div class="big" style="font-size:${n.yr.length > 5 ? 66 : 84}px;color:${C.cream};height:120px;display:flex;align-items:flex-end;justify-content:center">${n.yr}</div>
      <div style="width:56px;height:56px;border-radius:50%;background:${n.col};border:8px solid ${C.cream};margin:34px auto 0"></div>
      <div style="font:800 34px Inter;letter-spacing:.12em;text-transform:uppercase;color:${C.cream};margin-top:34px">${n.lb}</div>`;
    return { ...n, el };
  });
  const burger = put(root, burgerSVG({ w: 700 }), 960, 200, 700, '', 'a cut');
  const L = {}; ['bunB', 'patty', 'cheese', 'tomato', 'lettuce', 'bunT'].forEach(k => L[k] = $(burger, '.' + k));
  const order = ['bunB', 'patty', 'cheese', 'tomato', 'lettuce', 'bunT'];
  const bubbles = [['Wisconsin!', 380, 300, -5], ['New York!', 1540, 250, 4], ['Oklahoma!', 300, 620, 3], ['Connecticut!', 1600, 600, -4], ['Texas!', 960, 860, 2]]
    .map(([n, x, y, r]) => ({ r, el: put(root, `<span class="chip light" style="font-size:44px;padding:20px 36px">${n}</span>`, x, y, 600, 'text-align:center', 'a') }));
  const title = h('div', { class: 'a', style: 'left:800px;top:290px;width:1060px' }, root);
  h('div', { html: '<span class="chip gold" style="font-size:36px">A history of the</span>', style: 'margin-bottom:26px' }, title);
  h('div', { class: 'big', text: 'Burger', style: `font-size:215px;color:${C.mustard};text-shadow:9px 10px 0 ${C.ketchup}` }, title);
  const sub = put(root, 'ground meat, bread, and an argument.', 1330, 800, 1080, `font-size:54px;color:${C.cream};text-align:left;opacity:.9`, 'a serif');
  sub.style.left = '800px'; sub.style.textAlign = 'left';

  return t => {
    tf(glow, { s: 1 + .04 * Math.sin(t * .8) });
    const lp = P(t, .5, 8.0, E.lin), lex = P(t, s(3) - .1, .5, E.in);
    tf(line, { sx: clamp(lp * 1.05), y: -lex * 60, o: 1 - lex });
    nodes.forEach(n => { const p = pop(t, n.when, .5); tf(n.el, { y: (1 - p) * 40 - lex * 60, s: p, o: clamp(p * 3) * (1 - lex) }); });

    order.forEach((k, i) => { const p = P(t, s(3) + i * .27, .5, E.bounce); stf(L[k], { y: (1 - p) * -700, o: t >= s(3) + i * .27 ? 1 : 0 }); });
    const mv = P(t, 15.3, .9, E.io);
    tf(burger, { x: lerp(0, -510, mv), y: lerp(0, 90, mv), s: lerp(1, .78, mv), o: t >= s(3) ? 1 : 0 });
    bubbles.forEach((b, i) => { const p = pop(t, s(4) + .3 + i * .4, .4) * (1 - P(t, 15.0, .4)); tf(b.el, { s: p, r: b.r, o: clamp(p * 3) }); });
    const tp = P(t, 15.6, .7);
    tf(title, { x: (1 - tp) * 90, o: tp });
    tf(sub, { y: (1 - P(t, 16.6, .7)) * 20, o: P(t, 16.6, .7) });
  };
};
