// ── Mobile nav toggle
  const navEl = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  navToggle.addEventListener('click', () => {
    const open = navEl.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    navEl.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  // ── Active nav link on scroll
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const navSections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-56px 0px -85% 0px' });
  navSections.forEach(s => navObserver.observe(s));

  // ── Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── Carousels
  document.querySelectorAll('.carousel').forEach(carousel => {
    const wrap = carousel.querySelector('.carousel-track-wrap');
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;
    const slides = Array.from(track.querySelectorAll(':scope > .carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll(':scope > .carousel-dots > .carousel-dot'));
    const perPage = parseInt(carousel.dataset.perPage) || 1;
    let cur = 0;

    const maxIndex = Math.max(0, slides.length - perPage);
    dots.forEach((d, i) => {
      if (i > maxIndex) d.style.display = 'none';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    });
    function go(n) {
      cur = Math.min(Math.max(n, 0), maxIndex);
      track.style.transform = 'translateX(-' + (cur * (100 / perPage)) + '%)';
      dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    const prevBtn = carousel.querySelector(':scope > .carousel-track-wrap > .prev');
    const nextBtn = carousel.querySelector(':scope > .carousel-track-wrap > .next');
    prevBtn && prevBtn.addEventListener('click', e => { e.stopPropagation(); go(cur - 1); });
    nextBtn && nextBtn.addEventListener('click', e => { e.stopPropagation(); go(cur + 1); });
    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

    // Touch/swipe support
    let startX = 0;
    wrap && wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    wrap && wrap.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? cur + 1 : cur - 1);
    });
  });

  // ── Lightbox (portrait carousels + data-lightbox images - click to zoom)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.carousel-slide img, [data-lightbox]').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src; lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

function toggleGiphy() {
    const img = document.getElementById('giphy-img');
    const hint = document.getElementById('giphy-hint');
    const existing = document.getElementById('giphy-freeze');
    if (!existing) {
      const canvas = document.createElement('canvas');
      canvas.id = 'giphy-freeze';
      const w = img.naturalWidth || img.offsetWidth;
      const h = img.naturalHeight || img.offsetHeight;
      canvas.width = w; canvas.height = h;
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;pointer-events:none;';
      try {
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        img.parentNode.appendChild(canvas);
        hint.textContent = 'click to play';
      } catch(e) { /* cross-origin canvas blocked */ }
    } else {
      existing.remove();
      hint.textContent = 'click to pause';
    }
  }
