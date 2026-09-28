// ---- paper-cutout illustrations (inline SVG strings). Flat fills, ink outline, hard shadow via CSS. ----
const ST = `stroke="${C.ink}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
const TB = 'style="transform-box:fill-box;transform-origin:50% 50%"';

// Burger in separate layers so scenes can pull it apart. mode: 'classic' | 'bigmac'
function burgerSVG({ w = 600, mode = 'classic' } = {}) {
  const wave = 'q14 -18 28 0 t28 0 '.repeat(6);
  const sesame = [[130, 70, -20], [182, 50, 10], [236, 58, -10], [280, 84, 30], [150, 108, 15], [214, 92, -30], [262, 122, 10], [104, 128, -8]]
    .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="5.5" fill="#FFF1CF" transform="rotate(${r} ${x} ${y})"/>`).join('');
  const patty = (y, cls) => `<g class="L ${cls}" ${TB}><rect x="42" y="${y}" width="316" height="46" rx="22" fill="${C.patty}" ${ST}/>
      <path d="M80 ${y + 16}h28M150 ${y + 30}h34M230 ${y + 14}h26M296 ${y + 30}h30" stroke="#8A5230" stroke-width="6" stroke-linecap="round"/></g>`;
  const bunTop = (cls) => `<g class="L ${cls}" ${TB}><path d="M48 158C48 62 128 22 200 22S352 62 352 158Q352 176 332 176H68Q48 176 48 158Z" fill="${C.bun}" ${ST}/>
      <path d="M82 118C92 76 132 52 176 46" fill="none" stroke="${C.bunHi}" stroke-width="9" stroke-linecap="round"/>${sesame}</g>`;
  const lettuce = `<g class="L lettuce" ${TB}><path d="M30 182 ${wave}V202H30Z" fill="${C.lettuce}" ${ST}/></g>`;
  const tomato = `<g class="L tomato" ${TB}><rect x="54" y="196" width="292" height="22" rx="11" fill="${C.tomato}" ${ST}/></g>`;
  const cheese = `<g class="L cheese" ${TB}><path d="M46 214H354V228H306L292 256L278 228H120L106 246L92 228H46Z" fill="${C.cheese}" ${ST}/></g>`;
  const bunBot = (cls) => `<g class="L ${cls}" ${TB}><path d="M54 282H346V292Q346 324 314 324H86Q54 324 54 292Z" fill="${C.bun}" ${ST}/></g>`;
  if (mode === 'bigmac') {
    // three-bun stack: bottom bun, patty, club bun, cheese, patty, lettuce, top bun (painted bottom -> top)
    const mid = `<g class="L bunM" ${TB}><path d="M50 240H350V262Q350 272 340 272H60Q50 272 50 262Z" fill="${C.bun}" ${ST}/></g>`;
    return `<svg viewBox="0 0 400 380" width="${w}" style="overflow:visible">
      <g transform="translate(0,38)">${bunBot('bunB')}</g>
      <g transform="translate(0,52)">${patty(232, 'patty2')}</g>
      <g transform="translate(0,22)">${mid}</g>
      <g transform="translate(0,22)">${cheese}</g>
      <g transform="translate(0,-36)">${patty(232, 'patty')}</g>
      <g transform="translate(0,-4)">${lettuce}</g>
      <g transform="translate(0,-8)">${bunTop('bunT')}</g></svg>`;
  }
  return `<svg viewBox="0 0 400 340" width="${w}" style="overflow:visible">${bunBot('bunB')}${patty(232, 'patty')}${cheese}${tomato}${lettuce}${bunTop('bunT')}</svg>`;
}

function friesSVG(w = 300) {
  const sticks = [[70, 20, -9], [96, 6, -5], [122, 0, -1], [148, 4, 3], [174, 0, 6], [200, 12, 9], [110, 26, -4], [160, 30, 5]]
    .map(([x, y, r]) => `<rect x="${x}" y="${y}" width="28" height="170" rx="6" fill="#F6D067" ${ST} transform="rotate(${r} ${x + 14} ${y + 120})"/>`).join('');
  return `<svg viewBox="0 0 300 350" width="${w}" style="overflow:visible">${sticks}
    <path d="M56 170H244L226 322Q224 334 212 334H88Q76 334 74 322Z" fill="${C.ketchup}" ${ST}/>
    <path d="M64 226H236L232 262H68Z" fill="${C.cream}" stroke="none"/>
    <path d="M56 170H244L226 322Q224 334 212 334H88Q76 334 74 322Z" fill="none" ${ST}/></svg>`;
}

