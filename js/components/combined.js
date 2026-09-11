/* ==========================================================================
   SiMika - Materi Gabungan (Juara Umum Engine) Component
   - Clean, Minimalist UI without Content Button Icons
   - All Bahasa Indonesia UI
   ========================================================================== */

const CombinedComponent = {
  // Default selected competitions to combine (dynamically populated from window.COMPETITIONS)
  get selectedLombaIds() {
    if (!this._selectedLombaIds) {
      this._selectedLombaIds = COMPETITIONS.map(c => c.id);
    }
    // Filter out deleted competitions if any
    const validIds = COMPETITIONS.map(c => c.id);
    this._selectedLombaIds = this._selectedLombaIds.filter(id => validIds.includes(id));
    return this._selectedLombaIds;
  },

  set selectedLombaIds(val) {
    this._selectedLombaIds = val;
  },

  // Level Filter Tabs: 'sd', 'smp', 'penegak', 'overall'
  currentLevelTab: 'sd',

  render(container) {
    let levelTitle = '';
    let levelBadge = '';

    if (this.currentLevelTab === 'sd') {
      levelTitle = 'Juara Materi Gabungan Tingkat SD (Penggalang SD Putra & Putri)';
      levelBadge = 'Tingkat SD';
    } else if (this.currentLevelTab === 'smp') {
      levelTitle = 'Juara Materi Gabungan Tingkat SMP (Penggalang SMP Putra & Putri)';
      levelBadge = 'Tingkat SMP';
    } else if (this.currentLevelTab === 'penegak') {
      levelTitle = 'Juara Materi Gabungan Tingkat Penegak (Sangga Penegak Putra & Putri)';
      levelBadge = 'Tingkat Penegak';
    } else {
      levelTitle = 'Juara Materi Gabungan Tingkat Keseluruhan (SD, SMP, & Penegak)';
      levelBadge = 'Tingkat Overall';
    }

    const selectedCompObjs = COMPETITIONS.filter(c => this.selectedLombaIds.includes(c.id));

    // Get Putra and Putri leaderboards for current level
    const levelKey = this.currentLevelTab === 'overall' ? 'all' : this.currentLevelTab;

    const listPa = window.Calculators.getCombinedLeaderboard(this.selectedLombaIds, levelKey, 'pa');
    const listPi = window.Calculators.getCombinedLeaderboard(this.selectedLombaIds, levelKey, 'pi');
    const listOverall = window.Calculators.getCombinedLeaderboard(this.selectedLombaIds, levelKey, 'all');

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">
            Materi Gabungan & Juara Umum Tingkat Lomba
          </h1>
          <p class="page-subtitle">Rekap Akumulasi Skor Juara Materi Gabungan SD, SMP, Penegak, & Keseluruhan</p>
        </div>
        <button class="btn-yellow-pill" onclick="window.PrintComponent.printCombinedReport('${this.currentLevelTab}')">
          Cetak SK ${levelBadge}
        </button>
      </div>

      <!-- Level Switcher Tabs -->
      <div class="sub-tabs">
        <button class="sub-tab-btn ${this.currentLevelTab === 'sd' ? 'active' : ''}" onclick="CombinedComponent.switchLevelTab('sd')">
          Juara Materi Gabungan Tingkat SD
        </button>
        <button class="sub-tab-btn ${this.currentLevelTab === 'smp' ? 'active' : ''}" onclick="CombinedComponent.switchLevelTab('smp')">
          Juara Materi Gabungan Tingkat SMP
        </button>
        <button class="sub-tab-btn ${this.currentLevelTab === 'penegak' ? 'active' : ''}" onclick="CombinedComponent.switchLevelTab('penegak')">
          Juara Materi Gabungan Tingkat Penegak
        </button>
        <button class="sub-tab-btn ${this.currentLevelTab === 'overall' ? 'active' : ''}" onclick="CombinedComponent.switchLevelTab('overall')">
          Combined Keseluruhan (SD, SMP, Penegak)
        </button>
      </div>

      <!-- Competition Selector Panel -->
      <div class="card-panel">
        <div class="card-panel-header">
          <h3 class="panel-title">
            Pengaturan Mata Lomba yang Digabungkan (${this.selectedLombaIds.length} Terpilih)
          </h3>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn-outline" style="padding: 0.3rem 0.65rem; font-size: 0.74rem;" onclick="CombinedComponent.selectAll()">Pilih Semua</button>
            <button class="btn-outline" style="padding: 0.3rem 0.65rem; font-size: 0.74rem;" onclick="CombinedComponent.clearAll()">Bersihkan</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.6rem;">
          ${COMPETITIONS.map(c => {
            const isSelected = this.selectedLombaIds.includes(c.id);
            return `
              <div style="background: ${isSelected ? 'rgba(0, 245, 212, 0.12)' : 'var(--bg-creator-main)'}; border: 1px solid ${isSelected ? 'var(--neon-cyan)' : 'var(--border-creator)'}; padding: 0.6rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" onclick="CombinedComponent.toggleLomba('${c.id}')">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation(); CombinedComponent.toggleLomba('${c.id}')" />
                <div>
                  <div style="font-weight: 700; color: #fff; font-size: 0.8rem;">${c.name}</div>
                  <div style="font-size: 0.7rem; color: #94a3b8;">Gabungkan skor</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Podium Cards per Gender (Putra & Putri) for Level -->
      ${this.currentLevelTab !== 'overall' ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <!-- Podium Putra -->
          <div class="card-panel" style="margin-bottom: 0; background: #120c24; border: 1px solid rgba(0, 245, 212, 0.4);">
            <div class="card-panel-header">
              <h3 class="panel-title" style="color: var(--neon-cyan);">
                Juara Materi Gabungan ${levelBadge} PUTRA
              </h3>
            </div>
            ${this.renderPodiumWidget(listPa)}
          </div>

          <!-- Podium Putri -->
          <div class="card-panel" style="margin-bottom: 0; background: #120c24; border: 1px solid rgba(192, 132, 252, 0.4);">
            <div class="card-panel-header">
              <h3 class="panel-title" style="color: var(--crystal-purple);">
                Juara Materi Gabungan ${levelBadge} PUTRI
              </h3>
            </div>
            ${this.renderPodiumWidget(listPi)}
          </div>
        </div>
      ` : ''}

      <!-- Detailed Combined Leaderboard Table -->
      <div class="card-panel">
        <div class="card-panel-header">
          <h3 class="panel-title">
            Tabel Klasemen ${levelTitle} (${listOverall.length} Regu/Sangga)
          </h3>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Lencana 3D Rank</th>
                <th>ID Regu</th>
                <th>Nama Regu / Sangga</th>
                <th>Pangkalan</th>
                <th>Kategori</th>
                ${selectedCompObjs.map(c => `<th>${c.name.replace('Lomba ', '')}</th>`).join('')}
                <th>Total Akumulasi</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${listOverall.length === 0 ? `
                <tr><td colspan="${7 + selectedCompObjs.length}" style="text-align: center; color: #94a3b8; padding: 1.5rem;">Belum ada peserta terdaftar untuk tingkat ini.</td></tr>
              ` : listOverall.map(item => {
                const rankClass = item.rank === 1 ? 'rank-1' : item.rank === 2 ? 'rank-2' : item.rank === 3 ? 'rank-3' : 'rank-other';
                const rankBadgeLabel = item.rank === 1 ? '👑 RANK 1' : item.rank === 2 ? '🥈 RANK 2' : item.rank === 3 ? '🥉 RANK 3' : `💎 RANK ${item.rank}`;
                const catObj = CATEGORIES.find(c => c.id === item.team.category);
                const reguIdCode = item.team.id || item.schoolId || '-';

                return `
                  <tr>
                    <td><span class="rank-badge-game ${rankClass}">${rankBadgeLabel}</span></td>
                    <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
                    <td><strong style="color: #fff;">${item.team.name}</strong></td>
                    <td>${item.team.pangkalan}</td>
                    <td><span class="badge ${catObj?.badgeClass}">${catObj?.short}</span></td>
                    ${selectedCompObjs.map(c => `<td>${item.breakdown[c.id] || 0}</td>`).join('')}
                    <td><strong style="color: var(--neon-yellow); font-size: 1.05rem; font-family: 'Poppins', sans-serif;">${item.combinedTotal} Pts</strong></td>
                    <td>${item.isTie ? `<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">⚡ ${item.displayKet}</span>` : `<span style="font-size: 0.76rem; color: #94a3b8;">${item.displayKet || '-'}</span>`}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    lucide.createIcons();
  },

  renderPodiumWidget(list) {
    if (!list || list.length === 0) {
      return `<div style="font-size: 0.8rem; color: #94a3b8; padding: 0.75rem 0;">Belum ada data nilai.</div>`;
    }
    const t1 = list[0];
    const t2 = list[1];
    const t3 = list[2];

    return `
      <div style="display: flex; flex-direction: column; gap: 0.6rem;">
        ${t1 ? `
          <div style="background: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; padding: 0.6rem; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="rank-badge-game rank-1">👑 JUARA 1</span>
              <div style="font-size: 0.88rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">${t1.team.name}</div>
              <div style="font-size: 0.74rem; color: #94a3b8;">${t1.team.pangkalan}</div>
            </div>
            <div style="font-size: 1.05rem; font-weight: 900; color: var(--neon-yellow); font-family: 'Poppins', sans-serif;">${t1.combinedTotal} Pts</div>
          </div>
        ` : ''}

        ${t2 ? `
          <div style="background: rgba(168, 85, 247, 0.1); border-left: 4px solid #a855f7; padding: 0.6rem; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="rank-badge-game rank-2">🥈 JUARA 2</span>
              <div style="font-size: 0.85rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">${t2.team.name}</div>
              <div style="font-size: 0.74rem; color: #94a3b8;">${t2.team.pangkalan}</div>
            </div>
            <div style="font-size: 0.95rem; font-weight: 900; color: #e9d5ff; font-family: 'Poppins', sans-serif;">${t2.combinedTotal} Pts</div>
          </div>
        ` : ''}

        ${t3 ? `
          <div style="background: rgba(244, 63, 94, 0.1); border-left: 4px solid #f43f5e; padding: 0.6rem; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="rank-badge-game rank-3">🥉 JUARA 3</span>
              <div style="font-size: 0.85rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">${t3.team.name}</div>
              <div style="font-size: 0.74rem; color: #94a3b8;">${t3.team.pangkalan}</div>
            </div>
            <div style="font-size: 0.95rem; font-weight: 900; color: #fecdd3; font-family: 'Poppins', sans-serif;">${t3.combinedTotal} Pts</div>
          </div>
        ` : ''}
      </div>
    `;
  },

  switchLevelTab(tab) {
    this.currentLevelTab = tab;
    this.render(document.getElementById('app-main-content'));
  },

  toggleLomba(id) {
    if (this.selectedLombaIds.includes(id)) {
      if (this.selectedLombaIds.length === 1) return alert('Minimal 1 mata lomba harus dipilih!');
      this.selectedLombaIds = this.selectedLombaIds.filter(x => x !== id);
    } else {
      this.selectedLombaIds.push(id);
    }
    this.render(document.getElementById('app-main-content'));
  },

  selectAll() {
    this.selectedLombaIds = COMPETITIONS.map(c => c.id);
    this.render(document.getElementById('app-main-content'));
  },

  clearAll() {
    this.selectedLombaIds = ['administrasi'];
    this.render(document.getElementById('app-main-content'));
  }
};

window.CombinedComponent = CombinedComponent;
