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
  const COUNT = 48, DIST = 135;
  let particles = [];
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
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const [r,g,b] = accent();
    for (const p of particles) {
      p.x+=p.vx; p.y+=p.vy;
      if (p.x<0||p.x>canvas.width) p.vx*=-1;
      if (p.y<0||p.y>canvas.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle="rgba("+r+","+g+","+b+",0.5)"; ctx.fill();
    }
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.hypot(dx,dy);
        if (d<DIST) {
          ctx.globalAlpha=(1-d/DIST)*0.2;
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle="rgb("+r+","+g+","+b+")"; ctx.lineWidth=0.8; ctx.stroke();
        }
      }
    }
    ctx.globalAlpha=1; requestAnimationFrame(draw);
  }
  draw();
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
    cursor.style.left=mx+"px"; cursor.style.top=my+"px";
  });
  (function lerpRing() {
    rx+=(mx-rx)*0.13; ry+=(my-ry)*0.13;
    ring.style.left=rx+"px"; ring.style.top=ry+"px";
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

  const isMobile  = () => window.innerWidth <= 600;
  const isTablet  = () => window.innerWidth <= 900;
  const IMG_W     = () => isMobile() ? 80 : isTablet() ? 110 : 160;
  const MAX_SPEED = 2.2;
  const clamp     = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

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
      if (!clickedFloater.el.matches(':hover')) clickedFloater.paused = false;
    }
    clickedFloater = f;
    f.paused = true;
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
      if (!clickedFloater.el.matches(':hover')) clickedFloater.paused = false;
      clickedFloater = null;
    }
    setTimeout(() => { if (!clickedFloater) clickPopup.style.display = 'none'; }, 220);
  }

  // dismiss popup on outside click (desktop)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.float-img')) hideClickPopup();
  });

  // dismiss popup on tap outside float-img (mobile — synthetic click is unreliable on touch)
  let _docTouchMoved = false;
  document.addEventListener('touchstart', () => { _docTouchMoved = false; }, { passive: true });
  document.addEventListener('touchmove',  () => { _docTouchMoved = true;  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!_docTouchMoved && !e.target.closest('.float-img')) hideClickPopup();
    _docTouchMoved = false;
  }, { passive: true });

  const teaserEl = document.querySelector('.deploy-teaser');
  const subEl     = document.querySelector('.deploy-sub');

  // DEPLOY
  function deploy() {
    state = 'deployed';
    btn.textContent = 'pop';
    if (teaserEl) { teaserEl.style.transition = 'opacity 0.4s ease'; teaserEl.style.opacity = '0'; }
    if (subEl)    { subEl.style.transition    = 'opacity 0.4s ease'; subEl.style.opacity    = '0'; }
    setTimeout(() => {
      if (teaserEl) { teaserEl.textContent = ''; teaserEl.style.opacity = '1'; }
      if (subEl) {
        const word = 'woahhh';
        subEl.innerHTML = word.split('').map((ch, i) =>
          `<span class="woah-letter" style="animation-delay:${i * 0.09}s;--glow-delay:${0.55 + i * 0.09}s">${ch}</span>`
        ).join('');
        subEl.style.opacity = '1';
      }
    }, 420);

    const r  = btn.getBoundingClientRect();
    const ox = r.left + r.width  / 2;
    const oy = r.top  + r.height / 2;

    IMAGES.forEach((data, idx) => {
      const el = document.createElement('div');
      el.className = 'float-img';
      el.innerHTML = '<img src="../images/' + data.name + '.webp" alt="' + data.name + '" draggable="false">';
      document.body.appendChild(el);

      const w = IMG_W();
      el.style.cssText = 'width:' + w + 'px;left:' + (ox - w/2) + 'px;top:' + (oy - w/2) + 'px;transform:scale(0);opacity:0;transition:transform 0.55s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s ease,left 0.7s ease,top 0.7s ease;';

      const margin = 40;
      const tx = margin + Math.random() * (window.innerWidth  - w - margin * 2);
      const ty = margin + Math.random() * (window.innerHeight - w - margin * 2);
      const spd = 0.55 + Math.random() * 0.75;
      const ang = Math.random() * Math.PI * 2;

      const f = {
        el, caption: data.caption,
        x: ox - w/2, y: oy - w/2,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        w: 0, h: 0, ready: false, paused: false, dragging: false
      };
      floaters.push(f);

      setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.opacity   = '1';
        el.style.left = tx + 'px';
        el.style.top  = ty + 'px';

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
        f.paused = true;
        if (f.ready) el.style.transformOrigin = safeOrigin(f, 2.22);
        el.classList.add('hovered');
        cursorCaption.textContent = data.caption;
        cursorCaption.classList.add('visible');
      });
      el.addEventListener('mouseleave', () => {
        if (f.dragging) return;
        if (clickedFloater !== f) f.paused = false;
        el.classList.remove('hovered');
        el.style.transformOrigin = '';
        cursorCaption.classList.remove('visible');
      });

      // drag: mouse
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        drag = { f, offX: e.clientX - f.x, offY: e.clientY - f.y, lx: e.clientX, ly: e.clientY, dvx: 0, dvy: 0, didMove: false };
        f.dragging = true; f.paused = true;
        el.classList.add('dragging');
        el.classList.remove('hovered');
        cursorCaption.classList.remove('visible');
      });

      // touch: drag + tap
      let tSX, tSY, tMoved = false, tDrag = false;
      el.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        tSX = t.clientX; tSY = t.clientY; tMoved = false; tDrag = false;
        drag = { f, offX: t.clientX - f.x, offY: t.clientY - f.y, lx: t.clientX, ly: t.clientY, dvx: 0, dvy: 0, didMove: false };
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
          f.x = t.clientX - drag.offX; f.y = t.clientY - drag.offY;
          el.style.left = f.x + 'px';  el.style.top  = f.y + 'px';
        }
        e.preventDefault();
      }, { passive: false });

      el.addEventListener('touchend', (e) => {
        e.stopPropagation(); // prevent document touchend from double-firing dismiss
        if (tDrag && drag) {
          f.vx = clamp(drag.dvx * 0.45, -MAX_SPEED, MAX_SPEED);
          f.vy = clamp(drag.dvy * 0.45, -MAX_SPEED, MAX_SPEED);
          f.dragging = false; f.paused = false;
          el.classList.remove('dragging');
        } else if (!tMoved) {
          // tap
          if (clickedFloater === f) hideClickPopup();
          else showClickPopup(f);
        }
        drag = null; tDrag = false;
      });
      el.addEventListener('click', (e) => e.stopPropagation()); // prevent document click dismiss
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
    drag.f.x = e.clientX - drag.offX; drag.f.y = e.clientY - drag.offY;
    drag.f.el.style.left = drag.f.x + 'px'; drag.f.el.style.top = drag.f.y + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!drag) return;
    const f = drag.f;
    if (!drag.didMove) {
      // it was a click, not a drag
      if (clickedFloater === f) hideClickPopup();
      else showClickPopup(f);
    } else {
      f.vx = clamp(drag.dvx * 0.45, -MAX_SPEED, MAX_SPEED);
      f.vy = clamp(drag.dvy * 0.45, -MAX_SPEED, MAX_SPEED);
    }
    f.dragging = false;
    if (!f.el.matches(':hover')) { f.paused = false; }
    f.el.classList.remove('dragging');
    drag = null;
  });

  // PHYSICS LOOP
  function startPhysics() {
    function tick() {
      const iw = window.innerWidth, ih = window.innerHeight;

      floaters.forEach(f => {
        if (!f.ready || f.paused || f.dragging) return;
        f.x += f.vx; f.y += f.vy;
        if (f.x <= 0)        { f.x = 0;        f.vx =  Math.abs(f.vx); }
        if (f.x + f.w >= iw) { f.x = iw - f.w; f.vx = -Math.abs(f.vx); }
        if (f.y <= 0)        { f.y = 0;         f.vy =  Math.abs(f.vy); }
        if (f.y + f.h >= ih) { f.y = ih - f.h;  f.vy = -Math.abs(f.vy); }
        f.el.style.left = f.x + 'px';
        f.el.style.top  = f.y + 'px';
      });

      // image-image collisions
      for (let i = 0; i < floaters.length; i++) {
        for (let j = i + 1; j < floaters.length; j++) {
          const a = floaters[i], b = floaters[j];
          if (!a.ready || !b.ready) continue;
          const dx   = (a.x + a.w/2) - (b.x + b.w/2);
          const dy   = (a.y + a.h/2) - (b.y + b.h/2);
          const dist = Math.hypot(dx, dy) || 0.01;
          const min  = (a.w + b.w) / 2.2;
          if (dist < min) {
            const nx = dx/dist, ny = dy/dist;
            const push = (min - dist) / 2 + 0.5;
            if (!a.paused && !a.dragging) { a.x += nx*push; a.y += ny*push; }
            if (!b.paused && !b.dragging) { b.x -= nx*push; b.y -= ny*push; }
            const dvx = a.vx - b.vx, dvy = a.vy - b.vy;
            const dot = dvx*nx + dvy*ny;
            if (dot < 0) {
              a.vx -= dot*nx; a.vy -= dot*ny;
              b.vx += dot*nx; b.vy += dot*ny;
              a.vx = clamp(a.vx,-MAX_SPEED,MAX_SPEED); a.vy = clamp(a.vy,-MAX_SPEED,MAX_SPEED);
              b.vx = clamp(b.vx,-MAX_SPEED,MAX_SPEED); b.vy = clamp(b.vy,-MAX_SPEED,MAX_SPEED);
            }
          }
        }
      }

      // keep click popup tracking clicked floater
      if (clickedFloater && clickedFloater.ready) positionPopup(clickedFloater);

      animId = requestAnimationFrame(tick);
    }
    animId = requestAnimationFrame(tick);
  }

  // POP & HIDE
  function pop() {
    state = 'popped';
    cancelAnimationFrame(animId);
    hideClickPopup();
    cursorCaption.classList.remove('visible');
    const total = floaters.length;
    floaters.forEach((f, i) => {
      setTimeout(() => {
        f.el.style.transition = 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease 0.12s';
        f.el.style.transform  = 'scale(1.3)';
        setTimeout(() => {
          f.el.style.transform = 'scale(0)';
          f.el.style.opacity   = '0';
          setTimeout(() => f.el.remove(), 300);
        }, 140);
      }, i * 45);
    });
    floaters = [];
    setTimeout(() => {
      btn.style.transition = 'opacity 0.3s ease';
      btn.style.opacity    = '0';
      setTimeout(() => { btn.style.display = 'none'; aftermath.style.display = 'block'; }, 320);
    }, total * 45 + 420);
  }

  btn.addEventListener('click', () => {
    if (state === 'idle')          deploy();
    else if (state === 'deployed') pop();
  });

  // "again?" button — reset and redeploy
  const againBtn = document.getElementById('deploy-again-btn');
  if (againBtn) {
    againBtn.addEventListener('click', () => {
      // hide aftermath, restore deploy button
      aftermath.style.display = 'none';
      btn.style.display       = '';
      btn.style.opacity       = '1';
      btn.textContent         = 'deploy';
      state = 'idle';
      floaters = [];
      animId   = null;
      drag     = null;
      deploy();
    });
  }
})();
