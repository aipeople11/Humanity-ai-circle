(() => {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navlinks');
  if (!btn || !nav) return;
  const links = [...nav.querySelectorAll('a')];
  const openMenu = () => {
    nav.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    btn.setAttribute('aria-label','Close menu');
    document.body.classList.add('menu-open');
    const first = links.find(a => getComputedStyle(a).display !== 'none');
    if (first) first.focus({preventScroll:true});
  };
  const closeMenu = (returnFocus=false) => {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Open menu');
    document.body.classList.remove('menu-open');
    if (returnFocus) btn.focus({preventScroll:true});
  };
  btn.addEventListener('click', () => nav.classList.contains('open') ? closeMenu() : openMenu());
  links.forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu(true); });
  document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

  // Mark the active internal navigation item without requiring every page to hard-code it.
  const current = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a[href]').forEach(a => {
    const href=(a.getAttribute('href')||'').split('#')[0];
    if (href === current) a.setAttribute('aria-current','page');
  });


  // V16.1: progressive disclosure for the homepage question selector.
  const mindButtons = [...document.querySelectorAll('.mind-chip')];
  const mindTitle = document.getElementById('mind-answer-title');
  const mindCopy = document.getElementById('mind-answer-copy');
  const mindLink = document.getElementById('mind-answer-link');
  if (mindButtons.length && mindTitle && mindCopy && mindLink) {
    const activateMind = (button) => {
      mindButtons.forEach(b => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-selected', b === button ? 'true' : 'false'); });
      const answer = document.getElementById('mind-answer');
      if (answer) { answer.classList.remove('is-switching'); void answer.offsetWidth; answer.classList.add('is-switching'); }
      mindTitle.textContent = button.dataset.title || '';
      mindCopy.textContent = button.dataset.copy || '';
      mindLink.href = button.dataset.href || 'explore.html';
      mindLink.textContent = `${button.dataset.link || 'Explore'} →`;
    };
    mindButtons.forEach((button, index) => {
      button.addEventListener('click', () => activateMind(button));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        const delta = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1;
        const next = mindButtons[(index + delta + mindButtons.length) % mindButtons.length];
        next.focus(); activateMind(next);
      });
    });
  }

  // V16.1: quiet scroll reveals and active chapter navigation.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('.reveal-on-scroll')];
  if (reduceMotion || !('IntersectionObserver' in window)) { revealItems.forEach(el => el.classList.add('is-visible')); }
  else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, {threshold: 0.12, rootMargin: '0px 0px -7% 0px'});
    revealItems.forEach(el => revealObserver.observe(el));
  }
  const actLinks = [...document.querySelectorAll('[data-act-link]')];
  const acts = [...document.querySelectorAll('[data-act]')];
  if (actLinks.length && acts.length && 'IntersectionObserver' in window) {
    const actObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      actLinks.forEach(link => link.setAttribute('aria-current', link.dataset.actLink === id ? 'true' : 'false'));
    }, {threshold:[0.15,0.35,0.6], rootMargin:'-18% 0px -55% 0px'});
    acts.forEach(act => actObserver.observe(act));
  }
})();
