// ── Theme Toggle ──────────────────────────────────────────────────────────
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

// ── Scroll Reveal ─────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal, .timeline-item").forEach(el => observer.observe(el));

// ── Particle Network ──────────────────────────────────────────────────────
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

// ── Scroll Progress Bar ───────────────────────────────────────────────────
(function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct,100) + "%";
  }, { passive: true });
})();

// ── Custom Cursor ─────────────────────────────────────────────────────────
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

// ── Scroll To Top Button ──────────────────────────────────────────────────
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
