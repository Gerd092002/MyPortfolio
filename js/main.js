document.documentElement.classList.add('js-ready');

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenu = () => {
  if (!menuToggle || !mobileMenu) return;

  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
};

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenu.hidden = isOpen;
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    closeMobileMenu();

    const openDialog = document.querySelector('.case-study-dialog[open]');
    if (openDialog instanceof HTMLDialogElement && openDialog.open) {
      event.preventDefault();
      openDialog.close();
    }
  }, { capture: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMobileMenu();
  }, { passive: true });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -32px 0px',
  });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const navbar = document.querySelector('.site-header');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
let navFrame = null;

const updateNavigation = () => {
  navFrame = null;

  if (navbar) navbar.classList.toggle('is-scrolled', window.scrollY > 12);

  let currentSection = '';
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 140) currentSection = section.id;
  });

  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute('href') === `#${currentSection}`;
    if (isCurrent) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const scheduleNavigationUpdate = () => {
  if (navFrame === null) navFrame = window.requestAnimationFrame(updateNavigation);
};

window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
window.addEventListener('resize', scheduleNavigationUpdate, { passive: true });
scheduleNavigationUpdate();

const dialogs = document.querySelectorAll('.case-study-dialog');
let lastDialogTrigger = null;

document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.getAttribute('data-open-modal'));
    if (!(dialog instanceof HTMLDialogElement)) return;

    lastDialogTrigger = trigger;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  });
});

dialogs.forEach((dialog) => {
  dialog.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      if (typeof dialog.close === 'function' && dialog.open) {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
        if (lastDialogTrigger instanceof HTMLElement) lastDialogTrigger.focus();
      }
    });
  });

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;

    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      if (lastDialogTrigger instanceof HTMLElement) lastDialogTrigger.focus();
    }
  });

  dialog.addEventListener('close', () => {
    if (lastDialogTrigger instanceof HTMLElement) lastDialogTrigger.focus();
  });
});
