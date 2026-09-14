/* ==========================================================================
   SiMika - Main Application Controller & Router
   Voidborn Public Landing + Creator Byte AAA Gaming Admin Dashboard
   ========================================================================== */

window.currentCategoryFilter = 'all';
window.currentRoute = 'public';

class AppRouter {
  constructor() {
    this.mainContent = document.getElementById('app-main-content');
    this.sidebar = document.querySelector('.sidebar');
    this.topHeader = document.querySelector('.creator-header') || document.querySelector('.cybet-header') || document.querySelector('.top-header');
    this.appContainer = document.querySelector('.app-container');

    // Attach smooth parallax scroll binding
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

    // Attach interactive mouse movement parallax binding
    window.addEventListener('mousemove', (e) => {
      const mouseX = ((e.clientX / window.innerWidth) - 0.5) * 30;
      const mouseY = ((e.clientY / window.innerHeight) - 0.5) * 30;
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    });
  }

  navigate(route, extraParam) {
    // Protected Admin Routes Check (draw is open to public & participants)
    const protectedRoutes = ['dashboard', 'participants', 'scoring', 'ranking', 'combined', 'announcement', 'users', 'print'];
    if (protectedRoutes.includes(route) && !window.dataStore.currentUser) {
      this.navigate('login');
      return;
    }

    window.currentRoute = route;
    this.closeMobileSidebar();

    // Update active mobile dock button state
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
      const mobRoute = btn.dataset.mobileRoute;
      if (mobRoute === route || (mobRoute === 'login' && route === 'dashboard')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (route === 'public') {
      // Standalone Full-Width Voidborn Public Landing Page
      if (this.sidebar) this.sidebar.style.display = 'none';
      if (this.topHeader) this.topHeader.style.display = 'none';
      if (this.appContainer) this.appContainer.classList.remove('admin-layout');
      document.body.style.backgroundColor = '#100004';
      document.body.style.color = '#ffffff';

      if (this.mainContent) {
        this.mainContent.style.padding = '0';
        window.PublicComponent.render(this.mainContent);
      }
    } else if (route === 'login') {
      // Standalone Dedicated Split-Screen Login Page
      if (this.sidebar) this.sidebar.style.display = 'none';
      if (this.topHeader) this.topHeader.style.display = 'none';
      if (this.appContainer) this.appContainer.classList.remove('admin-layout');
      document.body.style.backgroundColor = '#100004';
      document.body.style.color = '#ffffff';

      if (this.mainContent) {
        this.mainContent.style.padding = '0';
        window.AuthComponent.render(this.mainContent);
      }
    } else if (route === 'draw' && !window.dataStore.currentUser) {
      // Standalone Full-Width Public Page for DAFTAR TAMPIL LKBB (OUTSIDE ADMIN DASHBOARD)
      // Only show standalone layout for non-logged-in (public) users
      if (this.sidebar) this.sidebar.style.display = 'none';
      if (this.topHeader) this.topHeader.style.display = 'none';
      if (this.appContainer) this.appContainer.classList.remove('admin-layout');
      document.body.style.backgroundColor = '#100004';
      document.body.style.color = '#ffffff';

      if (this.mainContent) {
        this.mainContent.style.padding = '0';
        window.DrawComponent.render(this.mainContent);
      }
    } else {
      // Creator Byte AAA Gaming Admin Layout (Post-Login)
      if (this.sidebar) this.sidebar.style.display = 'flex';
      if (this.topHeader) this.topHeader.style.display = 'flex';
      if (this.appContainer) this.appContainer.classList.add('admin-layout');
      document.body.style.backgroundColor = '#090d16';
      document.body.style.color = '#ffffff';

      if (this.mainContent) {
        this.mainContent.style.padding = '2rem';
      }

      // Update active sidebar item
      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
      });
      const activeNavBtn = document.querySelector(`[data-route="${route}"]`);
      if (activeNavBtn) {
        activeNavBtn.parentElement.classList.add('active');
      }

      // Render Admin Component
      switch (route) {
        case 'dashboard':
          window.DashboardComponent.render(this.mainContent);
          break;
        case 'participants':
          window.ParticipantsComponent.render(this.mainContent);
          break;
        case 'scoring':
          window.ScoringComponent.render(this.mainContent, extraParam);
          break;
        case 'draw':
          window.DrawComponent.render(this.mainContent);
          break;
        case 'ranking':
          window.RankingComponent.render(this.mainContent);
          break;
        case 'combined':
          window.CombinedComponent.render(this.mainContent);
          break;
        case 'announcement':
          window.AnnouncementComponent.render(this.mainContent);
          break;
        case 'users':
          window.UsersComponent.render(this.mainContent);
          break;
        case 'print':
          window.PrintComponent.renderPrintPage(this.mainContent);
          break;
        default:
          window.DashboardComponent.render(this.mainContent);
      }
    }

    lucide.createIcons();
  }

  setCategoryFilter(catId) {
    window.currentCategoryFilter = catId;

    document.querySelectorAll('.cat-pill').forEach(btn => {
      if (btn.dataset.cat === catId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.navigate(window.currentRoute);
  }

  updateUIForAuth() {
    const user = window.dataStore.currentUser;
    const authStatusBtn = document.getElementById('auth-status-btn');
    const userNameEl = document.getElementById('sidebar-user-name');
    const userRoleEl = document.getElementById('sidebar-user-role');

    if (user) {
      if (authStatusBtn) {
        authStatusBtn.innerHTML = `<i data-lucide="log-out"></i> Logout (${user.username})`;
        authStatusBtn.onclick = () => window.AuthComponent.logout();
        authStatusBtn.className = 'btn-voidborn-pill';
      }
      if (userNameEl) userNameEl.textContent = user.name;
      if (userRoleEl) userRoleEl.textContent = user.role.toUpperCase();
    } else {
      if (authStatusBtn) {
        authStatusBtn.innerHTML = `<i data-lucide="key"></i> Masuk Admin`;
        authStatusBtn.onclick = () => window.appRouter.navigate('login');
        authStatusBtn.className = 'btn-voidborn-pill';
      }
      if (userNameEl) userNameEl.textContent = 'Kak Juri Utama';
      if (userRoleEl) userRoleEl.textContent = 'ADMIN';
    }

    if (window.SecurityEngine) {
      window.SecurityEngine.applySecurityWatermark();
    }

    lucide.createIcons();
  }

  toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.toggle('mobile-open');
    if (backdrop) backdrop.classList.toggle('show');
  }

  closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize PWA Service Worker for 100% Offline Venue Operation
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered successfully:', reg.scope);
        reg.update();
      })
      .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
  }

  // 2. Initialize Security Engine & Anti-Screenshot System
  if (window.SecurityEngine) {
    window.SecurityEngine.init();
  }

  window.appRouter = new AppRouter();
  window.appRouter.updateUIForAuth();
  
  // Default entry page is Halaman Utama (Public Landing Page)
  window.appRouter.navigate('public');

  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('table.admin-table tbody tr, table.custom-table tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(q)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
});

function resetSystemData() {
  if (confirm('Reset seluruh data nilai & peserta ke data awal (Seed Data)?')) {
    window.dataStore.resetData();
    window.appRouter.navigate(window.currentRoute);
  }
}
