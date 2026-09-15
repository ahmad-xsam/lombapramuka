/* ==========================================================================
   SiMika - Standalone Dedicated Login Page Component
   ========================================================================== */

const AuthComponent = {
  render(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="split-login-page">
        <div class="split-login-card">
          <!-- Left Side: Scout Illustration & Branding Panel -->
          <div class="login-left-illustration" style="padding: 2rem 1.75rem;">
            <div class="login-left-brand" style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem;">
              <img class="simika-dynamic-logo" src="assets/simika-logo-dark.png" alt="SiMika Logo" style="height: 38px; width: auto; max-width: 160px; object-fit: contain; filter: drop-shadow(0 0 10px rgba(0, 245, 212, 0.4));">
            </div>

            <div class="scout-character-graphic" style="padding: 1rem 0;">
              <img class="simika-dynamic-logo" src="assets/simika-logo-dark.png" alt="SiMika Logo" style="width: 100%; max-width: 230px; height: auto; object-fit: contain; margin: 0 auto 1.2rem auto; filter: drop-shadow(0 0 25px rgba(0, 245, 212, 0.6)); display: block;">
              <h2 style="color: #ffffff; font-size: clamp(1.15rem, 1.8vw, 1.45rem); font-weight: 900; margin-bottom: 0.4rem; letter-spacing: -0.01em;">PORTAL MASUK ADMIN</h2>
              <p style="color: #cbd5e1; font-size: 0.8rem; max-width: 320px; margin: 0 auto; line-height: 1.5; font-weight: 400;">
                Selamat datang Tim Rekap & Dewan Juri. Silakan masuk untuk mengelola data peserta, penilaian, dan laporan SK Resmi.
              </p>
            </div>

            <div style="color: #94a3b8; font-size: 0.72rem; text-align: center; font-weight: 700; letter-spacing: 0.05em;">
              © SIMIKA SCOUT SCORING DASHBOARD 2026
            </div>
          </div>

          <!-- Right Side: Clean Sign-In Form Panel -->
          <div class="login-right-form-panel">
            <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
              <button type="button" class="btn-back-link" onclick="window.appRouter.navigate('public')">
                <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> Kembali ke Halaman Utama
              </button>
              <button class="theme-toggle-btn" onclick="window.ThemeManager.toggleTheme()"></button>
            </div>

            <h2 class="login-form-title">Login Dashboard Admin</h2>
            <p style="color: #94a3b8; font-size: 0.78rem; margin-bottom: 1.15rem;">Silakan isi kredensial akun admin Anda:</p>

            <form onsubmit="window.AuthComponent.handleLogin(event)">
              <div id="login-error-alert" style="display: none;" class="login-alert-danger"></div>

              <div class="login-input-box" style="margin-bottom: 0.95rem;">
                <label style="color: #cbd5e1; font-weight: 800; font-size: 0.76rem; display: block; margin-bottom: 0.35rem;">Username</label>
                <div>
                  <input type="text" id="login-username" class="form-control" required autofocus style="font-size: 0.78rem;" />
                </div>
              </div>

              <div class="login-input-box" style="margin-bottom: 1.25rem;">
                <label style="color: #cbd5e1; font-weight: 800; font-size: 0.76rem; display: block; margin-bottom: 0.35rem;">Password</label>
                <div>
                  <input type="password" id="login-password" class="form-control" placeholder="••••••••" required style="font-size: 0.78rem;" />
                </div>
              </div>

              <button type="submit" class="btn-yellow-pill" style="width: 100%; justify-content: center; border-radius: 10px; padding: 0.65rem; font-size: 0.84rem;">
                ⚡ MASUK KE DASHBOARD ADMIN
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();

    if (window.ThemeManager) {
      window.ThemeManager.applyTheme(window.ThemeManager.currentTheme);
    }
  },

  openLoginModal() {
    window.appRouter.navigate('login');
  },

  quickLogin(username, password) {
    const userField = document.getElementById('login-username');
    const passField = document.getElementById('login-password');
    if (userField) userField.value = username;
    if (passField) passField.value = password;
    this.handleLogin(new Event('submit'));
  },

  handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const userEl = document.getElementById('login-username');
    const passEl = document.getElementById('login-password');
    const u = userEl ? userEl.value.trim() : '';
    const p = passEl ? passEl.value.trim() : '';
    const errorBox = document.getElementById('login-error-alert');

    const users = window.dataStore.users;
    const match = users.find(x => x.username === u && x.password === p);

    if (match) {
      window.dataStore.setCurrentUser(match);
      window.appRouter.updateUIForAuth();
      // Directly navigate to Admin Dashboard after successful login
      window.appRouter.navigate('dashboard');
    } else {
      if (errorBox) {
        errorBox.textContent = '❌ Username atau password yang Anda masukkan salah!';
        errorBox.style.display = 'block';
      }
    }
  },

  logout() {
    if (confirm('Apakah Anda yakin ingin keluar dari akun admin?')) {
      window.dataStore.setCurrentUser(null);
      window.appRouter.updateUIForAuth();
      window.appRouter.navigate('public');
    }
  }
};

window.AuthComponent = AuthComponent;
