// ===== PARTÍCULAS — Mar de partículas ondulantes con BRILLO VISIBLE =====
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
    ROWS = isMobile ? 32 : 42;
    COLS = isMobile ? 32 : 42;
    
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const baseSize = isMobile ? 0.6 : 1.0;
        const sizeVar = Math.random() * (isMobile ? 0.5 : 0.8);
        
        particles.push({
          x: (j / COLS) * W,
          y: (i / ROWS) * H,
          baseX: (j / COLS) * W,
          baseY: (i / ROWS) * H,
          size: baseSize + sizeVar,
          phase: Math.random() * Math.PI * 2,
          offset: (i + j) * 0.12
        });
      }
    }
  }

  let t = 0;
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, W, H);

    t += isMobile ? 0.007 : 0.005;

    for (const p of particles) {
      const waveX = Math.sin(t + p.offset) * (isMobile ? 8 : 15);
      const waveY = Math.cos(t * 0.7 + p.offset) * (isMobile ? 12 : 22);
      
      const currentX = p.baseX + waveX;
      const currentY = p.baseY + waveY;

      const brightness = Math.sin(t * 1.2 + p.phase) * 0.5 + 0.5;
      const alpha = 0.18 + brightness * 0.55; 

      if (brightness > 0.7) {
        const glowSize = p.size * (isMobile ? 3 : 5);
        const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, glowSize);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
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
  resetCarouselTimer();
}

function updateCarousel() {
  const track   = document.querySelector('.carousel-track');
  const wrapper = document.querySelector('.carousel-track-wrapper');
  const dots    = document.querySelectorAll('.dot');
  if (!track || !wrapper) return;
  const slideWidth = wrapper.offsetWidth;
  track.style.transform  = `translateX(-${currentSlide * slideWidth}px)`;
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
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.onclick = function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        };

        // Cerrar menú al hacer clic en un enlace
        const links = navMenu.querySelectorAll('a');
        links.forEach(function(link) {
            link.onclick = function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
            };
        });
    }
});
