// ===== PARTÍCULAS — superficie marina con destellos brillantes =====
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resize);

  // ── Parámetros generales ──────────────────────────────────────────
  const NUM_FLOW   = 700;   // partículas de flujo (corriente)
  const NUM_SPARK  = 280;   // destellos brillantes (puntos de luz)
  let flowParts  = [];
  let sparkParts = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initParticles() {
    flowParts  = [];
    sparkParts = [];

    // Partículas de flujo: se mueven con campo vectorial ondulado
    for (let i = 0; i < NUM_FLOW; i++) {
      flowParts.push({
        x:     rand(0, W),
        y:     rand(0, H),
        speed: rand(0.18, 0.55),
        size:  rand(0.6, 1.8),
        phase: rand(0, Math.PI * 2),
        hue:   rand(0, 40),       // variación individual de tono
        alpha: rand(0.25, 0.65),
      });
    }

    // Destellos: puntos fijos que parpadean con brillo intenso
    for (let i = 0; i < NUM_SPARK; i++) {
      sparkParts.push({
        x:       rand(0, W),
        y:       rand(0, H),
        baseR:   rand(0.5, 1.4),
        phase:   rand(0, Math.PI * 2),
        speed:   rand(0.008, 0.025),
        hue:     rand(-20, 30),   // offset de tono
        drift:   rand(-0.08, 0.08),
      });
    }
  }

  // Paleta: azul profundo → cian → turquesa → leve violeta
  let hueBase = 195;
  let hueDir  = 0.07;
  let t = 0;

  function draw() {
    // Fondo con trail muy oscuro para efecto de estela
    ctx.fillStyle = 'rgba(3, 5, 15, 0.18)';
    ctx.fillRect(0, 0, W, H);

    hueBase += hueDir;
    if (hueBase > 240 || hueBase < 175) hueDir *= -1;
    t += 0.006;

    // ── Partículas de flujo ──────────────────────────────────────────
    for (const p of flowParts) {
      const nx    = p.x * 0.004;
      const ny    = p.y * 0.004;
      const angle = (
        Math.sin(nx + t * 0.8)     * Math.cos(ny * 0.6 + t * 0.5) +
        Math.sin(nx * 1.4 - t * 0.4) * 0.45 +
        Math.cos(p.phase + t * 0.35)  * 0.25
      ) * Math.PI * 2;

      p.x += Math.cos(angle) * p.speed;
      p.y += Math.sin(angle) * p.speed;

      // Wrap
      if (p.x < -2)  p.x = W + 2;
      if (p.x > W+2) p.x = -2;
      if (p.y < -2)  p.y = H + 2;
      if (p.y > H+2) p.y = -2;

      const hue  = (hueBase + p.hue + Math.sin(t + p.phase) * 12) % 360;
      const sat  = 80 + Math.sin(t * 0.5 + p.phase) * 12;
      const lum  = 55 + Math.sin(t * 0.9 + p.phase * 0.7) * 15;
      const a    = p.alpha + Math.sin(t * 1.1 + p.phase) * 0.15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},${sat}%,${lum}%,${Math.max(0.05, a)})`;
      ctx.fill();
    }

    // ── Destellos brillantes ─────────────────────────────────────────
    for (const s of sparkParts) {
      s.phase += s.speed;
      s.x     += s.drift;

      // Wrap horizontal suave
      if (s.x < -4)  s.x = W + 4;
      if (s.x > W+4) s.x = -4;

      const pulse = (Math.sin(s.phase) + 1) * 0.5;  // 0..1
      if (pulse < 0.15) continue;                     // ocultar cuando muy tenue

      const r    = s.baseR + pulse * 2.2;
      const hue  = (hueBase + s.hue + 10) % 360;
      const lum  = 75 + pulse * 22;
      const a    = 0.1 + pulse * 0.85;

      // Halo exterior difuso
      const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3.5);
      grd.addColorStop(0,   `hsla(${hue},95%,${lum}%,${a})`);
      grd.addColorStop(0.4, `hsla(${hue},90%,${lum - 10}%,${a * 0.4})`);
      grd.addColorStop(1,   `hsla(${hue},80%,${lum - 20}%,0)`);
      ctx.beginPath();
      ctx.arc(s.x, s.y, r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Núcleo brillante
      ctx.beginPath();
      ctx.arc(s.x, s.y, r * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},100%,92%,${a * 0.9})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();


// ===== CARRUSEL — 8 s por slide, bucle continuo =====
let currentSlide = 0;
let carouselTimer = null;

function moveCarousel(dir) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  // Reiniciar temporizador al hacer clic manual
  resetCarouselTimer();
}

function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const dots  = document.querySelectorAll('.dot');
  if (!track) return;
  track.style.transform  = `translateX(-${currentSlide * 100}%)`;
  track.style.transition = 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)';
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function resetCarouselTimer() {
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(function () { moveCarousel(1); }, 8000);
}

document.addEventListener('DOMContentLoaded', function () {
  updateCarousel();
  resetCarouselTimer();
});


// ===== NAV MÓVIL — hamburger toggle =====
function toggleNav() {
  const nav = document.getElementById('main-nav');
  const btn = document.querySelector('.nav-toggle');
  if (!nav) return;
  nav.classList.toggle('open');
  // Animar las líneas del hamburger
  if (btn) btn.classList.toggle('active');
}

// Cerrar menú al hacer clic en un enlace (móvil)
document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('#main-nav a');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      const nav = document.getElementById('main-nav');
      const btn = document.querySelector('.nav-toggle');
      if (nav) nav.classList.remove('open');
      if (btn) btn.classList.remove('active');
    });
  });
});
