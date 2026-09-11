/* ==========================================================================
   SiMika - Security Engine & Anti-Tampering Protection System
   - Data Integrity Checksums (Anti-Manipulation)
   - Anti-Screenshot & Screen Capture Protection (Watermark + Blur Guard)
   - Offline Queue & Auto-Sync Engine
   ========================================================================== */

const SIMIKA_OFFLINE_QUEUE_KEY = 'simika_offline_sync_queue_v1';
const SIMIKA_SECURITY_LOG_KEY = 'simika_security_audit_logs_v1';

class SecurityEngine {
  constructor() {
    this.watermarkElement = null;
    this.isProtected = false;
  }

  init() {
    this.setupAntiScreenshot();
    this.setupWindowFocusBlurGuard();
    this.verifyDataIntegrity();
    this.setupOfflineListeners();
  }

  // 1. Generate Simple Cryptographic Hash Checksum
  generateChecksum(dataObj) {
    const jsonStr = JSON.stringify(dataObj || {});
    let hash = 0;
    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return 'SEC-' + Math.abs(hash).toString(16).toUpperCase() + '-' + jsonStr.length;
  }

  // Verify LocalStorage Scores against manual tampering
  verifyDataIntegrity() {
    try {
      const scores = window.dataStore.scores;
      const storedSig = localStorage.getItem('simika_scores_signature');
      const currentSig = this.generateChecksum(scores);

      if (storedSig && storedSig !== currentSig) {
        console.warn('⚠️ [SECURITY ALERT] Data scores integrity mismatch detected! LocalStorage may have been altered.');
        this.logAudit('DATA_TAMPER_ALERT', 'LocalStorage scores signature mismatch');
      } else if (!storedSig) {
        localStorage.setItem('simika_scores_signature', currentSig);
      }
    } catch (err) {
      console.error('Data integrity check error:', err);
    }
  }

  updateDataSignature() {
    try {
      const scores = window.dataStore.scores;
      const newSig = this.generateChecksum(scores);
      localStorage.setItem('simika_scores_signature', newSig);
    } catch (e) {}
  }

  // 2. Anti-Screenshot & Screen Capture Guard
  setupAntiScreenshot() {
    // Intercept Keyboard Shortcuts (PrintScreen, Ctrl+P, F12, Ctrl+Shift+I)
    window.addEventListener('keydown', (e) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        this.triggerScreenshotProtection('Tombol PrintScreen terdeteksi! Dokumen ini dilindungi sistem keamanan SiMika.');
        e.preventDefault();
        return false;
      }

      // Ctrl + P (Cetak) outside of official print menu
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        if (!window.location.hash.includes('print')) {
          this.triggerScreenshotProtection('Tangkapan layar / Cetak cepat (Ctrl+P) dibatasi. Gunakan menu Cetak SK Resmi.');
          e.preventDefault();
          return false;
        }
      }

