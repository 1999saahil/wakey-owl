/**
 * Wakey Owl — Royal Coffee Packet & Roasted Bean Emergence Animation Engine
 * Handles interactive 3D particle emergence of coffee beans, golden aroma steam, and decoction flow.
 */

class CoffeeEmergenceEngine {
  constructor(canvasId = "hero-coffee-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.beans = [];
    this.steamParticles = [];
    this.decoctionDrops = [];
    this.mode = "floating-beans"; // 'floating-beans', 'aroma-burst', 'decoction-pour'
    this.animationFrame = null;
    this.mouse = { x: null, y: null };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.seedBeans(35);
    this.seedSteam(40);
    this.bindControls();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || 420;
    this.height = this.canvas.height = rect.height || 520;
  }

  seedBeans(count = 35) {
    this.beans = [];
    const centerX = this.width / 2;
    const originY = this.height * 0.45; // Emits from the top lip of the packet

    for (let i = 0; i < count; i++) {
      this.beans.push({
        x: centerX + (Math.random() - 0.5) * 60,
        y: originY + (Math.random() - 0.5) * 80,
        originX: centerX,
        originY: originY,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 8 + 10, // Bean size in px
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        color: Math.random() > 0.3 ? "#2C1B14" : "#4A2E1F", // Dark roasted coffee bean tones
        creaseColor: "#FF9E1B", // Glowing golden embryo crease
        opacity: Math.random() * 0.6 + 0.4,
        floatPhase: Math.random() * Math.PI * 2
      });
    }
  }