function shakeSVG(w = 260) {
  return `<svg viewBox="0 0 240 420" width="${w}" style="overflow:visible">
    <path d="M150 116L196 22" stroke="${C.ink}" stroke-width="20" stroke-linecap="round"/><path d="M150 116L196 22" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-dasharray="14 14"/>
    <path d="M40 176H200L180 396Q178 408 166 408H74Q62 408 60 396Z" fill="#F4A6B5" ${ST}/>
    <path d="M46 226H194L188 268H52Z" fill="${C.cream}" stroke="none"/>
    <path d="M40 176H200L180 396Q178 408 166 408H74Q62 408 60 396Z" fill="none" ${ST}/>
    <path d="M28 176Q26 112 120 102Q214 112 212 176Z" fill="${C.cream}" ${ST}/>
    <circle cx="120" cy="96" r="18" fill="${C.ketchup}" ${ST}/><path d="M120 80Q126 62 142 56" fill="none" ${ST}/></svg>`;
}

function steakPlateSVG(w = 460) {
  const onions = [[150, 92, 30, 16], [250, 82, 34, 18], [210, 128, 28, 14], [300, 118, 26, 14], [120, 130, 22, 12]]
    .map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#EAD9A8" stroke-width="9"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`).join('');
  return `<svg viewBox="0 0 420 260" width="${w}" style="overflow:visible">
    <ellipse cx="210" cy="150" rx="200" ry="96" fill="${C.paper}" ${ST}/><ellipse cx="210" cy="146" rx="150" ry="66" fill="none" stroke="#D9CFB8" stroke-width="4"/>
    <ellipse cx="206" cy="138" rx="112" ry="52" fill="${C.patty}" ${ST}/>
    <path d="M130 130l24 -12M176 154l26 -14M232 120l24 -12M262 148l20 -12M170 114l16 -8" stroke="#8A5230" stroke-width="6" stroke-linecap="round"/>${onions}</svg>`;
}