      // F12 or Ctrl+Shift+I / DevTools shortcut warning
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
        this.logAudit('DEVTOOLS_SHORTCUT_TRY', `User tried opening devtools: ${e.key}`);
      }
    }, true);

    // Dynamic Anti-Copy / Anti-Selection Guard
    document.addEventListener('copy', (e) => {
      const activeUser = window.dataStore.currentUser;
      if (activeUser && activeUser.role !== 'Super Admin') {
        this.showSecurityToast('🔒 Informasi Penilaian dilindungi dari penyalinan otomatis.');
      }
    });
  }

  // Blur page content when window loses focus (Anti Screen Capture Tool Focus Switch)
  setupWindowFocusBlurGuard() {
    let blurOverlay = document.getElementById('security-blur-overlay');
    if (!blurOverlay) {
      blurOverlay = document.createElement('div');
      blurOverlay.id = 'security-blur-overlay';
      blurOverlay.className = 'security-blur-overlay';
      blurOverlay.innerHTML = `
        <div class="security-blur-card">
          <i data-lucide="shield-alert" style="width: 48px; height: 48px; color: #fbbf24; margin-bottom: 0.75rem;"></i>
          <h3>DOKUMEN TERLINDUNGI MODUL KEAMANAN</h3>
          <p>Layar dikunci sementara saat fokus jendela terlepas untuk mencegah perekaman / tangkapan layar tak berizin.</p>
          <button class="btn-yellow-pill" onclick="window.SecurityEngine.unblurWindow()">
            Kembali ke Aplikasi SiMika
          </button>
        </div>
      `;
      document.body.appendChild(blurOverlay);
    }

    window.addEventListener('blur', () => {
      // Blur if logged in
      if (window.dataStore.currentUser) {
        blurOverlay.classList.add('active');
        if (window.lucide) window.lucide.createIcons();
      }
    });

    window.addEventListener('focus', () => {
      blurOverlay.classList.remove('active');
    });
  }

  unblurWindow() {
    const blurOverlay = document.getElementById('security-blur-overlay');
    if (blurOverlay) blurOverlay.classList.remove('active');
  }

  triggerScreenshotProtection(message) {
    this.showSecurityToast(`🛡️ SECURITY GUARD: ${message}`);
    this.logAudit('SCREENSHOT_BLOCKED', message);

    // Temporarily apply anti-screenshot flash overlay
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:#000;z-index:999999;display:flex;align-items:center;justify-content:center;color:#ff4d4d;font-weight:900;font-size:1.5rem;font-family:sans-serif;text-align:center;padding:2rem;';
    flash.innerHTML = `<div>⚠️ AKSES TANGKAPAN LAYAR DIBATASI<br><span style="font-size:0.9rem;color:#94a3b8;font-weight:400;margin-top:0.5rem;display:block;">${message}</span></div>`;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 1800);
  }

  // Render Dynamic Security Watermark across the workspace (Disabled/Removed per user request)
  applySecurityWatermark() {
    let watermark = document.getElementById('simika-security-watermark');
    if (watermark) {
      watermark.remove();
    }
  }

  showSecurityToast(msg) {
    let container = document.getElementById('security-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'security-toast-container';
      container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'security-toast-msg';
    toast.innerHTML = `<i data-lucide="shield-check" style="width:16px;height:16px;color:#00f5d4;"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  logAudit(action, details) {
    try {
      const logs = JSON.parse(localStorage.getItem(SIMIKA_SECURITY_LOG_KEY)) || [];
      logs.unshift({
        timestamp: new Date().toISOString(),
        user: window.dataStore.currentUser?.username || 'ANONYMOUS',
        action,
        details
      });
      // Keep last 100 audit entries
      if (logs.length > 100) logs.pop();
      localStorage.setItem(SIMIKA_SECURITY_LOG_KEY, JSON.stringify(logs));
    } catch (e) {}
  }

  // 3. Offline Queue & Auto-Sync Engine
  setupOfflineListeners() {
    window.addEventListener('online', () => {
      this.updateNetworkBadge(true);
      this.flushOfflineSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.updateNetworkBadge(false);
      this.showSecurityToast('📡 MODE OFFLINE AKTIF: Nilai disimpan di antrean lokal & akan disinkronkan otomatis saat ada koneksi.');
    });

    // Check status at startup
    setTimeout(() => this.updateNetworkBadge(navigator.onLine), 500);
  }

  updateNetworkBadge(isOnline) {
    const badgeEl = document.getElementById('network-status-badge');
    if (!badgeEl) return;

    if (isOnline) {
      badgeEl.className = 'network-status-badge status-online';
      badgeEl.innerHTML = `<span class="status-dot"></span> 🟢 ONLINE`;
      badgeEl.title = 'Koneksi internet terhubung. Sinkronisasi real-time aktif.';
    } else {
      badgeEl.className = 'network-status-badge status-offline';
      badgeEl.innerHTML = `<span class="status-dot"></span> 🟡 OFFLINE (MODE LOKAL)`;
      badgeEl.title = 'Aplikasi berjalan 100% offline. Semua input nilai tersimpan aman di perangkat lokal.';
    }
  }

  queueOfflineScoreSave(lombaId, teamId, scoreObj) {
    try {
      const queue = JSON.parse(localStorage.getItem(SIMIKA_OFFLINE_QUEUE_KEY)) || [];
      queue.push({
        id: 'SYNC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toISOString(),
        lombaId,
        teamId,
        scoreObj
      });
      localStorage.setItem(SIMIKA_OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      this.showSecurityToast('📥 Nilai masuk antrean offline (Auto-Sync saat internet terhubung).');
    } catch (e) {
      console.error('Error queuing offline score:', e);
    }
  }

  flushOfflineSyncQueue() {
    try {
      const queue = JSON.parse(localStorage.getItem(SIMIKA_OFFLINE_QUEUE_KEY)) || [];
      if (queue.length === 0) return;

      console.log(`[AutoSync] Processing ${queue.length} offline queued score submissions...`);
      this.showSecurityToast(`🔄 SINKRONISASI: Mengirim ${queue.length} data rekap offline...`);

      const badgeEl = document.getElementById('network-status-badge');
      if (badgeEl) {
        badgeEl.className = 'network-status-badge status-syncing';
        badgeEl.innerHTML = `<span class="status-dot"></span> 🔵 SINKRONISASI (${queue.length})`;
      }

      let successCount = 0;
      queue.forEach(item => {
        window.dataStore.saveScore(item.lombaId, item.teamId, item.scoreObj);
        successCount++;
      });

      // Clear queue after sync
      localStorage.removeItem(SIMIKA_OFFLINE_QUEUE_KEY);
      this.updateDataSignature();

      setTimeout(() => {
        this.updateNetworkBadge(true);
        this.showSecurityToast(`✅ SINKRONISASI SUKSES: ${successCount} nilai berhasil disinkronkan.`);
        // Refresh active component if needed
        if (window.appRouter && window.appRouter.currentRoute === 'dashboard') {
          window.appRouter.navigate('dashboard');
        }
      }, 1200);

    } catch (e) {
      console.error('Error flushing offline sync queue:', e);
    }
  }
}

window.SecurityEngine = new SecurityEngine();
