// theme.js: handles dark/light mode toggle and persistence
(function(){
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');

  // initial theme: prefer dark (gray neon) by default unless user saved a preference
  function getInitialTheme(){
    const saved = localStorage.getItem('site-theme');
    if (saved) return saved; // 'dark' or 'light'
    // default to dark (gray neon)
    return 'dark';
  }

  function applyTheme(theme){
    if(theme === 'dark'){
      body.classList.add('dark');       // matches your style.css: body.dark { ... }
      toggle.setAttribute('aria-pressed','true');
      toggle.textContent = '🌙';
    } else {
      body.classList.remove('dark');
      toggle.setAttribute('aria-pressed','false');
      toggle.textContent = '🌞';
    }
    localStorage.setItem('site-theme', theme);
  }

  // safe guard if toggle is missing
  if(!toggle) {
    // still apply initial theme
    applyTheme(getInitialTheme());
    return;
  }

  toggle.addEventListener('click', () => {
    const isDark = body.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  });

  // initialize
  applyTheme(getInitialTheme());
})();
