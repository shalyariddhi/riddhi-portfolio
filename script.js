document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Theme Toggle Management
  // ==========================================
  const themeToggle = document.querySelector('#checkbox');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  // Apply initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'light') {
    themeToggle.checked = true;
  }

  // Toggle handler
  themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });


  // ==========================================
  // 2. Typewriter Effect
  // ==========================================
  const typewriterElement = document.querySelector('#typewriter');
  const words = [
    "Full-Stack Developer",
    "Python Backend Engineer",
    "AI/ML & NLP Developer",
    "FastAPI & Secure APIs",
    "B.Tech CSE (AI & ML)"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Deleting character
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45; // faster deleting
    } else {
      // Adding character
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90; // normal typing
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Complete word typed, wait before delete
      isDeleting = true;
      typingSpeed = 2000; // Wait 2s
    } else if (isDeleting && charIndex === 0) {
      // Word fully deleted, switch to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // brief pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  // Init typewriter if target element exists
  if (typewriterElement) {
    type();
  }


  // ==========================================
  // 3. Navigation Scroll State & Mobile Toggle
  // ==========================================
  const header = document.querySelector('#header');
  const navMenu = document.querySelector('#nav-menu');
  const menuBtn = document.querySelector('#menu-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.querySelector('#scroll-progress');

  // Change header styling on scroll + update progress bar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // Toggle mobile navigation
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
    });

    // Close mobile nav on click outside or on link click
    document.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }


  // ==========================================
  // 4. Scroll Reveal & Skill Bars Progression
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to trigger animation only once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach((el, index) => {
    el.setAttribute('data-delay', (index % 4) + 1);
    revealObserver.observe(el);
  });

  // Separate observer for skill bars to trigger progressive fill
  const skillsSection = document.querySelector('#skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level;
          });
        }
      });
    }, {
      threshold: 0.15
    });
    skillsObserver.observe(skillsSection);
  }


  // ==========================================
  // 5. ScrollSpy (Highlight navigation items on scroll)
  // ==========================================
  const sections = document.querySelectorAll('section');
  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-25% 0px -55% 0px'
  });

  sections.forEach(sec => scrollSpyObserver.observe(sec));


  // ==========================================
  // 5b. Subtle Hero Parallax
  // ==========================================
  const heroContent = document.querySelector('.hero-content');
  const heroImage = document.querySelector('.hero-image-wrapper');
  const blobs = document.querySelectorAll('.blob');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
      if (heroImage) heroImage.style.transform = `translateY(${scrollY * 0.06}px)`;
      blobs.forEach((blob, i) => {
        blob.style.transform = `translateY(${scrollY * (0.04 + i * 0.02)}px)`;
      });
    }
  });


  // ==========================================
  // 6. Interactive Projects Filter
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          // Show card with transition
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          // Hide card with transition
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });


  // ==========================================
  // 7. Certificate Lightbox Modal
  // ==========================================
  const certModal = document.querySelector('#cert-modal');
  const certModalImg = document.querySelector('#cert-modal-img');
  const certModalTitle = document.querySelector('#cert-modal-title');
  const certModalSubtitle = document.querySelector('#cert-modal-subtitle');
  const certModalBadge = document.querySelector('#cert-modal-badge');
  const certModalClose = document.querySelector('#cert-modal-close');
  const certCardsWithImage = document.querySelectorAll('.cert-has-image');

  if (certModal && certCardsWithImage.length) {
    certCardsWithImage.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img');
        const title = card.getAttribute('data-title');
        const issuer = card.getAttribute('data-issuer');
        const certId = card.getAttribute('data-id');
        const certDate = card.getAttribute('data-date');

        if (imgSrc) {
          certModalImg.src = imgSrc;
          certModalImg.alt = title;
          certModalTitle.textContent = title;
          certModalSubtitle.textContent = `${issuer} Proof of Completion · ${certDate}`;
          certModalBadge.textContent = `Verification ID: ${certId}`;
          certModal.classList.add('open');
          certModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeModal = () => {
      certModal.classList.remove('open');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (certModalClose) {
      certModalClose.addEventListener('click', closeModal);
    }

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('open')) {
        closeModal();
      }
    });
  }


  // ==========================================
  // 8. Contact Section (Direct Mailto CTA)
  // ==========================================
  // Direct mailto link is handled natively via <a href="mailto:riddhishalya2506@gmail.com">

});

