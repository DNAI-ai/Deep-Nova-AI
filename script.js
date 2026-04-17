// ===== PARTÍCULAS — Mar de partículas ondulantes con TAMAÑO Y BRILLO MAXIMIZADO =====
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

  let ROWS = 45;
  let COLS = 45;
  let particles = [];

  function initParticles() {
    particles = [];
    // Menos densidad pero más tamaño para un efecto más "marino" y visible
    ROWS = isMobile ? 30 : 40;
    COLS = isMobile ? 30 : 40;
    
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        // Variación sutil de tamaño: en web son más grandes en general
        const baseSize = isMobile ? 0.8 : 1.8;
        const sizeVar = Math.random() * (isMobile ? 0.6 : 1.2);
        
        particles.push({
          x: (j / COLS) * W,
          y: (i / ROWS) * H,
          baseX: (j / COLS) * W,
          baseY: (i / ROWS) * H,
          size: baseSize + sizeVar,
          phase: Math.random() * Math.PI * 2,
          offset: (i + j) * 0.12,
          sparkleSpeed: Math.random() * 0.04 + 0.01
        });
      }
    }
  }

  let t = 0;
  function draw() {
    // Fondo negro con estela mínima para que el brillo destaque
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, W, H);

    // Movimiento extra lento y fluido
    t += isMobile ? 0.007 : 0.005;

    for (const p of particles) {
      const waveX = Math.sin(t + p.offset) * (isMobile ? 10 : 20);
      const waveY = Math.cos(t * 0.7 + p.offset) * (isMobile ? 15 : 30);
      
      const currentX = p.baseX + waveX;
      const currentY = p.baseY + waveY;

      // Brillo variable con mayor intensidad
      const brightness = Math.sin(t * 1.2 + p.phase) * 0.5 + 0.5;
      const alpha = 0.2 + brightness * 0.7; 

      // Dibujar resplandor (glow) más amplio
      if (brightness > 0.6) {
        const glowSize = p.size * (isMobile ? 5 : 8);
        const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, glowSize);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.35})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Núcleo de la partícula
      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      // Destello extra brillante (sparkle)
      if (brightness > 0.92) {
        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
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
