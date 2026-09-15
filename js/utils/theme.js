/* ==========================================================================
   SiMika - Theme Manager Engine (Light Mode: Merah-Putih | Dark Mode: Hitam-Merah)
   ========================================================================== */

const ThemeManager = {
  currentTheme: localStorage.getItem('simika_theme_mode') || 'dark',

  init() {
    this.applyTheme(this.currentTheme);
  },

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('simika_theme_mode', this.currentTheme);
    this.applyTheme(this.currentTheme);
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const body = document.body;
    if (!body) return;

    if (theme === 'light') {
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
    } else {
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
    }

    const logoSrc = theme === 'light' ? 'assets/simika-logo-light.png' : 'assets/simika-logo-dark.png';

    // Update all dynamic logo images across all pages
    document.querySelectorAll('.simika-dynamic-logo, img[alt="SiMika Logo"]').forEach(img => {
      img.src = logoSrc;
    });

    // Update Favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = logoSrc;
    }

    // Update theme toggle buttons UI (ICON-ONLY AS REQUESTED BY USER)
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.style.display = "inline-flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.width = "38px";
      btn.style.height = "38px";
      btn.style.borderRadius = "50%";
      btn.style.padding = "0";
      btn.style.cursor = "pointer";
      btn.style.transition = "all 0.25s ease";

      if (theme === 'light') {
        btn.innerHTML = `<i data-lucide="sun" style="width: 20px; height: 20px; color: #d90429;"></i>`;
        btn.title = "Beralih ke Dark Mode (Hitam-Merah)";
        btn.style.background = "#ffffff";
        btn.style.border = "2px solid #d90429";
        btn.style.boxShadow = "0 2px 10px rgba(217, 4, 41, 0.25)";
      } else {
        btn.innerHTML = `<i data-lucide="moon" style="width: 20px; height: 20px; color: #ff3355;"></i>`;
        btn.title = "Beralih ke Light Mode (Merah-Putih)";
        btn.style.background = "#18060c";
        btn.style.border = "2px solid rgba(255, 51, 85, 0.5)";
        btn.style.boxShadow = "0 0 12px rgba(255, 51, 85, 0.3)";
      }
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  }
};

window.ThemeManager = ThemeManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}