function forkSVG(h = 420) {
  return `<svg viewBox="0 0 70 300" height="${h}" style="overflow:visible"><path d="M12 8V70Q12 92 35 92Q58 92 58 70V8M35 8V92M35 92V286" fill="none" stroke="${C.ink}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8V70Q12 92 35 92Q58 92 58 70V8M35 8V92M35 92V286" fill="none" stroke="${C.steel}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function knifeSVG(h = 420) {
  return `<svg viewBox="0 0 70 300" height="${h}" style="overflow:visible"><path d="M22 8Q56 20 52 130H22Z" fill="${C.steel}" ${ST}/><rect x="22" y="130" width="30" height="160" rx="10" fill="#6a4a2f" ${ST}/></svg>`;
}

function shipSVG(w = 200) {
  return `<svg viewBox="0 0 220 120" width="${w}" style="overflow:visible">
    <path d="M112 34Q104 14 120 4M124 30Q118 14 134 8" stroke="#8a8a8a" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>
    <rect x="70" y="40" width="82" height="26" rx="4" fill="${C.cream}" ${ST}/>
    <rect x="106" y="24" width="20" height="26" fill="${C.ketchup}" ${ST}/><rect x="100" y="20" width="32" height="8" fill="${C.ink}"/>
    <path d="M8 66H212L186 108H32Z" fill="${C.ink}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M22 84H198" stroke="${C.cream}" stroke-width="5"/></svg>`;
}

function carSVG(w = 560, body = C.ketchup) {
  return `<svg viewBox="0 0 540 210" width="${w}" style="overflow:visible">
    <path d="M18 138Q16 116 46 110L12 62L70 102L130 100Q160 62 226 60H330Q378 66 408 102L482 112Q516 118 518 142V158H18Z" fill="${body}" ${ST}/>
    <path d="M148 100Q170 72 228 70H296V100Z" fill="${C.sky}" ${ST}/><path d="M308 70H332Q366 76 388 100H308Z" fill="${C.sky}" ${ST}/>
    <path d="M30 132H500" stroke="${C.cream}" stroke-width="8" stroke-linecap="round"/>
    <rect x="8" y="140" width="62" height="14" rx="7" fill="${C.cream}" ${ST}/><rect x="470" y="140" width="56" height="14" rx="7" fill="${C.cream}" ${ST}/>
    <g class="wheel"><circle cx="130" cy="160" r="38" fill="${C.ink}"/><circle cx="130" cy="160" r="22" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/><path d="M130 142V178M112 160H148" stroke="${C.ink}" stroke-width="5"/></g>
    <g class="wheel"><circle cx="404" cy="160" r="38" fill="${C.ink}"/><circle cx="404" cy="160" r="22" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/><path d="M404 142V178M386 160H422" stroke="${C.ink}" stroke-width="5"/></g></svg>`;
}

function castleSVG(w = 760) {
  const cren = (x0, x1, y) => { let s = ''; for (let x = x0; x < x1; x += 40) s += `<rect x="${x}" y="${y}" width="22" height="26" fill="#fff" ${ST}/>`; return s; };
  return `<svg viewBox="0 0 760 520" width="${w}" style="overflow:visible">
    <rect x="40" y="150" width="120" height="330" fill="#fff" ${ST}/>${cren(46, 160, 124)}
    <rect x="600" y="150" width="120" height="330" fill="#fff" ${ST}/>${cren(606, 720, 124)}
    <rect x="140" y="230" width="480" height="250" fill="#fff" ${ST}/>${cren(150, 610, 204)}
    <rect x="160" y="250" width="440" height="50" fill="${C.teal}" ${ST}/>
    <text x="380" y="288" text-anchor="middle" font-family="Archivo Black" font-size="36" fill="#fff" letter-spacing="6">BURGERS</text>
    <rect x="206" y="330" width="130" height="150" fill="#D6EEF2" ${ST}/><rect x="424" y="330" width="130" height="150" fill="#D6EEF2" ${ST}/>
    <path d="M338 480V386Q338 350 380 350Q422 350 422 386V480Z" fill="${C.teal}" ${ST}/>
    <rect x="70" y="200" width="20" height="60" rx="8" fill="#D6EEF2" stroke="${C.ink}" stroke-width="4"/><rect x="630" y="200" width="20" height="60" rx="8" fill="#D6EEF2" stroke="${C.ink}" stroke-width="4"/>
    <path d="M0 482H760" stroke="${C.ink}" stroke-width="6"/></svg>`;
}

function grillWindowSVG(w = 760) {
  return `<svg viewBox="0 0 760 420" width="${w}" style="overflow:visible">
    <rect x="10" y="10" width="740" height="400" rx="16" fill="#fff" ${ST}/>
    <rect x="34" y="34" width="692" height="352" rx="8" fill="#DCEFF3" ${ST}/>
    <rect x="34" y="260" width="692" height="126" fill="#8F9AA3" ${ST}/><rect x="34" y="260" width="692" height="26" fill="#C8D0D6" ${ST}/>
    ${[110, 250, 390, 530].map(x => `<ellipse cx="${x + 40}" cy="270" rx="56" ry="17" fill="${C.patty}" ${ST}/>`).join('')}
    <g class="steam">${[150, 290, 430, 570].map(x => `<path class="st" d="M${x} 236q-16 -22 0 -44t0 -44" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".9"/>`).join('')}</g>
    <path d="M60 60L180 60L100 160Z" fill="#fff" opacity=".35"/><path d="M110 60L150 60L80 160L60 160Z" fill="#fff" opacity=".2"/></svg>`;
}

function mixerSVG(w = 640) {
  const cups = [0, 1, 2, 3, 4].map(i => { const x = 40 + i * 116;
    return `<path d="M${x} 200H${x + 84}L${x + 74} 330Q${x + 72} 340 ${x + 62} 340H${x + 22}Q${x + 12} 340 ${x + 10} 330Z" fill="#F4A6B5" ${ST}/>
    <g class="spin"><rect x="${x + 38}" y="70" width="8" height="180" rx="4" fill="${C.steel}" ${ST}/><ellipse class="blade" cx="${x + 42}" cy="246" rx="26" ry="7" fill="${C.steel}" ${ST}/></g>`; }).join('');
  return `<svg viewBox="0 0 640 360" width="${w}" style="overflow:visible"><rect x="20" y="10" width="600" height="70" rx="14" fill="${C.ketchup}" ${ST}/>
    <rect x="40" y="26" width="120" height="14" rx="7" fill="${C.cream}"/>${cups}</svg>`;
}

function shopSVG(w = 520) {
  const stripes = Array.from({ length: 8 }, (_, i) => `<path d="M${60 + i * 50} 150h50l-8 60h-50z" fill="${i % 2 ? '#fff' : C.ketchup}" ${ST}/>`).join('');
  return `<svg viewBox="0 0 520 380" width="${w}" style="overflow:visible"><rect x="50" y="200" width="420" height="160" fill="${C.cream}" ${ST}/>${stripes}
    <rect x="80" y="240" width="150" height="90" fill="#D6EEF2" ${ST}/><rect x="290" y="240" width="150" height="90" fill="#D6EEF2" ${ST}/>
    <rect x="215" y="100" width="90" height="50" rx="8" fill="${C.mustard}" ${ST}/><text x="260" y="136" text-anchor="middle" font-family="Archivo Black" font-size="28" fill="${C.ink}">OPEN</text>
    <path d="M0 362H520" stroke="${C.ink}" stroke-width="6"/></svg>`;
}

function factorySVG(w = 900) {
  return `<svg viewBox="0 0 900 300" width="${w}" style="overflow:visible"><path d="M0 300V180H90V120H160V180H260V90H320V180H420V140H520V180H620V100H680V180H780V150H900V300Z" fill="#0b0908"/>
    ${[110, 290, 650].map(x => `<rect x="${x}" y="${x === 290 ? 20 : 50}" width="30" height="${x === 290 ? 80 : 60}" fill="#0b0908"/>`).join('')}
    ${Array.from({ length: 14 }, (_, i) => `<rect x="${30 + i * 62}" y="${215 + (i % 2) * 20}" width="22" height="16" fill="#4a3a25"/>`).join('')}</svg>`;
}

function spatulaSVG(w = 300) {
  return `<svg viewBox="0 0 300 120" width="${w}" style="overflow:visible"><rect x="120" y="44" width="176" height="24" rx="12" fill="#6a4a2f" ${ST}/>
    <path d="M10 26H130Q140 26 140 36V80Q140 90 130 90H10Q0 90 0 80V36Q0 26 10 26Z" fill="${C.steel}" ${ST}/></svg>`;
}

function sparkle(size = 40, color = '#fff') {
  return `<svg viewBox="-20 -20 40 40" width="${size}" height="${size}" style="overflow:visible"><path d="M0 -18Q2 -2 18 0Q2 2 0 18Q-2 2 -18 0Q-2 -2 0 -18Z" fill="${color}" stroke="${C.ink}" stroke-width="2"/></svg>`;
}
function pinSVG(size = 44, color = C.ketchup) {
  return `<svg viewBox="0 0 40 56" width="${size}" style="overflow:visible"><path d="M20 2C9 2 2 10 2 20c0 14 18 34 18 34s18-20 18-34C38 10 31 2 20 2Z" fill="${color}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="20" cy="20" r="7" fill="#fff"/></svg>`;
}
function leafSVG(size = 60) {
  return `<svg viewBox="0 0 60 60" width="${size}" style="overflow:visible"><path d="M8 52C6 22 26 6 54 6C54 34 40 54 8 52Z" fill="${C.lettuce}" ${ST.replace('5', '3.5')}/><path d="M10 50L40 20" stroke="${C.ink}" stroke-width="3" fill="none"/></svg>`;
}
