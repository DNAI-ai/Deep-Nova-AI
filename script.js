// ===== INICIALIZAR AOS (Animate On Scroll) =====
document.addEventListener('DOMContentLoaded', function() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }
});

// ===== PARTÍCULAS — Mar de partículas ondulantes con TAMAÑO REDUCIDO Y BRILLO SUTIL =====
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
        const baseSize = isMobile ? 0.5 : 0.8;
        const sizeVar = Math.random() * (isMobile ? 0.4 : 0.7);
        
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
      const alpha = 0.08 + brightness * 0.35; 

      if (brightness > 0.8) {
        const glowSize = p.size * (isMobile ? 3 : 4);
        const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, glowSize);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.2})`);
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

// ===== MICRO-INTERACCIONES: SONIDO SUTIL (Sintetizado) =====
// Creamos un contexto de audio para generar sonidos tecnológicos sutiles sin archivos externos
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTick() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

document.addEventListener('DOMContentLoaded', function() {
  const interactiveElements = document.querySelectorAll('.card, .nav nav a, .nav-brand, .dot');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      // Solo suena si el usuario ha interactuado con la página antes (política de navegadores)
      playTick();
    });
  });
});
