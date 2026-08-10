/**
 * Wakey Owl — Web Audio API Sound Engine
 * Generates futuristic acoustic micro-feedback and ambient cyber-roastery soundscape.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = false;
    this.ambientPlaying = false;
    this.ambientNodes = null;

    this.init();
  }

  init() {
    // Check localStorage preference
    const saved = localStorage.getItem("wakey_sound_enabled");
    if (saved === "true") {
      this.soundEnabled = true;
    }

    this.updateToggleUI();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem("wakey_sound_enabled", this.soundEnabled.toString());
    
    if (this.soundEnabled) {
      this.ensureContext();
      this.playSuccess();
      if (this.ambientPlaying) {
        this.startAmbient();
      }
    } else {
      this.stopAmbient();
    }

    this.updateToggleUI();
    return this.soundEnabled;
  }

  updateToggleUI() {
    const btn = document.getElementById("sound-toggle-btn");
    const icon = document.getElementById("sound-toggle-icon");
    const text = document.getElementById("sound-toggle-text");

    if (btn) {
      btn.classList.toggle("active", this.soundEnabled);
      btn.setAttribute("aria-pressed", this.soundEnabled);
    }
    if (icon) {
      icon.innerHTML = this.soundEnabled 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    }
    if (text) {
      text.textContent = this.soundEnabled ? "Audio Active" : "Audio Muted";
    }
  }

  // Soft futuristic UI click
  playClick() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Hover tone
  playHover() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(540, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // AI Sonar Blip during calculations
  playSonar() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    const baseFreq = 900 + Math.random() * 400;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Harmonic chord for success/recommendation
  playSuccess() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.45);
    });
  }

  // Brew timer bell / completion chime
  playBrewChime() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const freqs = [440, 554.37, 659.25, 880];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.1);
      osc.stop(this.ctx.currentTime + idx * 0.1 + 1.2);
    });
  }

  // Subtle ambient nocturnal hum
  startAmbient() {
    if (!this.soundEnabled || this.ambientNodes) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const masterGain = this.ctx.createGain();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(110, this.ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);

    masterGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();

    this.ambientNodes = { osc1, osc2, masterGain };
    this.ambientPlaying = true;
  }

  stopAmbient() {
    if (this.ambientNodes) {
      try {
        this.ambientNodes.osc1.stop();
        this.ambientNodes.osc2.stop();
      } catch (e) {}
      this.ambientNodes = null;
    }
    this.ambientPlaying = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.wakeyAudio = new SoundEngine();
});
