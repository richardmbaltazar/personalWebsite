// Theme Toggle
const html = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", savedTheme);
if (themeToggle) {
  themeToggle.textContent = savedTheme === "dark" ? "Light" : "Dark";
  themeToggle.addEventListener("click", () => {
    const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "Light" : "Dark";
  });
}

// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal, .timeline-item").forEach(el => observer.observe(el));

// Particle Network
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const mobile = window.matchMedia("(max-width:600px)").matches;
  const tablet = window.matchMedia("(max-width:900px)").matches;
  const COUNT = mobile ? 22  : tablet ? 35  : 48;
  const DIST  = mobile ? 80  : tablet ? 110 : 135;
  // throttle canvas to 30fps on mobile — physics still runs at 60fps
  const fpsInterval = mobile ? 1000 / 30 : 0;
  let particles = [], lastTs = 0;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  function spawn() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height,
        vx: (Math.random()-0.5)*0.38, vy: (Math.random()-0.5)*0.38, r: Math.random()*1.3+0.7 });
    }
  }
  spawn();
  function accent() {
    return document.documentElement.getAttribute("data-theme")==="dark" ? [56,189,248] : [2,132,199];
  }
  function draw(ts) {
    requestAnimationFrame(draw);
    if (fpsInterval && ts - lastTs < fpsInterval) return;
    lastTs = ts;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const [r,g,b] = accent();
    const fill = "rgba("+r+","+g+","+b+",0.5)";
    const stroke = "rgb("+r+","+g+","+b+")";
    for (const p of particles) {
      p.x+=p.vx; p.y+=p.vy;
      if (p.x<0||p.x>canvas.width) p.vx*=-1;
      if (p.y<0||p.y>canvas.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=fill; ctx.fill();
    }
    ctx.strokeStyle=stroke; ctx.lineWidth=0.8;
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.hypot(dx,dy);
        if (d<DIST) {
          ctx.globalAlpha=(1-d/DIST)*0.2;
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha=1;
  }
  draw(0);
})();

// Scroll Progress Bar
(function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct,100) + "%";
  }, { passive: true });
})();

// Custom Cursor
(function initCursor() {
  const cursor = document.getElementById("cursor");
  const ring   = document.getElementById("cursor-ring");
  if (!cursor||!ring) return;
  let mx=-100, my=-100, rx=-100, ry=-100;
  document.addEventListener("mousemove", (e) => {
    mx=e.clientX; my=e.clientY;
    cursor.style.translate=mx+"px "+my+"px";
  });
  (function lerpRing() {
    rx+=(mx-rx)*0.13; ry+=(my-ry)*0.13;
    ring.style.translate=rx+"px "+ry+"px";
    requestAnimationFrame(lerpRing);
  })();
  document.querySelectorAll("a, button, .info-card, .skill-tag, .bento-stat, .bento-photo").forEach(el => {
    el.addEventListener("mouseenter", () => { cursor.classList.add("cursor-hover"); ring.classList.add("ring-hover"); });
    el.addEventListener("mouseleave", () => { cursor.classList.remove("cursor-hover"); ring.classList.remove("ring-hover"); });
  });
  document.addEventListener("touchstart", () => { cursor.style.display="none"; ring.style.display="none"; }, { once:true });
})();

// Scroll To Top Button
(function initScrollTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    const nearBottom = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 120);
    btn.classList.toggle("visible", nearBottom);
  }, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// Photo Carousel
(function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const dots = document.querySelectorAll('.carousel-dot');
  const total = track.querySelectorAll('img').length;
  let current = 0;
  let timer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { timer = setInterval(next, 4000); }
  function stopAuto()  { clearInterval(timer); }

  document.querySelector('.carousel-next')?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  document.querySelector('.carousel-prev')?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  const photo = document.querySelector('.bento-photo');
  photo?.addEventListener('mouseenter', stopAuto);
  photo?.addEventListener('mouseleave', startAuto);

  startAuto();
})();

