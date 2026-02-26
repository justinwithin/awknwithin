/* ==========================================================================
   Within Center - Shared JavaScript Module
   Handles: Navigation, Header, Footer, Carousel, Tabs, Toasts, Animations
   ========================================================================== */

(function() {
  'use strict';

  // ---- Determine base path for links ----
  const BASE = (function() {
    const path = window.location.pathname;
    const idx = path.indexOf('/within-center');
    if (idx !== -1) {
      return path.substring(0, idx) + '/within-center';
    }
    return '/within-center';
  })();

  function link(page) {
    if (page === '/') return BASE + '/';
    return BASE + '/' + page + '/';
  }

  // ---- Inject Header ----
  function injectHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.id = 'site-header';
    header.innerHTML = `
      <div class="site-header__inner">
        <a href="${link('/')}" class="site-logo">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="18" fill="#379676"/>
            <path d="M10 14 L18 26 L26 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M14 14 L18 20 L22 14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.6"/>
          </svg>
          Within Center
        </a>
        <nav class="site-nav" id="site-nav">
          <a href="${link('/')}" class="site-nav__link" data-page="home">Home</a>
          <a href="${link('psychedelic-therapy-austin')}" class="site-nav__link" data-page="outpatient">Psychedelic Therapy Austin</a>
          <a href="${link('psychedelic-therapy-retreat')}" class="site-nav__link" data-page="retreat">Inpatient Retreat</a>
          <div class="site-nav__dropdown">
            <span class="site-nav__link site-nav__dropdown-toggle" data-page="about">About</span>
            <div class="site-nav__dropdown-menu">
              <a href="${link('our-team')}" class="site-nav__dropdown-item">Our Team</a>
              <a href="${link('blog')}" class="site-nav__dropdown-item">Within Blog</a>
            </div>
          </div>
          <a href="${link('contact')}" class="site-nav__link" data-page="contact">Contact</a>
          <a href="${link('booking')}" class="btn btn--primary btn--sm">Book Now</a>
          <a href="tel:+15125159434" class="site-nav__phone">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            (512) 515-9434
          </a>
        </nav>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;
    document.body.prepend(header);

    // Highlight current page
    const currentPath = window.location.pathname;
    header.querySelectorAll('.site-nav__link, .site-nav__dropdown-item').forEach(function(el) {
      const href = el.getAttribute('href');
      if (href && currentPath.includes(href.replace(BASE, '').replace(/\/$/, ''))) {
        el.classList.add('site-nav__link--active');
      }
    });

    // Mobile toggle
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        nav.classList.toggle('site-nav--open');
      });
    }

    // Mobile dropdown
    header.querySelectorAll('.site-nav__dropdown-toggle').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          el.parentElement.classList.toggle('open');
        }
      });
    });

    // Scroll shadow
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // ---- Inject Footer ----
  function injectFooter() {
    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-brand__logo">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                <circle cx="18" cy="18" r="18" fill="#379676"/>
                <path d="M10 14 L18 26 L26 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M14 14 L18 20 L22 14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.6"/>
              </svg>
              Within Center
            </div>
            <div class="footer-brand__address">
              7600 Stillridge Dr<br>Austin, Texas 78736
            </div>
            <div class="footer-brand__contact">
              <a href="tel:+15125159434">(512) 515-9434</a>
              <a href="mailto:intake@within.center">intake@within.center</a>
            </div>
            <p style="font-size:0.85rem;margin-top:8px;color:rgba(255,255,255,0.6);">Monday - Friday: 9am - 6pm<br>Intake: 24/7</p>
            <div class="social-links">
              <a href="https://www.facebook.com/withincenteraustin" class="social-link" aria-label="Facebook" target="_blank" rel="noopener">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.youtube.com/@withincenter" class="social-link" aria-label="YouTube" target="_blank" rel="noopener">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2c.312-1.732.466-3.49.46-5.25a29.005 29.005 0 00-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/></svg>
              </a>
              <a href="https://www.instagram.com/withincenteraustin" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <a href="${link('psychedelic-therapy-austin')}">Outpatient Therapy</a>
            <a href="${link('psychedelic-therapy-retreat')}">Retreat Center</a>
            <a href="${link('booking')}">Book a Session</a>
          </div>
          <div class="footer-col">
            <h4>Conditions</h4>
            <a href="${link('depression-treatment')}">Depression</a>
            <a href="${link('anxiety-treatment')}">Anxiety</a>
            <a href="${link('addiction-treatment')}">Addiction</a>
            <a href="${link('grief-treatment')}">Grief &amp; Loss</a>
            <a href="${link('burnout-treatment')}">Burnout</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="${link('our-team')}">Our Team</a>
            <a href="${link('blog')}">Within Blog</a>
            <a href="${link('contact')}">Contact Us</a>
            <h4 style="margin-top:var(--wc-space-lg);">Newsletter</h4>
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.6);margin-bottom:8px;">Get updates on events and promos</p>
            <form class="newsletter-form" onsubmit="event.preventDefault(); WithinCenter.toast('Thanks for subscribing!','success');">
              <input type="email" placeholder="Your email" required>
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Hearth Space Health, Inc. All rights reserved.</p>
          <p style="max-width:600px;font-size:0.75rem;color:rgba(255,255,255,0.4);line-height:1.5;">The information provided on this website is for informational and educational purposes only and is not intended as medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider. If you are experiencing a medical or psychiatric emergency, please call 911.</p>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }

  // ---- Tabs ----
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function(tabs) {
      var btns = tabs.querySelectorAll('.tabs__btn');
      var panels = tabs.querySelectorAll('.tabs__panel');
      btns.forEach(function(btn, i) {
        btn.addEventListener('click', function() {
          btns.forEach(function(b) { b.classList.remove('tabs__btn--active'); });
          panels.forEach(function(p) { p.classList.remove('tabs__panel--active'); });
          btn.classList.add('tabs__btn--active');
          if (panels[i]) panels[i].classList.add('tabs__panel--active');
        });
      });
    });
  }

  // ---- Testimonial Carousel ----
  function initCarousels() {
    document.querySelectorAll('.testimonials-carousel').forEach(function(carousel) {
      var track = carousel.querySelector('.testimonials-track');
      var items = carousel.querySelectorAll('.testimonial');
      var dots = carousel.querySelectorAll('.carousel-dot');
      var prevBtn = carousel.querySelector('.carousel-btn--prev');
      var nextBtn = carousel.querySelector('.carousel-btn--next');
      var current = 0;

      function goTo(idx) {
        if (idx < 0) idx = items.length - 1;
        if (idx >= items.length) idx = 0;
        current = idx;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function(d, i) {
          d.classList.toggle('carousel-dot--active', i === current);
        });
      }

      if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });
      dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() { goTo(i); });
      });

      // Auto-advance
      setInterval(function() { goTo(current + 1); }, 6000);
    });
  }

  // ---- Scroll Animations ----
  function initAnimations() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(function(el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // ---- Toast ----
  function showToast(message, type) {
    type = type || 'info';
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3500);
  }

  // ---- Team Bio Toggle ----
  function initBioToggles() {
    document.querySelectorAll('.team-card__bio-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var bio = btn.previousElementSibling;
        if (bio) {
          bio.classList.toggle('expanded');
          btn.textContent = bio.classList.contains('expanded') ? 'Read less' : 'Read more';
        }
      });
    });
  }

  // ---- Init ----
  function init() {
    injectHeader();
    injectFooter();
    initTabs();
    initCarousels();
    initAnimations();
    initBioToggles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities
  window.WithinCenter = {
    toast: showToast,
    link: link,
    BASE: BASE
  };
})();
