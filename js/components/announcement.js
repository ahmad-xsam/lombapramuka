/* ==========================================================================
   SiMika - Announcement & Master Championship Recap Component
   - Clean, Minimalist UI without Content Button Icons
   - All Bahasa Indonesia UI
   ========================================================================== */

const AnnouncementComponent = {
  render(container) {
    if (!container) return;

    const activeCat = window.currentCategoryFilter || 'all';
    const catObj = CATEGORIES.find(c => c.id === activeCat);
    const catLabel = catObj ? catObj.label : 'Semua Kategori (SD, SMP, & Penegak)';

    const allTeams = window.dataStore.getTeams(activeCat);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">
            Pengumuman Rekap Kejuaraan Lomba
          </h1>
          <p class="page-subtitle">Daftar Rekap Hasil Kejuaraan Seluruh Mata Bidang Lomba Pramuka SiMika</p>
        </div>
        <button class="btn-yellow-pill" onclick="AnnouncementComponent.exportToExcel()">
          Ekspor Excel Pengumuman
        </button>
      </div>

      <!-- Filter Kategori Tabs -->
      <div class="category-filter-bar">
        <button class="filter-tab-btn ${activeCat === 'all' ? 'active' : ''}" onclick="AnnouncementComponent.setFilter('all')">
          SEMUA KATEGORI
        </button>
        <button class="filter-tab-btn ${activeCat === 'sd_pa' ? 'active' : ''}" onclick="AnnouncementComponent.setFilter('sd_pa')">
          SD PUTRA
        </button>
        <button class="filter-tab-btn ${activeCat === 'sd_pi' ? 'active' : ''}" onclick="AnnouncementComponent.setFilter('sd_pi')">
          SD PUTRI
        </button>
        <button class="filter-tab-btn ${activeCat === 'smp_pa' ? 'active' : ''}" onclick="AnnouncementComponent.setFilter('smp_pa')">
          SMP PUTRA
        </button>
        <button class="filter-tab-btn ${activeCat === 'smp_pi' ? 'active' : ''}" onclick="AnnouncementComponent.setFilter('smp_pi')">
          SMP PUTRI
        </button>
        <button class="filter-tab-btn ${activeCat === 'penegak_pa' ? 'active' : ''}" onclick="AnnouncementComponent.setFilter('penegak_pa')">
          PENEGAK PUTRA
        </button>
        <button class="filter-tab-btn ${activeCat === 'penegak_pi' ? 'active' : ''}" onclick="AnnouncementComponent.setFilter('penegak_pi')">
          PENEGAK PUTRI
        </button>
      </div>

      <!-- Stats Summary Banner -->
      <div class="creator-metrics-row" style="margin-bottom: 1.5rem;">
        <div class="creator-metric-card" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(0,0,0,0.4)); border-color: rgba(251, 191, 36, 0.3);">
          <div class="creator-metric-label">Kategori Aktif</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #fbbf24; font-family: 'Poppins', sans-serif;">${catLabel}</div>
        </div>
        <div class="creator-metric-card">
          <div class="creator-metric-label">Jumlah Kontingen / Regu</div>
          <div class="creator-metric-val" style="color: var(--neon-cyan); font-size: 1.5rem;">${allTeams.length} Regu</div>
        </div>
        <div class="creator-metric-card">
          <div class="creator-metric-label">Total Mata Bidang Lomba</div>
          <div class="creator-metric-val" style="color: #c084fc; font-size: 1.5rem;">10 Bidang Lomba</div>
        </div>
      </div>

      <!-- Section: Rekap Kejuaraan per 10 Mata Lomba -->
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        ${COMPETITIONS.map(c => {
          const list = window.Calculators.getLombaLeaderboard(c.id, activeCat);
          const hasTies = list.some(item => item.isTie);
          const isSchoolComp = (c.id === 'joged_komando' || c.id === 'lkbb');

          return `
            <div class="card-panel" style="margin-bottom: 0;">
              <div class="card-panel-header">
                <h3 class="panel-title">
                  Rekap Kejuaraan ${c.name} (${catLabel})
                </h3>
                ${hasTies ? `
                  <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 0.2rem 0.5rem;">
                    ⚡ Status Tanding Ulang
                  </span>
                ` : `
                  <span style="font-size: 0.75rem; color: #94a3b8;">${list.length} ${isSchoolComp ? 'Sekolah' : 'Peserta'} Dinilai</span>
                `}
              </div>

              <div class="table-container">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Peringkat Kejuaraan</th>
                      <th>${isSchoolComp ? 'ID Basis' : 'ID Regu'}</th>
                      ${isSchoolComp ? `<th>Sekolah / Pangkalan</th>` : `<th>Nama Regu / Sangga</th><th>Pangkalan / Sekolah</th>`}
                      <th>Kategori</th>
                      <th>Total Skor Final</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${list.length === 0 ? `
                      <tr><td colspan="${isSchoolComp ? 6 : 7}" style="text-align: center; color: #94a3b8; padding: 1.5rem;">Belum ada peserta/sekolah yang dinilai pada mata lomba ini.</td></tr>
                    ` : list.map(item => {
                      const rankClass = item.rank === 1 ? 'rank-1' : item.rank === 2 ? 'rank-2' : item.rank === 3 ? 'rank-3' : 'rank-other';
                      const rankLabel = item.rank === '-' ? '-' : item.rank === 1 ? '👑 JUARA 1' : item.rank === 2 ? '🥈 JUARA 2' : item.rank === 3 ? '🥉 JUARA 3' : `💎 RANK ${item.rank}`;
                      
                      const displayName = isSchoolComp ? (item.pangkalan || item.team.pangkalan || item.team.name) : item.team.name;
                      const levelUpper = isSchoolComp ? (item.levelLabel || item.level || 'SD').toUpperCase() : (CATEGORIES.find(cat => cat.id === item.team.category)?.short || item.team.category);
                      const badgeClass = isSchoolComp ? (levelUpper.includes('SD') ? 'badge-sd-pa' : levelUpper.includes('SMP') ? 'badge-smp-pa' : 'badge-penegak-pa') : (CATEGORIES.find(cat => cat.id === item.team.category)?.badgeClass || 'badge-sd');
                      const reguIdCode = item.basisId || item.scoreObj?.basisId || item.team.id || item.schoolId || '-';

                      return `
                        <tr>
                          <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
                          <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
                          <td><strong style="color: #fff; font-size: 0.92rem;">${displayName}</strong>${isSchoolComp ? `<br><span style="font-size: 0.72rem; color: #10b981; font-weight: 600;">(${item.reguCount || 2} Regu Terdaftar)</span>` : ''}</td>
                          ${!isSchoolComp ? `<td>${item.team.pangkalan}</td>` : ''}
                          <td><span class="badge ${badgeClass}">${levelUpper}</span></td>
                          <td><strong style="color: var(--neon-yellow); font-size: 1rem; font-family: 'Poppins', sans-serif;">${item.totalScore > 0 ? item.totalScore : '-'}</strong></td>
                          <td>
                            ${item.isTie ? `
                              <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">⚡ ${item.displayKet}</span>
                            ` : `
                              <span style="font-size: 0.76rem; color: #94a3b8;">${item.displayKet || '-'}</span>
                            `}
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('')}

        <!-- Section: Juara Umum / Materi Gabungan -->
        <div class="card-panel" style="margin-bottom: 0; border: 1px solid rgba(251, 191, 36, 0.4);">
          <div class="card-panel-header">
            <h3 class="panel-title" style="color: #fbbf24;">
              Rekap Juara Umum / Akumulasi Materi Gabungan (${catLabel})
            </h3>
          </div>
          <div class="table-container">
            ${this.renderCombinedSummaryTable(activeCat)}
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
  },

  setFilter(cat) {
    window.currentCategoryFilter = cat;
    this.render(document.getElementById('app-main-content'));
  },

  renderCombinedSummaryTable(catFilter) {
    const levelKey = catFilter === 'all' ? 'all' : (catFilter.startsWith('sd_') ? 'sd' : catFilter.startsWith('smp_') ? 'smp' : 'penegak');
    const genderKey = catFilter.includes('_pa') ? 'pa' : catFilter.includes('_pi') ? 'pi' : 'all';

    const list = window.Calculators.getCombinedLeaderboard(
      ['administrasi', 'banksoal', 'p3k', 'pioneering', 'sandi', 'morse', 'semaphore', 'ketangkasan', 'joged_komando', 'lkbb'],
      levelKey,
      genderKey
    );

    if (list.length === 0) {
      return `<div style="text-align: center; color: #94a3b8; padding: 1.5rem;">Belum ada data untuk juara umum kategori ini.</div>`;
    }

    return `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Peringkat Juara Umum</th>
            <th>ID Regu</th>
            <th>Nama Regu / Sangga</th>
            <th>Pangkalan / Sekolah</th>
            <th>Kategori</th>
            <th>Total Akumulasi Skor</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(item => {
            const rankClass = item.rank === 1 ? 'rank-1' : item.rank === 2 ? 'rank-2' : item.rank === 3 ? 'rank-3' : 'rank-other';
            const rankBadgeLabel = item.rank === 1 ? '👑 JUARA UMUM I' : item.rank === 2 ? '🥈 JUARA UMUM II' : item.rank === 3 ? '🥉 JUARA UMUM III' : `💎 RANK ${item.rank}`;
            const cObj = CATEGORIES.find(c => c.id === item.team.category);
            const reguIdCode = item.team.id || item.schoolId || '-';

            return `
              <tr>
                <td><span class="rank-badge-game ${rankClass}">${rankBadgeLabel}</span></td>
                <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
                <td><strong style="color: #fff;">${item.team.name}</strong></td>
                <td>${item.team.pangkalan}</td>
                <td><span class="badge ${cObj?.badgeClass || 'badge-sd'}">${cObj?.short || item.team.category}</span></td>
                <td><strong style="color: var(--neon-yellow); font-size: 1.05rem; font-family: 'Poppins', sans-serif;">${item.combinedTotal} Pts</strong></td>
                <td>
                  ${item.isTie ? `
                    <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">⚡ ${item.displayKet}</span>
                  ` : `
                    <span style="font-size: 0.76rem; color: #94a3b8;">${item.displayKet || '-'}</span>
                  `}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  exportToExcel() {
    const activeCat = window.currentCategoryFilter || 'all';
    const catObj = CATEGORIES.find(c => c.id === activeCat);
    const catLabel = catObj ? catObj.label : 'Semua Kategori (SD, SMP, & Penegak)';
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let excelHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Pengumuman Kejuaraan</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #000; }
          .title-head { font-size: 14pt; font-weight: bold; text-align: center; color: #1e1b4b; }
          .subtitle-head { font-size: 12pt; font-weight: bold; text-align: center; color: #4338ca; }
          .info-cat { font-size: 10pt; font-style: italic; text-align: center; margin-bottom: 15px; color: #475569; }
          .comp-section { font-size: 11pt; font-weight: bold; background-color: #4f46e5; color: #ffffff; padding: 6px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background-color: #1e1b4b; color: #ffffff; font-weight: bold; border: 1px solid #000; text-align: center; padding: 6px; }
          td { border: 1px solid #000; padding: 5px; font-size: 10pt; }
          .rank-1 { background-color: #fef9c3; font-weight: bold; }
          .rank-2 { background-color: #f3e8ff; font-weight: bold; }
          .rank-3 { background-color: #ffe4e6; font-weight: bold; }
          .tie-badge { color: #dc2626; font-weight: bold; }
          .total-score { font-weight: bold; color: #b45309; text-align: center; }
          .sig-box { margin-top: 30px; font-size: 10pt; text-align: center; }
        </style>
      </head>
      <body>
        <div class="title-head">GERAKAN PRAMUKA KWARTIR CABANG</div>
        <div class="subtitle-head">DAFTAR REKAP PENGUMUMAN KEJUARAAN SELURUH MATA BIDANG LOMBA SIMIKA</div>
        <div class="info-cat">Filter Kategori: <strong>${catLabel}</strong> | Tanggal: ${dateStr}</div>
        <br/>
    `;

    COMPETITIONS.forEach(c => {
      const list = window.Calculators.getLombaLeaderboard(c.id, activeCat);
      const isSchoolComp = (c.id === 'joged_komando' || c.id === 'lkbb');
      const idHeader = isSchoolComp ? 'ID Basis' : 'ID Regu';

      excelHTML += `
        <table>
          <thead>
            <tr>
              <th colspan="7" class="comp-section">REKAP KEJUARAAN: ${c.name.toUpperCase()} (${catLabel.toUpperCase()})</th>
            </tr>
            <tr>
              <th style="width: 12%;">Peringkat</th>
              <th style="width: 15%;">${idHeader}</th>
              <th style="width: 23%;">${isSchoolComp ? 'Sekolah / Pangkalan' : 'Nama Regu / Sangga'}</th>
              <th style="width: 22%;">${isSchoolComp ? 'Jumlah Regu' : 'Pangkalan / Sekolah'}</th>
              <th style="width: 12%;">Kategori</th>
              <th style="width: 8%;">Total Skor</th>
              <th style="width: 8%;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
      `;

      if (list.length === 0) {
        excelHTML += `<tr><td colspan="7" style="text-align: center;">Belum ada peserta dinilai.</td></tr>`;
      } else {
        list.forEach(item => {
          const bgClass = item.rank === 1 ? 'class="rank-1"' : item.rank === 2 ? 'class="rank-2"' : item.rank === 3 ? 'class="rank-3"' : '';
          const rankText = item.rank === 1 ? '🥇 JUARA 1' : item.rank === 2 ? '🥈 JUARA 2' : item.rank === 3 ? '🥉 JUARA 3' : `Peringkat ${item.rank}`;
          const cObj = CATEGORIES.find(cat => cat.id === item.team.category);
          const ketText = item.displayKet || item.scoreObj?.ket || '-';
          const reguIdCode = item.basisId || item.scoreObj?.basisId || item.team.id || item.schoolId || '-';
          const nameCol = isSchoolComp ? (item.pangkalan || item.team.pangkalan || item.team.name) : item.team.name;
          const secCol = isSchoolComp ? `${item.reguCount || 2} Regu Terdaftar` : item.team.pangkalan;
          const catLabelCell = isSchoolComp ? (item.levelLabel || item.level || 'SD').toUpperCase() : (cObj?.short || item.team.category);

          excelHTML += `
            <tr ${bgClass}>
              <td style="text-align: center; font-weight: bold;">${rankText}</td>
              <td style="text-align: center; font-weight: bold;">${reguIdCode}</td>
              <td>${nameCol}</td>
              <td>${secCol}</td>
              <td style="text-align: center;">${catLabelCell}</td>
              <td class="total-score">${item.totalScore}</td>
              <td style="text-align: center; ${item.isTie ? 'color:#dc2626; font-weight:bold;' : ''}">${ketText}</td>
            </tr>
          `;
        });
      }

      excelHTML += `
          </tbody>
        </table>
        <br/>
      `;
    });

    const levelKey = activeCat === 'all' ? 'all' : (activeCat.startsWith('sd_') ? 'sd' : activeCat.startsWith('smp_') ? 'smp' : 'penegak');
    const genderKey = activeCat.includes('_pa') ? 'pa' : activeCat.includes('_pi') ? 'pi' : 'all';
    const combinedList = window.Calculators.getCombinedLeaderboard(
      ['administrasi', 'banksoal', 'p3k', 'pioneering', 'sandi', 'morse', 'semaphore', 'ketangkasan', 'joged_komando', 'lkbb'],
      levelKey,
      genderKey
    );

    excelHTML += `
      <table>
        <thead>
          <tr>
            <th colspan="7" style="background-color: #b45309; color: #ffffff; font-size: 12pt;">REKAP JUARA UMUM / AKUMULASI MATERI GABUNGAN (${catLabel.toUpperCase()})</th>
          </tr>
          <tr>
            <th style="width: 12%;">Peringkat Umum</th>
            <th style="width: 15%;">ID Regu</th>
            <th style="width: 23%;">Nama Regu / Sangga</th>
            <th style="width: 22%;">Pangkalan / Sekolah</th>
            <th style="width: 12%;">Kategori</th>
            <th style="width: 8%;">Total Akumulasi</th>
            <th style="width: 8%;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
    `;

    if (combinedList.length === 0) {
      excelHTML += `<tr><td colspan="7" style="text-align: center;">Belum ada data juara umum.</td></tr>`;
    } else {
      combinedList.forEach(item => {
        const bgClass = item.rank === 1 ? 'class="rank-1"' : item.rank === 2 ? 'class="rank-2"' : item.rank === 3 ? 'class="rank-3"' : '';
        const rankText = item.rank === 1 ? '👑 JUARA UMUM I' : item.rank === 2 ? '🥈 JUARA UMUM II' : item.rank === 3 ? '🥉 JUARA UMUM III' : `Rank ${item.rank}`;
        const cObj = CATEGORIES.find(c => c.id === item.team.category);
        const reguIdCode = item.team.id || item.schoolId || '-';
        excelHTML += `
          <tr ${bgClass}>
            <td style="text-align: center; font-weight: bold;">${rankText}</td>
            <td style="text-align: center; font-weight: bold;">${reguIdCode}</td>
            <td>${item.team.name}</td>
            <td>${item.team.pangkalan}</td>
            <td style="text-align: center;">${cObj?.short || item.team.category}</td>
            <td class="total-score">${item.combinedTotal} Pts</td>
            <td style="text-align: center; ${item.isTie ? 'color:#dc2626; font-weight:bold;' : ''}">${item.displayKet || '-'}</td>
          </tr>
        `;
      });
    }

    excelHTML += `
        </tbody>
      </table>
      <br/>
      <table style="border: none;">
        <tr style="border: none;">
          <td style="border: none; text-align: center; width: 50%;">
            <p>Ketua Dewan Juri,</p><br/><br/><br/>
            <p style="font-weight: bold; text-decoration: underline;">( Kak Ir. H. Supriyadi, M.Pd )</p>
          </td>
          <td style="border: none; text-align: center; width: 50%;">
            <p>Ketua Panitia Pelaksana,</p><br/><br/><br/>
            <p style="font-weight: bold; text-decoration: underline;">( Kak Dr. Ahmad Fauzi, M.Si )</p>
          </td>
        </tr>
      </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHTML], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `pengumuman_rekap_kejuaraan_${activeCat}_simika.xls`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

window.AnnouncementComponent = AnnouncementComponent;
