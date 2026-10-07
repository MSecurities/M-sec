// Runs in <head> before the first paint (see layout.tsx): puts the `dark` class on <html> from the saved
// choice or the system setting, so CSS-driven dark styles never flash light while the page loads.
export const THEME_INIT_SCRIPT =
  "try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}";
