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
  dots.forEach(([cx, cy, a]) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', cx * P + 5); c.setAttribute('cy', cy * P + 5); c.setAttribute('r', 4.1);
    c.setAttribute('fill', a ? '#FFB000' : '#0E0D0B');
    if (!RM) {
      const ang = Math.random() * Math.PI * 2, d = 160 + Math.random() * 340;
      c.style.transform = `translate(${Math.cos(ang) * d}px,${Math.sin(ang) * d}px) scale(0)`;
      c.style.opacity = 0;
      c.style.transitionDelay = (a ? 1.2 : (cx / 40) * .6 + Math.random() * .4) + 's';
    }
    svg.appendChild(c);
  });
  host.appendChild(svg);
  if (!RM) requestAnimationFrame(() => requestAnimationFrame(() => $$('circle', svg).forEach(c => { c.style.transform = 'none'; c.style.opacity = 1; })));
}

/* 2. reveals */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2, rootMargin: '0px 0px -6% 0px' });
$$('.rv').forEach(el => RM ? el.classList.add('in') : io.observe(el));
setTimeout(() => $$('.hero .rv').forEach(el => el.classList.add('in')), 50);

/* 3. terminal types in on view */
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
const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { typeIn(e.target); tio.unobserve(e.target); } }), { threshold: .5 });
$$('pre[data-type]').forEach(p => tio.observe(p));

/* 4. the number counts up */
const fmt = (v, dec) => v.toFixed(dec).replace('.', '<i class="dp"></i>');
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, to = +el.dataset.to, dec = +el.dataset.dec, dur = 1800, t0 = performance.now();
  if (RM) { el.innerHTML = fmt(to, dec); return; }
  const tick = t => { const k = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - k, 4)); el.innerHTML = fmt(v, dec); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .5 });
$$('.count').forEach(c => cio.observe(c));

/* 5. scroll-driven axon: the signal rests on a node, then jumps */
const closer = $('#closerIcon');
const seq = $('#sequence'), sig = $('#signal'), word = $('#seqWord');
const nodes = $$('.node'), names = $$('.axon-names li');
const WORDS = ['load', 'quantize', 'allocate', 'run'];
let stage = -1;
function setStage(s) {
  if (s === stage) return; stage = s;
  if (RM) word.textContent = WORDS[s];
  else { word.classList.add('swap'); setTimeout(() => { word.textContent = WORDS[s]; word.classList.remove('swap'); }, 220); }
  nodes.forEach((d, i) => d.classList.toggle('on', i <= s)); names.forEach((d, i) => d.classList.toggle('on', i === s));
}
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function frame() {
  if (seq) {
    const r = seq.getBoundingClientRect(), span = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / span));
    const f = p * 3.999, s = Math.floor(f), t = f - s;
    const j = s < 3 ? ease(Math.max(0, (t - .65) / .35)) : 0;
    const pos = Math.min(3, s + j) / 3;
    sig.style.transform = `translateX(${(pos * sig.parentElement.clientWidth).toFixed(1)}px)`;
    setStage(Math.min(3, Math.round(s + j)));
  }
  if (closer) { const r = closer.getBoundingClientRect(), k = (r.top + r.height / 2) / innerHeight - .5; closer.style.transform = `rotate(${(-k * 24 - 4).toFixed(2)}deg) translateY(${(k * 40).toFixed(1)}px)`; }
  if (!RM) requestAnimationFrame(frame);
}
if (RM) { addEventListener('scroll', frame, { passive: true }); frame(); } else requestAnimationFrame(frame);
})();
