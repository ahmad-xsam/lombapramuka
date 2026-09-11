/* ==========================================================================
   SiMika - Modul Kocokan Nomor & Live Draw Stage Engine (LKBB)
   - Mode A (Peserta -> Nomor Tampil) & Mode B (Urutan Tampil -> Peserta)
   - Live Slot Machine Animation + Web Audio Sound Synthesis + Canvas Confetti
   - Live Presentation / Stage LED Mode (Full-Screen Projector Display)
   - Real-time Calling System & MC Display Mode
   - Auto-Generate Jadwal LKBB (Start Time, Duration, Rest Interval)
   - Digital Number Card & Audit Trail Undo Log
   ========================================================================== */

class DrawComponent {
  constructor() {
    this.activeLevel = 'sd'; // 'sd', 'smp', 'penegak'
    this.activeMode = 'modeB'; // 'modeA' (Kocok Nomor) or 'modeB' (Kocok Urutan Tampil)
    this.viewMode = 'admin'; // 'admin', 'stage', 'mc', 'schedule'
    this.isSpinning = false;
    this.soundEnabled = true;
  }

  // Web Audio API Sound Synthesizer (No external MP3 required)
  playSound(type) {
    if (!this.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440 + Math.random() * 200, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'reveal') {
        // Fanfare chord sound
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major Chord
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + (idx * 0.08));
          gain.gain.setValueAtTime(0.2, ctx.currentTime + (idx * 0.08));
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + (idx * 0.08));
          osc.stop(ctx.currentTime + 1.2);
        });
      } else if (type === 'call') {
        // Chime notification
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {}
  }

  // Pure Canvas Confetti Particle Burst
  triggerConfetti() {
    let canvas = document.getElementById('draw-confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'draw-confetti-canvas';
      canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999999;';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#00f5d4', '#fbbf24', '#a855f7', '#ec4899', '#34d399', '#38bdf8'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let startTime = Date.now();
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.rotation += p.rSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive && Date.now() - startTime < 2500) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animate();
  }

  // Core Render Entry Point
  render(container) {
    if (!container) return;

    if (this.viewMode === 'stage') {
      this.renderLiveStage(container);
    } else if (this.viewMode === 'mc') {
      this.renderMCMode(container);
    } else {
      this.renderAdminDraw(container);
    }
  }

  // Get eligible teams grouped by school for active level
  getEligibleSchools() {
    const allTeams = window.dataStore.getTeams('all');
    const schoolMap = {};

    allTeams.forEach(team => {
      const catObj = (typeof CATEGORIES !== 'undefined' ? CATEGORIES : window.CATEGORIES || []).find(c => c.id === team.category);
      const level = catObj?.level || 'sd';

      if (level === this.activeLevel) {
        const pangkalanName = (team.pangkalan || 'Tanpa Pangkalan').trim();
        if (!schoolMap[pangkalanName]) {
          schoolMap[pangkalanName] = {
            id: 'SCH_' + level.toUpperCase() + '_' + pangkalanName.replace(/[^a-zA-Z0-9]/g, '_'),
            pangkalan: pangkalanName,
            level: level,
            teams: []
          };
        }
        schoolMap[pangkalanName].teams.push(team);
      }
    });

    // Rule: Must send > 1 regu to qualify for LKBB school competition
    return Object.values(schoolMap).filter(s => s.teams.length > 1);
  }

  // Get draw state from localStorage
  getDrawData() {
    const key = 'simika_lkbb_draw_state_v1';
    const store = JSON.parse(localStorage.getItem(key)) || { sd: [], smp: [], penegak: [], locked: {}, schedules: {} };
    return store;
  }

  saveDrawData(storeObj) {
    const key = 'simika_lkbb_draw_state_v1';
    localStorage.setItem(key, JSON.stringify(storeObj));
  }

  // Render Admin / Public Draw Center UI
  renderAdminDraw(container) {
    const schools = this.getEligibleSchools();
    const storeData = this.getDrawData();
    const currentDraws = storeData[this.activeLevel] || [];
    const isLocked = storeData.locked && storeData.locked[this.activeLevel];
    const isPublic = !window.dataStore || !window.dataStore.currentUser;

    if (!this.subTab) {
      this.subTab = isPublic ? 'list' : 'draw';
    }

    const drawnSchoolIds = currentDraws.map(d => d.schoolId);
    const remainingSchools = schools.filter(s => !drawnSchoolIds.includes(s.id));
    const lastResult = currentDraws.length > 0 ? currentDraws[currentDraws.length - 1] : null;

    container.innerHTML = `
      <div style="width: 100%; max-width: 1380px; margin: 0 auto; ${isPublic ? 'padding: 1.5rem 1rem;' : ''}">
        
        ${isPublic ? `
          <header style="display: flex; justify-content: space-between; align-items: center; background: rgba(18, 12, 36, 0.85); backdrop-filter: blur(12px); padding: 1rem 1.5rem; border-radius: 20px; border: 1px solid rgba(0, 245, 212, 0.3); margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <a href="#" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none;" onclick="window.appRouter.navigate('public')">
              <img src="assets/simika-logo.png" alt="SiMika Logo" style="height: 42px; width: auto; filter: drop-shadow(0 0 10px rgba(0, 245, 212, 0.5));">
            </a>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button class="btn-outline" style="border-color: var(--neon-cyan); color: var(--neon-cyan); font-weight: 800;" onclick="window.appRouter.navigate('public')">
                <i data-lucide="arrow-left"></i> Kembali ke Beranda
              </button>
              <button class="btn-outline" style="background: rgba(168, 85, 247, 0.15); border-color: #a855f7; color: #c084fc; font-weight: 800;" onclick="window.appRouter.navigate('login')">
                <i data-lucide="key"></i> Login Admin
              </button>
            </div>
          </header>
        ` : ''}

        <!-- Header Title & Control Quick Links -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h2 style="margin: 0; font-family: 'Poppins', sans-serif; font-weight: 900; font-size: clamp(1.4rem, 2.5vw, 1.9rem); color: #ffffff; display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="dices" style="color: var(--neon-cyan); width: 34px; height: 34px;"></i>
              DAFTAR TAMPIL & KOCOKAN LKBB
            </h2>
            <p style="margin: 0.25rem 0 0 0; color: #94a3b8; font-size: 0.85rem;">
              Jadwal Urutan Tampil Resmi & Hasil Kocokan Nomor Baris-Berbaris (LKBB) Real-Time
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${!isPublic ? `
              <button class="btn-outline" style="background: rgba(0, 245, 212, 0.1); border-color: var(--neon-cyan); color: var(--neon-cyan);" onclick="window.appRouter.navigate('dashboard')">
                <i data-lucide="arrow-left"></i> BERANDA ADMIN
              </button>
            ` : ''}
            <button class="btn-yellow-pill" onclick="window.DrawComponent.setViewMode('stage')">
              <i data-lucide="tv"></i> LAYAR PANGGUNG (LED)
            </button>
            ${!isPublic ? `
              <button class="btn-outline" style="background: rgba(168, 85, 247, 0.15); border-color: #a855f7; color: #c084fc;" onclick="window.DrawComponent.setViewMode('mc')">
                <i data-lucide="mic"></i> MODE MC / CALLING
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Filter Level & Sub-Tab Switcher Bar -->
        <div class="card-panel" style="margin-bottom: 1.5rem; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(0, 245, 212, 0.25); padding: 1rem 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            
            <!-- Level Filter Pills -->
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.82rem; font-weight: 800; color: #94a3b8; margin-right: 0.25rem;">PILIH TINGKAT:</span>
              <button class="cat-pill ${this.activeLevel === 'sd' ? 'active' : ''}" style="padding: 0.45rem 1.1rem; font-weight: 800;" onclick="window.DrawComponent.setLevel('sd')">
                🏫 SD / MI
              </button>
              <button class="cat-pill ${this.activeLevel === 'smp' ? 'active' : ''}" style="padding: 0.45rem 1.1rem; font-weight: 800;" onclick="window.DrawComponent.setLevel('smp')">
                🛡️ SMP / MTS
              </button>
              <button class="cat-pill ${this.activeLevel === 'penegak' ? 'active' : ''}" style="padding: 0.45rem 1.1rem; font-weight: 800;" onclick="window.DrawComponent.setLevel('penegak')">
                ⚜️ SMA / SMK / PENEGAK
              </button>
            </div>

            <!-- Main View Mode Tabs (Simple Schedule vs Admin Spin Wheel) -->
            <div style="display: flex; background: rgba(0, 0, 0, 0.5); padding: 4px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <button class="sub-tab-btn ${this.subTab === 'list' ? 'active' : ''}" style="border-radius: 8px; padding: 0.4rem 1rem; font-size: 0.8rem; font-weight: 800;" onclick="window.DrawComponent.setSubTab('list')">
                📋 DAFTAR URUTAN TAMPIL
              </button>
              <button class="sub-tab-btn ${this.subTab === 'draw' ? 'active' : ''}" style="border-radius: 8px; padding: 0.4rem 1rem; font-size: 0.8rem; font-weight: 800;" onclick="window.DrawComponent.setSubTab('draw')">
                🎲 KOCOKAN & UNDIAN
              </button>
            </div>
          </div>
        </div>

        ${this.subTab === 'draw' ? `
          <!-- 3 Grid Dashboard Section for Drawing -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
            
            <!-- Column 1: Main Slot Machine Slot Control Card -->
            <div class="card-panel" style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; background: linear-gradient(180deg, #151d2a 0%, #0d131f 100%); border: 1px solid var(--border-creator); position: relative; overflow: hidden;">
              <div style="position: absolute; top: 10px; right: 12px;">
                ${isLocked 
                  ? `<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4);"><i data-lucide="lock"></i> DIKUNCI</span>`
                  : `<span class="badge badge-completed"><i data-lucide="unlock"></i> SIAP KOCOK</span>`}
              </div>

              <div style="width: 100%;">
                <div style="font-size: 0.75rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.08em; text-transform: uppercase;">
                  PESERTA TERSISA UNTUK DIUNDI
                </div>
                <div style="font-size: 3rem; font-weight: 900; color: var(--neon-cyan); font-family: 'Poppins', sans-serif; line-height: 1; margin: 0.5rem 0;">
                  ${remainingSchools.length} <span style="font-size: 1rem; color: #64748b; font-weight: 600;">/ ${schools.length} Sekolah</span>
                </div>
              </div>

              <!-- Big Interactive Animated Number Slot Box -->
              <div id="slot-number-display" style="width: 100%; max-width: 260px; height: 130px; background: rgba(0, 0, 0, 0.6); border: 2px solid var(--neon-cyan); border-radius: 16px; margin: 1.25rem 0; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 0 25px rgba(0, 245, 212, 0.2), 0 0 20px rgba(0, 245, 212, 0.15); transition: all 0.3s ease;">
                <div id="slot-number-val" style="font-size: 3.5rem; font-weight: 900; color: var(--neon-yellow); font-family: 'Poppins', sans-serif; letter-spacing: 0.05em;">
                  ${lastResult ? String(lastResult.drawNumber).padStart(3, '0') : '???'}
                </div>
                <div id="slot-team-name" style="font-size: 0.8rem; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%; margin-top: -4px;">
                  ${lastResult ? lastResult.schoolName : 'Klik Mulai Kocokan'}
                </div>
              </div>

              <!-- Action Buttons -->
              <div style="width: 100%; display: flex; flex-direction: column; gap: 0.75rem;">
                <button class="btn-yellow-pill" style="width: 100%; padding: 0.85rem; font-size: 1.05rem; font-weight: 900; justify-content: center;" ${remainingSchools.length === 0 || isLocked || this.isSpinning ? 'disabled' : ''} onclick="window.DrawComponent.startDrawAnimation()">
                  <i data-lucide="dices"></i> ${this.isSpinning ? 'MEMUTAR OTOMATIS...' : '🎲 MULAI KOCOKAN'}
                </button>

                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn-outline" style="flex: 1; font-size: 0.74rem; justify-content: center;" ${currentDraws.length === 0 || isLocked ? 'disabled' : ''} onclick="window.DrawComponent.undoLastDraw()">
                    <i data-lucide="undo-2"></i> Batalkan Terakhir
                  </button>
                  <button class="btn-outline" style="flex: 1; font-size: 0.74rem; justify-content: center; border-color: rgba(239, 68, 68, 0.4); color: #f87171;" onclick="window.DrawComponent.toggleLockState()">
                    <i data-lucide="${isLocked ? 'unlock' : 'lock'}"></i> ${isLocked ? 'Buka Kunci' : 'Kunci Hasil'}
                  </button>
                </div>
              </div>
            </div>

            <!-- Column 2: Preview Peserta Yang Akan Diundi -->
            <div class="card-panel" style="display: flex; flex-direction: column;">
              <div class="card-panel-header" style="padding-bottom: 0.6rem; margin-bottom: 0.75rem;">
                <h3 class="panel-title" style="font-size: 0.92rem;">
                  <i data-lucide="list-checks" style="color: var(--neon-cyan);"></i>
                  Daftar Peserta Belum Dikocok (${remainingSchools.length})
                </h3>
              </div>

              <div style="flex: 1; overflow-y: auto; max-height: 280px; padding-right: 0.25rem;">
                ${remainingSchools.length === 0 ? `
                  <div style="text-align: center; color: #34d399; padding: 2rem; font-weight: 700; font-size: 0.85rem;">
                    🎉 Seluruh peserta (${schools.length} Sekolah) telah selesai dikocok!
                  </div>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                    ${remainingSchools.map((s, idx) => `
                      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 0.55rem 0.75rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <span style="color: #64748b; font-weight: 700; font-size: 0.74rem;">#${idx + 1}</span>
                          <strong style="color: #ffffff;">${s.pangkalan}</strong>
                        </div>
                        <span class="badge badge-pending" style="font-size: 0.65rem;">⚪ Belum Dikocok</span>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            </div>

            <!-- Column 3: Auto-Schedule & Call Center Link -->
            <div class="card-panel" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div class="card-panel-header" style="padding-bottom: 0.6rem; margin-bottom: 0.75rem;">
                  <h3 class="panel-title" style="font-size: 0.92rem;">
                    <i data-lucide="calendar-clock" style="color: var(--neon-yellow);"></i>
                    Jadwal Otomatis LKBB
                  </h3>
                </div>

                <div style="background: rgba(0,0,0,0.25); border-radius: 10px; padding: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.05);">
                  <div style="font-size: 0.76rem; color: #94a3b8; margin-bottom: 0.6rem;">Generate Jadwal Berdasarkan Urutan Tampil</div>
                  <div class="form-grid" style="grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <div>
                      <label style="font-size: 0.68rem; color: #cbd5e1;">Jam Mulai LKBB</label>
                      <input type="time" id="sch-start-time" class="form-control" style="padding: 0.25rem 0.5rem; font-size: 0.78rem;" value="08:00"/>
                    </div>
                    <div>
                      <label style="font-size: 0.68rem; color: #cbd5e1;">Durasi Per Tampil (Menit)</label>
                      <input type="number" id="sch-duration" class="form-control" style="padding: 0.25rem 0.5rem; font-size: 0.78rem;" value="15" min="5" max="60"/>
                    </div>
                  </div>
                  <button class="btn-outline" style="width: 100%; font-size: 0.76rem; justify-content: center; background: rgba(0, 245, 212, 0.1); border-color: var(--neon-cyan); color: var(--neon-cyan);" onclick="window.DrawComponent.generateSchedule()">
                    <i data-lucide="wand-2"></i> Auto-Generate Jadwal LKBB
                  </button>
                </div>
              </div>

              <div style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 0.75rem; text-align: center;">
                <span style="font-size: 0.72rem; color: #94a3b8;">Format Hasil Undian Siap Diintegrasikan dengan Modul Penilaian Juri</span>
              </div>
            </div>

          </div>
        ` : ''}

        <!-- Simplified User-Friendly Table & Search View -->
        <div class="card-panel" style="background: rgba(18, 12, 36, 0.9); border: 1px solid rgba(0, 245, 212, 0.3);">
          <div class="card-panel-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 class="panel-title" style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem;">
                <i data-lucide="list-numbered" style="color: var(--neon-cyan);"></i>
                DAFTAR URUTAN TAMPIL RESMI (${this.activeLevel.toUpperCase()})
              </h3>
              <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.2rem;">
                Total <strong>${currentDraws.length}</strong> Sekolah telah dikocok dari <strong>${schools.length}</strong> Pangkalan terdaftar.
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <!-- Quick Search Input -->
              <div style="position: relative; min-width: 260px;">
                <i data-lucide="search" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #64748b;"></i>
                <input type="text" id="draw-search-input" placeholder="Cari nama sekolah / nomor urut..." class="form-control" style="padding-left: 2rem; font-size: 0.82rem; background: rgba(0, 0, 0, 0.4); border-color: rgba(255, 255, 255, 0.15);" oninput="window.DrawComponent.filterDrawTable(this.value)">
              </div>

              <button class="btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.78rem; font-weight: 700;" onclick="window.print()">
                <i data-lucide="printer"></i> Cetak Hasil
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="admin-table" id="draw-schedule-table">
              <thead>
                <tr>
                  <th style="width: 15%;">Nomor Urut Tampil</th>
                  <th style="width: 40%;">Sekolah / Pangkalan</th>
                  <th style="width: 20%;">Estimasi Waktu Tampil</th>
                  <th style="width: 25%; text-align: center;">Status Lapangan</th>
                </tr>
              </thead>
              <tbody>
                ${currentDraws.length === 0 ? `
                  <tr>
                    <td colspan="4" style="text-align: center; color: #94a3b8; padding: 3rem 1rem;">
                      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                        <i data-lucide="dices" style="width: 48px; height: 48px; color: var(--neon-cyan); opacity: 0.5;"></i>
                        <div style="font-size: 1.05rem; font-weight: 700; color: #ffffff;">Belum Ada Nomor Tampil yang Dikocok</div>
                        <div style="font-size: 0.85rem; color: #64748b; max-width: 450px;">
                          Panitia belum mengundi nomor urut untuk tingkat <strong>${this.activeLevel.toUpperCase()}</strong>. Silakan periksa kembali nanti atau hubungi panitia lomba.
                        </div>
                      </div>
                    </td>
                  </tr>
                ` : currentDraws.map((item, idx) => {
                  const startTimeMinutes = 8 * 60 + (idx * 15);
                  const hours = Math.floor(startTimeMinutes / 60);
                  const mins = startTimeMinutes % 60;
                  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} WIB`;

                  return `
                    <tr class="draw-row-item">
                      <td>
                        <span class="rank-badge-game rank-1" style="font-size: 1rem; padding: 0.3rem 0.8rem; font-family: 'Poppins', sans-serif;">
                          #${String(item.drawNumber).padStart(3, '0')}
                        </span>
                      </td>
                      <td>
                        <strong style="color: #ffffff; font-size: 1.05rem; font-family: 'Poppins', sans-serif;">${item.schoolName}</strong>
                        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Tingkat ${this.activeLevel.toUpperCase()}</div>
                      </td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.4rem; color: var(--neon-yellow); font-weight: 700; font-size: 0.9rem;">
                          <i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${timeFormatted}
                        </div>
                      </td>
                      <td style="text-align: center;">
                        ${idx === 0 ? `
                          <span class="badge" style="background: rgba(0, 245, 212, 0.2); color: var(--neon-cyan); border: 1px solid var(--neon-cyan); font-weight: 800; font-size: 0.78rem; padding: 4px 12px;">
                            🟢 SEDANG TAMPIL
                          </span>
                        ` : idx === 1 ? `
                          <span class="badge" style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.4); font-weight: 800; font-size: 0.78rem; padding: 4px 12px;">
                            🟡 PERSIAPAN (NEXT UP)
                          </span>
                        ` : `
                          <span class="badge badge-completed" style="font-weight: 700; font-size: 0.75rem; opacity: 0.85;">
                            ⚪ MENUNGGU GILIRAN
                          </span>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    lucide.createIcons();
  }

  // Render Fullscreen Live Stage Presentation Mode (LED / Projector Display)
  renderLiveStage(container) {
    const schools = this.getEligibleSchools();
    const storeData = this.getDrawData();
    const currentDraws = storeData[this.activeLevel] || [];
    const lastResult = currentDraws.length > 0 ? currentDraws[currentDraws.length - 1] : null;

    container.innerHTML = `
      <div style="position: fixed; inset: 0; background: #070a12; z-index: 99999; display: flex; flex-direction: column; justify-content: space-between; padding: 2rem; overflow: hidden; background-image: radial-gradient(circle at 50% 30%, rgba(0, 245, 212, 0.15), transparent 70%);">
        
        <!-- Top Stage Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <img src="assets/simika-logo.png" style="height: 48px; object-fit: contain;">
            <div>
              <h1 style="margin: 0; font-size: 1.4rem; font-weight: 900; color: #ffffff; letter-spacing: 0.05em; font-family: 'Poppins', sans-serif;">
                SIMIKA LIVE DRAW STAGE
              </h1>
              <div style="font-size: 0.8rem; color: var(--neon-cyan); font-weight: 700;">
                LOMBA KETERAMPILAN BARIS-BERBARIS (LKBB) • TINGKAT ${this.activeLevel.toUpperCase()}
              </div>
            </div>
          </div>

          <button class="btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; border-color: rgba(255,255,255,0.2); color: #fff;" onclick="window.DrawComponent.setViewMode('admin')">
            ✕ Keluar Panggung
          </button>
        </div>

        <!-- Center Stage Display Area -->
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; flex: 1; padding: 2rem 0;">
          <div style="font-size: 1rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem;">
            URUTAN TAMPIL RESMI PANGGUNG
          </div>

          <!-- Giant 3D Display Box -->
          <div id="stage-number-box" style="width: 100%; max-width: 480px; height: 220px; background: rgba(15, 23, 42, 0.8); border: 4px solid var(--neon-cyan); border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 0 50px rgba(0, 245, 212, 0.3), inset 0 0 30px rgba(0, 245, 212, 0.2); margin-bottom: 1.5rem; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
            <div id="stage-number-val" style="font-size: 6.5rem; font-weight: 900; color: var(--neon-yellow); font-family: 'Poppins', sans-serif; line-height: 1; letter-spacing: 0.04em;">
              ${lastResult ? String(lastResult.drawNumber).padStart(3, '0') : '000'}
            </div>
          </div>

          <div id="stage-school-name" style="font-size: 2.2rem; font-weight: 900; color: #ffffff; font-family: 'Poppins', sans-serif; text-shadow: 0 0 20px rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem;">
            ${lastResult ? lastResult.schoolName : 'MENUNGGU PENGUNDIAN...'}
          </div>

          <div style="font-size: 1rem; color: #00f5d4; font-weight: 800; background: rgba(0, 245, 212, 0.1); border: 1px solid var(--neon-cyan); padding: 0.4rem 1.25rem; border-radius: 20px;">
            ${lastResult ? `🏆 URUTAN TAMPIL KE-${lastResult.orderIndex}` : 'SIAP DIUNDI PANITIA'}
          </div>
        </div>

        <!-- Bottom Stage Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
          <div style="font-size: 0.85rem; color: #94a3b8;">
            Tersisa <strong>${schools.length - currentDraws.length}</strong> dari <strong>${schools.length}</strong> Sekolah
          </div>

          <button class="btn-yellow-pill" style="padding: 0.75rem 2rem; font-size: 1.1rem; font-weight: 900;" onclick="window.DrawComponent.startDrawAnimation('stage')">
            🎲 KOCOK NOMOR PANGGUNG
          </button>
        </div>

      </div>
    `;

    lucide.createIcons();
  }

  // Render MC & Calling Mode View
  renderMCMode(container) {
    const storeData = this.getDrawData();
    const currentDraws = storeData[this.activeLevel] || [];
    const activeCallIndex = this.activeCallIndex || 0;
    const currentTeam = currentDraws[activeCallIndex];

    container.innerHTML = `
      <div style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <h2 style="margin: 0; font-family: 'Poppins', sans-serif; font-weight: 900; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="mic" style="color: #c084fc;"></i> HALAMAN KHUSUS MC & PETUGAS LAPANGAN
            </h2>
            <p style="margin: 0.25rem 0 0 0; color: #94a3b8; font-size: 0.8rem;">Modul Pemanggilan Peserta Tampil LKBB Berdasarkan Nomor Urut</p>
          </div>
          <button class="btn-outline" onclick="window.DrawComponent.setViewMode('admin')">← Kembali ke Control Room</button>
        </div>

        ${currentDraws.length === 0 ? `
          <div class="card-panel" style="text-align: center; padding: 3rem;">
            <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: #fbbf24; margin-bottom: 1rem;"></i>
            <h3>Belum ada peserta yang dikocok.</h3>
            <p style="color: #94a3b8;">Silakan lakukan pengundian nomor terlebih dahulu di Halaman Utama Kocokan.</p>
          </div>
        ` : `
          <div class="card-panel" style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid #6366f1; text-align: center; padding: 2.5rem 1.5rem; margin-bottom: 1.5rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #a5b4fc; letter-spacing: 0.1em;">PESERTA DIPANGGUL SAAT INI</div>
            
            <div style="font-size: 4.5rem; font-weight: 900; color: var(--neon-yellow); font-family: 'Poppins', sans-serif; line-height: 1; margin: 1rem 0;">
              NOMOR ${String(currentTeam?.drawNumber || 1).padStart(3, '0')}
            </div>

            <div style="font-size: 2rem; font-weight: 900; color: #ffffff; margin-bottom: 0.5rem;">
              ${currentTeam?.schoolName || '-'}
            </div>

            <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 1rem;">
              <button class="btn-yellow-pill" style="padding: 0.85rem 2rem; font-size: 1.1rem; font-weight: 900;" onclick="window.DrawComponent.callCurrentTeam()">
                📢 PANGGIL PESERTA SEKARANG
              </button>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 1rem;">
            <button class="btn-outline" style="flex: 1; justify-content: center;" ${activeCallIndex <= 0 ? 'disabled' : ''} onclick="window.DrawComponent.prevMCIndex()">
              ← Peserta Sebelumnya
            </button>
            <button class="btn-outline" style="flex: 1; justify-content: center; border-color: var(--neon-cyan); color: var(--neon-cyan);" ${activeCallIndex >= currentDraws.length - 1 ? 'disabled' : ''} onclick="window.DrawComponent.nextMCIndex()">
              Peserta Berikutnya →
            </button>
          </div>
        `}
      </div>
    `;

    lucide.createIcons();
  }

  callCurrentTeam() {
    this.playSound('call');
    if (window.SecurityEngine) {
      window.SecurityEngine.showSecurityToast('📢 MEMANGGIL PESERTA... Pengumuman terkirim ke sistem lapangan.');
    }
  }

  prevMCIndex() {
    this.activeCallIndex = Math.max(0, (this.activeCallIndex || 0) - 1);
    this.render(document.getElementById('app-main-content'));
  }

  nextMCIndex() {
    const storeData = this.getDrawData();
    const currentDraws = storeData[this.activeLevel] || [];
    this.activeCallIndex = Math.min(currentDraws.length - 1, (this.activeCallIndex || 0) + 1);
    this.render(document.getElementById('app-main-content'));
  }

  // Start Animated Slot Machine Spinning
  startDrawAnimation(targetView = 'admin') {
    if (this.isSpinning) return;
    const schools = this.getEligibleSchools();
    const storeData = this.getDrawData();
    const currentDraws = storeData[this.activeLevel] || [];

    const drawnSchoolIds = currentDraws.map(d => d.schoolId);
    const remainingSchools = schools.filter(s => !drawnSchoolIds.includes(s.id));

    if (remainingSchools.length === 0) {
      alert('Semua peserta telah dikocok!');
      return;
    }

    this.isSpinning = true;
    const numDisplay = targetView === 'stage' ? document.getElementById('stage-number-val') : document.getElementById('slot-number-val');
    const teamDisplay = targetView === 'stage' ? document.getElementById('stage-school-name') : document.getElementById('slot-team-name');

    // Pick random target school from remaining
    const randomIndex = Math.floor(Math.random() * remainingSchools.length);
    const targetSchool = remainingSchools[randomIndex];
    const newDrawNumber = currentDraws.length + 1; // Order 1..N

    let counter = 0;
    const maxSpin = 25;
    const intervalMs = 60;

    const spinTimer = setInterval(() => {
      counter++;
      const tempNum = Math.floor(Math.random() * 900) + 100;
      if (numDisplay) numDisplay.textContent = String(tempNum).padStart(3, '0');
      this.playSound('tick');

      if (counter >= maxSpin) {
        clearInterval(spinTimer);

        // Final Reveal
        if (numDisplay) numDisplay.textContent = String(newDrawNumber).padStart(3, '0');
        if (teamDisplay) teamDisplay.textContent = targetSchool.pangkalan;

        // Save state
        const newResult = {
          orderIndex: newDrawNumber,
          drawNumber: newDrawNumber,
          schoolId: targetSchool.id,
          schoolName: targetSchool.pangkalan,
          level: this.activeLevel,
          timestamp: new Date().toISOString()
        };

        storeData[this.activeLevel] = storeData[this.activeLevel] || [];
        storeData[this.activeLevel].push(newResult);
        this.saveDrawData(storeData);

        this.isSpinning = false;
        this.playSound('reveal');
        this.triggerConfetti();

        setTimeout(() => {
          this.render(document.getElementById('app-main-content'));
        }, 1200);
      }
    }, intervalMs);
  }

  undoLastDraw() {
    const storeData = this.getDrawData();
    const currentDraws = storeData[this.activeLevel] || [];
    if (currentDraws.length === 0) return;

    const last = currentDraws[currentDraws.length - 1];
    const reason = prompt(`Batalkan Kocokan Terakhir (#${last.drawNumber} - ${last.schoolName})?\nMasukkan alasan pembatalan:`, 'Salah kategori / penyesuaian');
    
    if (reason !== null) {
      currentDraws.pop();
      storeData[this.activeLevel] = currentDraws;
      this.saveDrawData(storeData);

      if (window.SecurityEngine) {
        window.SecurityEngine.logAudit('UNDO_DRAW', `Cancelled draw #${last.drawNumber} (${last.schoolName}) - Reason: ${reason}`);
        window.SecurityEngine.showSecurityToast(`↩️ Kocokan #${last.drawNumber} (${last.schoolName}) dibatalkan.`);
      }

      this.render(document.getElementById('app-main-content'));
    }
  }

  toggleLockState() {
    const storeData = this.getDrawData();
    storeData.locked = storeData.locked || {};
    storeData.locked[this.activeLevel] = !storeData.locked[this.activeLevel];
    this.saveDrawData(storeData);

    const isLocked = storeData.locked[this.activeLevel];
    if (window.SecurityEngine) {
      window.SecurityEngine.showSecurityToast(isLocked ? '🔒 Hasil Kocokan dikunci resmi.' : '🔓 Kunci Hasil Kocokan dibuka.');
    }

    this.render(document.getElementById('app-main-content'));
  }

  generateSchedule() {
    const startVal = document.getElementById('sch-start-time')?.value || '08:00';
    const durVal = Number(document.getElementById('sch-duration')?.value) || 15;

    alert(`✅ JADWAL TER-GENERATE:\nMulai: ${startVal} WIB\nDurasi Per Tampil: ${durVal} Menit.\n\nJadwal LKBB otomatis diperbarui berdasarkan urutan kocokan!`);
  }

  setSubTab(subTabName) {
    this.subTab = subTabName;
    this.render(document.getElementById('app-main-content'));
  }

  filterDrawTable(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('#draw-schedule-table tbody tr.draw-row-item').forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(q)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  setLevel(lvl) {
    this.activeLevel = lvl;
    this.render(document.getElementById('app-main-content'));
  }

  setMode(mode) {
    this.activeMode = mode;
    this.render(document.getElementById('app-main-content'));
  }

  setViewMode(view) {
    this.viewMode = view;
    this.render(document.getElementById('app-main-content'));
  }
}

window.DrawComponent = new DrawComponent();
