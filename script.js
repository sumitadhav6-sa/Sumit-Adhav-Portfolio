(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const header = $('#header'), progress = $('#progress'), toTop = $('#toTop');
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks'), pill = $('#navPill');
  const links = $$('.nav-links a');
  const sections = links.map(a => $(a.getAttribute('href')));

  const img = $('#profilePhoto');
  const noPhoto = () => $('.photo-ring').classList.add('no-photo');
  img.addEventListener('error', noPhoto);
  if (img.complete && img.naturalWidth === 0) noPhoto();

  function movePill(a) {
    if (!pill || !a) return;
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  function setActive(id) {
    links.forEach(a => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) { a.setAttribute('aria-current', 'true'); movePill(a); }
      else a.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    header.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 600);

    let current = sections[0].id;
    const line = y + innerHeight * 0.35;
    sections.forEach(s => { if (s.offsetTop <= line) current = s.id; });
    if (innerHeight + y >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].id;
    setActive(current);
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => movePill($('.nav-links a.active')));
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  function closeMenu() {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
  });
  links.forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const roles = ['Full Stack Developer', 'Python Developer', 'Flask Web Developer', 'Problem Solver'];
  const typed = $('#typed');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) typed.textContent = roles[0];
  else {
    let r = 0, c = 0, del = false;
    (function tick() {
      const word = roles[r];
      typed.textContent = word.slice(0, c);
      let delay = del ? 45 : 90;
      if (!del && c === word.length) { del = true; delay = 1600; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; delay = 350; }
      c += del ? -1 : 1;
      setTimeout(tick, delay);
    })();
  }

  const counters = $$('[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      let n = 0;
      const step = () => { n++; el.textContent = n + '+'; if (n < target) setTimeout(step, 250); };
      el.textContent = reduce ? target + '+' : '0';
      if (!reduce) step();
      io.unobserve(el);
    });
  }, { threshold: .6 });
  counters.forEach(c => io.observe(c));

  const form = $('#contactForm'), note = $('#formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#cName'), email = $('#cEmail'), msg = $('#cMsg');
    let ok = true;
    [name, email, msg].forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { note.style.color = '#ff7b7b'; note.textContent = 'Please fill all fields with valid details.'; return; }
    const body = encodeURIComponent(`${msg.value}\n\nFrom: ${name.value} (${email.value})`);
    location.href = `mailto:sumitadhav6@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + name.value)}&body=${body}`;
    note.style.color = '#7dcfff';
    note.textContent = 'Opening your email app...';
    form.reset();
  });

  $('#year').textContent = new Date().getFullYear();
  onScroll();
  setTimeout(() => movePill($('.nav-links a.active')), 100);
})();
