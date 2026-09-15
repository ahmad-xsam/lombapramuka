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

    // Update theme toggle buttons UI
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      if (theme === 'light') {
        btn.innerHTML = `<span style="background: #ffffff; color: #d90429; padding: 2px 7px; border-radius: 6px; font-weight: 900; font-size: 0.72rem; letter-spacing: 0.05em; border: 1px solid #d90429;">MERAH-PUTIH</span> <i data-lucide="sun" style="width: 15px; height: 15px; color: #ffffff;"></i> <span style="color: #ffffff; font-weight: 800;">LIGHT MODE</span>`;
        btn.title = "Klik untuk beralih ke Dark Mode (Hitam-Merah)";
        btn.style.background = "linear-gradient(135deg, #d90429 0%, #b7094c 100%)";
        btn.style.borderColor = "#ffffff";
        btn.style.color = "#ffffff";
      } else {
        btn.innerHTML = `<span style="background: #000000; color: #ff3355; padding: 2px 7px; border-radius: 6px; font-weight: 900; font-size: 0.72rem; letter-spacing: 0.05em; border: 1px solid #ff3355;">HITAM-MERAH</span> <i data-lucide="moon" style="width: 15px; height: 15px; color: #ff3355;"></i> <span style="color: #ff3355; font-weight: 800;">DARK MODE</span>`;
        btn.title = "Klik untuk beralih ke Light Mode (Merah-Putih)";
        btn.style.background = "linear-gradient(135deg, #0f0508 0%, #2a0008 100%)";
        btn.style.borderColor = "rgba(255, 51, 85, 0.4)";
        btn.style.color = "#ff3355";
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
