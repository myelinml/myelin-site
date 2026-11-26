(() => {
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* 1. dot-matrix wordmark that assembles on load */
const G = {
 m:[".....",".....","##.#.","#.#.#","#.#.#","#.#.#","#.#.#",".....","....."],
 y:[".....",".....","#...#","#...#","#...#","#...#",".####","....#",".###."],
 e:[".....",".....",".###.","#...#","#####","#....",".###.",".....","....."],
 l:["##.",".#.",".#.",".#.",".#.",".#.",".##","...","..."],
 i:[".*.","...","##.",".#.",".#.",".#.","###","...","..."],
 n:[".....",".....","####.","#...#","#...#","#...#","#...#",".....","....."]
};
const host = $('#dotword');
if (host) {
  let x = 0, dots = [];
  for (const ch of 'myelin') { const g = G[ch];
    g.forEach((row, r) => [...row].forEach((v, c) => { if (v !== '.') dots.push([x + c, r, v === '*']); }));
    x += g[0].length + 1; }
  const P = 10, W = (x - 1) * P, H = 9 * P;
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  dots.forEach(([cx, cy, a], k) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', cx * P + 5); c.setAttribute('cy', cy * P + 5); c.setAttribute('r', 4.1);
    c.setAttribute('fill', a ? '#FFB000' : '#0E0D0B');
    if (!RM) {
      const ang = Math.random() * Math.PI * 2, d = 120 + Math.random() * 260;
      c.style.transform = `translate(${Math.cos(ang) * d}px,${Math.sin(ang) * d}px) scale(0)`;
      c.style.opacity = 0;
      c.style.transitionDelay = (a ? 1.15 : (cx / 40) * .5 + Math.random() * .35) + 's';
    }
    svg.appendChild(c);
  });
  host.appendChild(svg);
  if (!RM) requestAnimationFrame(() => requestAnimationFrame(() => $$('circle', svg).forEach(c => { c.style.transform = 'none'; c.style.opacity = 1; })));
}

/* 2. reveals */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
$$('.rv').forEach(el => RM ? el.classList.add('in') : io.observe(el));
setTimeout(() => $$('.hero .rv').forEach(el => el.classList.add('in')), 50);

/* 3. terminals typing in on view */
function typeIn(pre) {
  const html = pre.innerHTML, text = pre.textContent, speed = +pre.dataset.speed || 12;
  if (RM) { pre.classList.add('typed'); return; }
  pre.textContent = ''; pre.classList.add('typing');
  let i = 0, last = 0;
  const step = t => {
    if (t - last > 16) { i = Math.min(text.length, i + Math.max(1, Math.round(speed / 4))); pre.textContent = text.slice(0, i); last = t; }
    if (i < text.length) requestAnimationFrame(step); else { pre.innerHTML = html; pre.classList.replace('typing', 'typed'); }
  };
  requestAnimationFrame(step);
}
const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { typeIn(e.target); tio.unobserve(e.target); } }), { threshold: .35 });
$$('pre[data-type]').forEach(p => p.dataset.type === 'hero' ? setTimeout(() => typeIn(p), 700) : tio.observe(p));

/* 4. numbers counting up */
const fmt = (v, dec) => v.toFixed(dec).replace('.', '<i class="dp"></i>');
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, to = +el.dataset.to, dec = +el.dataset.dec, dur = 1800, t0 = performance.now();
  if (RM) { el.innerHTML = fmt(to, dec); return; }
  const tick = t => { const k = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - k, 4)); el.innerHTML = fmt(v, dec); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .5 });
$$('.count').forEach(c => cio.observe(c));

/* 5. bit-width dots */
$$('.bit').forEach(b => { const n = +b.dataset.n, d = $('.bdots', b);
  for (let k = 7; k >= 0; k--) { const i = document.createElement('i'); if (k < n) { i.className = 'lit'; i.style.setProperty('--bd', ((7 - k) * .05 + n * .04) + 's'); } d.appendChild(i); } });

