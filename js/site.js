/* MEX — sales site (English) */
'use strict';

/* =========================================================
   CONFIGURAÇÃO — edite aqui
   checkout: link de pagamento (Kiwify, Hotmart, Mercado Pago, Stripe…)
   whatsapp: só números, com DDI e DDD. Ex.: '5511999999999'
   price: usado só na calculadora (o preço visível está no index.html)
   ========================================================= */
const MEX_SITE = {
  checkout: '',
  whatsapp: '',
  price: 197,
};

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const brl = (c, cents = true) => (c < 0 ? '− ' : '') + 'R$ ' + (Math.abs(c) / 100).toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });

  /* ---------- links de compra e WhatsApp ---------- */
  if (MEX_SITE.checkout) $$('[data-buy]').forEach((a) => { a.href = MEX_SITE.checkout; a.target = '_blank'; a.rel = 'noopener'; });
  if (MEX_SITE.whatsapp) $$('[data-wa]').forEach((a) => { a.href = `https://wa.me/${MEX_SITE.whatsapp}?text=${encodeURIComponent('Hi! I would like to know more about MEX.')}`; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; });
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- aparecer ao rolar ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(countUp);
    if (e.target.matches('[data-count]')) countUp(e.target);
    io.unobserve(e.target);
  }), { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
  requestAnimationFrame(() => setTimeout(() => $('.h-hero').classList.add('in'), 120));

  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = +el.dataset.count, t0 = performance.now(), dur = reduce ? 1 : 1400;
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(to * e); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /* ---------- barra de progresso, nav e barra do celular ---------- */
  const nav = $('#nav'), bar = $('.progress i'), mbar = $('#mbar'), darks = $$('.sec.inv, .final, .marquee');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    nav.classList.toggle('scrolled', y > 20);
    const mid = 40;
    nav.classList.toggle('on-dark', darks.some((d) => { const r = d.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; }));
    const price = $('#price').getBoundingClientRect();
    mbar.classList.toggle('show', y > innerHeight * 0.9 && !(price.top < innerHeight && price.bottom > 0));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- botões magnéticos ---------- */
  if (matchMedia('(pointer: fine)').matches && !reduce) $$('.mag').forEach((b) => {
    b.addEventListener('mousemove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`; });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });

  /* ---------- confete preto e branco ---------- */
  const cv = $('#fx'), cx = cv.getContext('2d');
  let parts = [], raf = 0;
  const size = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
  size(); addEventListener('resize', size);
  function burst(x, y, n = 70, power = 1) {
    if (reduce) return;
    const dark = (el) => el && !!el.closest('.win, .sec.inv, .final, .calc-out');
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = (2 + Math.random() * 7) * power;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4 * power, r: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 1, shape: Math.random() < .5 ? 0 : Math.random() < .5 ? 1 : 2, c: Math.random() < .5 ? '#0b0b0b' : '#f4f4f2', stroke: dark });
    }
    if (!raf) raf = requestAnimationFrame(step);
  }
  function rain(n = 140) { for (let i = 0; i < n; i++) setTimeout(() => burst(Math.random() * innerWidth, -10, 1, .6), i * 12); }
  function step() {
    const d = devicePixelRatio;
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    parts.forEach((p) => {
      p.vy += .22; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .006;
      cx.save(); cx.translate(p.x * d, p.y * d); cx.rotate(p.rot); cx.globalAlpha = Math.min(1, p.life * 2);
      cx.fillStyle = p.c; cx.strokeStyle = p.c === '#0b0b0b' ? '#f4f4f2' : '#0b0b0b'; cx.lineWidth = d;
      const r = p.r * d;
      if (p.shape === 0) { cx.fillRect(-r, -r / 2, r * 2, r); cx.strokeRect(-r, -r / 2, r * 2, r); }
      else if (p.shape === 1) { cx.beginPath(); cx.arc(0, 0, r * .7, 0, 7); cx.fill(); cx.stroke(); }
      else { cx.beginPath(); cx.moveTo(0, -r); cx.lineTo(r, r); cx.lineTo(-r, r); cx.closePath(); cx.fill(); cx.stroke(); }
      cx.restore();
    });
    raf = parts.length ? requestAnimationFrame(step) : 0;
  }

  /* ---------- som (curtinho, opcional) ---------- */
  let ac = null;
  function blip(kind) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const notes = kind === 'ach' ? [523, 659, 784, 1047] : kind === 'rec' ? [660, 880] : [520, 780];
      notes.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * 0.07;
        o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.25);
      });
    } catch { /* sem som, tudo bem */ }
  }

  /* ---------- toasts ---------- */
  function toast(html, cls = '', ms = 2600) {
    const t = document.createElement('div');
    t.className = 'toast ' + cls; t.innerHTML = html;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, ms);
  }

  /* ---------- DEMO interativa ---------- */
  const PH = { pagar: ['Paid! One down.', 'Bill settled. What a relief.', 'Done. Next!'], receber: ['Money in the till!', 'Received. Let\'s go!', 'It\'s in! Noted.'] };
  const balEl = $('#dBal'), leftEl = $('#dLeft'), xpEl = $('#dXp'), lvEl = $('#dLv'), hint = $('#hint');
  const START = 842000;
  let bal = START, xp = 42, lv = 7, shown = START, anim = 0;
  const rows = $$('.w-row');
  rows[0].classList.add('pulse');
  function setBal(v) {
    const from = shown, t0 = performance.now();
    cancelAnimationFrame(anim);
    const tick = (t) => { const p = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - p, 3); shown = Math.round(from + (v - from) * e); balEl.textContent = brl(shown); if (p < 1) anim = requestAnimationFrame(tick); };
    anim = requestAnimationFrame(tick);
    balEl.classList.add('bump'); setTimeout(() => balEl.classList.remove('bump'), 300);
  }
  rows.forEach((r) => {
    r.querySelector('button').addEventListener('click', (ev) => {
      if (r.classList.contains('done')) return;
      r.classList.add('done'); r.classList.remove('pulse');
      hint.classList.add('gone');
      const v = +r.dataset.v, t = r.dataset.t;
      bal += v; setBal(bal);
      const b = ev.currentTarget.getBoundingClientRect();
      burst(b.left + b.width / 2, b.top + b.height / 2, 46, 1);
      blip(t === 'receber' ? 'rec' : 'pay');
      toast(`<span class="ti2">✓</span>${PH[t][Math.floor(Math.random() * 3)]} ${brl(Math.abs(v))}`);
      xp += 22;
      if (xp >= 100) { xp -= 100; lv++; lvEl.textContent = lv; lvEl.classList.add('pop'); setTimeout(() => lvEl.classList.remove('pop'), 600); setTimeout(() => toast(`<span class="ti2">${lv}</span><span><small>Level up</small><b>Level ${lv}</b></span>`, 'ach', 3200), 500); }
      xpEl.style.width = xp + '%';
      const left = rows.filter((x) => !x.classList.contains('done'));
      leftEl.textContent = left.length ? `${left.length} ${left.length === 1 ? 'bill' : 'bills'}` : 'all caught up ✓';
      if (left[0]) left[0].classList.add('pulse');
      if (!left.length) {
        setTimeout(() => { rain(170); blip('ach'); toast('<span class="ti2">★</span><span><small>Achievement · Bronze</small><b>Clean day</b></span>', 'ach', 4200); }, 650);
        $('#dReset').hidden = false;
      }
    });
  });
  $('#dReset').addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('done', 'pulse'));
    rows[0].classList.add('pulse');
    bal = START; setBal(bal); leftEl.textContent = '4 bills'; $('#dReset').hidden = true;
  });

  /* ---------- calculadora do atraso ---------- */
  const iN = $('#iN'), iV = $('#iV'), iD = $('#iD'), out = $('#cOut'), msg = $('#cMsg');
  let outShown = 0, outAnim = 0;
  const paint = (el) => { el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min)) * 100 + '%'); };
  function calc() {
    [iN, iV, iD].forEach(paint);
    const n = +iN.value, v = +iV.value, d = +iD.value;
    $('#cN').textContent = n; $('#cV').textContent = 'R$ ' + v.toLocaleString('en-US'); $('#cD').textContent = d + (d === 1 ? ' day' : ' days');
    const perBill = v * (0.02 + 0.01 * (d / 30));
    const year = Math.round(perBill * n * 12 * 100);
    const from = outShown, t0 = performance.now();
    cancelAnimationFrame(outAnim);
    const tick = (t) => { const p = Math.min(1, (t - t0) / 500), e = 1 - Math.pow(1 - p, 3); outShown = Math.round(from + (year - from) * e); out.textContent = brl(outShown, false); if (p < 1) outAnim = requestAnimationFrame(tick); };
    outAnim = requestAnimationFrame(tick);
    const months = year > 0 ? (MEX_SITE.price * 100) / (year / 12) : Infinity;
    const times = Math.floor(year / (MEX_SITE.price * 100));
    const pays = months < 1 ? 'in <b>less than a month</b>' : `in <b>${Math.ceil(months)} ${Math.ceil(months) === 1 ? 'month' : 'months'}</b>`;
    msg.innerHTML = times >= 2 ? `That's <b>${times} times</b> the price of MEX. It pays for itself ${pays}.`
      : times === 1 ? `That alone is more than the price of MEX. It pays for itself ${pays}.`
      : `Small as it is, it's money going down the drain. With MEX, <b>no bill slips through the cracks</b>.`;
  }
  [iN, iV, iD].forEach((i) => i.addEventListener('input', calc));
  calc();

  /* ---------- confete nos botões de compra (só um gostinho) ---------- */
  $$('[data-buy]').forEach((b) => b.addEventListener('click', () => { const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 30, .8); }));

  /* ---------- FAQ: abre um por vez ---------- */
  $$('.faq details').forEach((d) => d.addEventListener('toggle', () => { if (d.open) $$('.faq details').forEach((o) => { if (o !== d) o.open = false; }); }));
})();