  seedSteam(count = 40) {
    this.steamParticles = [];
    const centerX = this.width / 2;
    const originY = this.height * 0.4;

    for (let i = 0; i < count; i++) {
      this.steamParticles.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: originY - Math.random() * 180,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 1.2 + 0.6),
        size: Math.random() * 18 + 12,
        opacity: Math.random() * 0.4 + 0.1,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 60
      });
    }
  }

  triggerAromaBurst() {
    this.mode = "aroma-burst";
    if (window.wakeyAudio) window.wakeyAudio.playSuccess();
    
    // Spawn 50 high-velocity exploding beans
    const centerX = this.width / 2;
    const originY = this.height * 0.42;

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.beans.push({
        x: centerX,
        y: originY,
        originX: centerX,
        originY: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 9 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        color: "#3E271E",
        creaseColor: "#F5D061",
        opacity: 1,
        floatPhase: Math.random() * Math.PI * 2
      });
    }

    // Add extra golden steam puffs
    for (let i = 0; i < 30; i++) {
      this.steamParticles.push({
        x: centerX + (Math.random() - 0.5) * 50,
        y: originY,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 2 + 1),
        size: Math.random() * 25 + 20,
        opacity: 0.6,
        life: 0,
        maxLife: 80
      });
    }

    const triggerBtn = document.getElementById("btn-trigger-aroma");
    if (triggerBtn) {
      triggerBtn.classList.add("active-burst");
      setTimeout(() => triggerBtn.classList.remove("active-burst"), 1200);
    }
  }

  triggerDecoctionPour() {
    this.mode = "decoction-pour";
    if (window.wakeyAudio) window.wakeyAudio.playBrewChime();

    this.decoctionDrops = [];
    const startX = this.width / 2;
    const startY = this.height * 0.35;

    for (let i = 0; i < 80; i++) {
      this.decoctionDrops.push({
        x: startX + (Math.random() - 0.5) * 12,
        y: startY + i * 4,
        vy: Math.random() * 4 + 6,
        width: Math.random() * 4 + 3,
        length: Math.random() * 16 + 10,
        color: Math.random() > 0.4 ? "rgba(255, 158, 27, 0.9)" : "rgba(212, 175, 55, 0.95)",
        opacity: 1
      });
    }

    const pourBtn = document.getElementById("btn-trigger-pour");
    if (pourBtn) {
      pourBtn.classList.add("active-pour");
      setTimeout(() => pourBtn.classList.remove("active-pour"), 1500);
    }
  }

  bindControls() {
    const aromaBtn = document.getElementById("btn-trigger-aroma");
    if (aromaBtn) {
      aromaBtn.addEventListener("click", () => this.triggerAromaBurst());
    }

    const pourBtn = document.getElementById("btn-trigger-pour");
    if (pourBtn) {
      pourBtn.addEventListener("click", () => this.triggerDecoctionPour());
    }

    const unsealBtn = document.getElementById("btn-trigger-unseal");
    if (unsealBtn) {
      unsealBtn.addEventListener("click", () => {
        if (window.wakeyAudio) window.wakeyAudio.playClick();
        this.triggerAromaBurst();
        if (window.wakeyCart) window.wakeyCart.showToast("✦ Canister Cryo-Seal Opened: 9,800ft Terroir Aromatics Released");
      });
    }
  }

  drawCoffeeBean(x, y, size, rotation, color, creaseColor, opacity) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.globalAlpha = opacity;

    // Bean outer shadow/glow
    this.ctx.shadowColor = "rgba(255, 158, 27, 0.45)";
    this.ctx.shadowBlur = 10;

    // Draw Bean Body (Ellipse with slight curved indentation)
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 0.65, size, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    // Specular glossy highlight
    this.ctx.beginPath();
    this.ctx.ellipse(-size * 0.2, -size * 0.3, size * 0.2, size * 0.35, -0.3, 0, Math.PI * 2);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    this.ctx.fill();

    // Center S-Curved Crease
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size * 0.85);
    this.ctx.bezierCurveTo(size * 0.25, -size * 0.3, -size * 0.25, size * 0.3, 0, size * 0.85);
    this.ctx.strokeStyle = creaseColor;
    this.ctx.lineWidth = size * 0.12;
    this.ctx.lineCap = "round";
    this.ctx.stroke();

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const time = Date.now() * 0.001;

    // 1. Draw Golden Steam
    for (let i = 0; i < this.steamParticles.length; i++) {
      const s = this.steamParticles[i];
      s.y += s.vy;
      s.x += s.vx + Math.sin(time * 2 + s.life * 0.1) * 0.5;
      s.size += 0.25;
      s.life++;

      const lifeRatio = s.life / s.maxLife;
      const currentOpacity = s.opacity * (1 - lifeRatio);

      if (lifeRatio >= 1) {
        s.x = this.width / 2 + (Math.random() - 0.5) * 40;
        s.y = this.height * 0.42;
        s.life = 0;
        s.size = Math.random() * 16 + 10;
      }

      const grad = this.ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
      grad.addColorStop(0, `rgba(255, 170, 50, ${currentOpacity * 0.8})`);
      grad.addColorStop(0.5, `rgba(245, 208, 97, ${currentOpacity * 0.4})`);
      grad.addColorStop(1, "rgba(255, 158, 27, 0)");

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();
    }

    // 2. Draw Floating Coffee Beans
    for (let i = 0; i < this.beans.length; i++) {
      const b = this.beans[i];

      b.x += b.vx + Math.sin(time + b.floatPhase) * 0.4;
      b.y += b.vy;
      b.rotation += b.rotationSpeed;

      // Mouse interactive repelling
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = b.x - this.mouse.x;
        const dy = b.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const force = (1 - dist / 90) * 2.5;
          const angle = Math.atan2(dy, dx);
          b.x += Math.cos(angle) * force * 3;
          b.y += Math.sin(angle) * force * 3;
        }
      }

      // Wrap around or return to packet
      if (b.y < -30) {
        b.y = this.height * 0.45;
        b.x = this.width / 2 + (Math.random() - 0.5) * 60;
        b.vy = -(Math.random() * 1.5 + 0.4);
      }
      if (b.x < -20) b.x = this.width + 20;
      if (b.x > this.width + 20) b.x = -20;

      this.drawCoffeeBean(b.x, b.y, b.size, b.rotation, b.color, b.creaseColor, b.opacity);
    }

    // 3. Draw Decoction Pour Stream if active
    if (this.decoctionDrops.length > 0) {
      for (let i = this.decoctionDrops.length - 1; i >= 0; i--) {
        const d = this.decoctionDrops[i];
        d.y += d.vy;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(d.x, d.y);
        this.ctx.lineTo(d.x, d.y + d.length);
        this.ctx.strokeStyle = d.color;
        this.ctx.lineWidth = d.width;
        this.ctx.lineCap = "round";
        this.ctx.shadowColor = "#FF9E1B";
        this.ctx.shadowBlur = 12;
        this.ctx.stroke();
        this.ctx.restore();

        if (d.y > this.height) {
          this.decoctionDrops.splice(i, 1);
        }
      }
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("hero-coffee-canvas")) {
    window.wakeyCoffeeEmergence = new CoffeeEmergenceEngine("hero-coffee-canvas");
  }
});