// Deploy Easter Egg
  // Returns transform-origin that keeps the scaled image inside the viewport
  function safeOrigin(f, scale) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const sw = f.w * scale, sh = f.h * scale;
    const cx = f.x + f.w / 2, cy = f.y + f.h / 2;
    // check each edge at the given scale with center origin
    let ox = '50%', oy = '50%';
    if (cx - sw / 2 < 8)      ox = '0%';
    if (cx + sw / 2 > vw - 8) ox = '100%';
    if (cy - sh / 2 < 8)      oy = '0%';
    if (cy + sh / 2 > vh - 8) oy = '100%';
    return ox + ' ' + oy;
  }

(function initDeploy() {
  const IMAGES = [
    { name: 'day1s',     caption: '// my very earliest mistakes were made with these people' },
    { name: 'family',    caption: '// the fam i love very very much' },
    { name: 'freshmen',  caption: '// before the storm(CS): freshmen year richard' },
    { name: 'gline',     caption: '// LETS GO GLINE' },
    { name: 'jammin',    caption: '// jammim bummin' },
    { name: 'roommates', caption: '// cool engineer roomies' },
    { name: 'tang',      caption: '// tangtangtangtang' },
    { name: 'vonvon',    caption: '// with my favorite and only nephew' },
    { name: 'homies',    caption: '// they knew me before the glow up' },
  ];

  const btn       = document.getElementById('deploy-btn');
  const aftermath = document.getElementById('deploy-aftermath');
  // aftermath's "AGAIN?" triggers re-deploy
  if (aftermath) aftermath.addEventListener('click', () => { if (state === 'popped') deploy(); });
  const section   = document.getElementById('deploy-section');
  if (!btn) return;

  // Reveal deploy section on scroll
  if (section) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { section.classList.add('visible'); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(section);
  }

  let state   = 'idle';
  let floaters = [];
  let animId   = null;
  let drag     = null;

  const isMobile     = () => window.innerWidth <= 600;
  const isTablet     = () => window.innerWidth <= 900;
  const IMG_W        = () => isMobile() ? 80 : isTablet() ? 110 : 160;
  // touchstart always fires before synthetic mouseenter, so this flag is set in time
  let touchUsed = false;
  document.addEventListener('touchstart', () => { touchUsed = true; }, { once: true, passive: true });
  const showCaption = () => !touchUsed;
  const MAX_SPEED   = 1.1;
  const clamp       = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const visualScale = f => f.el.classList.contains('clicked')  ? 2.28
                         : f.el.classList.contains('hovered')  ? 2.22
                         : f.el.classList.contains('dragging') ? 2.08 : 1;

  // Cursor caption (hover)
  const cursorCaption = document.createElement('div');
  cursorCaption.className = 'cursor-caption';
  document.body.appendChild(cursorCaption);

  // Click/tap popup
  const clickPopup = document.createElement('div');
  clickPopup.className = 'click-popup';
  document.body.appendChild(clickPopup);
  let clickedFloater = null;

  function positionPopup(f) {
    const pw = clickPopup.offsetWidth || 120;
    const ph = clickPopup.offsetHeight || 32;
    let px = f.x + f.w / 2 - pw / 2;
    let py = f.y - ph - 12;
    px = Math.max(8, Math.min(px, window.innerWidth - pw - 8));
    if (py < 8) py = f.y + f.h + 12;
    clickPopup.style.left = px + 'px';
    clickPopup.style.top  = py + 'px';
  }

  function showClickPopup(f) {
    if (clickedFloater) {
      clickedFloater.el.classList.remove('clicked');
      clickedFloater.el.style.transformOrigin = '';
      clickedFloater.paused = clickedFloater.isHovered;
    }
    clickedFloater = f;
    f.paused = true;
    cursorCaption.classList.remove('visible'); // click popup replaces cursor caption
    if (f.ready) f.el.style.transformOrigin = safeOrigin(f, 2.28);
    f.el.classList.add('clicked');
    clickPopup.textContent = f.caption;
    clickPopup.style.left = '-9999px';
    clickPopup.style.display = 'block';
    requestAnimationFrame(() => {
      positionPopup(f);
      clickPopup.classList.add('visible');
    });
  }

  function hideClickPopup() {
    clickPopup.classList.remove('visible');
    if (clickedFloater) {
      clickedFloater.el.classList.remove('clicked');
      clickedFloater.el.style.transformOrigin = '';
      // ensure image always resumes moving after dismiss
      if (Math.hypot(clickedFloater.vx, clickedFloater.vy) < 0.1) {
        const _a = Math.random() * Math.PI * 2;
        clickedFloater.vx = Math.cos(_a) * clickedFloater.cruiseSpd;
        clickedFloater.vy = Math.sin(_a) * clickedFloater.cruiseSpd;
      }
      clickedFloater.paused = clickedFloater.isHovered;
      clickedFloater = null;
    }
    setTimeout(() => { if (!clickedFloater) clickPopup.style.display = 'none'; }, 220);
  }

  // dismiss popup on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.float-img')) hideClickPopup();
  });

  const teaserEl = document.querySelector('.deploy-teaser');
  const subEl     = document.querySelector('.deploy-sub');

  // DEPLOY (also called on 'again?' — handles both first deploy and re-deploy)
  function deploy() {
    state = 'deployed';
    btn.textContent = 'pop';

    // fade teaser out (clears "wanna see something cool" or "was that fun?")
    if (teaserEl) { teaserEl.style.transition = 'opacity 0.4s ease'; teaserEl.style.opacity = '0'; }

    // only animate woahhh on first deploy; on re-deploy it's already showing
    const hasWoah = subEl && subEl.querySelector('.woah-letter');
    if (subEl && !hasWoah) { subEl.style.transition = 'opacity 0.4s ease'; subEl.style.opacity = '0'; }

    setTimeout(() => {
      if (teaserEl) { teaserEl.textContent = ''; teaserEl.style.opacity = '1'; }
      if (subEl && !hasWoah) {
        const word = 'woahhh';
        subEl.innerHTML = word.split('').map((ch, i) =>
          `<span class="woah-letter" style="animation-delay:${i * 0.09}s;--glow-delay:${0.55 + i * 0.09}s">${ch}</span>`
        ).join('');
        subEl.style.opacity = '1';
      }
    }, 420);

    // restore btn, hide aftermath when (re-)deploying
    btn.style.display  = '';
    btn.style.opacity  = '1';
    if (aftermath) { aftermath.style.opacity = '0'; aftermath.style.display = 'none'; }
    // clear any existing floaters before creating new ones (re-deploy case)
    floaters.forEach(f => { if (f.el.parentNode) f.el.remove(); });
    floaters = [];

    const r  = btn.getBoundingClientRect();
    const ox = r.left + r.width  / 2;
    const oy = r.top  + r.height / 2;

    IMAGES.forEach((data, idx) => {
      const el = document.createElement('div');
      el.className = 'float-img';
      el.innerHTML = '<img'
        + ' src="../images/lg/'  + data.name + '.webp"'
        + ' srcset="../images/sm/' + data.name + '.webp 160w,'
        +        ' ../images/md/' + data.name + '.webp 220w,'
        +        ' ../images/lg/' + data.name + '.webp 320w"'
        + ' sizes="(max-width:600px) 160px, (max-width:900px) 220px, 320px"'
        + ' alt="' + data.name + '" draggable="false">';
      document.body.appendChild(el);

      const w = IMG_W();
      el.style.cssText = 'width:' + w + 'px;left:0;top:0;transform:scale(0);opacity:0;transition:transform 0.55s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s ease,translate 0.7s ease;';
      el.style.translate = (ox - w/2) + 'px ' + (oy - w/2) + 'px';

      const margin = 40;
      const tx = margin + Math.random() * (window.innerWidth  - w - margin * 2);
      const ty = margin + Math.random() * (window.innerHeight - w - margin * 2);
      const spd = 0.25 + Math.random() * 0.35;
      const ang = Math.random() * Math.PI * 2;

      const f = {
        el, caption: data.caption,
        x: ox - w/2, y: oy - w/2,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        w: 0, h: 0, ready: false, paused: false, dragging: false, isHovered: false,
        cruiseSpd: spd, fling: false
      };
      floaters.push(f);

      setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.opacity   = '1';
        el.style.translate = tx + 'px ' + ty + 'px';

        setTimeout(() => {
          // keep transform transition for hover expand, remove left/top transition
          el.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease';
          el.style.transform = ''; // let CSS classes control scale
          f.x = tx; f.y = ty;
          f.w = el.offsetWidth; f.h = el.offsetHeight;
          f.ready = true;
        }, 780);
      }, idx * 90);

      // hover: cursor caption
      el.addEventListener('mouseenter', () => {
        if (f.dragging) return;
        f.isHovered = true; f.paused = true;
        if (f.ready) el.style.transformOrigin = safeOrigin(f, 2.22);
        el.classList.add('hovered');
        if (showCaption()) {
          cursorCaption.textContent = data.caption;
          cursorCaption.classList.add('visible');
        }
      });
      el.addEventListener('mouseleave', () => {
        if (f.dragging) return;
        f.isHovered = false;
        f.paused = (f === clickedFloater); // stay paused if still clicked
        el.classList.remove('hovered');
        el.style.transformOrigin = '';
        if (showCaption()) cursorCaption.classList.remove('visible');
      });

      // drag: mouse
      el.addEventListener('mousedown', (e) => {
        if (touchUsed) return; // ignore synthetic mousedown fired after touch events
        e.preventDefault();
        drag = { f, offX: e.clientX - f.x, offY: e.clientY - f.y, lx: e.clientX, ly: e.clientY, dvx: 0, dvy: 0, didMove: false, vxHist: [], vyHist: [] };
        f.dragging = true; f.paused = true;
        el.classList.add('dragging');
        el.classList.remove('hovered');
      });

      // touch: drag + tap
      let tSX, tSY, tMoved = false, tDrag = false;
      el.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        tSX = t.clientX; tSY = t.clientY; tMoved = false; tDrag = false;
        drag = { f, offX: t.clientX - f.x, offY: t.clientY - f.y, lx: t.clientX, ly: t.clientY, dvx: 0, dvy: 0, didMove: false, vxHist: [], vyHist: [] };
      }, { passive: true });

      el.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (!tMoved && Math.hypot(t.clientX - tSX, t.clientY - tSY) > 8) {
          tMoved = true; tDrag = true;
          f.dragging = true; f.paused = true;
          el.classList.remove('clicked');
        }
        if (tDrag && drag) {
          drag.dvx = t.clientX - drag.lx; drag.dvy = t.clientY - drag.ly;
          drag.lx  = t.clientX;           drag.ly  = t.clientY;
          drag.vxHist.push(drag.dvx); drag.vyHist.push(drag.dvy);
          if (drag.vxHist.length > 4) { drag.vxHist.shift(); drag.vyHist.shift(); }
          f.x = t.clientX - drag.offX; f.y = t.clientY - drag.offY;
          el.style.translate = f.x + 'px ' + f.y + 'px';
        }
        e.preventDefault();
      }, { passive: false });

      el.addEventListener('touchend', (e) => {
        if (tDrag && drag) {
          // it was a drag — fling
          const _nh = drag.vxHist.length || 1;
          const _fvx = drag.vxHist.reduce((a, b) => a + b, 0) / _nh;
          const _fvy = drag.vyHist.reduce((a, b) => a + b, 0) / _nh;
          f.vx = clamp(_fvx * 0.45, -8, 8);
          f.vy = clamp(_fvy * 0.45, -8, 8);
          f.fling = true;
          f.dragging = false; f.paused = false;
          el.classList.remove('dragging');
        } else {
          // it was a tap — show popup (touch equivalent of hover+click)
          e.preventDefault(); // suppress synthetic mousedown/mouseup/click after touchend
          if (clickedFloater === f) hideClickPopup();
          else showClickPopup(f);
        }
        drag = null; tDrag = false;
      });
    });

    startPhysics();
  }

  // GLOBAL MOUSE DRAG + CURSOR CAPTION FOLLOW
  document.addEventListener('mousemove', (e) => {
    // update cursor caption position
    // keep cursor caption inside viewport
    const ccW = cursorCaption.offsetWidth  || 120;
    const ccH = cursorCaption.offsetHeight || 28;
    let ccX = e.clientX + 14;
    let ccY = e.clientY - 10;
    if (ccX + ccW > window.innerWidth  - 8) ccX = e.clientX - ccW - 14;
    if (ccY < 8)                             ccY = e.clientY + 20;
    if (ccY + ccH > window.innerHeight - 8)  ccY = e.clientY - ccH - 14;
    cursorCaption.style.left = Math.max(8, ccX) + 'px';
    cursorCaption.style.top  = Math.max(8, ccY) + 'px';

    if (!drag) return;
    const moved = Math.hypot(e.clientX - drag.lx, e.clientY - drag.ly);
    if (moved > 5) drag.didMove = true;
    drag.dvx = e.clientX - drag.lx; drag.dvy = e.clientY - drag.ly;
    drag.lx  = e.clientX;           drag.ly  = e.clientY;
    drag.vxHist.push(drag.dvx); drag.vyHist.push(drag.dvy);
    if (drag.vxHist.length > 4) { drag.vxHist.shift(); drag.vyHist.shift(); }
    drag.f.x = e.clientX - drag.offX; drag.f.y = e.clientY - drag.offY;
    drag.f.el.style.translate = drag.f.x + 'px ' + drag.f.y + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!drag) return;
    const f = drag.f;
    if (!drag.didMove) {
      // cursor device click — hover already handles it, just dismiss any leftover popup
      hideClickPopup();
    } else {
      const _nh = drag.vxHist.length || 1;
      const _fvx = drag.vxHist.reduce((a, b) => a + b, 0) / _nh;
      const _fvy = drag.vyHist.reduce((a, b) => a + b, 0) / _nh;
      f.vx = clamp(_fvx * 0.45, -8, 8);
      f.vy = clamp(_fvy * 0.45, -8, 8);
      f.fling = true;
    }
    f.dragging = false;
    f.paused = f.isHovered || (f === clickedFloater);
    f.el.classList.remove('dragging');
    drag = null;
  });

  // PHYSICS LOOP
  function startPhysics() {
    function tick() {
      const iw = window.innerWidth, ih = window.innerHeight;

      floaters.forEach(f => {
        if (!f.ready || f.paused || f.dragging) return;
        if (f.fling) {
          // smooth deceleration after a throw
          f.vx *= 0.97; f.vy *= 0.97;
          const s = Math.hypot(f.vx, f.vy);
          if (s < f.cruiseSpd + 0.1) {
            // settle back to original cruise speed, preserving direction
            const n = s || f.cruiseSpd;
            f.vx = (f.vx / n) * f.cruiseSpd;
            f.vy = (f.vy / n) * f.cruiseSpd;
            f.fling = false;
          }
        } else if (Math.hypot(f.vx, f.vy) > MAX_SPEED) {
          // collision boost — return to cruise more snappily
          f.vx *= 0.94; f.vy *= 0.94;
        }
        // safety net: never let a free image stop completely
        if (!f.fling && Math.hypot(f.vx, f.vy) < 0.05) {
          const _a = Math.random() * Math.PI * 2;
          f.vx = Math.cos(_a) * f.cruiseSpd; f.vy = Math.sin(_a) * f.cruiseSpd;
        }
        f.x += f.vx; f.y += f.vy;
        if (f.x <= 0)        { f.x = 0;        f.vx =  Math.abs(f.vx); }
        if (f.x + f.w >= iw) { f.x = iw - f.w; f.vx = -Math.abs(f.vx); }
        if (f.y <= 0)        { f.y = 0;         f.vy =  Math.abs(f.vy); }
        if (f.y + f.h >= ih) { f.y = ih - f.h;  f.vy = -Math.abs(f.vy); }
        f.el.style.translate = f.x + 'px ' + f.y + 'px';
      });

      // image-image collisions (AABB using visual/scaled bounds)
      for (let i = 0; i < floaters.length; i++) {
        for (let j = i + 1; j < floaters.length; j++) {
          const a = floaters[i], b = floaters[j];
          if (!a.ready || !b.ready) continue;
          const as = visualScale(a), bs = visualScale(b);
          const aw = a.w * as, ah = a.h * as;
          const ax = a.x - (aw - a.w) / 2, ay = a.y - (ah - a.h) / 2;
          const bw = b.w * bs, bh = b.h * bs;
          const bx = b.x - (bw - b.w) / 2, by = b.y - (bh - b.h) / 2;
          const penX = Math.min(ax + aw, bx + bw) - Math.max(ax, bx);
          const penY = Math.min(ay + ah, by + bh) - Math.max(ay, by);
          if (penX <= 0 || penY <= 0) continue;
          const aStatic = a.paused || a.dragging;
          const bStatic = b.paused || b.dragging;
          if (penX < penY) {
            const dir = (ax + aw / 2) < (bx + bw / 2) ? 1 : -1;
            if (!aStatic && !bStatic) {
              const push = penX / 2 + 0.5;
              a.x -= dir * push; b.x += dir * push;
            } else if (aStatic) { b.x += dir * Math.min(penX + 1, 18); }
              else               { a.x -= dir * Math.min(penX + 1, 18); }
            if ((a.vx - b.vx) * dir > 0) {
              if      (aStatic) { b.vx = -b.vx; }
              else if (bStatic) { a.vx = -a.vx; }
              else              { const t = a.vx; a.vx = b.vx; b.vx = t; }
              a.vx = clamp(a.vx, -8, 8); b.vx = clamp(b.vx, -8, 8);
            }
          } else {
            const dir = (ay + ah / 2) < (by + bh / 2) ? 1 : -1;
            if (!aStatic && !bStatic) {
              const push = penY / 2 + 0.5;
              a.y -= dir * push; b.y += dir * push;
            } else if (aStatic) { b.y += dir * Math.min(penY + 1, 18); }
              else               { a.y -= dir * Math.min(penY + 1, 18); }
            if ((a.vy - b.vy) * dir > 0) {
              if      (aStatic) { b.vy = -b.vy; }
              else if (bStatic) { a.vy = -a.vy; }
              else              { const t = a.vy; a.vy = b.vy; b.vy = t; }
              a.vy = clamp(a.vy, -8, 8); b.vy = clamp(b.vy, -8, 8);
            }
          }
        }
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // POP — removes floaters, keeps woahhh, hides main btn, shows aftermath ("was that fun?" + "AGAIN?")
  function pop() {
    state = 'popped';
    hideClickPopup();
    cursorCaption.classList.remove('visible');
    floaters.forEach(f => {
      f.el.style.transition = 'transform 0.45s cubic-bezier(0.55,0,1,0.45), opacity 0.4s ease';
      f.el.style.transform  = 'scale(0)';
      f.el.style.opacity    = '0';
      setTimeout(() => { if (f.el.parentNode) f.el.remove(); }, 500);
    });
    floaters = [];
    // hide main btn — aftermath provides the "AGAIN?" action
    btn.style.transition = 'opacity 0.3s ease';
    btn.style.opacity    = '0';
    setTimeout(() => { btn.style.display = 'none'; }, 300);
    // woahhh stays in subEl unchanged
    // show aftermath which contains "was that fun?" + "AGAIN?" from HTML
    if (aftermath) {
      aftermath.style.transition = 'opacity 0.4s ease';
      aftermath.style.opacity    = '0';
      aftermath.style.display    = 'block';
      setTimeout(() => { aftermath.style.opacity = '1'; }, 400);
    }
  }

  btn.addEventListener('click', () => {
    if (state === 'deployed') pop();
    else deploy(); // 'idle' (first time) or 'popped' (again?)
  });

})();