/* 6. hardware scan -> lock */
const hw = $('#hw');
if (hw) new IntersectionObserver((es, o) => es.forEach(e => {
  if (!e.isIntersecting) return; o.disconnect();
  const rows = $$('li:not(.locked)', hw).slice(0, 3);
  if (RM) { hw.classList.add('done'); return; }
  let k = 0; const iv = setInterval(() => {
    rows.forEach(r => r.classList.remove('scan')); if (k < rows.length * 2) rows[k % rows.length].classList.add('scan');
    else { clearInterval(iv); rows.forEach(r => r.classList.add('pick')); hw.classList.add('done'); } k++;
  }, 260);
}), { threshold: .5 }).observe(hw);

/* 7. device tilt with the cursor + closer icon on scroll + scroll-driven axon */
const dev = $('#device'), closer = $('#closerIcon');
let tx = 0, ty = 0, cx = 0, cy = 0;
if (!RM && matchMedia('(hover: hover)').matches) addEventListener('pointermove', e => { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });

const seq = $('#sequence'), sig = $('#signal'), num = $('#seqNum'), word = $('#seqWord'), cap = $('#seqCap');
const nodes = $$('.node'), names = $$('.axon-names li');
const STEPS = [['01','load','one memory map of the .myl file.'],['02','quantize','only if needed. the format is fixed at conversion.'],['03','allocate','one arena, planned by the compiler.'],['04','run','the native plan, for this model, on this machine.']];
let stage = -1;
function setStage(s) {
  if (s === stage) return; stage = s;
  const [n, w, c] = STEPS[s];
  if (RM) { num.textContent = n; word.textContent = w; cap.textContent = c; }
  else { word.classList.add('swap'); cap.classList.add('swap');
    setTimeout(() => { num.textContent = n; word.textContent = w; cap.textContent = c; word.classList.remove('swap'); cap.classList.remove('swap'); }, 220); }
  nodes.forEach((d, i) => d.classList.toggle('on', i <= s)); names.forEach((d, i) => d.classList.toggle('on', i === s));
}
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const nav = $('.nav'), secs = $$('[data-sec]'), rail = $$('.rail a');
function frame() {
  // tilt
  cx += (tx - cx) * .08; cy += (ty - cy) * .08;
  if (dev) dev.style.transform = `rotateX(${(-cy * 9).toFixed(2)}deg) rotateY(${(cx * 12).toFixed(2)}deg) rotate(-4deg)`;
  // axon
  if (seq) {
    const r = seq.getBoundingClientRect(), span = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / span));
    const f = p * 3.999, s = Math.floor(f), t = f - s;
    // saltatory: rest on a node, then jump in the last 35% of each step
    const j = s < 3 ? ease(Math.max(0, (t - .65) / .35)) : 0;
    const pos = Math.min(3, s + j) / 3;
    const track = sig.parentElement.clientWidth;
    sig.style.transform = `translateX(${(pos * track).toFixed(1)}px)`;
    setStage(Math.min(3, Math.round(s + j)));
  }
  // closer icon tilt by scroll
  if (closer) { const r = closer.getBoundingClientRect(), k = (r.top + r.height / 2) / innerHeight - .5; closer.style.transform = `rotate(${(-k * 24 - 4).toFixed(2)}deg) translateY(${(k * 40).toFixed(1)}px)`; }
  // nav + rail
  nav.classList.toggle('solid', scrollY > 40);
  let cur = secs[0], dark = false;
  for (const s of secs) { const r = s.getBoundingClientRect(); if (r.top <= innerHeight * .45) cur = s; if (r.top <= 40 && r.bottom > 40) dark = s.classList.contains('dark'); }
  nav.classList.toggle('on-dark', dark);
  const id = cur.id || (cur.previousElementSibling && cur.previousElementSibling.id);
  rail.forEach(a => a.classList.toggle('on', a.dataset.for === id));
  if (!RM) requestAnimationFrame(frame);
}
if (RM) { addEventListener('scroll', frame, { passive: true }); frame(); } else requestAnimationFrame(frame);
})();
