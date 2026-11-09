/* ==========================================================================
   AUREUM · Onboarding controller
   Vanilla ES module. Handles swipe, keyboard, dots, progress, ripple,
   3D tilt, KPI counters and the final CTA transition.
   ========================================================================== */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const root = document.getElementById('onboarding');
const stage = document.getElementById('stage');
const track = document.getElementById('track');
const dotsWrap = document.getElementById('dots');
const nextBtn = document.getElementById('next');
const skipBtn = document.getElementById('skip');
const backBtn = document.getElementById('back');
const nextLabel = nextBtn.querySelector('.btn__label');
const segs = Array.from(document.querySelectorAll('.progress__seg'));
const slides = Array.from(track.querySelectorAll('.slide'));

const last = slides.length - 1;
let index = 0;
let finished = false;

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */

function slideWidth() {
  return stage.clientWidth;
}

function updateTrack(offset = 0, animate = true) {
  const x = -index * slideWidth() + offset;
  track.style.transition = animate
    ? 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
    : 'none';
  track.style.transform = `translate3d(${x}px, 0, 0)`;
}

function updateUI() {
  segs.forEach((seg, i) => {
    seg.classList.toggle('is-active', i === index);
    seg.classList.toggle('is-done', i < index);
  });

  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));

  backBtn.hidden = index === 0;

  const isFinal = index === last;
  nextBtn.classList.toggle('btn--final', isFinal);

  const compact = window.matchMedia('(max-width: 480px)').matches;
  const finalLabel = compact
    ? nextBtn.dataset.finalLabelShort || 'Comenzar'
    : nextBtn.dataset.finalLabel || 'Entrar al Dashboard';

  nextLabel.textContent = isFinal
    ? finalLabel
    : nextBtn.dataset.nextLabel || 'Siguiente';
}

function goTo(target) {
  const clamped = Math.max(0, Math.min(last, target));
  const changed = clamped !== index;
  index = clamped;

  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === index);
    slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
  });

  root.setAttribute('aria-labelledby', `slide-title-${index}`);

  updateTrack(0, true);
  updateUI();

  if (changed) {
    stage.scrollTo({ top: 0, left: 0 });
  }

  if (index === last) {
    animateCounters();
  }
}

/* --------------------------------------------------------------------------
   Dot pagination
   -------------------------------------------------------------------------- */

const dots = slides.map((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot';
  dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
  return dot;
});

/* --------------------------------------------------------------------------
   Buttons
   -------------------------------------------------------------------------- */

nextBtn.addEventListener('click', () => {
  if (index === last) {
    finish('finish');
  } else {
    goTo(index + 1);
  }
});

skipBtn.addEventListener('click', () => finish('skip'));
backBtn.addEventListener('click', () => goTo(index - 1));

segs.forEach((seg) => {
  seg.addEventListener('click', () => goTo(Number(seg.dataset.go)));
});

/* --------------------------------------------------------------------------
   Keyboard navigation
   -------------------------------------------------------------------------- */

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (index === last) {
      finish('finish');
    } else {
      goTo(index + 1);
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    goTo(index - 1);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    finish('skip');
  }
});

/* --------------------------------------------------------------------------
   Pointer swipe
   -------------------------------------------------------------------------- */

let dragging = false;
let axis = null;
let startX = 0;
let startY = 0;
let currentX = 0;
let startTime = 0;

stage.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  dragging = true;
  axis = null;
  startX = event.clientX;
  startY = event.clientY;
  currentX = 0;
  startTime = performance.now();
  track.style.transition = 'none';
});

stage.addEventListener('pointermove', (event) => {
  if (!dragging) return;

  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  if (!axis) {
    if (Math.abs(dx) > Math.abs(dy) + 3) {
      axis = 'x';
      stage.classList.add('is-dragging');
    } else if (Math.abs(dy) > 6) {
      axis = 'y';
      cancelDrag();
      return;
    }
  }

  if (axis !== 'x') return;

  currentX = dx;

  // Rubber-band resistance at the first and last slide
  if ((index === 0 && dx > 0) || (index === last && dx < 0)) {
    currentX = dx * 0.35;
  }

  updateTrack(currentX, false);
});

function cancelDrag() {
  dragging = false;
  axis = null;
  stage.classList.remove('is-dragging');
  updateTrack(0, true);
}

function endDrag() {
  if (!dragging) return;

  const dx = currentX;
  const dt = Math.max(1, performance.now() - startTime);
  const velocity = dx / dt;

  dragging = false;
  stage.classList.remove('is-dragging');

  const threshold = Math.max(60, stage.clientWidth * 0.16);

  if (axis === 'x' && (dx < -threshold || velocity < -0.5)) {
    goTo(index + 1);
  } else if (axis === 'x' && (dx > threshold || velocity > 0.5)) {
    goTo(index - 1);
  } else {
    updateTrack(0, true);
  }

  axis = null;
}

window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', () => {
  if (dragging) cancelDrag();
});

/* --------------------------------------------------------------------------
   3D tilt on the catalog card (mouse only)
   -------------------------------------------------------------------------- */

if (!prefersReduced) {
  document.querySelectorAll('[data-tilt]').forEach((surface) => {
    const inner = surface.querySelector('.tilt__inner');
    if (!inner) return;

    surface.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = surface.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      inner.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`);
      inner.style.setProperty('--rx', `${(-py * 9).toFixed(2)}deg`);
    });

    surface.addEventListener('pointerleave', () => {
      inner.style.setProperty('--ry', '0deg');
      inner.style.setProperty('--rx', '0deg');
    });
  });
}

/* --------------------------------------------------------------------------
   KPI counters (slide 3)
   -------------------------------------------------------------------------- */

const counterEls = Array.from(slides[last].querySelectorAll('[data-count]'));
let counterToken = 0;

function animateCounters() {
  const token = ++counterToken;

  counterEls.forEach((el) => {
    const target = Number.parseFloat(el.dataset.count || '0');
    const decimals = Number(el.dataset.decimals || 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const formatter = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    if (prefersReduced) {
      el.textContent = `${prefix}${formatter.format(target)}${suffix}`;
      return;
    }

    const started = performance.now();
    const duration = 1100;

    const frame = (now) => {
      if (token !== counterToken) return;
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${formatter.format(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  });
}

/* --------------------------------------------------------------------------
   Ripple micro-interaction
   -------------------------------------------------------------------------- */

if (!prefersReduced) {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('pointerdown', (event) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* --------------------------------------------------------------------------
   Finish / exit transition
   -------------------------------------------------------------------------- */

function finish(kind) {
  if (finished) return;
  finished = true;

  root.classList.add('is-finishing');

  const destination =
    kind === 'skip' ? root.dataset.exit || '../' : root.dataset.finish || '../';
  const delay = prefersReduced ? 80 : 640;

  // When the file is opened directly from disk, SPA routes are unavailable,
  // so fall back to the configured exit target.
  const target =
    window.location.protocol === 'file:'
      ? root.dataset.exit || '../'
      : destination;

  window.setTimeout(() => {
    window.location.href = target;
  }, delay);
}

/* --------------------------------------------------------------------------
   Resize handling
   -------------------------------------------------------------------------- */

let resizeFrame = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    if (!dragging) updateTrack(0, false);
    updateUI();
  });
});

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

updateTrack(0, false);
updateUI();

requestAnimationFrame(() => {
  root.focus({ preventScroll: true });
});
