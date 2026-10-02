/**
 * ========================================================
 * FLOATING BOTANICAL PETALS CANVAS
 * ========================================================
 * Simulates gentle drifting rose and peony petals floating
 * in a warm gentle breeze across the screen.
 */

class PetalSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = 28;
    this.colors = (window.CONFIG && CONFIG.effects && CONFIG.effects.petalColors) 
      ? CONFIG.effects.petalColors 
      : ["#d97d7d", "#e8a598", "#f4c2ba", "#c96f6f", "#e0b084"];

    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  init() {
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: Math.random() * 14 + 10,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.02 + 0.01,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      opacity: Math.random() * 0.45 + 0.45,
      curve: Math.random() * 0.4 + 0.6
    };
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(Math.sin(p.flip), 1);

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(
      p.size * p.curve, -p.size * 0.5, 
      p.size * p.curve, p.size * 0.8, 
      0, p.size
    );
    this.ctx.bezierCurveTo(
      -p.size * p.curve, p.size * 0.8, 
      -p.size * p.curve, -p.size * 0.5, 
      0, 0
    );

    this.ctx.fillStyle = p.color;
    this.ctx.globalAlpha = p.opacity;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetY = 2;
    this.ctx.fill();

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.008) * 0.8 + p.speedX;
      p.rotation += p.rotationSpeed;
      p.flip += p.flipSpeed;

      this.drawPetal(p);

      // Reset when falling off screen
      if (p.y > this.height + 25 || p.x < -30 || p.x > this.width + 30) {
        this.petals[i] = this.createPetal(false);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.petalSystem = new PetalSystem('petals-canvas');
});
