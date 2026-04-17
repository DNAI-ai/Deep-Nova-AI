// ===== PARTÍCULAS OCEÁNICAS — olas brillantes con cambio de color suave =====
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resize);

  const NUM = 900;
  let parts = [];

  function initParticles() {
    parts = [];
    for (let i = 0; i < NUM; i++) {
      parts.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        ox:    Math.random() * W,   // origin x para noise base
        oy:    Math.random() * H,
        speed: Math.random() * 0.4 + 0.15,
        size:  Math.random() * 2.2 + 0.5,
        phase: Math.random() * Math.PI * 2,
        hue:   Math.random() * 60,  // offset de color individual
      });
    }
  }

  // Paleta: azul → cian → verde agua → violeta, ciclo suave
  // hueBase va de 180 (cian) hasta 300 (violeta) y vuelve
  let hueBase = 190;
  let hueDir  = 0.12;

  let t = 0;

  function draw() {
    // Fondo con trail oscuro
    ctx.fillStyle = 'rgba(3, 6, 18, 0.22)';
    ctx.fillRect(0, 0, W, H);

    hueBase += hueDir;
    if (hueBase > 270 || hueBase < 170) hueDir *= -1;

    t += 0.008;

    for (const p of parts) {
      // Campo de flujo: onda 2D senoidal que simula corriente de agua
      const nx  = p.x * 0.0055;
      const ny  = p.y * 0.0055;
      const angle = (
        Math.sin(nx + t) * Math.cos(ny * 0.7 + t * 0.6) +
        Math.sin(nx * 1.3 - t * 0.5) * 0.5 +
        Math.cos(p.phase + t * 0.4) * 0.3
      ) * Math.PI * 2;

      p.x += Math.cos(angle) * p.speed;
      p.y += Math.sin(angle) * p.speed;

      // Wrap alrededor de pantalla
      if (p.x < -2)  p.x = W + 2;
      if (p.x > W+2) p.x = -2;
      if (p.y < -2)  p.y = H + 2;
      if (p.y > H+2) p.y = -2;

      // Color: tono global + offset individual, brillo varía con movimiento
      const hue  = (hueBase + p.hue + Math.sin(t + p.phase) * 18) % 360;
      const sat  = 75 + Math.sin(t * 0.7 + p.phase) * 15;
      const lum  = 55 + Math.sin(t + p.phase * 0.5) * 18;
      const alpha = 0.45 + Math.sin(t * 1.2 + p.phase) * 0.2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},${sat}%,${lum}%,${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();

// ===== CARRUSEL =====
let currentSlide = 0;

function moveCarousel(dir) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const dots  = document.querySelectorAll('.dot');
  if (!track) return;
  track.style.transform  = `translateX(-${currentSlide * 100}%)`;
  track.style.transition = 'transform 0.5s ease';
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

document.addEventListener('DOMContentLoaded', function () {
  updateCarousel();

  // Auto-avance del carrusel cada 3s
  setInterval(function () { moveCarousel(1); }, 3000);
});



