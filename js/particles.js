/**
 * Wakey Owl — Ambient Particle & Ember Canvas System
 * Creates floating golden coffee dust, glowing embers, and dynamic cursor dispersion.
 */

class ParticleSystem {
  constructor(canvasId = "ambient-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 45 : 90;
    this.mouse = { x: null, y: null, radius: 120 };
    this.animationFrameId = null;

    this.colors = [
      "rgba(255, 158, 27, ",   // Solar Amber
      "rgba(245, 208, 97, ",   // Cyber Gold
      "rgba(255, 85, 0, ",     // Deep Fire Amber
      "rgba(230, 161, 92, ",   // Warm Crema
      "rgba(0, 240, 255, "     // Cyan highlight (rare)
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createParticles();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const isCyan = Math.random() < 0.04;
      const colorBase = isCyan ? this.colors[4] : this.colors[Math.floor(Math.random() * 4)];
      
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.8 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.15), // rise upwards like embers/steam
        speedX: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.6 + 0.2,
        colorBase: colorBase,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const time = Date.now() * 0.001;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural upward drift + horizontal sine sway
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(time + p.pulseOffset) * 0.2;

      // Mouse repulsion/dispersion
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 1.5;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 2;
          p.y += Math.sin(angle) * force * 2;
        }
      }

      // Screen wrapping
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      // Dynamic glowing pulse
      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(time * p.pulseSpeed * 10 + p.pulseOffset));

      // Draw particle with glowing radial gradient
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
      grad.addColorStop(0, `${p.colorBase}${currentOpacity})`);
      grad.addColorStop(0.5, `${p.colorBase}${currentOpacity * 0.4})`);
      grad.addColorStop(1, `${p.colorBase}0)`);

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Solid core
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorBase}${Math.min(1, currentOpacity + 0.3)})`;
      this.ctx.fill();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Auto init on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  window.wakeyParticles = new ParticleSystem("ambient-canvas");
});
