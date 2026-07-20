import './style.css'

let siteData = {};
let scrollObserver;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/data.json');
    siteData = await response.json();
    
    renderServices();
    renderProjects();
    renderTestimonials();
    initScrollAnimations();
    initNavbar();
    initMobileNav();
    initContactForm();
    initProjectModal();
  } catch (error) {
    console.error('Error loading site data:', error);
  }
});

function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;

  const html = siteData.services.map((service, index) => `
    <div class="service-card animate-up stagger-${(index % 4) + 1}">
      <div class="service-icon">
        <i class="fas fa-${service.icon}"></i>
      </div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function renderProjects() {
  const filterContainer = document.querySelector('.portfolio-filters');
  const gridContainer = document.getElementById('projects-grid');
  if (!filterContainer || !gridContainer) return;

  if (!siteData.projects || siteData.projects.length === 0) {
    gridContainer.innerHTML = '<p class="text-center text-muted" style="grid-column: 1 / -1;">New projects coming soon...</p>';
    filterContainer.innerHTML = '';
    return;
  }

  // Extract unique categories, add 'All'
  const categories = ['All', ...new Set(siteData.projects.map(p => p.category))];

  // Render filter buttons
  filterContainer.innerHTML = categories.map((cat, index) => `
    <button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${cat}">
      ${cat}
    </button>
  `).join('');

  // Initial render of all projects
  renderProjectsGrid(siteData.projects, gridContainer);

  // Filter logic
  filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      // Update active state
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      const filter = e.target.getAttribute('data-filter');
      const filteredProjects = filter === 'All' 
        ? siteData.projects 
        : siteData.projects.filter(p => p.category === filter);
      
      renderProjectsGrid(filteredProjects, gridContainer);
    }
  });
}

function renderProjectsGrid(projects, container) {
  if (projects.length === 0) {
    container.innerHTML = '<p class="text-center text-muted" style="grid-column: 1 / -1;">No projects in this category.</p>';
    return;
  }

  const html = projects.map((project, index) => `
    <div class="project-card animate-up stagger-${(index % 4) + 1}" data-id="${project.id}">
      <img src="${project.afterImage || project.image || 'https://via.placeholder.com/800x600'}" alt="${project.title}" loading="lazy" style="object-fit: cover;">
      <div class="project-overlay">
        <p>${project.category}</p>
        <h3>${project.title}</h3>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
  
  if (scrollObserver) {
    container.querySelectorAll('.animate-up').forEach(el => {
      // Small timeout to allow DOM to paint before observing so animation triggers correctly
      setTimeout(() => scrollObserver.observe(el), 10);
    });
  }
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  if (!siteData.testimonials || siteData.testimonials.length === 0) {
    container.innerHTML = '<p class="text-center text-muted" style="grid-column: 1 / -1;">Client reviews coming soon...</p>';
    return;
  }

  const html = siteData.testimonials.map((t, index) => `
    <div class="testimonial-card animate-up stagger-${(index % 3) + 1}">
      <div class="stars">
        ${Array(t.rating).fill('<i class="fas fa-star"></i>').join('')}
      </div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="client-info">
        <h4>${t.name}</h4>
        <p>${t.role || 'Client'}</p>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.querySelector('.close-modal');
  const gridContainer = document.getElementById('projects-grid');
  
  if (!modal || !closeBtn || !gridContainer) return;

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  gridContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;

    const projectId = parseInt(card.getAttribute('data-id'));
    const project = siteData.projects.find(p => p.id === projectId);
    
    if (project) {
      document.getElementById('modal-title').textContent = project.title;
      document.getElementById('modal-category').textContent = project.category;
      
      const sqftEl = document.getElementById('modal-sqft');
      if (project.sqft) {
        sqftEl.querySelector('span').textContent = project.sqft;
        sqftEl.style.display = 'block';
      } else {
        sqftEl.style.display = 'none';
      }

      document.getElementById('modal-before').src = project.beforeImage || 'https://via.placeholder.com/800x600?text=No+Before+Image';
      document.getElementById('modal-after').src = project.afterImage || project.image || 'https://via.placeholder.com/800x600?text=No+After+Image';

      modal.classList.remove('hidden');
    }
  });
}

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-up, .animate-fade').forEach(el => {
    scrollObserver.observe(el);
  });
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  
  if (!form) return;

  // Replace this with your Google Apps Script Web App URL after you deploy it
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';

  form.addEventListener('submit', e => {
    e.preventDefault();
    
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
      statusDiv.style.color = '#dc2743';
      statusDiv.textContent = 'Setup Required: Please add your Google Script URL in main.js';
      return;
    }

    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;
    statusDiv.textContent = '';

    const formData = new FormData(form);

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        statusDiv.style.color = 'green';
        statusDiv.textContent = 'Message sent successfully! We will contact you soon.';
        form.reset();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => {
      console.error('Error!', error.message);
      statusDiv.style.color = '#dc2743';
      statusDiv.textContent = 'Oops! Something went wrong. Please try again.';
    })
    .finally(() => {
      submitBtn.textContent = 'SEND MESSAGE';
      submitBtn.disabled = false;
    });
  });
}
