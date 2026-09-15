/* ==========================================================================
   SiMika - Scoring & Competition Entry Component
   - Clean, Minimalist UI without Content Button Icons
   - All Bahasa Indonesia UI
   ========================================================================== */

const ScoringComponent = {
  currentLomba: 'administrasi',

  render(container, selectedLombaId) {
    if (selectedLombaId) {
      this.currentLomba = selectedLombaId;
    }

    const isLocked = window.dataStore.isCompetitionsLocked;
    const activeCat = window.currentCategoryFilter || 'all';
    const leaderboard = window.Calculators.getLombaLeaderboard(this.currentLomba, activeCat);
    const currentCompObj = COMPETITIONS.find(c => c.id === this.currentLomba);
    const isSchoolComp = (this.currentLomba === 'joged_komando' || this.currentLomba === 'lkbb');

    let activeCatLabel = 'Semua Kategori';
    if (isSchoolComp) {
      if (activeCat === 'sd' || activeCat === 'sd_pa' || activeCat === 'sd_pi') activeCatLabel = 'Tingkat SD';
      else if (activeCat === 'smp' || activeCat === 'smp_pa' || activeCat === 'smp_pi') activeCatLabel = 'Tingkat SMP';
      else if (activeCat === 'penegak' || activeCat === 'penegak_pa' || activeCat === 'penegak_pi') activeCatLabel = 'Tingkat PENEGAK';
      else activeCatLabel = 'Semua Kategori (SD, SMP, PENEGAK)';
    } else {
      activeCatLabel = CATEGORIES.find(c => c.id === activeCat)?.label || 'Semua Kategori';
    }

    container.innerHTML = `
      <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
        <div>
          <h1 class="page-title" style="display: flex; align-items: center; gap: 0.5rem; margin: 0;">
            <i data-lucide="${currentCompObj?.icon || 'trophy'}" style="color: var(--neon-cyan); width: 28px; height: 28px;"></i>
            ${currentCompObj?.name || 'Input Nilai Lomba'}
          </h1>
          <p class="page-subtitle" style="margin-top: 0.25rem;">Modul Input Penilaian & Perhitungan Peringkat Otomatis</p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button class="btn-yellow-pill" style="padding: 0.6rem 1.25rem; font-size: 0.85rem; background: linear-gradient(135deg, #00f5d4, #0284c7); color: #090d16; font-weight: 900; box-shadow: 0 4px 18px rgba(0, 245, 212, 0.45); border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; border-radius: 999px; transition: transform 0.2s;" onclick="ScoringComponent.openAddLombaModal()" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
            <i data-lucide="plus-circle" style="width: 18px; height: 18px;"></i> ➕ TAMBAH JENIS LOMBA
          </button>
        </div>
      </div>

      <!-- Sub Tabs for Competitions (Reorderable & Lockable) -->
      <div class="sub-tabs-wrapper" style="margin-bottom: 1.25rem;">
        <div class="sub-tabs-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="font-size: 0.78rem; font-weight: 700; opacity: 0.85; display: flex; align-items: center; gap: 0.4rem;">
            <span>📌 DAFTAR MATA LOMBA (${COMPETITIONS.length})</span>
            <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.75;">(Geser atau gunakan ◄ ► untuk mengubah posisi)</span>
          </div>

          <!-- Lock / Unlock Toggle Button -->
          <button type="button" id="btn-toggle-lomba-lock" class="btn-lock-toggle ${isLocked ? 'locked' : 'unlocked'}" onclick="window.ScoringComponent.toggleLock(event)" style="padding: 0.45rem 1rem; font-size: 0.78rem; border-radius: 999px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; position: relative; z-index: 10; user-select: none;" title="${isLocked ? 'Status Terkunci: Klik untuk membuka kunci hapus lomba' : 'Status Terbuka: Klik untuk mengunci kembali'}">
            ${isLocked ? '🔒 DAFTAR LOMBA TERKUNCI (KLIK BUKA)' : '🔓 KUNCI TERBUKA (KLIK KUNCI KEMBALI)'}
          </button>
        </div>

        <div class="sub-tabs" style="display: flex; flex-wrap: wrap; gap: 0.45rem; padding: 0.75rem; border-radius: 14px;">
          ${COMPETITIONS.map((c, idx) => `
            <div class="sub-tab-item ${c.id === this.currentLomba ? 'active-item' : ''}" 
                 draggable="true"
                 ondragstart="ScoringComponent.handleDragStart(event, ${idx})"
                 ondragover="ScoringComponent.handleDragOver(event)"
                 ondrop="ScoringComponent.handleDrop(event, ${idx})"
                 style="position: relative; display: inline-flex; align-items: center; cursor: grab;">
              
              <!-- Shift Left Arrow -->
              ${idx > 0 ? `
                <button type="button" class="btn-shift-arrow" title="Geser posisi ke Kiri" onclick="event.stopPropagation(); ScoringComponent.moveLomba(${idx}, ${idx - 1})" style="border: none; background: transparent; cursor: pointer; padding: 0 3px; font-size: 0.7rem; opacity: 0.5;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.5">
                  ◄
                </button>
              ` : ''}

              <button class="sub-tab-btn ${c.id === this.currentLomba ? 'active' : ''}" onclick="ScoringComponent.switchLomba('${c.id}')" style="display: flex; align-items: center; gap: 0.35rem;">
                <i data-lucide="${c.icon || 'trophy'}" style="width: 14px; height: 14px;"></i> ${c.name}
              </button>

              <!-- Shift Right Arrow -->
              ${idx < COMPETITIONS.length - 1 ? `
                <button type="button" class="btn-shift-arrow" title="Geser posisi ke Kanan" onclick="event.stopPropagation(); ScoringComponent.moveLomba(${idx}, ${idx + 1})" style="border: none; background: transparent; cursor: pointer; padding: 0 3px; font-size: 0.7rem; opacity: 0.5;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.5">
                  ►
                </button>
              ` : ''}

              <!-- Delete Button (Only Visible when Unlocked) -->
              ${!isLocked ? `
                <button type="button" title="Hapus Lomba ${c.name}" onclick="event.stopPropagation(); ScoringComponent.confirmDeleteLomba('${c.id}', '${c.name.replace(/'/g, "\\'")}')" style="background: rgba(239, 68, 68, 0.25); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.6); border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; margin-left: 2px; cursor: pointer; z-index: 2;" onmouseover="this.style.background='#ef4444'; this.style.color='#fff';" onmouseout="this.style.background='rgba(239, 68, 68, 0.25)'; this.style.color='#ef4444';">
                  ✕
                </button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Score Entry Table Panel -->
      <div class="card-panel">
        <div class="card-panel-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <h3 class="panel-title" style="display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="${currentCompObj?.icon || 'trophy'}" style="color: var(--neon-cyan);"></i> Rekap Nilai ${currentCompObj?.name} (${leaderboard.length} ${isSchoolComp ? 'Sekolah' : 'Peserta'})
          </h3>
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <div style="font-size: 0.78rem; color: #94a3b8;">
              Kategori Filter: <strong style="color: var(--neon-cyan);">${activeCatLabel}</strong>
            </div>
            <button class="btn-yellow-pill" style="padding: 0.4rem 0.85rem; font-size: 0.78rem; background: linear-gradient(135deg, #10b981, #059669); color: #fff; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); border: none; font-weight: 700; cursor: pointer;" onclick="ScoringComponent.exportToExcel()">
              Ekspor Excel
            </button>
          </div>
        </div>

        ${isSchoolComp ? `
          <!-- Filter Kategori Tingkat Sekolah SD, SMP, PENEGAK -->
          <div class="category-filter-bar">
            <button class="filter-tab-btn ${activeCat === 'all' ? 'active' : ''}" onclick="ScoringComponent.setFilter('all')">
              SEMUA KATEGORI
            </button>
            <button class="filter-tab-btn ${activeCat === 'sd' || activeCat === 'sd_pa' || activeCat === 'sd_pi' ? 'active' : ''}" onclick="ScoringComponent.setFilter('sd')">
              SD
            </button>
            <button class="filter-tab-btn ${activeCat === 'smp' || activeCat === 'smp_pa' || activeCat === 'smp_pi' ? 'active' : ''}" onclick="ScoringComponent.setFilter('smp')">
              SMP
            </button>
            <button class="filter-tab-btn ${activeCat === 'penegak' || activeCat === 'penegak_pa' || activeCat === 'penegak_pi' ? 'active' : ''}" onclick="ScoringComponent.setFilter('penegak')">
              PENEGAK
            </button>
          </div>
        ` : `
          <!-- Filter Regu SD PA/PI, SMP PA/PI, PENEGAK PA/PI -->
          <div class="category-filter-bar">
            <button class="filter-tab-btn ${activeCat === 'all' ? 'active' : ''}" onclick="ScoringComponent.setFilter('all')">
              SEMUA KATEGORI
            </button>
            <button class="filter-tab-btn ${activeCat === 'sd_pa' ? 'active' : ''}" onclick="ScoringComponent.setFilter('sd_pa')">
              SD PUTRA
            </button>
            <button class="filter-tab-btn ${activeCat === 'sd_pi' ? 'active' : ''}" onclick="ScoringComponent.setFilter('sd_pi')">
              SD PUTRI
            </button>
            <button class="filter-tab-btn ${activeCat === 'smp_pa' ? 'active' : ''}" onclick="ScoringComponent.setFilter('smp_pa')">
              SMP PUTRA
            </button>
            <button class="filter-tab-btn ${activeCat === 'smp_pi' ? 'active' : ''}" onclick="ScoringComponent.setFilter('smp_pi')">
              SMP PUTRI
            </button>
            <button class="filter-tab-btn ${activeCat === 'penegak_pa' ? 'active' : ''}" onclick="ScoringComponent.setFilter('penegak_pa')">
              PENEGAK PUTRA
            </button>
            <button class="filter-tab-btn ${activeCat === 'penegak_pi' ? 'active' : ''}" onclick="ScoringComponent.setFilter('penegak_pi')">
              PENEGAK PUTRI
            </button>
          </div>
        `}

        <div class="table-container">
          <table class="admin-table">
            <thead>
              ${this.renderTableHeader()}
            </thead>
            <tbody>
              ${leaderboard.length === 0 ? `
                <tr><td colspan="11" style="text-align: center; color: #94a3b8; padding: 1.5rem;">Belum ada peserta/sekolah terdaftar untuk kategori ini.</td></tr>
              ` : leaderboard.map(item => this.renderTableRow(item)).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    lucide.createIcons();
  },

  switchLomba(lombaId) {
    this.currentLomba = lombaId;
    this.render(document.getElementById('app-main-content'));
  },

  setFilter(cat) {
    window.currentCategoryFilter = cat;
    this.render(document.getElementById('app-main-content'));
  },

  renderTableHeader() {
    switch (this.currentLomba) {
      case 'administrasi':
        return `
          <tr>
            <th>Peringkat</th>
            <th>ID Regu</th>
            <th>Regu / Pangkalan</th>
            <th>Pendaftaran</th>
            <th>Pernyataan</th>
            <th>KTA</th>
            <th>Kwitansi</th>
            <th>Mandat</th>
            <th>Ijin</th>
            <th>Asuransi</th>
            <th>Bumbung</th>
            <th>Total Skor</th>
            <th>Keterangan</th>
            <th style="text-align: right;">Aksi</th>
          </tr>
        `;
      case 'banksoal':
      case 'pioneering':
      case 'sandi':
      case 'morse':
      case 'semaphore':
      case 'ketangkasan':
        return `
          <tr>
            <th>Peringkat</th>
            <th>ID Regu</th>
            <th>Regu / Pangkalan</th>
            <th>Kategori</th>
            <th>Nilai Utama</th>
            <th>Total Skor</th>
            <th>Keterangan</th>
            <th style="text-align: right;">Aksi</th>
          </tr>
        `;
      case 'p3k':
        return `
          <tr>
            <th>Peringkat</th>
            <th>ID Regu</th>
            <th>Regu / Pangkalan</th>
            <th>Nilai Teori P3K</th>
            <th>Nilai Praktek P3K</th>
            <th>Total Skor</th>
            <th>Keterangan</th>
            <th style="text-align: right;">Aksi</th>
          </tr>
        `;
      case 'joged_komando':
        return `
          <tr>
            <th>Peringkat</th>
            <th>ID Basis</th>
            <th>Sekolah / Pangkalan</th>
            <th>Kategori</th>
            <th>Juri 1 Total</th>
            <th>Juri 2 Total</th>
            <th>Juri 3 Total</th>
            <th>Pengurangan (Penalty)</th>
            <th>Total Akhir</th>
            <th>Keterangan</th>
            <th style="text-align: right;">Aksi</th>
          </tr>
        `;
      case 'lkbb':
        return `
          <tr>
            <th>Peringkat</th>
            <th>ID Basis</th>
            <th>Sekolah / Pangkalan</th>
            <th>Kategori</th>
            <th>Nilai DP</th>
            <th>PBB Dasar (Juri 1+2+3)</th>
            <th>Variasi Formasi (Juri 1+2+3)</th>
            <th>Danton (Juri 1+2+3)</th>
            <th>Total Overall LKBB</th>
            <th>Keterangan</th>
            <th style="text-align: right;">Aksi</th>
          </tr>
        `;
      default: {
        const cObj = COMPETITIONS.find(c => c.id === this.currentLomba);
        if (cObj && cObj.type === 'dual') {
          return `
            <tr>
              <th style="width: 70px; text-align: center;">Peringkat</th>
              <th style="width: 100px; text-align: center;">ID Regu</th>
              <th>Nama Regu / Sangga</th>
              <th style="text-align: center;">Kategori</th>
              <th style="width: 110px; text-align: center;">Nilai Teori</th>
              <th style="width: 110px; text-align: center;">Nilai Praktek</th>
              <th style="width: 110px; text-align: center;">Total Skor</th>
              <th style="width: 130px; text-align: center;">Keterangan</th>
              <th style="width: 110px; text-align: right;">Aksi</th>
            </tr>
          `;
        }
        return `
          <tr>
            <th style="width: 70px; text-align: center;">Peringkat</th>
            <th style="width: 100px; text-align: center;">ID Regu</th>
            <th>Nama Regu / Sangga</th>
            <th style="text-align: center;">Kategori</th>
            <th style="width: 120px; text-align: center;">Nilai Utama</th>
            <th style="width: 120px; text-align: center;">Total Skor</th>
            <th style="width: 130px; text-align: center;">Keterangan</th>
            <th style="width: 110px; text-align: right;">Aksi</th>
          </tr>
        `;
      }
    }
  },

  renderKetCell(item) {
    const ketText = item.displayKet || item.scoreObj?.ket || '-';
    if (item.isTie) {
      return `<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">⚡ ${ketText}</span>`;
    }
    return `<span style="font-size: 0.76rem; color: #94a3b8;">${ketText}</span>`;
  },

  hasValidScore(scoreObj) {
    if (!scoreObj || typeof scoreObj !== 'object') return false;

    // Single score competitions (banksoal, pioneering, sandi, morse, semaphore, ketangkasan, custom single)
    if (typeof scoreObj.score === 'number' && scoreObj.score > 0) return true;

    // Administrasi
    if ((scoreObj.pendaftaran || 0) > 0 || (scoreObj.pernyataan || 0) > 0 || (scoreObj.kta || 0) > 0 ||
        (scoreObj.kwitansi || 0) > 0 || (scoreObj.mandat || 0) > 0 || (scoreObj.ijin || 0) > 0 ||
        (scoreObj.asuransi || 0) > 0 || (scoreObj.bumbung || 0) > 0) return true;

    // P3K or dual score custom
    if ((scoreObj.teori || 0) > 0 || (scoreObj.praktek || 0) > 0) return true;

    // Joged Komando
    if (scoreObj.juri1 || scoreObj.juri2 || scoreObj.juri3 || scoreObj.penalty) {
      const j1 = scoreObj.juri1 || {};
      const j2 = scoreObj.juri2 || {};
      const j3 = scoreObj.juri3 || {};
      if ((j1.kreativitas || 0) > 0 || (j1.kekompakkan || 0) > 0 || (j1.musik || 0) > 0 ||
          (j2.kreativitas || 0) > 0 || (j2.kekompakkan || 0) > 0 || (j2.musik || 0) > 0 ||
          (j3.kreativitas || 0) > 0 || (j3.kekompakkan || 0) > 0 || (j3.musik || 0) > 0 ||
          (scoreObj.penalty || 0) > 0) {
        return true;
      }
    }

    // LKBB
    if (scoreObj.dp !== undefined || scoreObj.pbbDasar || scoreObj.variasi || scoreObj.danton) {
      const dpVal = typeof scoreObj.dp === 'number' ? scoreObj.dp : (scoreObj.dp?.juri1 || 0);
      const pbb = scoreObj.pbbDasar || {};
      const vf = scoreObj.variasi || {};
      const dt = scoreObj.danton || {};
      if (dpVal > 0 ||
          (pbb.juri1 || 0) > 0 || (pbb.juri2 || 0) > 0 || (pbb.juri3 || 0) > 0 ||
          (vf.juri1 || 0) > 0 || (vf.juri2 || 0) > 0 || (vf.juri3 || 0) > 0 ||
          (dt.juri1 || 0) > 0 || (dt.juri2 || 0) > 0 || (dt.juri3 || 0) > 0) {
        return true;
      }
    }

    return false;
  },

  renderActionButton(teamId, scoreObj) {
    const hasScore = this.hasValidScore(scoreObj);

    if (hasScore) {
      return `
        <button class="btn-action-input-nilai btn-has-score" onclick="ScoringComponent.openInputModal('${teamId}')">
          Edit Nilai
        </button>
      `;
    }

    return `
      <button class="btn-action-input-nilai" onclick="ScoringComponent.openInputModal('${teamId}')">
        Input Nilai
      </button>
    `;
  },

  renderTableRow(item) {
    const { team, scoreObj, totalScore, rank } = item;
    const hasData = this.hasValidScore(scoreObj);
    const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
    const rankLabel = (!hasData || rank === '-') ? '-' : rank === 1 ? '👑 RANK 1' : rank === 2 ? '🥈 RANK 2' : rank === 3 ? '🥉 RANK 3' : `💎 RANK ${rank}`;
    const totalDisplay = hasData 
      ? `<strong style="color: var(--neon-yellow); font-size: 0.95rem; font-family: 'Poppins', sans-serif;">${totalScore}</strong>` 
      : `<span style="color: #64748b; font-weight: 600;">-</span>`;
    const reguIdCode = scoreObj?.basisId || item.basisId || team.id || item.schoolId || '-';

    switch (this.currentLomba) {
      case 'administrasi': {
        const s = scoreObj || {};
        return `
          <tr>
            <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
            <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
            <td><strong style="color: #fff;">${team.name}</strong><br><span style="font-size: 0.72rem; color: #94a3b8;">${team.pangkalan}</span></td>
            <td>${hasData ? (s.pendaftaran ?? 0) : '-'}</td>
            <td>${hasData ? (s.pernyataan ?? 0) : '-'}</td>
            <td>${hasData ? (s.kta ?? 0) : '-'}</td>
            <td>${hasData ? (s.kwitansi ?? 0) : '-'}</td>
            <td>${hasData ? (s.mandat ?? 0) : '-'}</td>
            <td>${hasData ? (s.ijin ?? 0) : '-'}</td>
            <td>${hasData ? (s.asuransi ?? 0) : '-'}</td>
            <td>${hasData ? (s.bumbung ?? 0) : '-'}</td>
            <td>${totalDisplay}</td>
            <td>${this.renderKetCell(item)}</td>
            <td style="text-align: right;">
              ${this.renderActionButton(team.id, scoreObj)}
            </td>
          </tr>
        `;
      }
      case 'banksoal':
      case 'pioneering':
      case 'sandi':
      case 'morse':
      case 'semaphore':
      case 'ketangkasan': {
        const s = scoreObj || {};
        const catObj = CATEGORIES.find(c => c.id === team.category);
        return `
          <tr>
            <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
            <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
            <td><strong style="color: #fff;">${team.name}</strong><br><span style="font-size: 0.72rem; color: #94a3b8;">${team.pangkalan}</span></td>
            <td><span class="badge ${catObj?.badgeClass}">${catObj?.short}</span></td>
            <td>${hasData ? (s.score ?? 0) : '-'}</td>
            <td>${totalDisplay}</td>
            <td>${this.renderKetCell(item)}</td>
            <td style="text-align: right;">
              ${this.renderActionButton(team.id, scoreObj)}
            </td>
          </tr>
        `;
      }
      case 'p3k': {
        const s = scoreObj || {};
        return `
          <tr>
            <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
            <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
            <td><strong style="color: #fff;">${team.name}</strong><br><span style="font-size: 0.72rem; color: #94a3b8;">${team.pangkalan}</span></td>
            <td>${hasData ? (s.teori ?? 0) : '-'}</td>
            <td>${hasData ? (s.praktek ?? 0) : '-'}</td>
            <td>${totalDisplay}</td>
            <td>${this.renderKetCell(item)}</td>
            <td style="text-align: right;">
              ${this.renderActionButton(team.id, scoreObj)}
            </td>
          </tr>
        `;
      }
      case 'joged_komando': {
        const s = scoreObj || {};
        const breakdown = window.Calculators.calculateJogedKomando(s);
        const schoolName = item.pangkalan || team.pangkalan || team.name;
        const levelUpper = (item.levelLabel || item.level || 'SD').toUpperCase();
        const badgeClass = levelUpper.includes('SD') ? 'badge-sd-pa' : levelUpper.includes('SMP') ? 'badge-smp-pa' : 'badge-penegak-pa';
        return `
          <tr>
            <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
            <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
            <td><strong style="color: #fff; font-size: 0.92rem;">${schoolName}</strong><br><span style="font-size: 0.72rem; color: #10b981; font-weight: 600;">(${item.reguCount || 2} Regu Terdaftar)</span></td>
            <td><span class="badge ${badgeClass}">${levelUpper}</span></td>
            <td>${hasData ? breakdown.totalJuri1 : '-'}</td>
            <td>${hasData ? breakdown.totalJuri2 : '-'}</td>
            <td>${hasData ? breakdown.totalJuri3 : '-'}</td>
            <td><span style="color: #ef4444; font-weight: 700;">${hasData ? `-${breakdown.penalty}` : '-'}</span></td>
            <td>${totalDisplay}</td>
            <td>${this.renderKetCell(item)}</td>
            <td style="text-align: right;">
              ${this.renderActionButton(team.id, scoreObj)}
            </td>
          </tr>
        `;
      }
      case 'lkbb': {
        const s = scoreObj || {};
        const breakdown = window.Calculators.calculateLKBB(s);
        const schoolName = item.pangkalan || team.pangkalan || team.name;
        const levelUpper = (item.levelLabel || item.level || 'SD').toUpperCase();
        const badgeClass = levelUpper.includes('SD') ? 'badge-sd-pa' : levelUpper.includes('SMP') ? 'badge-smp-pa' : 'badge-penegak-pa';
        return `
          <tr>
            <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
            <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
            <td><strong style="color: #fff; font-size: 0.92rem;">${schoolName}</strong><br><span style="font-size: 0.72rem; color: #10b981; font-weight: 600;">(${item.reguCount || 2} Regu Terdaftar)</span></td>
            <td><span class="badge ${badgeClass}">${levelUpper}</span></td>
            <td>${hasData ? breakdown.totalDp : '-'}</td>
            <td>${hasData ? breakdown.totalPbb : '-'}</td>
            <td>${hasData ? breakdown.totalVariasi : '-'}</td>
            <td>${hasData ? breakdown.totalDanton : '-'}</td>
            <td>${totalDisplay}</td>
            <td>${this.renderKetCell(item)}</td>
            <td style="text-align: right;">
              ${this.renderActionButton(team.id, scoreObj)}
            </td>
          </tr>
        `;
      }
      default: {
        const s = scoreObj || {};
        const cObj = COMPETITIONS.find(c => c.id === this.currentLomba);
        const catObj = CATEGORIES.find(c => c.id === team.category);
        if (cObj && cObj.type === 'dual') {
          return `
            <tr>
              <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
              <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
              <td><strong style="color: #fff;">${team.name}</strong><br><span style="font-size: 0.72rem; color: #94a3b8;">${team.pangkalan}</span></td>
              <td><span class="badge ${catObj?.badgeClass}">${catObj?.short || '-'}</span></td>
              <td>${hasData ? (s.teori ?? 0) : '-'}</td>
              <td>${hasData ? (s.praktek ?? 0) : '-'}</td>
              <td>${totalDisplay}</td>
              <td>${this.renderKetCell(item)}</td>
              <td style="text-align: right;">
                ${this.renderActionButton(team.id, scoreObj)}
              </td>
            </tr>
          `;
        }
        return `
          <tr>
            <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
            <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
            <td><strong style="color: #fff;">${team.name}</strong><br><span style="font-size: 0.72rem; color: #94a3b8;">${team.pangkalan}</span></td>
            <td><span class="badge ${catObj?.badgeClass}">${catObj?.short || '-'}</span></td>
            <td>${hasData ? (s.score ?? 0) : '-'}</td>
            <td>${totalDisplay}</td>
            <td>${this.renderKetCell(item)}</td>
            <td style="text-align: right;">
              ${this.renderActionButton(team.id, scoreObj)}
            </td>
          </tr>
        `;
      }
    }
  },

  openInputModal(teamId) {
    this.closeModal();

    const team = window.dataStore.getTeamById(teamId) || { id: teamId, name: teamId, pangkalan: teamId };
    const existingScore = window.dataStore.getScoresForLomba(this.currentLomba)[teamId] || {};
    const compObj = COMPETITIONS.find(c => c.id === this.currentLomba);
    const isSchoolComp = (this.currentLomba === 'joged_komando' || this.currentLomba === 'lkbb');
    const schoolName = team.pangkalan || team.name;
    const headerTitle = isSchoolComp ? `Sekolah / Pangkalan: ${schoolName}` : `${team.name} (${team.pangkalan})`;

    let formBody = '';

    if (this.currentLomba === 'administrasi') {
      formBody = `
        <div class="form-grid">
          <div class="form-group"><label>Format Pendaftaran</label><input type="number" id="s-pendaftaran" class="form-control" value="${existingScore.pendaftaran ?? 0}" min="0" max="100"/></div>
          <div class="form-group"><label>Surat Pernyataan</label><input type="number" id="s-pernyataan" class="form-control" value="${existingScore.pernyataan ?? 0}" min="0" max="100"/></div>
          <div class="form-group"><label>Kartu Tanda Anggota (KTA)</label><input type="number" id="s-kta" class="form-control" value="${existingScore.kta ?? 0}" min="0" max="100"/></div>
          <div class="form-group"><label>Kwitansi Pembayaran</label><input type="number" id="s-kwitansi" class="form-control" value="${existingScore.kwitansi ?? 0}" min="0" max="100"/></div>
          <div class="form-group"><label>Surat Mandat</label><input type="number" id="s-mandat" class="form-control" value="${existingScore.mandat ?? 0}" min="0" max="100"/></div>
          <div class="form-group"><label>Surat Ijin Orang Tua</label><input type="number" id="s-ijin" class="form-control" value="${existingScore.ijin ?? 0}" min="0" max="100"/></div>
          <div class="form-group"><label>Kartu Asuransi</label><input type="number" id="s-asuransi" class="form-control" value="${existingScore.asuransi ?? 0}" min="0" max="100"/></div>
          <div class="form-group"><label>Bumbung Kemanusiaan</label><input type="number" id="s-bumbung" class="form-control" value="${existingScore.bumbung ?? 0}" min="0" max="100"/></div>
        </div>
      `;
    } else if (this.currentLomba === 'p3k') {
      formBody = `
        <div class="form-grid">
          <div class="form-group"><label>Nilai Teori P3K</label><input type="number" id="s-teori" class="form-control" value="${existingScore.teori ?? 0}" min="0" max="100"/></div>
          <div class="form-group"><label>Nilai Praktek P3K</label><input type="number" id="s-praktek" class="form-control" value="${existingScore.praktek ?? 0}" min="0" max="100"/></div>
        </div>
      `;
    } else if (this.currentLomba === 'joged_komando') {
      const j1 = existingScore.juri1 || {};
      const j2 = existingScore.juri2 || {};
      const j3 = existingScore.juri3 || {};
      const basisIdVal = existingScore.basisId || team.id || '';

      formBody = `
        <div class="form-group" style="margin-bottom: 0.75rem; background: rgba(16, 185, 129, 0.08); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
          <label style="color: #10b981; font-weight: 700; font-size: 0.82rem;">ID BASIS (Nomor / Kode Basis Sekolah)</label>
          <input type="text" id="s-basis-id" class="form-control" value="${basisIdVal}" placeholder="Contoh: BASIS-01 / SCH-SD-01"/>
          <span style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem; display: block;">ID Basis ini dapat disesuaikan dan akan muncul di seluruh rekapitulasi.</span>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 10px; margin-bottom: 0.75rem;">
          <div style="font-weight: 800; color: var(--neon-cyan); margin-bottom: 0.35rem; font-size: 0.8rem;">Penilaian Juri 1</div>
          <div class="form-grid">
            <div class="form-group"><label>Kreativitas Gerakan</label><input type="number" id="j1-kreativitas" class="form-control" value="${j1.kreativitas ?? 0}"/></div>
            <div class="form-group"><label>Kekompakkan Gerakan</label><input type="number" id="j1-kekompakkan" class="form-control" value="${j1.kekompakkan ?? 0}"/></div>
            <div class="form-group"><label>Keselarasan Musik</label><input type="number" id="j1-musik" class="form-control" value="${j1.musik ?? 0}"/></div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 10px; margin-bottom: 0.75rem;">
          <div style="font-weight: 800; color: var(--neon-cyan); margin-bottom: 0.35rem; font-size: 0.8rem;">Penilaian Juri 2</div>
          <div class="form-grid">
            <div class="form-group"><label>Kreativitas Gerakan</label><input type="number" id="j2-kreativitas" class="form-control" value="${j2.kreativitas ?? 0}"/></div>
            <div class="form-group"><label>Kekompakkan Gerakan</label><input type="number" id="j2-kekompakkan" class="form-control" value="${j2.kekompakkan ?? 0}"/></div>
            <div class="form-group"><label>Keselarasan Musik</label><input type="number" id="j2-musik" class="form-control" value="${j2.musik ?? 0}"/></div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 10px; margin-bottom: 0.75rem;">
          <div style="font-weight: 800; color: var(--neon-cyan); margin-bottom: 0.35rem; font-size: 0.8rem;">Penilaian Juri 3</div>
          <div class="form-grid">
            <div class="form-group"><label>Kreativitas Gerakan</label><input type="number" id="j3-kreativitas" class="form-control" value="${j3.kreativitas ?? 0}"/></div>
            <div class="form-group"><label>Kekompakkan Gerakan</label><input type="number" id="j3-kekompakkan" class="form-control" value="${j3.kekompakkan ?? 0}"/></div>
            <div class="form-group"><label>Keselarasan Musik</label><input type="number" id="j3-musik" class="form-control" value="${j3.musik ?? 0}"/></div>
          </div>
        </div>

        <div class="form-group" style="margin-top: 0.75rem;">
          <label style="color: #ef4444; font-weight: 700;">Pengurangan Nilai / Penalty (Jumlah Peserta Kurang Ketentuan)</label>
          <input type="number" id="s-penalty" class="form-control" value="${existingScore.penalty ?? 0}" min="0"/>
        </div>
      `;
    } else if (this.currentLomba === 'lkbb') {
      const pbb = existingScore.pbbDasar || {};
      const vf = existingScore.variasi || {};
      const dt = existingScore.danton || {};
      const basisIdVal = existingScore.basisId || team.id || '';

      formBody = `
        <div class="form-group" style="margin-bottom: 0.75rem; background: rgba(16, 185, 129, 0.08); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
          <label style="color: #10b981; font-weight: 700; font-size: 0.82rem;">ID BASIS (Nomor / Kode Basis Sekolah)</label>
          <input type="text" id="s-basis-id" class="form-control" value="${basisIdVal}" placeholder="Contoh: BASIS-01 / SCH-SD-01"/>
          <span style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem; display: block;">ID Basis ini dapat disesuaikan dan akan muncul di seluruh rekapitulasi.</span>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 10px; margin-bottom: 0.75rem;">
          <div style="font-weight: 800; color: var(--neon-cyan); margin-bottom: 0.35rem; font-size: 0.8rem;">Penilaian DP (Danpas)</div>
          <div class="form-group">
            <label>Nilai DP (Satu Penilaian)</label>
            <input type="number" id="s-dp" class="form-control" value="${typeof existingScore.dp === 'number' ? existingScore.dp : (existingScore.dp?.juri1 ?? 0)}" min="0"/>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 10px; margin-bottom: 0.75rem;">
          <div style="font-weight: 800; color: var(--neon-cyan); margin-bottom: 0.35rem; font-size: 0.8rem;">Penilaian PBB Dasar</div>
          <div class="form-grid">
            <div class="form-group"><label>Nilai Juri 1</label><input type="number" id="pbb-j1" class="form-control" value="${pbb.juri1 ?? 0}"/></div>
            <div class="form-group"><label>Nilai Juri 2</label><input type="number" id="pbb-j2" class="form-control" value="${pbb.juri2 ?? 0}"/></div>
            <div class="form-group"><label>Nilai Juri 3</label><input type="number" id="pbb-j3" class="form-control" value="${pbb.j3 ?? 0}"/></div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 10px; margin-bottom: 0.75rem;">
          <div style="font-weight: 800; color: var(--neon-cyan); margin-bottom: 0.35rem; font-size: 0.8rem;">Penilaian Variasi Formasi</div>
          <div class="form-grid">
            <div class="form-group"><label>Nilai Juri 1</label><input type="number" id="vf-j1" class="form-control" value="${vf.juri1 ?? 0}"/></div>
            <div class="form-group"><label>Nilai Juri 2</label><input type="number" id="vf-j2" class="form-control" value="${vf.juri2 ?? 0}"/></div>
            <div class="form-group"><label>Nilai Juri 3</label><input type="number" id="vf-j3" class="form-control" value="${vf.juri3 ?? 0}"/></div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 10px; margin-bottom: 0.75rem;">
          <div style="font-weight: 800; color: var(--neon-cyan); margin-bottom: 0.35rem; font-size: 0.8rem;">Penilaian Danton</div>
          <div class="form-grid">
            <div class="form-group"><label>Nilai Juri 1</label><input type="number" id="dt-j1" class="form-control" value="${dt.juri1 ?? 0}"/></div>
            <div class="form-group"><label>Nilai Juri 2</label><input type="number" id="dt-j2" class="form-control" value="${dt.juri2 ?? 0}"/></div>
            <div class="form-group"><label>Nilai Juri 3</label><input type="number" id="dt-j3" class="form-control" value="${dt.juri3 ?? 0}"/></div>
          </div>
        </div>
      `;
    } else {
      // Single Score or Custom Dual Score Competitions
      const cObj = COMPETITIONS.find(c => c.id === this.currentLomba);
      if (cObj && cObj.type === 'dual') {
        formBody = `
          <div class="form-grid">
            <div class="form-group"><label>Nilai Teori (${cObj.name})</label><input type="number" id="s-teori" class="form-control" value="${existingScore.teori ?? 0}" min="0" max="100"/></div>
            <div class="form-group"><label>Nilai Praktek (${cObj.name})</label><input type="number" id="s-praktek" class="form-control" value="${existingScore.praktek ?? 0}" min="0" max="100"/></div>
          </div>
        `;
      } else {
        formBody = `
          <div class="form-group">
            <label>Nilai Utama ${cObj ? cObj.name : 'Lomba'}</label>
            <input type="number" id="s-single-score" class="form-control" value="${existingScore.score ?? 0}" min="0" max="100"/>
          </div>
        `;
      }
    }

    const modalHTML = `
      <div class="modal-overlay open" id="score-input-modal" onclick="if(event.target === this) ScoringComponent.closeModal()">
        <div class="modal-container">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Input Nilai: ${compObj ? compObj.name : this.currentLomba}</h3>
              <p style="font-size: 0.8rem; color: var(--neon-cyan); font-weight: 700; margin-top: 0.15rem;">${headerTitle}</p>
            </div>
            <button class="btn-outline" type="button" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="ScoringComponent.closeModal()">✕</button>
          </div>
          <form onsubmit="ScoringComponent.saveScore(event, '${team.id}')">
            ${formBody}
            <div class="form-group" style="margin-top: 0.75rem;">
              <label>Catatan / Keterangan Juri</label>
              <input type="text" id="s-keterangan" class="form-control" value="${existingScore.ket || ''}" placeholder="Contoh: Sangat rapi & tepat waktu"/>
            </div>
            <div class="modal-footer" style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
              <button type="button" class="btn-outline" onclick="ScoringComponent.closeModal()">Batal</button>
              <button type="submit" class="btn-yellow-pill">Hitung & Simpan Nilai</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const escListener = (evt) => {
      if (evt.key === 'Escape') {
        ScoringComponent.closeModal();
        document.removeEventListener('keydown', escListener);
      }
    };
    document.addEventListener('keydown', escListener);

    lucide.createIcons();
  },

  closeModal() {
    document.querySelectorAll('#score-input-modal, #score-finalcheck-modal, #add-lomba-modal').forEach(el => el.remove());
  },

  saveScore(e, teamId) {
    e.preventDefault();
    const form = e.target;

    const getVal = (id) => {
      const field = form.querySelector('#' + id);
      return field ? (Number(field.value) || 0) : 0;
    };
    const getStr = (id) => {
      const field = form.querySelector('#' + id);
      return field ? (field.value || '').trim() : '';
    };

    const ket = getStr('s-keterangan');
    let scoreObj = { ket };

    if (this.currentLomba === 'administrasi') {
      scoreObj.pendaftaran = getVal('s-pendaftaran');
      scoreObj.pernyataan = getVal('s-pernyataan');
      scoreObj.kta = getVal('s-kta');
      scoreObj.kwitansi = getVal('s-kwitansi');
      scoreObj.mandat = getVal('s-mandat');
      scoreObj.ijin = getVal('s-ijin');
      scoreObj.asuransi = getVal('s-asuransi');
      scoreObj.bumbung = getVal('s-bumbung');
    } else if (this.currentLomba === 'p3k') {
      scoreObj.teori = getVal('s-teori');
      scoreObj.praktek = getVal('s-praktek');
    } else if (this.currentLomba === 'joged_komando') {
      scoreObj.juri1 = {
        kreativitas: getVal('j1-kreativitas'),
        kekompakkan: getVal('j1-kekompakkan'),
        musik: getVal('j1-musik')
      };
      scoreObj.juri2 = {
        kreativitas: getVal('j2-kreativitas'),
        kekompakkan: getVal('j2-kekompakkan'),
        musik: getVal('j2-musik')
      };
      scoreObj.juri3 = {
        kreativitas: getVal('j3-kreativitas'),
        kekompakkan: getVal('j3-kekompakkan'),
        musik: getVal('j3-musik')
      };
      scoreObj.penalty = getVal('s-penalty');
    } else if (this.currentLomba === 'lkbb') {
      scoreObj.dp = getVal('s-dp');
      scoreObj.pbbDasar = {
        juri1: getVal('pbb-j1'),
        juri2: getVal('pbb-j2'),
        juri3: getVal('pbb-j3')
      };
      scoreObj.variasi = {
        juri1: getVal('vf-j1'),
        juri2: getVal('vf-j2'),
        juri3: getVal('vf-j3')
      };
      scoreObj.danton = {
        juri1: getVal('dt-j1'),
        juri2: getVal('dt-j2'),
        juri3: getVal('dt-j3')
      };
    } else {
      const cObj = COMPETITIONS.find(c => c.id === this.currentLomba);
      if (cObj && cObj.type === 'dual') {
        scoreObj.teori = getVal('s-teori');
        scoreObj.praktek = getVal('s-praktek');
      } else {
        scoreObj.score = getVal('s-single-score');
      }
    }

    if (this.currentLomba === 'joged_komando' || this.currentLomba === 'lkbb') {
      const customBasisId = getStr('s-basis-id');
      if (customBasisId) {
        scoreObj.basisId = customBasisId;
      }
    }

    // Run Smart Validation Engine
    const validationResult = window.SmartValidator 
      ? window.SmartValidator.validate(this.currentLomba, scoreObj) 
      : { valid: true, errors: [], warnings: [], summary: {} };

    if (!validationResult.valid) {
      alert('❌ GAGAL SIMPAN NILAI:\n' + validationResult.errors.join('\n'));
      return;
    }

    // Open Smart Validation & Final Check Verification Modal
    this.openFinalCheckModal(teamId, scoreObj, validationResult);
  },

  openFinalCheckModal(teamId, scoreObj, validationResult) {
    this.closeModal();

    const team = window.dataStore.getTeamById(teamId) || { id: teamId, name: teamId, pangkalan: teamId };
    const compObj = COMPETITIONS.find(c => c.id === this.currentLomba);
    const totalScore = window.Calculators.getCompetitionTotalScore(this.currentLomba, scoreObj);
    const securityHash = window.SecurityEngine ? window.SecurityEngine.generateChecksum(scoreObj) : 'SEC-VERIFIED';

    const warningsHTML = validationResult.warnings.length > 0
      ? `<div class="final-check-warning-box">
          <strong style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.25rem;">
            <i data-lucide="alert-triangle" style="width: 16px; height: 16px; color: #fbbf24;"></i> PERATIAN / CAUTION:
          </strong>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.76rem;">
            ${validationResult.warnings.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>`
      : '';

    const modalHTML = `
      <div class="modal-overlay open" id="score-finalcheck-modal">
        <div class="modal-container" style="max-width: 520px;">
          <div class="modal-header" style="border-bottom: 1px solid var(--neon-cyan); padding-bottom: 0.75rem;">
            <div>
              <h3 class="modal-title" style="display: flex; align-items: center; gap: 0.4rem; color: var(--neon-cyan);">
                <i data-lucide="shield-check"></i> FINAL CHECK & VERIFIKASI SEKURITAS
              </h3>
              <p style="font-size: 0.76rem; color: #94a3b8; margin-top: 0.2rem;">
                Pastikan data penilaian di bawah ini telah diverifikasi oleh Dewan Juri sebelum disalin ke database.
              </p>
            </div>
            <button class="btn-outline" type="button" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="ScoringComponent.closeModal()">✕</button>
          </div>

          <div style="padding: 1rem 0;">
            <div style="background: rgba(0, 245, 212, 0.05); border: 1px dashed var(--neon-cyan); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem;">
                <span style="color: #94a3b8;">Peserta / Pangkalan:</span>
                <strong style="color: #ffffff;">${team.name} (${team.pangkalan || '-'})</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem;">
                <span style="color: #94a3b8;">Mata Lomba:</span>
                <strong style="color: var(--neon-yellow);">${compObj?.name || this.currentLomba}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 900; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem; margin-top: 0.5rem;">
                <span style="color: #ffffff;">AKUMULASI SKOR TOTAL:</span>
                <span style="color: var(--neon-cyan); font-family: 'Poppins', sans-serif;">${totalScore} POIN</span>
              </div>
            </div>

            ${warningsHTML}

            <div style="background: rgba(0, 0, 0, 0.3); padding: 0.6rem 0.85rem; border-radius: 8px; font-size: 0.7rem; color: #64748b; font-family: monospace; display: flex; justify-content: space-between; align-items: center;">
              <span>DIGITAL SIGNATURE HASH:</span>
              <span style="color: #34d399; font-weight: 700;">${securityHash}</span>
            </div>
          </div>

          <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn-outline" onclick="ScoringComponent.openInputModal('${teamId}')">
              ← Periksa / Edit Lagi
            </button>
            <button type="button" class="btn-yellow-pill" style="font-weight: 900;" id="btn-commit-final-score">
              🛡️ Konfirmasi & Simpan Final
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('btn-commit-final-score').onclick = () => {
      this.commitFinalScore(teamId, scoreObj);
    };

    lucide.createIcons();
  },

  commitFinalScore(teamId, scoreObj) {
    // If browser is offline, queue in SecurityEngine
    if (!navigator.onLine && window.SecurityEngine) {
      window.SecurityEngine.queueOfflineScoreSave(this.currentLomba, teamId, scoreObj);
    }

    // Save to dataStore
    window.dataStore.saveScore(this.currentLomba, teamId, scoreObj);

    // Update security signature
    if (window.SecurityEngine) {
      window.SecurityEngine.updateDataSignature();
      window.SecurityEngine.showSecurityToast('🛡️ Skor berhasil diverifikasi & disimpan dengan enkripsi data.');
    }

    this.closeModal();
    this.render(document.getElementById('app-main-content'));
  },

  exportToExcel() {
    const activeCat = window.currentCategoryFilter || 'all';
    const leaderboard = window.Calculators.getLombaLeaderboard(this.currentLomba, activeCat);
    const currentCompObj = COMPETITIONS.find(c => c.id === this.currentLomba);
    const isSchoolComp = (this.currentLomba === 'joged_komando' || this.currentLomba === 'lkbb');
    
    let categoryLabel = 'Semua Kategori';
    if (isSchoolComp) {
      if (activeCat === 'sd' || activeCat === 'sd_pa' || activeCat === 'sd_pi') categoryLabel = 'Tingkat SD';
      else if (activeCat === 'smp' || activeCat === 'smp_pa' || activeCat === 'smp_pi') categoryLabel = 'Tingkat SMP';
      else if (activeCat === 'penegak' || activeCat === 'penegak_pa' || activeCat === 'penegak_pi') categoryLabel = 'Tingkat PENEGAK';
      else categoryLabel = 'Semua Kategori (SD, SMP, PENEGAK)';
    } else {
      categoryLabel = CATEGORIES.find(c => c.id === activeCat)?.label || 'Semua Kategori';
    }

    const compName = currentCompObj?.name || 'Rekap Nilai Lomba';
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let headers = [];
    let getRowData = null;

    switch (this.currentLomba) {
      case 'administrasi':
        headers = ['Peringkat', 'ID Regu', 'Nama Regu / Sangga', 'Pangkalan / Sekolah', 'Pendaftaran', 'Pernyataan', 'KTA', 'Kwitansi', 'Mandat', 'Ijin', 'Asuransi', 'Bumbung', 'Total Skor', 'Keterangan'];
        getRowData = (item) => {
          const s = item.scoreObj || {};
          return [
            item.rank === 1 ? '👑 Juara 1' : item.rank === 2 ? '🥈 Juara 2' : item.rank === 3 ? '🥉 Juara 3' : `Rank ${item.rank}`,
            item.team.id || '-',
            item.team.name,
            item.team.pangkalan,
            s.pendaftaran || 0,
            s.pernyataan || 0,
            s.kta || 0,
            s.kwitansi || 0,
            s.mandat || 0,
            s.ijin || 0,
            s.asuransi || 0,
            s.bumbung || 0,
            item.totalScore,
            item.displayKet || s.ket || '-'
          ];
        };
        break;

      case 'lkbb':
        headers = ['Peringkat', 'ID Basis', 'Sekolah / Pangkalan', 'Tingkat Kategori', 'Nilai DP', 'PBB Dasar (Total)', 'Variasi Formasi (Total)', 'Danton (Total)', 'Total Overall LKBB', 'Keterangan'];
        getRowData = (item) => {
          const s = item.scoreObj || {};
          const b = window.Calculators.calculateLKBB(s);
          const reguIdCode = s.basisId || item.basisId || item.schoolId || item.team.id || '-';
          return [
            item.rank === 1 ? '👑 Juara 1' : item.rank === 2 ? '🥈 Juara 2' : item.rank === 3 ? '🥉 Juara 3' : `Rank ${item.rank}`,
            reguIdCode,
            item.pangkalan || item.team.pangkalan || item.team.name,
            (item.levelLabel || item.level || 'SD').toUpperCase(),
            b.totalDp,
            b.totalPbb,
            b.totalVariasi,
            b.totalDanton,
            item.totalScore,
            item.displayKet || s.ket || '-'
          ];
        };
        break;

      case 'joged_komando':
        headers = ['Peringkat', 'ID Basis', 'Sekolah / Pangkalan', 'Tingkat Kategori', 'Juri 1 Total', 'Juri 2 Total', 'Juri 3 Total', 'Penalty (Pengurangan)', 'Total Akhir', 'Keterangan'];
        getRowData = (item) => {
          const s = item.scoreObj || {};
          const b = window.Calculators.calculateJogedKomando(s);
          const reguIdCode = s.basisId || item.basisId || item.schoolId || item.team.id || '-';
          return [
            item.rank === 1 ? '👑 Juara 1' : item.rank === 2 ? '🥈 Juara 2' : item.rank === 3 ? '🥉 Juara 3' : `Rank ${item.rank}`,
            reguIdCode,
            item.pangkalan || item.team.pangkalan || item.team.name,
            (item.levelLabel || item.level || 'SD').toUpperCase(),
            b.totalJuri1,
            b.totalJuri2,
            b.totalJuri3,
            b.penalty ? `-${b.penalty}` : 0,
            item.totalScore,
            item.displayKet || s.ket || '-'
          ];
        };
        break;

      case 'p3k':
        headers = ['Peringkat', 'ID Regu', 'Nama Regu / Sangga', 'Pangkalan / Sekolah', 'Nilai Teori P3K', 'Nilai Praktek P3K', 'Total Skor', 'Keterangan'];
        getRowData = (item) => {
          const s = item.scoreObj || {};
          return [
            item.rank === 1 ? '👑 Juara 1' : item.rank === 2 ? '🥈 Juara 2' : item.rank === 3 ? '🥉 Juara 3' : `Rank ${item.rank}`,
            item.team.id || '-',
            item.team.name,
            item.team.pangkalan,
            s.teori || 0,
            s.praktek || 0,
            item.totalScore,
            item.displayKet || s.ket || '-'
          ];
        };
        break;

      default:
        headers = ['Peringkat', 'ID Regu', 'Nama Regu / Sangga', 'Pangkalan / Sekolah', 'Kategori', 'Nilai Utama', 'Total Skor', 'Keterangan'];
        getRowData = (item) => {
          const s = item.scoreObj || {};
          const cat = CATEGORIES.find(c => c.id === item.team.category);
          return [
            item.rank === 1 ? '👑 Juara 1' : item.rank === 2 ? '🥈 Juara 2' : item.rank === 3 ? '🥉 Juara 3' : `Rank ${item.rank}`,
            item.team.name,
            item.team.pangkalan,
            cat?.short || item.team.category,
            s.score || 0,
            item.totalScore,
            item.displayKet || s.ket || '-'
          ];
        };
        break;
    }

    const totalCols = headers.length;

    let htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${compName.replace(/[^\w\s]/gi, '')}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; }
          .kop-title { font-size: 14pt; font-weight: bold; text-align: center; margin: 0; padding: 4px; color: #0f172a; }
          .kop-sub { font-size: 12pt; font-weight: bold; text-align: center; margin: 0; padding: 2px; color: #0284c7; }
          .kop-meta { font-size: 10pt; text-align: center; margin-bottom: 15px; color: #475569; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th { background-color: #0f172a; color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #334155; padding: 10px 12px; font-size: 11pt; }
          td { border: 1px solid #cbd5e1; padding: 8px 10px; vertical-align: middle; font-size: 10pt; }
          tr:nth-child(even) { background-color: #f8fafc; }
          tr:nth-child(odd) { background-color: #ffffff; }
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .rank-1 { background-color: #fef3c7 !important; font-weight: bold; color: #b45309; text-align: center; }
          .rank-2 { background-color: #f1f5f9 !important; font-weight: bold; color: #475569; text-align: center; }
          .rank-3 { background-color: #ffedd5 !important; font-weight: bold; color: #c2410c; text-align: center; }
          .score-col { font-weight: bold; color: #0369a1; background-color: #e0f2fe !important; text-align: center; border: 1px solid #7dd3fc; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="${totalCols}" class="kop-title">GERAKAN PRAMUKA KWARTIR CABANG</td></tr>
          <tr><td colspan="${totalCols}" class="kop-sub">PANITIA REKAPITULASI LOMBA PRAMUKA JUARA "SIMIKA"</td></tr>
          <tr><td colspan="${totalCols}" class="kop-title" style="font-size: 13pt; text-decoration: underline; padding-top: 8px;">LAPORAN HASIL REKAPITULASI ${compName.toUpperCase()}</td></tr>
          <tr><td colspan="${totalCols}" class="kop-meta">Kategori: <strong>${categoryLabel}</strong> | Tanggal Ekspor: ${dateStr}</td></tr>
          <tr><td colspan="${totalCols}" style="height: 10px; border: none;"></td></tr>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${leaderboard.length === 0 ? `
              <tr><td colspan="${totalCols}" style="text-align: center; color: #94a3b8; padding: 20px;">Belum ada data peserta terdaftar untuk kategori ini.</td></tr>
            ` : leaderboard.map(item => {
              const row = getRowData(item);
              const rankClass = item.rank === 1 ? 'rank-1' : item.rank === 2 ? 'rank-2' : item.rank === 3 ? 'rank-3' : 'text-center';
              
              return `
                <tr>
                  ${row.map((val, idx) => {
                    if (idx === 0) {
                      return `<td class="${rankClass}">${val}</td>`;
                    } else if (idx === 1 || idx === 2) {
                      return `<td class="text-left" style="font-weight: ${idx === 1 ? 'bold' : 'normal'};">${val}</td>`;
                    } else if (idx === row.length - 2) {
                      return `<td class="score-col">${val}</td>`;
                    } else if (idx === row.length - 1) {
                      return `<td class="text-left" style="color: #64748b;">${val}</td>`;
                    } else {
                      return `<td class="text-center">${val}</td>`;
                    }
                  }).join('')}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <br><br>
        <table>
          <tr>
            <td colspan="${Math.floor(totalCols / 2)}" style="border:none;" class="text-center">
              Ketua Dewan Juri,<br><br><br><br>
              <strong>( Kak Ir. H. Supriyadi, M.Pd )</strong><br>
              <span style="font-size: 8pt; color: #64748b;">NTA. 12.01.002.88</span>
            </td>
            <td colspan="${Math.ceil(totalCols / 2)}" style="border:none;" class="text-center">
              Ketua Panitia Pelaksana,<br><br><br><br>
              <strong>( Kak Dr. Ahmad Fauzi, M.Si )</strong><br>
              <span style="font-size: 8pt; color: #64748b;">NTA. 12.01.001.04</span>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const cleanCompName = compName.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanCat = activeCat.toUpperCase();
    const fileName = `Rekap_${cleanCompName}_${cleanCat}.xls`;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  openAddLombaModal() {
    this.closeModal();

    const modalHTML = `
      <div class="modal-overlay open" id="add-lomba-modal" onclick="if(event.target === this) ScoringComponent.closeModal()">
        <div class="modal-container" style="max-width: 520px;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title" style="display: flex; align-items: center; gap: 0.5rem; color: #fff;">
                <i data-lucide="plus-circle" style="color: var(--neon-cyan);"></i> TAMBAH JENIS LOMBA BARU
              </h3>
              <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.15rem;">Tambah mata lomba baru ke dalam sistem rekapitulasi SiMika</p>
            </div>
            <button class="btn-outline" type="button" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="ScoringComponent.closeModal()">✕</button>
          </div>
          <form onsubmit="ScoringComponent.saveNewLomba(event)">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; color: #fff;">Nama Jenis Lomba <span style="color: #ef4444;">*</span></label>
              <input type="text" id="nl-name" class="form-control" placeholder="Contoh: Lomba Hasta Karya / Lomba Pidato" required />
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; color: #fff;">Skema / Format Penilaian</label>
              <select id="nl-type" class="form-control">
                <option value="single">Skor Tunggal / Single Score (0 - 100 Pts)</option>
                <option value="dual">Skor Ganda (Nilai Teori + Nilai Praktek)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label style="font-weight: 700; color: #fff;">Pilih Ikon Mata Lomba</label>
              <select id="nl-icon" class="form-control">
                <option value="trophy">🏆 Trophy / Piala</option>
                <option value="award">🥇 Award / Medali</option>
                <option value="star">⭐ Star / Bintang</option>
                <option value="shield">🛡️ Shield / Perisai</option>
                <option value="flag">🚩 Flag / Bendera</option>
                <option value="zap">⚡ Zap / Ketangkasan</option>
                <option value="heart-pulse">❤️ Heart / P3K</option>
                <option value="compass">🧭 Compass / Pioneering</option>
                <option value="key">🔑 Key / Sandi</option>
                <option value="radio">📻 Radio / Morse</option>
                <option value="file-text">📄 File / Administrasi</option>
                <option value="music">🎵 Music / Joged</option>
                <option value="palette">🎨 Palette / Arts</option>
                <option value="box">📦 Box / Hasta Karya</option>
                <option value="target">🎯 Target / Ketepatan</option>
                <option value="sparkles">✨ Sparkles / Spesial</option>
              </select>
            </div>

            <div class="modal-footer" style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
              <button type="button" class="btn-outline" onclick="ScoringComponent.closeModal()">Batal</button>
              <button type="submit" class="btn-yellow-pill" style="background: linear-gradient(135deg, #00f5d4, #0284c7); color: #090d16; font-weight: 900; border: none; padding: 0.6rem 1.2rem; border-radius: 999px; cursor: pointer;">
                Simpan Jenis Lomba
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
  },

  saveNewLomba(e) {
    e.preventDefault();
    const nameInput = document.getElementById('nl-name');
    const typeInput = document.getElementById('nl-type');
    const iconInput = document.getElementById('nl-icon');

    if (!nameInput || !nameInput.value.trim()) return;

    const name = nameInput.value.trim();
    const type = typeInput ? typeInput.value : 'single';
    const icon = iconInput ? iconInput.value : 'trophy';

    const newComp = window.dataStore.addCompetition({ name, type, icon });
    this.closeModal();
    this.currentLomba = newComp.id;
    this.render(document.getElementById('app-main-content'));

    if (window.SecurityEngine) {
      window.SecurityEngine.showWatermarkToast(`🏆 Jenis Lomba "${newComp.name}" Berhasil Ditambahkan!`);
    }
  },

  toggleLock(evt) {
    if (evt) {
      if (typeof evt.preventDefault === 'function') evt.preventDefault();
      if (typeof evt.stopPropagation === 'function') evt.stopPropagation();
    }
    const isLocked = window.dataStore.toggleCompetitionsLock();
    if (window.SecurityEngine) {
      window.SecurityEngine.showWatermarkToast(isLocked ? '🔒 Daftar Jenis Lomba Terkunci (Mode Aman)' : '🔓 Kunci Terbuka (Mode Hapus Active)');
    }
    const container = document.getElementById('app-main-content');
    if (container) {
      this.render(container);
    }
  },

  moveLomba(fromIdx, toIdx) {
    window.dataStore.moveCompetition(fromIdx, toIdx);
    this.render(document.getElementById('app-main-content'));
  },

  handleDragStart(evt, index) {
    evt.dataTransfer.setData('text/plain', String(index));
    evt.dataTransfer.effectAllowed = 'move';
  },

  handleDragOver(evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  },

  handleDrop(evt, toIndex) {
    evt.preventDefault();
    const fromIndex = parseInt(evt.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      this.moveLomba(fromIndex, toIndex);
    }
  },

  confirmDeleteLomba(lombaId, name) {
    if (window.dataStore.isCompetitionsLocked) {
      alert('🔒 Daftar jenis lomba sedang TERKUNCI.\nSilakan klik tombol "🔒 DAFTAR LOMBA TERKUNCI" untuk membuka kunci sebelum menghapus.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus jenis lomba "${name}"?\nSemua data nilai lomba ini akan terhapus.`)) {
      window.dataStore.deleteCompetition(lombaId);
      const firstComp = window.dataStore.competitions[0];
      this.currentLomba = firstComp ? firstComp.id : 'administrasi';
      this.render(document.getElementById('app-main-content'));
    }
  }
};

window.ScoringComponent = ScoringComponent;
