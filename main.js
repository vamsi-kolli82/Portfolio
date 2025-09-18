document.addEventListener('DOMContentLoaded', () => {
  // Data: projects (as requested)
  const projects = [
    {
      id: 'finovate',
      title: 'Finovate Dashboard',
      desc: 'Dark theme finance tracker with neon UI. Visualizes financial metrics and transactions with interactive charts.',
      tech: ['JavaScript','Chart.js','HTML','CSS'],
      github: 'https://github.com/vamsi-kolli82/Finance-Tracker',
      live: '#',
      image: 'images/finovate.jpeg'
    },
    {
      id: 'ems',
      title: 'Employee Management System',
      desc: 'CRUD application using Java and MySQL for managing employee records, roles, and persistence.',
      tech: ['Java','JDBC','MySQL'],
      github: 'https://github.com/vamsi-kolli82/Employee_Management_System',
      live: '#',
      image: 'images/ems.jpeg'
    }
  ];

  // Render projects
  const projectGrid = document.getElementById('project-grid');
  function mkBadge(t){ return `<span class="tech-badge">${t}</span>`; }

  function renderProjects(list){
    projectGrid.innerHTML = '';
    if(list.length === 0){
      projectGrid.innerHTML = `<div class="glass" style="padding:1rem;">No projects matched your search/filter.</div>`;
      return;
    }
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project-card glass';
      card.setAttribute('tabindex','0');
      card.setAttribute('role','button');
      card.setAttribute('aria-label', `Open project ${p.title}`);
      card.dataset.id = p.id;

      card.innerHTML = `
        <img src="${p.image}" alt="${p.title} screenshot" onerror="this.style.opacity=.4" />
        <div class="project-body">
          <h4>${p.title}</h4>
          <p class="muted small">${p.desc}</p>
          <div style="margin-top:auto">
            <div class="tech-badges">${p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>
            <div style="margin-top:.6rem;display:flex;gap:.5rem">
              <a class="btn ghost" href="${p.github}" target="_blank" rel="noopener">GitHub</a>
              ${p.live ? `<a class="btn ghost" href="${p.live}" target="_blank" rel="noopener">Live Demo</a>` : ''}
            </div>
          </div>
        </div>
      `;
      // click/keyboard open modal
      card.addEventListener('click', () => openProjectModal(p));
      card.addEventListener('keypress', (e) => { if(e.key === 'Enter' || e.key === ' ') openProjectModal(p); });
      projectGrid.appendChild(card);
    });
  }

  renderProjects(projects);

  // Project Modal
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');

  function openProjectModal(p){
    modalBody.innerHTML = `
      <h2 id="modal-title">${p.title}</h2>
      <img src="${p.image}" alt="${p.title} screenshot" style="width:100%;max-height:320px;object-fit:cover;border-radius:8px;margin:8px 0" />
      <p>${p.desc}</p>
      <p><strong>Tech:</strong> ${p.tech.join(', ')}</p>
      <p style="display:flex;gap:.5rem;margin-top:.6rem">
        <a class="btn primary" href="${p.github}" target="_blank" rel="noopener">View on GitHub</a>
        ${p.live ? `<a class="btn ghost" href="${p.live}" target="_blank" rel="noopener">Open Live Demo</a>` : ''}
        <button id="modal-close-btn" class="btn ghost" data-close>Close</button>
      </p>
    `;
    modal.setAttribute('aria-hidden','false');
    // focus trap: focus modal close button
    setTimeout(()=> {
      const closeBtn = modal.querySelector('[data-close]');
      if(closeBtn) closeBtn.focus();
    }, 50);
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  // overlay and close buttons
  modal.addEventListener('click', (e) => {
    if(e.target.hasAttribute('data-close') || e.target.classList.contains('modal-overlay')) closeModal();
  });

  // ESC closes modal
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      // close any open modal
      if(modal.getAttribute('aria-hidden') === 'false') closeModal();
    }
  });

  // Search & Filter
  const searchInput = document.getElementById('project-search');
  const techFilter = document.getElementById('tech-filter');

  function filterProjects(){
    const q = (searchInput.value || '').trim().toLowerCase();
    const tech = (techFilter.value || '').trim().toLowerCase();
    const filtered = projects.filter(p => {
      const matchesQ = q === '' || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tech.join(' ').toLowerCase().includes(q);
      const matchesTech = tech === '' || p.tech.map(t => t.toLowerCase()).includes(tech);
      return matchesQ && matchesTech;
    });
    renderProjects(filtered);
  }

  searchInput && searchInput.addEventListener('input', debounce(filterProjects, 220));
  techFilter && techFilter.addEventListener('change', filterProjects);

  // Debounce helper
  function debounce(fn, wait){
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(()=> fn.apply(this,args), wait);
    }
  }

  // Skill bars animate on scroll into view
  const skills = document.querySelectorAll('.skill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const value = el.dataset.value || 0;
        const fill = el.querySelector('.skill-fill');
        fill.style.width = value + '%';
        observer.unobserve(el);
      }
    });
  }, {threshold:0.3});

  skills.forEach(s => observer.observe(s));

  // Back to top button
  const backBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 400) backBtn.style.display = 'block';
    else backBtn.style.display = 'none';
  });
  backBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryMenu = document.getElementById('primary-menu');
  if(menuToggle){
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      primaryMenu.style.display = !expanded ? 'flex' : 'none';
    });
  }

  // Contact form validation + send to Formspree + localStorage save
  const contactForm = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if(contactForm){
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // we'll handle submit (validation + AJAX send)

      feedback.textContent = '';
      feedback.style.color = ''; // reset

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      // basic client-side validation
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(name.length < 2){
        feedback.textContent = 'Please enter your name (2+ characters).';
        feedback.style.color = 'var(--accent3, #f39c12)';
        contactForm.name.focus();
        return;
      }
      if(!emailRe.test(email)){
        feedback.textContent = 'Please enter a valid email address.';
        feedback.style.color = 'var(--accent3, #f39c12)';
        contactForm.email.focus();
        return;
      }
      if(subject.length < 3){
        feedback.textContent = 'Please add a subject.';
        feedback.style.color = 'var(--accent3, #f39c12)';
        contactForm.subject.focus();
        return;
      }
      if(message.length < 6){
        feedback.textContent = 'Message should be at least 6 characters.';
        feedback.style.color = 'var(--accent3, #f39c12)';
        contactForm.message.focus();
        return;
      }

      // store locally first
      let messages = [];
      try {
        messages = JSON.parse(localStorage.getItem('localMessages') || '[]');
      } catch(err) { messages = []; }
      messages.push({
        name, email, subject, message, time: new Date().toISOString()
      });
      try {
        localStorage.setItem('localMessages', JSON.stringify(messages));
      } catch(err) {
        // localStorage may fail if storage full or access denied — ignore but proceed
        console.warn('Could not save message locally', err);
      }

      // Attempt to send to Formspree (AJAX) using the form action
      const action = (contactForm.getAttribute('action') || '').trim();
      if(action){
        try {
          // capture FormData before resetting
          const formData = new FormData(contactForm);

          const resp = await fetch(action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if(resp.ok){
            feedback.textContent = 'Message sent — saved locally and submitted. Thank you!';
            feedback.style.color = 'var(--accent2, #ff4ecd)';
            contactForm.reset();
          } else {
            // attempt to parse JSON error returned by Formspree
            let errText = 'Unable to submit form to Formspree.';
            try {
              const data = await resp.json();
              if(data && data.errors){
                errText = data.errors.map(x => x.message).join(', ');
              }
            } catch(parseErr){}
            feedback.textContent = 'Saved locally, but not submitted: ' + errText;
            feedback.style.color = 'orange';
          }
        } catch(networkErr){
          console.error('Network error sending to Formspree:', networkErr);
          feedback.textContent = 'Saved locally, but network error prevented sending. Please try again later.';
          feedback.style.color = 'orange';
        }
      } else {
        // no action attribute set — only save locally
        feedback.textContent = 'Message saved locally (no remote endpoint configured).';
        feedback.style.color = 'var(--accent2, #ff4ecd)';
        contactForm.reset();
      }
    });
  }

  // Accessibility: close mobile menu when focusing outside
  document.addEventListener('click', (e) => {
    if(window.innerWidth <= 700 && primaryMenu && menuToggle){
      if(!primaryMenu.contains(e.target) && !menuToggle.contains(e.target)){
        primaryMenu.style.display = 'none';
        menuToggle.setAttribute('aria-expanded','false');
      }
    }
  });

  // Keyboard: trap focus in modal when open (basic)
  document.addEventListener('focus', (e) => {
    if(modal.getAttribute('aria-hidden') === 'false'){
      const modalElements = Array.from(modal.querySelectorAll('button, a, [href], input, textarea, select, [tabindex]')).filter(el => !el.hasAttribute('disabled'));
      if(modalElements.length && !modal.contains(e.target)){
        modalElements[0].focus();
      }
    }
  }, true);

});
