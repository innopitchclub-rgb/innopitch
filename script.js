// ---------- footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---------- mobile nav ----------
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
// starfield element
const starfield = document.querySelector('.starfield');

// Split text into spans for premium per-character animation
function initPremiumText() {
  document.querySelectorAll('.premium-text').forEach((el) => {
    if (el.dataset.splitDone) return;
    const originalNodes = Array.from(el.childNodes);
    el.textContent = '';
    let idx = 0;

    originalNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        el.appendChild(document.createElement('br'));
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        // preserve element (e.g., <span class="highlight">) but split its text
        const clone = node.cloneNode(false);
        const txt = node.textContent || '';
        Array.from(txt).forEach((ch) => {
          const s = document.createElement('span');
          s.textContent = ch === ' ' ? '\u00A0' : ch;
          s.style.setProperty('--i', String(idx));
          idx += 1;
          clone.appendChild(s);
        });
        el.appendChild(clone);
        return;
      }

      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent || '';
        Array.from(txt).forEach((ch) => {
          const s = document.createElement('span');
          s.textContent = ch === ' ' ? '\u00A0' : ch;
          s.style.setProperty('--i', String(idx));
          idx += 1;
          el.appendChild(s);
        });
      }
    });

    el.dataset.splitDone = '1';
  });
}

// initialize premium text on load
window.addEventListener('load', () => {
  initPremiumText();
});

// generate simple stars once
if (starfield) {
  const STAR_COUNT = 110;
  for (let i = 0; i < STAR_COUNT; i += 1) {
    const s = document.createElement('span');
    s.className = 'star';
    const size = Math.random() * 2.8 + 0.6; // px
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${Math.random() * 100}vw`;
    s.style.top = `${Math.random() * 100}vh`;
    s.style.opacity = `${0.25 + Math.random() * 0.8}`;
    // twinkle timing and slight blur for larger stars
    s.style.animationDuration = `${1.4 + Math.random() * 3.0}s`;
    s.style.animationDelay = `${Math.random() * 3}s`;
    if (size > 2.6) s.style.filter = 'blur(0.6px)';
    // parallax factor (larger => moves more with scroll)
    s.dataset.parallax = `${Math.random() * 0.9 + 0.2}`;
    starfield.appendChild(s);
  }
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- premium interactions ----------
const header = document.querySelector('.site-header');
const progressBar = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const revealItems = document.querySelectorAll('.hero-copy, .hero-card, .about-intro, .about-grid, .about-point, .detail-card, .leader-card, .team-card, .event-card, .apply-inner, .apply-form, .member-card, .events-empty');

const revealOnScroll = () => {
  const scrollTop = window.scrollY + window.innerHeight * 0.9;

  revealItems.forEach((item, index) => {
    if (!item.classList.contains('reveal')) {
      item.classList.add('reveal');
    }
    if (scrollTop > item.offsetTop) {
      item.classList.add('is-visible');
      item.style.transitionDelay = `${Math.min(index * 60, 220)}ms`;
    }
  });

  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 12);
  }

  // scroll progress used for parallax and rocket movement
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

  // move starfield for subtle parallax
  if (starfield) {
    // translate the whole field slightly
    starfield.style.transform = `translateY(${ -progress * 12 }%)`;
    // layered per-star parallax for depth
    const stars = starfield.querySelectorAll('.star');
    stars.forEach((s) => {
      const p = parseFloat(s.dataset.parallax) || 0.6;
      s.style.transform = `translateY(${ -progress * 40 * p }px)`;
    });
  }

  // (rocket animations removed)

  if (progressBar) {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
  }

  if (backToTop) {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }
};

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);

// ---------- ripple effect ----------
const rippleButtons = document.querySelectorAll('.btn, .filter-pill, .checkbox-pill, .nav-toggle, .back-to-top');

rippleButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.1;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    ripple.className = 'ripple';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// ---------- mouse spotlight ----------
const spotlight = document.querySelector('.spotlight');

if (spotlight) {
  window.addEventListener('mousemove', (event) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    spotlight.style.transform = `translate(${(x - 0.5) * 20}px, ${(y - 0.5) * 12}px)`;
    spotlight.style.opacity = '0.9';
  });

  window.addEventListener('mouseleave', () => {
    spotlight.style.transform = 'translate(0, 0)';
    spotlight.style.opacity = '0.6';
  });
}

// ---------- lightweight particles ----------
for (let i = 0; i < 16; i += 1) {
  const particle = document.createElement('span');
  particle.className = 'particle';
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.top = `${Math.random() * 100}vh`;
  particle.style.animationDelay = `${Math.random() * 8}s`;
  document.body.appendChild(particle);
}

// ---------- application form ----------
const applyForm = document.getElementById('applyForm');

if (applyForm) {
  const formStatus = document.getElementById('formStatus');
  const submitBtn = applyForm.querySelector('button[type="submit"]');

  applyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    formStatus.style.color = '';

    const payload = {
      fullName,
      regNumber: document.getElementById('regNumber').value.trim(),
      year: document.getElementById('year').value.trim(),
      email,
      phone: document.getElementById('phone').value.trim(),
      interest: document.getElementById('interest').value.trim(),
      interestArea: Array.from(
        document.querySelectorAll('input[name="interestArea"]:checked')
      ).map((el) => el.value),
      _gotcha: document.querySelector('input[name="_gotcha"]').value,
    };

    try {
      const response = await fetch(applyForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok && data.ok) {
        formStatus.textContent = fullName
          ? `Thanks, ${fullName.split(' ')[0]} — your application is in. Check ${email || 'your university email'} for next steps.`
          : "Thanks — your application is in. We'll follow up on your university email.";
        applyForm.reset();
      } else {
        formStatus.style.color = '#E8483A';
        formStatus.textContent = (data.errors && data.errors[0]) || 'Something went wrong. Please try again.';
      }
    } catch (err) {
      formStatus.style.color = '#E8483A';
      formStatus.textContent =
        "Couldn't reach the server. Make sure the backend is running, or try again shortly.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit application';
    }
  });
}
