/* ==========================================================================
   FUTURISTIC BACKGROUND & INTERACTIVE HUD ENGINE
   - Neural network particle canvas (interactive to mouse)
   - Real-time oscilloscope waveform generator
   - Dynamic HUD signal variations
   ========================================================================== */

(function () {
  'use strict';

  // 1. NEURAL PARTICLE CANVAS
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = {
    x: width / 2,
    y: height / 2,
    radius: 140,
    isActive: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isActive = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.isActive = false;
  });

  // Configuração das partículas
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.8;
      this.baseAlpha = Math.random() * 0.45 + 0.15;
      this.color = Math.random() > 0.85 ? '#ff2a2a' : '#ffffff';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Interação sutil com o mouse
      if (mouse.isActive) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Loop de Animação do Background
  function animateBackground() {
    ctx.clearRect(0, 0, width, height);

    // Desenhar conexões entre partículas próximas
    const maxDistance = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color === '#ff2a2a' || particles[j].color === '#ff2a2a' 
            ? 'rgba(255, 42, 42, ' + alpha * 1.8 + ')' 
            : 'rgba(255, 255, 255, ' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Desenhar cada partícula
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animateBackground);
  }

  animateBackground();

  // 2. OSCILOSCÓPIO / WAVEFORM DO WIDGET HUD
  const waveCanvas = document.getElementById('waveformCanvas');
  if (waveCanvas) {
    const wCtx = waveCanvas.getContext('2d');
    let step = 0;

    function drawWaveform() {
      const w = waveCanvas.width;
      const h = waveCanvas.height;
      wCtx.clearRect(0, 0, w, h);

      wCtx.beginPath();
      wCtx.strokeStyle = '#ff2a2a';
      wCtx.lineWidth = 1.4;

      const sliceWidth = w / 30;
      let x = 0;

      for (let i = 0; i <= 30; i++) {
        const freq1 = Math.sin((i * 0.4) + (step * 0.08));
        const freq2 = Math.cos((i * 0.2) + (step * 0.04));
        const y = (h / 2) + (freq1 * freq2 * 9);

        if (i === 0) {
          wCtx.moveTo(x, y);
        } else {
          wCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      wCtx.stroke();
      step += 1;
      requestAnimationFrame(drawWaveform);
    }

    drawWaveform();
  }

  // 3. FLUTUAÇÃO DE VALOR DO SINAL HUD
  const signalEl = document.getElementById('signalValue');
  if (signalEl) {
    setInterval(() => {
      const rand = Math.floor(Math.random() * 3) + 97; // 97, 98 ou 99
      signalEl.textContent = rand;
    }, 2800);
  }

})();
