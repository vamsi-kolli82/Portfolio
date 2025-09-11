// theme.js: handles dark/light mode toggle and persistence

(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  // init theme from localStorage or match prefers-color-scheme
  function getInitialTheme(){
    const saved = localStorage.getItem('site-theme');
    if (saved) return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function applyTheme(theme){
    if(theme === 'light'){
      document.documentElement.classList.add('light');
      toggle.setAttribute('aria-pressed','false');
      toggle.textContent = '🌞';
    } else {
      document.documentElement.classList.remove('light');
      toggle.setAttribute('aria-pressed','true');
      toggle.textContent = '🌙';
    }
    localStorage.setItem('site-theme', theme);
  }

  // toggle event
  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.contains('light');
    applyTheme(isLight ? 'dark' : 'light');
  });

  // initialize
  applyTheme(getInitialTheme());
})();
