(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');

  // ---- Theme toggle (stored per viewer; falls back to OS setting) ----
  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.dataset.theme ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // ---- Header border on scroll ----
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Reveal on scroll + bar fill ----
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fillBars = (el) => el.querySelectorAll('.fill[data-w]').forEach(f => { f.style.width = f.dataset.w + '%'; });
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        fillBars(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('in'); fillBars(el); });
  }

  // ---- Back to top: show after scrolling down ----
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    const t = () => toTop.classList.toggle('show', scrollY > 400);
    addEventListener('scroll', t, { passive: true });
    t();
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // ---- Highlighter: diagonal from bottom-left to top-right of each number ----
  const hls = document.querySelectorAll('.hl');
  const tiltHl = () => hls.forEach(el => {
    const r = el.getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(el).fontSize);
    const len = r.width + 28;                 // stroke length incl. overhang
    const rise0 = r.height * 0.55;            // original corner-to-corner slant
    const leftDrop = rise0 / 2;               // where the left end sat before (kept)
    const rise = Math.max(0, rise0 - fs / 3); // right end lowered by ~1/3 of the text size
    const deg = Math.asin(Math.min(0.5, rise / len)) * 180 / Math.PI;
    el.style.setProperty('--hl-rot', (-deg).toFixed(2) + 'deg');
    el.style.setProperty('--hl-dy', leftDrop.toFixed(1) + 'px');
  });
  if (hls.length) {
    tiltHl();
    addEventListener('resize', tiltHl, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(tiltHl);
  }

  // ---- Print (résumé page) ----
  document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));

  // ---- Copy email ----
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      const label = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '복사됨';
      } catch (e) {
        btn.textContent = '복사 실패';
      }
      setTimeout(() => { btn.textContent = label; }, 1600);
    });
  });

  // ---- Active nav / TOC link (scroll spy) ----
  const spyLinks = [...document.querySelectorAll('[data-spy] a[href^="#"]')];
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(spyLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        spyLinks.forEach(a => a.classList.remove('active'));
        const a = map.get(e.target.id);
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // ---- Lightbox (native <dialog>) ----
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const img = lb.querySelector('img');
    const cap = lb.querySelector('.lb-cap');
    document.querySelectorAll('[data-lightbox]').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.querySelector('img');
        img.src = src.currentSrc || src.src;
        img.alt = src.alt;
        cap.textContent = btn.dataset.lightbox || src.alt || '';
        lb.showModal();
      });
    });
    lb.addEventListener('click', (e) => { if (e.target !== img) lb.close(); });
  }

  // ---- Lite YouTube: load the iframe only on click ----
  document.querySelectorAll('[data-yt]').forEach(box => {
    const btn = box.querySelector('button');
    btn.addEventListener('click', () => {
      const id = box.dataset.yt;
      const start = box.dataset.start || 0;
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&start=${start}&rel=0`;
      f.title = box.dataset.title || 'YouTube video';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      box.replaceChildren(f);
    }, { once: true });
  });
})();
