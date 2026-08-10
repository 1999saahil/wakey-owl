/**
 * Wakey Owl — 3D Anti-Gravity Parallax & Card Tilt Engine
 * Implements smooth spring-damped 3D cursor tilt and specular sheen on interactive surfaces.
 */

class TiltEngine {
  constructor() {
    this.heroElement = document.querySelector("[data-hero-tilt]");
    this.tiltCards = document.querySelectorAll("[data-tilt]");
    this.init();
  }

  init() {
    if (this.heroElement) {
      this.initHeroTilt();
    }
    this.initCardTilts();
  }

  initHeroTilt() {
    const hero = this.heroElement;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    const onMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate normalized offset (-1 to 1)
      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      targetX = normX * 18; // Max 18 deg rotY
      targetY = -normY * 18; // Max 18 deg rotX
    };

    window.addEventListener("mousemove", onMouseMove);

    // Smooth spring loop
    const renderLoop = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const canister = hero.querySelector(".hero-canister-img");
      const rings = hero.querySelectorAll(".holo-ring");
      const badges = hero.querySelectorAll(".floating-badge");

      if (canister) {
        canister.style.transform = `perspective(1000px) rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(30px)`;
      }

      rings.forEach((ring, idx) => {
        const factor = (idx + 1) * 0.4;
        ring.style.transform = `translate(-50%, -50%) rotateX(${currentY * factor}deg) rotateY(${currentX * factor}deg) translateZ(${idx * 15}px)`;
      });

      badges.forEach((b, idx) => {
        const depth = (idx % 2 === 0 ? 45 : 35);
        b.style.transform = `translate3d(${currentX * 1.5}px, ${-currentY * 1.5}px, ${depth}px)`;
      });

      requestAnimationFrame(renderLoop);
    };

    renderLoop();
  }

  initCardTilts() {
    this.tiltCards = document.querySelectorAll("[data-tilt]");
    
    this.tiltCards.forEach((card) => {
      let isHovered = false;

      const handleMove = (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        // Specular glow highlight position
        card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
      };

      const handleEnter = () => {
        isHovered = true;
        card.style.transition = "transform 0.1s ease-out";
      };

      const handleLeave = () => {
        isHovered = false;
        card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      };

      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", handleLeave);
    });
  }

  refresh() {
    this.tiltCards = document.querySelectorAll("[data-tilt]");
    this.initCardTilts();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.wakeyTilt = new TiltEngine();
});
