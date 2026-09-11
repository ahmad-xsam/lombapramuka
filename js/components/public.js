/* ==========================================================================
   SiMika - Parallax Constellation Public Landing Page Component
   - Interactive Star Constellation Particles (Titik-Titik & Rasi Garis Bintang)
   - Moon Removed
   - Proportional Fluid Layout for Public Landing & Admin Dashboard
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
      <div class="moonlight-landing-wrapper">
        <!-- Moonlight Header Navigation -->
        <header class="moonlight-header">
          <a href="#" class="moonlight-logo" onclick="window.appRouter.navigate('public')">
            <img src="assets/simika-logo.png" alt="SiMika Logo" class="moonlight-header-logo-img">
          </a>

          <ul class="moonlight-nav-menu">
            <li><a href="#hero-scene" class="active">Beranda</a></li>
            <li><a href="#about-simika">Tentang SiMika</a></li>
            <li><a href="javascript:void(0)" onclick="window.appRouter.navigate('draw')" style="color: var(--neon-cyan); font-weight: 800;">🎲 DAFTAR TAMPIL LKBB</a></li>
          </ul>

          <button class="btn-moonlight-admin" onclick="window.appRouter.navigate('login')">
            <i data-lucide="key" style="width: 14px; height: 14px;"></i> Masuk Admin
          </button>
        </header>

        <!-- Parallax Hero Scene -->
        <section class="moonlight-hero-scene" id="hero-scene">
          <!-- Starry Night Background & Twinkling Stars -->
          <div class="stars-layer"></div>

          <!-- Interactive Constellation Canvas (Titik-Titik & Rasi Garis Bintang) -->
          <canvas id="constellation-canvas" class="constellation-canvas"></canvas>

          <!-- Background Mountains Silhouettes -->
          <svg class="moonlight-bg-mountains" viewBox="0 0 1440 600" preserveAspectRatio="none">
            <path fill="#2e2759" d="M0,420 L150,290 L320,380 L520,210 L720,360 L920,180 L1150,350 L1350,230 L1440,290 L1440,600 L0,600 Z"/>
            <path fill="#3b326e" opacity="0.65" d="M0,480 L200,360 L400,440 L600,280 L800,400 L1020,260 L1280,410 L1440,320 L1440,600 L0,600 Z"/>
          </svg>

          <!-- Giant Parallax Hero Content (Layered BEHIND foreground rocks) -->
          <div class="moonlight-hero-content">
            <div class="moonlight-tagline">SISTEM MANAGEMENT REKAPITULASI LOMBA PRAMUKA</div>
            <img src="assets/simika-logo-hero.png" alt="SiMika Logo" class="moonlight-hero-logo-img">
            <p class="moonlight-subtitle">Sistem Rekapitulasi Lomba Pramuka Online Real-Time</p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem;">
              <button class="btn-moonlight-explore" style="background: linear-gradient(135deg, #00f5d4, #06b6d4); color: #070a12; font-weight: 900;" onclick="window.appRouter.navigate('draw')">
                🎲 DAFTAR TAMPIL LKBB
              </button>
              <button class="btn-moonlight-explore" onclick="document.getElementById('live-scoreboard').scrollIntoView({behavior: 'smooth'})">
                LIHAT REKAP REALTIME
              </button>
            </div>
          </div>

          <!-- Foreground Rocks & Cliffs Silhouettes (Layered IN FRONT of text) -->
          <div class="moonlight-foreground-cliffs">
            <!-- Left Cliff Group -->
            <svg class="cliff-svg cliff-left" viewBox="0 0 550 750" preserveAspectRatio="none">
              <path fill="#1c1439" d="M0,0 L200,0 L280,140 L160,260 L320,440 L180,600 L360,750 L0,750 Z"/>
              <path fill="#150e2a" d="M0,0 L140,0 L210,120 L100,240 L250,420 L120,580 L280,750 L0,750 Z"/>
              <path fill="#281e4d" opacity="0.7" d="M140,0 L210,120 L280,140 L160,260 L320,440 L360,750 L280,750 L250,420 L100,240 Z"/>
              <path fill="#382a69" opacity="0.4" d="M0,100 L100,240 L140,0 Z"/>
              <path fill="#382a69" opacity="0.4" d="M120,580 L280,750 L180,600 Z"/>
            </svg>

            <!-- Right Cliff Group -->
            <svg class="cliff-svg cliff-right" viewBox="0 0 550 750" preserveAspectRatio="none">
              <path fill="#1c1439" d="M550,0 L350,0 L270,150 L390,280 L230,440 L370,600 L190,750 L550,750 Z"/>
              <path fill="#150e2a" d="M550,0 L410,0 L340,130 L450,260 L300,420 L430,580 L270,750 L550,750 Z"/>
              <path fill="#281e4d" opacity="0.7" d="M410,0 L340,130 L270,150 L390,280 L230,440 L190,750 L270,750 L300,420 L450,260 Z"/>
              <path fill="#382a69" opacity="0.4" d="M550,120 L450,260 L410,0 Z"/>
              <path fill="#382a69" opacity="0.4" d="M430,580 L270,750 L370,600 Z"/>
            </svg>

            <!-- Bottom Ground Base Overlay -->
            <div class="moonlight-ground-overlay"></div>
          </div>
        </section>

        <!-- System Explanation Section -->
        <section style="max-width: 1280px; margin: 3rem auto 1rem auto; padding: 0 1.5rem; text-align: center; position: relative; z-index: 20;" id="about-simika">
          <div style="background: rgba(18, 12, 36, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(192, 132, 252, 0.25); border-radius: 24px; padding: 2.5rem 2rem; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(0, 245, 212, 0.12); color: var(--neon-cyan); border: 1px solid rgba(0, 245, 212, 0.3); padding: 0.35rem 1rem; border-radius: 999px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.25rem;">
              <i data-lucide="info" style="width: 15px; height: 15px;"></i> Tentang Sistem SiMika
            </div>
            
            <h2 style="font-family: 'Poppins', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 900; margin-bottom: 1rem; color: #ffffff; line-height: 1.2;">
              Sistem Management Rekapitulasi Lomba Pramuka (SiMika)
            </h2>
            
            <p style="color: #cbd5e1; font-size: clamp(0.9rem, 1.2vw, 1.05rem); max-width: 920px; margin: 0 auto 2.25rem auto; line-height: 1.7; font-weight: 400; text-align: justify;">
              SiMika adalah platform web terpadu yang dirancang khusus untuk memodernisasi, mengolah, dan menyajikan hasil rekapitulasi nilai perlombaan Pramuka secara transparan, akurat, dan real-time. Dengan sistem ini, panitia dan dewan juri dapat menginput nilai dengan mudah, menghindari kesalahan kalkulasi manual, serta menyajikan live scoreboard langsung yang dapat dipantau oleh peserta dan pembina regu secara terbuka.
            </p>

            <!-- Feature Cards Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.25rem; text-align: left;">
              <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.35rem; transition: transform 0.25s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="width: 42px; height: 42px; background: rgba(0, 245, 212, 0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--neon-cyan); margin-bottom: 0.9rem;">
                  <i data-lucide="zap" style="width: 22px; height: 22px;"></i>
                </div>
                <h3 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-bottom: 0.4rem;">Rekap Real-Time Instan</h3>
                <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; text-align: justify;">Perhitungan skor dan perubahan peringkat terjadi secara otomatis saat nilai diinput oleh juri.</p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.35rem; transition: transform 0.25s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="width: 42px; height: 42px; background: rgba(192, 132, 252, 0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--crystal-purple); margin-bottom: 0.9rem;">
                  <i data-lucide="layers" style="width: 22px; height: 22px;"></i>
                </div>
                <h3 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-bottom: 0.4rem;">Multi-Tingkat & Kategori</h3>
                <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; text-align: justify;">Mendukung pengelompokan nilai untuk tingkat SD, SMP, hingga Penegak kategori Putra & Putri.</p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.35rem; transition: transform 0.25s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="width: 42px; height: 42px; background: rgba(251, 191, 36, 0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fbbf24; margin-bottom: 0.9rem;">
                  <i data-lucide="shield-check" style="width: 22px; height: 22px;"></i>
                </div>
                <h3 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-bottom: 0.4rem;">Akurat & Transparan</h3>
                <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; text-align: justify;">Menyajikan rincian akumulasi nilai per mata lomba dengan objektivitas tinggi dan mudah diaudit.</p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.35rem; transition: transform 0.25s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="width: 42px; height: 42px; background: rgba(239, 68, 68, 0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #f87171; margin-bottom: 0.9rem;">
                  <i data-lucide="printer" style="width: 22px; height: 22px;"></i>
                </div>
                <h3 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-bottom: 0.4rem;">Cetak SK Kejuaraan</h3>
                <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; text-align: justify;">Memfasilitasi pencetakan Surat Keputusan (SK) Pemenang dan dokumen rekapitulasi resmi.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Live Scoreboard Section -->
        <section style="max-width: 1380px; margin: 2rem auto 0 auto; padding: 0 1.5rem; text-align: center; position: relative; z-index: 20;" id="live-scoreboard">
          <div style="margin-bottom: 1rem;">
            <button class="btn-moonlight-explore" style="background: linear-gradient(135deg, #00f5d4, #a855f7); color: #070a12; font-weight: 900; font-size: 0.95rem; padding: 0.6rem 1.5rem; border-radius: 999px;" onclick="window.appRouter.navigate('draw')">
              🎲 DAFTAR TAMPIL LKBB (KOCOKAN NOMOR)
            </button>
          </div>
          <h2 style="font-family: 'Poppins', sans-serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 900; margin-bottom: 0.35rem; color: #ffffff;">
            PAPAN SKOR REKAPITULASI LIVE
          </h2>
          <p style="color: #94a3b8; font-size: clamp(0.85rem, 1.2vw, 0.95rem); margin-bottom: 1.75rem;">
            Hasil Perhitungan Akumulasi Nilai Seluruh Lomba Pramuka Real-Time (${categoryTitle})
          </p>

          <!-- All 7 Category Switcher Tabs -->
          <div class="sub-tabs" style="margin: 1.25rem 0 2rem 0; justify-content: center; background: rgba(18, 12, 36, 0.9); padding: 0.75rem; border-radius: 20px; border: 1px solid rgba(192, 132, 252, 0.3); gap: 0.5rem; display: flex; flex-wrap: wrap;">
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
              <div class="card-panel" style="margin-bottom: 0; background: #120c24; border: 1px solid rgba(0, 245, 212, 0.4);">
                <div class="card-panel-header">
                  <h3 class="panel-title" style="color: var(--neon-cyan);">
                    <i data-lucide="trophy"></i>
                    Podium Juara Overall PUTRA
                  </h3>
                </div>
                ${CombinedComponent.renderPodiumWidget(listPa)}
              </div>

              <!-- Podium Putri -->
              <div class="card-panel" style="margin-bottom: 0; background: #120c24; border: 1px solid rgba(192, 132, 252, 0.4);">
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
              <div class="card-panel" style="margin-bottom: 0; background: #120c24; border: 1px solid rgba(0, 245, 212, 0.4);">
                <div class="card-panel-header">
                  <h3 class="panel-title" style="color: var(--neon-cyan);">
                    <i data-lucide="trophy"></i>
                    Podium Juara Top 3 - ${categoryTitle}
                  </h3>
                </div>
                ${CombinedComponent.renderPodiumWidget(listMain)}
              </div>
            </div>
          `}

          <!-- Main Live Table showing all 10 competitions score breakdown -->
          <div class="card-panel" style="background: #120c24; border: 1px solid rgba(192, 132, 252, 0.3); text-align: left;">
            <div class="card-panel-header">
              <h3 class="panel-title">
                <i data-lucide="award" style="color: #fbbf24;"></i>
                Hasil Perhitungan Akumulasi Nilai Seluruh Lomba Real-Time (${listMain.length} Kontingen)
              </h3>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                Kategori: <strong style="color: var(--neon-cyan);">${categoryTitle}</strong>
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
                    ${COMPETITIONS.map(c => `<th title="${c.name}">${c.name.replace('Lomba ', '')}</th>`).join('')}
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
                        <td><strong style="color: var(--neon-yellow); font-size: 1.15rem; font-family: 'Poppins', sans-serif;">${item.combinedTotal} Pts</strong></td>
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

        <!-- Moonlight Footer -->
        <footer style="margin-top: 4rem; padding: 2.25rem 1.5rem; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); background: rgba(9, 5, 24, 0.92); position: relative; z-index: 20;">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 0.85rem;">
            <div style="display: flex; align-items: center; justify-content: center;">
              <img src="assets/simika-logo.png" alt="SiMika Logo" style="height: 54px; width: auto; max-width: 200px; object-fit: contain; filter: drop-shadow(0 0 15px rgba(0, 245, 212, 0.4));">
            </div>
            <p style="font-size: clamp(0.82rem, 1.1vw, 0.92rem); color: #cbd5e1; max-width: 950px; line-height: 1.6; font-weight: 500; text-align: justify;">
              Sistem ini dibuat untuk mempermudah dalam mencatat rekapitulasi nilai lomba pramuka | dibuat dan dikembangkan oleh : <strong style="color: var(--neon-cyan); font-weight: 800;">Kak Ahmad Samsudin, S.T.</strong>
            </p>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.2rem;">
              &copy; ${new Date().getFullYear()} SiMika - Sistem Rekapitulasi Lomba Pramuka Online. All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>
    `;

    lucide.createIcons();

    // Initialize Constellation Star Canvas
    setTimeout(() => this.initConstellationCanvas(), 50);
  },

  initConstellationCanvas() {
    const canvas = document.getElementById('constellation-canvas');
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

    const mouse = { x: null, y: null, maxDist: 140 };

    heroSec.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSec.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Create Constellation Star Particles (Titik-Titik Bintang)
    const starCount = Math.min(Math.floor((width * height) / 10000), 95);
    const stars = [];
    const colors = ['#ffffff', '#00f5d4', '#c084fc', '#fbbf24', '#93c5fd'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.6 + 0.9,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.35,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation connecting lines (Rasi Garis Bintang)
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const lineAlpha = (1 - dist / 115) * 0.35;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(192, 132, 252, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Draw stars and interactive mouse constellation connections
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0 || s.x > width) s.vx *= -1;
        if (s.y < 0 || s.y > height) s.vy *= -1;

        s.alpha += s.pulseSpeed;
        if (s.alpha > 0.95 || s.alpha < 0.25) s.pulseSpeed *= -1;

        // Draw star dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Interactive mouse connection line
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = s.x - mouse.x;
          const mdy = s.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.maxDist) {
            const mAlpha = (1 - mdist / mouse.maxDist) * 0.6;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${mAlpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
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
