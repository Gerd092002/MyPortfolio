const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

const setBodyScrollLock = (locked) => {
  document.body.style.overflow = locked ? 'hidden' : '';
};

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('[data-close-mobile]').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
}, { passive: true });

const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const revealIndex = new Map();
  revealEls.forEach((el, index) => revealIndex.set(el, index));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const index = revealIndex.get(entry.target) ?? 0;
      entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 12) * 70}ms`);

      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px',
  });

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-mobile a[href^="#"]');

const setActiveNav = () => {
  const marker = window.scrollY + (window.innerHeight * 0.35);
  let current = 'hero';

  sections.forEach((section) => {
    if (section.offsetTop <= marker) {
      current = section.id;
    }
  });

  if (window.scrollY < 80) {
    current = 'hero';
  }

  navLinks.forEach((link) => {
    const target = link.getAttribute('href').slice(1);
    link.classList.toggle('active', target === current);
  });
};

let navScrollFrame = null;

const scheduleActiveNavUpdate = () => {
  if (navScrollFrame !== null) return;

  navScrollFrame = window.requestAnimationFrame(() => {
    navScrollFrame = null;
    setActiveNav();
  });
};

window.addEventListener('scroll', scheduleActiveNavUpdate, { passive: true });
window.addEventListener('resize', scheduleActiveNavUpdate, { passive: true });
setActiveNav();

const modals = document.querySelectorAll('dialog.project-modal');
let lastModalTrigger = null;

const finishModalClose = () => {
  setBodyScrollLock(false);
  if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
    lastModalTrigger.focus();
  }
};

const closeModal = (dialog) => {
  if (!dialog) return;
  if (typeof dialog.close === 'function' && dialog.open) {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
    finishModalClose();
  }
};

document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const dialogId = trigger.getAttribute('data-open-modal');
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;

    lastModalTrigger = trigger;

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    setBodyScrollLock(true);
  });
});

modals.forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeModal(dialog);
    }
  });

  dialog.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => closeModal(dialog));
  });

  dialog.addEventListener('close', () => {
    finishModalClose();
  });
});
