// ── Age calculation ──
const BIRTH = '2002-03-12';

function calcDecimalAge(birthDateStr) {
  const now  = Date.now();
  const born = new Date(birthDateStr).getTime();
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return (now - born) / msPerYear;
}

function updateAge() {
  const el = document.getElementById('age-display');
  if (!el) return;
  const age = calcDecimalAge(BIRTH);
  el.textContent = age.toFixed(8);
}

// ── Particles ──
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 55;
  const COLORS = ['#ff2d6b', '#00d4ff', '#a855f7', '#00ff88'];

  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    }

    // draw faint lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}



// ── Ripple on card click ──
function initRipple() {
  document.querySelectorAll('.nav-card, .project-card, .contact-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim 0.5s linear;
        background: rgba(255,255,255,0.08);
        width: 200px;
        height: 200px;
        left: ${x - 100}px;
        top: ${y - 100}px;
        pointer-events: none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(2.5); opacity: 0; }
    }
    .age-unit { color: #8888aa; font-size: 0.75em; font-weight: 400; margin-left: 1px; }
    .age-time  { color: #00d4ff; font-variant-numeric: tabular-nums; font-weight: 600; font-size: 0.9em; }
  `;
  document.head.appendChild(style);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  
  initRipple();
  updateAge();
  setInterval(updateAge, 1000);
});
