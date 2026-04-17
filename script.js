// ===== PARTÍCULAS — Mar de partículas ondulantes (Efecto Blanco/Negro) =====
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let W, H;
  let isMobile = false;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    isMobile = W < 768;
    initParticles();
  }
  window.addEventListener('resize', resize);

  // Parámetros para el "mar" de partículas
  // Más densidad en escritorio, menos en móvil para rendimiento
  let ROWS = 45;
  let COLS = 45;
  let particles = [];

  function initParticles() {
    particles = [];
    ROWS = isMobile ? 30 : 45;
    COLS = isMobile ? 30 : 45;
    
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        particles.push({
          x: (j / COLS) * W,
          y: (i / ROWS) * H,
          baseX: (j / COLS) * W,
          baseY: (i / ROWS) * H,
          // Partículas más pequeñas en móvil
          size: isMobile ? (Math.random() * 0.8 + 0.3) : (Math.random() * 1.5 + 0.5),
          phase: Math.random() * Math.PI * 2,
          offset: (i + j) * 0.1
        });
      }
    }
  }

  // t incrementa más lento para que el movimiento sea pausado
  let t = 0;
  function draw() {
    // Fondo negro puro con estela mínima
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, W, H);

    // Velocidad reducida (antes 0.02)
    t += 0.012;

    for (const p of particles) {
      // Movimiento ondulante tipo mar - Amplitud reducida para suavidad
      const waveX = Math.sin(t + p.offset) * (isMobile ? 8 : 12);
      const waveY = Math.cos(t * 0.8 + p.offset) * (isMobile ? 12 : 18);
      
      const currentX = p.baseX + waveX;
      const currentY = p.baseY + waveY;

      // Brillo variable según la onda
      const brightness = Math.sin(t + p.phase) * 0.5 + 0.5;
      const alpha = 0.08 + brightness * 0.5;

      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      // Destello ocasional más suave
      if (brightness > 0.97) {
        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.25})`;
        ctx.fill();
      }
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
  resetCarouselTimer();
}

function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const dots  = document.querySelectorAll('.dot');
  if (!track) return;
  track.style.transform  = `translateX(-${currentSlide * 100}%)`;
  track.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
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
  if (btn) btn.classList.toggle('active');
}

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
