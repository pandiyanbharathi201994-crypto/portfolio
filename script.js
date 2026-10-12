/**
 * Portfolio Interactive Scripts
 * Author: Bharathi
 * Features:
 * - Particle background animation
 * - Dynamic role typing effect
 * - Theme Switcher (Dark / Light) with LocalStorage persistence
 * - Navbar scroll state & active section scroll-spy
 * - Mobile hamburger drawer menu
 * - IntersectionObserver scroll reveal & animated skill progress bars
 * - Interactive Project category filtering
 * - 3D Avatar tilt on mouse movement
 * - Accessible FAQ accordion
 * - Client-side validated contact form with feedback
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Theme Switcher (Dark / Light)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or detect system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  /* ==========================================================================
     2. Particle Background Canvas
     ========================================================================== */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    const particleCount = 65;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.speedY = Math.random() * 0.45 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 150;
        this.isIndigo = Math.random() > 0.4;
      }

      update() {
        this.x += this.speedX;
        this.y -= this.speedY;
        this.life++;

        if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
          this.y = height + 10;
        }
      }

      draw() {
        const lifeRatio = this.life / this.maxLife;
        let fade = 1;
        if (lifeRatio < 0.15) fade = lifeRatio / 0.15;
        else if (lifeRatio > 0.85) fade = (1 - lifeRatio) / 0.15;

        const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
        const particleAlpha = this.alpha * fade * (isDark ? 0.7 : 0.45);
        const color = this.isIndigo
          ? `hsla(226, 85%, 68%, ${particleAlpha})`
          : `hsla(190, 90%, 55%, ${particleAlpha})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    particles = Array.from({ length: particleCount }, () => new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
     3. Dynamic Typing Effect
     ========================================================================== */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const roles = [
      'MBA Graduate & Web Developer',
      'Frontend Developer (React.js, JS)',
      'Commerce & Business Mindset',
      'Web Apps & MongoDB Enthusiast',
      'Organized Problem Solver & Team Player'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeDelay = 90;
    const eraseDelay = 45;
    const holdDelay = 1800;

    function handleTyping() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        charIndex++;
        typedEl.textContent = currentRole.substring(0, charIndex);

        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(handleTyping, holdDelay);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = currentRole.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      setTimeout(handleTyping, isDeleting ? eraseDelay : typeDelay);
    }

    handleTyping();
  }

  /* ==========================================================================
     4. Navigation Bar Scroll State & Mobile Menu
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    updateActiveNav();
  });

  function updateActiveNav() {
    let activeId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeId = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      if (link.getAttribute('data-section') === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Hamburger menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close mobile menu when link is clicked
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     5. Scroll Reveal & Animated Skill Progress Bars
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Skill Progress Bars observer
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      skillsObserver.observe(skillsSection);
    }
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('in-view'));
    animateSkillBars();
  }

  function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-progress-bar');
    bars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      const fill = bar.querySelector('.skill-fill');
      if (fill && level) {
        fill.style.width = `${level}%`;
      }
    });
  }

  /* ==========================================================================
     6. 3D Avatar Tilt Effect on Mouse Move
     ========================================================================== */
  const avatarCard = document.getElementById('avatarCard');
  if (avatarCard && window.innerWidth > 768) {
    const avatarFrame = avatarCard.querySelector('.avatar-frame');

    avatarCard.addEventListener('mousemove', e => {
      const rect = avatarCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const rotateY = deltaX * 12; // degrees
      const rotateX = -deltaY * 12;

      if (avatarFrame) {
        avatarFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    });

    avatarCard.addEventListener('mouseleave', () => {
      if (avatarFrame) {
        avatarFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  }

  /* ==========================================================================
     7. Projects Category Filter
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || cardCategories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     8. FAQ Accordion
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const drawer = item.querySelector('.faq-drawer');

    if (trigger && drawer) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items for neat accordion feel
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            const otherDrawer = otherItem.querySelector('.faq-drawer');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherDrawer) otherDrawer.style.maxHeight = null;
          }
        });

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          drawer.style.maxHeight = `${drawer.scrollHeight}px`;
        } else {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          drawer.style.maxHeight = null;
        }
      });
    }
  });

  /* ==========================================================================
     9. Contact Form Validation & Submission
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const messageInput = document.getElementById('userMessage');
      const submitBtn = document.getElementById('submitBtn');

      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const messageError = document.getElementById('messageError');

      // Reset errors
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        shakeElement(nameInput);
        isValid = false;
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email.';
        shakeElement(emailInput);
        isValid = false;
      } else if (!emailPattern.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        shakeElement(emailInput);
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a brief message.';
        shakeElement(messageInput);
        isValid = false;
      }

      if (!isValid) return;

      // Simulate sending
      const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending Message...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = originalBtnText;

        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => {
            formSuccess.classList.remove('show');
          }, 6000);
        }
      }, 1200);
    });
  }

  function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight; // trigger reflow
    element.style.animation = 'input-shake 0.4s ease';
    element.focus();
  }

  // Inject input shake keyframe
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes input-shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(styleSheet);

  /* ==========================================================================
     10. Dynamic Current Year in Footer
     ========================================================================== */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     11. Resume Modal (Preview, Print & Close)
     ========================================================================== */
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn, #hero-resume-btn, #cvDownloadBtn');
  const closeResumeModal = document.getElementById('closeResumeModal');
  const printResumeBtn = document.getElementById('printResumeBtn');

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function hideResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeResumeModal) {
    closeResumeModal.addEventListener('click', hideResumeModal);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', e => {
      if (e.target === resumeModal) {
        hideResumeModal();
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
      hideResumeModal();
    }
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

});
