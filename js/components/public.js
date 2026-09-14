/* ==========================================================================
   SiMika - Crimson Hero Landing Page Component (Collider Gaming/Agency Style)
   - Heavy Bold Typography (CREATE. IMPACT. DOMINATE.)
   - Vivid Crimson Red Gradient Theme with Glowing Embers & Floor Reflections
   - Top Header Nav with MASUK ADMIN Button
   - Stats Row (50+ Regu, 100% Rekap Realtime, 10+ Kategori)
   - Dynamic Competition Synchronization for Live Scoreboard
   ========================================================================== */

const PublicComponent = {
  activeCategory: 'overall',
  animationFrameId: null,

  render(container) {
    if (!container) return;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const allCompIds = COMPETITIONS.map(c => c.id);

    let levelKey = 'all';
    let genderKey = 'all';
    let categoryTitle = 'Gabungan Seluruh SD, SMP, & Penegak';

    if (this.activeCategory === 'sd_pa') {
      levelKey = 'sd'; genderKey = 'pa'; categoryTitle = 'Penggalang SD Putra';
    } else if (this.activeCategory === 'sd_pi') {
      levelKey = 'sd'; genderKey = 'pi'; categoryTitle = 'Penggalang SD Putri';
    } else if (this.activeCategory === 'smp_pa') {
      levelKey = 'smp'; genderKey = 'pa'; categoryTitle = 'Penggalang SMP Putra';
    } else if (this.activeCategory === 'smp_pi') {
      levelKey = 'smp'; genderKey = 'pi'; categoryTitle = 'Penggalang SMP Putri';
    } else if (this.activeCategory === 'penegak_pa') {
      levelKey = 'penegak'; genderKey = 'pa'; categoryTitle = 'Sangga Penegak Putra';
    } else if (this.activeCategory === 'penegak_pi') {
      levelKey = 'penegak'; genderKey = 'pi'; categoryTitle = 'Sangga Penegak Putri';
    } else {
      levelKey = 'all'; genderKey = 'all'; categoryTitle = 'Gabungan Seluruh SD, SMP, & Penegak (Putra & Putri)';
    }

    const listMain = window.Calculators.getCombinedLeaderboard(allCompIds, levelKey, genderKey);
    const listPa = window.Calculators.getCombinedLeaderboard(allCompIds, levelKey, 'pa');
    const listPi = window.Calculators.getCombinedLeaderboard(allCompIds, levelKey, 'pi');

    container.innerHTML = `
      <div class="crimson-landing-wrapper">
        <!-- Collider-Style Top Header Bar -->
        <header class="crimson-header">
          <div class="crimson-brand-logo" onclick="window.appRouter.navigate('public')">
            <span class="brand-text-accent">SIMIKA</span>
          </div>

          <ul class="crimson-nav-menu">
            <li><a href="#hero-scene" class="active">Beranda</a></li>
            <li><a href="#about-simika">Tentang</a></li>
            <li><a href="#live-scoreboard">Rekap Live</a></li>
            <li><a href="javascript:void(0)" onclick="window.appRouter.navigate('draw')">Daftar Tampil</a></li>
          </ul>

          <button class="btn-crimson-talk" onclick="window.appRouter.navigate('login')">
            MASUK ADMIN ↗
          </button>
        </header>

        <!-- Collider Crimson Hero Scene -->
        <section class="crimson-hero-scene" id="hero-scene">
          <!-- Ambient Radial Background Lighting & Sparks Canvas -->
          <canvas id="crimson-ember-canvas" class="crimson-ember-canvas"></canvas>

          <!-- Large Background Mascot Emblem Motif -->
          <div class="hero-bg-emblem-glow">
            <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M150 20 L270 260 L200 260 L150 150 L100 260 L30 260 Z" fill="#ffffff" fill-opacity="0.12"/>
            </svg>
          </div>

          <!-- Hero Main Content Grid -->
          <div class="crimson-hero-content">
            <div class="crimson-tagline">
              <span class="flash-icon">⚡</span> COMPETITION MANAGEMENT SYSTEM
            </div>

            <h1 class="crimson-giant-title">
              CREATE.<br>
              IMPACT.<br>
              DOMINATE.
            </h1>

            <p class="crimson-hero-desc">
              Sistem Manajemen & Rekapitulasi Skor Lomba Pramuka Real-Time yang cepat, transparan, dan terpercaya. Akurasi nilai 100% dari juri hingga papan skor utama.
            </p>

            <div class="crimson-hero-actions">
              <button class="btn-crimson-work" onclick="document.getElementById('live-scoreboard').scrollIntoView({behavior: 'smooth'})">
                LIHAT REKAP LIVE ↗
              </button>

              <div class="award-wreath-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  <path d="M7.5 12a4.5 4.5 0 0 1 4.5-4.5"/>
                  <path d="M16.5 12a4.5 4.5 0 0 0-4.5-4.5"/>
                  <path d="M6 19.5a9 9 0 0 1-3-7.5 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-3 7.5"/>
                </svg>
                <span>OFFICIAL PRAMUKA SCORING ENGINE</span>
              </div>
            </div>

            <!-- Stats Bar at Hero Bottom -->
            <div class="crimson-stats-row">
              <div class="stat-item">
                <div class="stat-num">50+</div>
                <div class="stat-label">REGU PESERTA</div>
              </div>
              <div class="stat-item">
                <div class="stat-num">100%</div>
                <div class="stat-label">REKAP REALTIME</div>
              </div>
              <div class="stat-item">
                <div class="stat-num">${COMPETITIONS.length}+</div>
                <div class="stat-label">KATEGORI LOMBA</div>
              </div>
            </div>
          </div>

          <!-- Glossy Wet Floor Base Reflection Gradient -->
          <div class="crimson-reflective-floor"></div>
        </section>

        <!-- System Explanation Section -->
        <section class="crimson-about-section" id="about-simika">
          <div class="crimson-about-card">
            <div class="about-tag">
              <i data-lucide="info"></i> Tentang SiMika
            </div>
            
            <h2 class="about-title">
              Sistem Management Rekapitulasi Lomba Pramuka (SiMika)
            </h2>
            
            <p class="about-desc">
              SiMika adalah platform web terpadu yang dirancang khusus untuk memodernisasi, mengolah, dan menyajikan hasil rekapitulasi nilai perlombaan Pramuka secara transparan, akurat, dan real-time. Dengan sistem ini, panitia dan dewan juri dapat menginput nilai dengan mudah, menghindari kesalahan kalkulasi manual, serta menyajikan live scoreboard langsung yang dapat dipantau oleh peserta dan pembina regu secara terbuka.
            </p>

            <!-- Feature Cards Grid -->
            <div class="crimson-features-grid">
              <div class="feature-card">
                <div class="feature-icon icon-cyan">
                  <i data-lucide="zap"></i>
                </div>
                <h3>Rekap Real-Time Instan</h3>
                <p>Perhitungan skor dan perubahan peringkat terjadi secara otomatis saat nilai diinput oleh juri.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon icon-purple">
                  <i data-lucide="layers"></i>
                </div>
                <h3>Multi-Tingkat & Kategori</h3>
                <p>Mendukung pengelompokan nilai untuk tingkat SD, SMP, hingga Penegak kategori Putra & Putri.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon icon-yellow">
                  <i data-lucide="shield-check"></i>
                </div>
                <h3>Akurat & Transparan</h3>
                <p>Menyajikan rincian akumulasi nilai per mata lomba dengan objektivitas tinggi dan mudah diaudit.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon icon-red">
                  <i data-lucide="printer"></i>
                </div>
                <h3>Cetak SK Kejuaraan</h3>
                <p>Memfasilitasi pencetakan Surat Keputusan (SK) Pemenang dan dokumen rekapitulasi resmi.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Live Scoreboard Section -->
        <section class="crimson-scoreboard-section" id="live-scoreboard">
          <h2 class="scoreboard-title">
            PAPAN SKOR REKAPITULASI LIVE
          </h2>
          <p class="scoreboard-subtitle">
            Hasil Perhitungan Akumulasi Nilai Seluruh Lomba Pramuka Real-Time (${categoryTitle})
          </p>

          <!-- Category Switcher Tabs -->
          <div class="crimson-sub-tabs">
            <button class="sub-tab-btn ${this.activeCategory === 'sd_pa' ? 'active' : ''}" onclick="PublicComponent.switchCategory('sd_pa')">
              🏆 SD PUTRA
            </button>
            <button class="sub-tab-btn ${this.activeCategory === 'sd_pi' ? 'active' : ''}" onclick="PublicComponent.switchCategory('sd_pi')">
              🌸 SD PUTRI
            </button>
            <button class="sub-tab-btn ${this.activeCategory === 'smp_pa' ? 'active' : ''}" onclick="PublicComponent.switchCategory('smp_pa')">
              🛡️ SMP PUTRA
            </button>
            <button class="sub-tab-btn ${this.activeCategory === 'smp_pi' ? 'active' : ''}" onclick="PublicComponent.switchCategory('smp_pi')">
              🌺 SMP PUTRI
            </button>
            <button class="sub-tab-btn ${this.activeCategory === 'penegak_pa' ? 'active' : ''}" onclick="PublicComponent.switchCategory('penegak_pa')">
              ⚜️ PENEGAK PUTRA
            </button>
            <button class="sub-tab-btn ${this.activeCategory === 'penegak_pi' ? 'active' : ''}" onclick="PublicComponent.switchCategory('penegak_pi')">
              👑 PENEGAK PUTRI
            </button>
            <button class="sub-tab-btn ${this.activeCategory === 'overall' ? 'active' : ''}" onclick="PublicComponent.switchCategory('overall')">
              🌟 GABUNGAN SELURUH
            </button>
          </div>

          <!-- Podium Widgets per Gender or Category -->
          ${this.activeCategory === 'overall' ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; text-align: left;">
              <!-- Podium Putra -->
              <div class="card-panel" style="margin-bottom: 0; background: #120508; border: 1px solid rgba(230, 0, 46, 0.4);">
                <div class="card-panel-header">
                  <h3 class="panel-title" style="color: #ff3355;">
                    <i data-lucide="trophy"></i>
                    Podium Juara Overall PUTRA
                  </h3>
                </div>
                ${CombinedComponent.renderPodiumWidget(listPa)}
              </div>

              <!-- Podium Putri -->
              <div class="card-panel" style="margin-bottom: 0; background: #120508; border: 1px solid rgba(192, 132, 252, 0.4);">
                <div class="card-panel-header">
                  <h3 class="panel-title" style="color: var(--crystal-purple);">
                    <i data-lucide="trophy"></i>
                    Podium Juara Overall PUTRI
                  </h3>
                </div>
                ${CombinedComponent.renderPodiumWidget(listPi)}
              </div>
            </div>
          ` : `
            <div style="max-width: 650px; margin: 0 auto 2rem auto; text-align: left;">
              <div class="card-panel" style="margin-bottom: 0; background: #120508; border: 1px solid rgba(230, 0, 46, 0.4);">
                <div class="card-panel-header">
                  <h3 class="panel-title" style="color: #ff3355;">
                    <i data-lucide="trophy"></i>
                    Podium Juara Top 3 - ${categoryTitle}
                  </h3>
                </div>
                ${CombinedComponent.renderPodiumWidget(listMain)}
              </div>
            </div>
          `}

          <!-- Main Live Table showing all competition breakdown (including newly added competitions!) -->
          <div class="card-panel" style="background: #120508; border: 1px solid rgba(230, 0, 46, 0.3); text-align: left;">
            <div class="card-panel-header">
              <h3 class="panel-title">
                <i data-lucide="award" style="color: #fbbf24;"></i>
                Hasil Perhitungan Akumulasi Nilai Real-Time (${listMain.length} Kontingen)
              </h3>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                Kategori: <strong style="color: #ff4d6d;">${categoryTitle}</strong>
              </div>
            </div>

            <div class="table-container">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Lencana 3D Rank</th>
                    <th>Nama Regu / Sangga</th>
                    <th>Pangkalan / Sekolah</th>
                    <th>Kategori</th>
                    ${COMPETITIONS.map(c => `<th title="${c.name}">${c.name.replace(/^Lomba\s+/i, '')}</th>`).join('')}
                    <th>Total Skor Final</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  ${listMain.length === 0 ? `
                    <tr><td colspan="${6 + COMPETITIONS.length}" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">Belum ada data nilai terdaftar untuk tingkat dan kategori ini.</td></tr>
                  ` : listMain.map(item => {
                    const rankClass = item.rank === 1 ? 'rank-1' : item.rank === 2 ? 'rank-2' : item.rank === 3 ? 'rank-3' : 'rank-other';
                    const rankBadgeLabel = item.rank === 1 ? '👑 RANK 1' : item.rank === 2 ? '🥈 RANK 2' : item.rank === 3 ? '🥉 RANK 3' : `💎 RANK ${item.rank}`;
                    const catObj = CATEGORIES.find(c => c.id === item.team.category);

                    return `
                      <tr>
                        <td><span class="rank-badge-game ${rankClass}">${rankBadgeLabel}</span></td>
                        <td><strong style="color: #fff; font-size: 0.92rem;">${item.team.name}</strong></td>
                        <td>${item.team.pangkalan}</td>
                        <td><span class="badge ${catObj?.badgeClass || 'badge-sd'}">${catObj?.short || item.team.category}</span></td>
                        ${COMPETITIONS.map(c => `<td>${item.breakdown[c.id] || 0}</td>`).join('')}
                        <td><strong style="color: #ffcc00; font-size: 1.15rem; font-family: 'Poppins', sans-serif;">${item.combinedTotal} Pts</strong></td>
                        <td>
                          ${item.isTie ? `
                            <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">⚡ ${item.displayKet}</span>
                          ` : `
                            <span style="font-size: 0.8rem; color: #94a3b8;">${item.displayKet || '-'}</span>
                          `}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Crimson Footer -->
        <footer class="crimson-footer">
          <div class="footer-container">
            <div class="footer-brand">SIMIKA</div>
            <p class="footer-text">
              Sistem ini dibuat untuk mempermudah dalam mencatat rekapitulasi nilai lomba pramuka | dikembangkan oleh: <strong style="color: #ff4d6d; font-weight: 800;">Kak Ahmad Samsudin, S.T.</strong>
            </p>
            <div class="footer-copy">
              &copy; ${new Date().getFullYear()} SiMika - Sistem Rekapitulasi Lomba Pramuka Online. All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>
    `;

    lucide.createIcons();

    // Initialize Crimson Spark Particle Canvas
    setTimeout(() => this.initCrimsonParticles(), 50);
  },

  initCrimsonParticles() {
    const canvas = document.getElementById('crimson-ember-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const heroSec = document.getElementById('hero-scene');
    if (!heroSec) return;

    let width = (canvas.width = heroSec.clientWidth);
    let height = (canvas.height = heroSec.clientHeight);

    window.addEventListener('resize', () => {
      if (!canvas) return;
      width = canvas.width = heroSec.clientWidth;
      height = canvas.height = heroSec.clientHeight;
    });

    const particles = [];
    const count = 75;
    const colors = ['#e6002e', '#ff3355', '#ff7788', '#ffffff', '#ffcc00'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.7) * 0.8,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * 0.03 + 0.005
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;

        p.alpha += p.pulse;
        if (p.alpha > 0.95 || p.alpha < 0.2) p.pulse *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      PublicComponent.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  },

  switchCategory(catKey) {
    this.activeCategory = catKey;
    this.render(document.getElementById('app-main-content'));
  }
};

window.PublicComponent = PublicComponent;

