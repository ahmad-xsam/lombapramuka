/* ==========================================================================
   SiMika - Leaderboard & Ranking Component
   - Clean, Minimalist UI without Content Button Icons
   - All Bahasa Indonesia UI
   ========================================================================== */

const RankingComponent = {
  activeView: 'lkbb_breakdown',

  render(container) {
    const activeCat = window.currentCategoryFilter || 'all';
    if (this.activeView !== 'lkbb_breakdown' && !COMPETITIONS.some(c => c.id === this.activeView)) {
      this.activeView = 'lkbb_breakdown';
    }

    const lkbbList = window.Calculators.getLKBBSubLeaderboards(activeCat);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">
            Rekap Peringkat & Breakdown Nilai Lomba
          </h1>
          <p class="page-subtitle">Klasemen Hasil Nilai Lomba & Peringkat per Kategori Real-Time</p>
        </div>
      </div>

      <div class="sub-tabs">
        <button class="sub-tab-btn ${this.activeView === 'lkbb_breakdown' ? 'active' : ''}" onclick="RankingComponent.switchView('lkbb_breakdown')">
          Special Breakdown LKBB (DP & PBB Dasar)
        </button>
        ${COMPETITIONS.map(c => `
          <button class="sub-tab-btn ${this.activeView === c.id ? 'active' : ''}" onclick="RankingComponent.switchView('${c.id}')">
            Leaderboard ${c.name}
          </button>
        `).join('')}
      </div>

      ${this.activeView === 'lkbb_breakdown' ? `
        <div class="card-panel">
          <div class="card-panel-header">
            <h3 class="panel-title">
              Hasil Peringkat Lomba LKBB (Rincian Terpisah DP, PBB Dasar, Variasi & Danton)
            </h3>
          </div>

          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Lencana 3D Rank</th>
                  <th>ID Basis</th>
                  <th>Sekolah / Pangkalan</th>
                  <th>Tingkat</th>
                  <th>Nilai DP</th>
                  <th>Rank DP</th>
                  <th>Nilai PBB Dasar (Juri 1-3)</th>
                  <th>Rank PBB Dasar</th>
                  <th>Variasi Formasi (Juri 1-3)</th>
                  <th>Rank Variasi</th>
                  <th>Danton (Juri 1-3)</th>
                  <th>Rank Danton</th>
                  <th>Total Overall LKBB</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                ${lkbbList.length === 0 ? `
                  <tr><td colspan="14" style="text-align: center; color: #94a3b8; padding: 1.5rem;">Belum ada data untuk kategori ini.</td></tr>
                ` : lkbbList.map(item => {
                  const rankClass = item.rankOverall === 1 ? 'rank-1' : item.rankOverall === 2 ? 'rank-2' : item.rankOverall === 3 ? 'rank-3' : 'rank-other';
                  const rankLabel = item.rankOverall === 1 ? '👑 RANK 1' : item.rankOverall === 2 ? '🥈 RANK 2' : item.rankOverall === 3 ? '🥉 RANK 3' : `💎 RANK ${item.rankOverall}`;
                  const schoolName = item.pangkalan || item.team.pangkalan || item.team.name;
                  const levelUpper = (item.levelLabel || item.level || 'SD').toUpperCase();
                  const badgeClass = levelUpper.includes('SD') ? 'badge-sd-pa' : levelUpper.includes('SMP') ? 'badge-smp-pa' : 'badge-penegak-pa';
                  const reguIdCode = item.basisId || item.scoreObj?.basisId || item.schoolId || item.team.id || '-';

                  return `
                    <tr>
                      <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
                      <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
                      <td><strong style="color: #fff; font-size: 0.92rem;">${schoolName}</strong><br><span style="font-size: 0.72rem; color: #10b981; font-weight: 600;">(${item.reguCount || 2} Regu Terdaftar)</span></td>
                      <td><span class="badge ${badgeClass}">${levelUpper}</span></td>
                      <td>${item.totalDp}</td>
                      <td><span class="badge badge-sd">Rank ${item.rankDp}</span></td>
                      <td>${item.totalPbb}</td>
                      <td><span class="badge badge-smp">Rank ${item.rankPbb}</span></td>
                      <td>${item.totalVariasi}</td>
                      <td><span class="badge badge-sd">Rank ${item.rankVariasi}</span></td>
                      <td>${item.totalDanton}</td>
                      <td><span class="badge badge-penegak">Rank ${item.rankDanton}</span></td>
                      <td><strong style="color: var(--neon-yellow); font-size: 1.05rem; font-family: 'Poppins', sans-serif;">${item.total}</strong></td>
                      <td>${item.isTie ? `<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">⚡ ${item.displayKet}</span>` : `<span style="font-size: 0.76rem; color: #94a3b8;">${item.displayKet || '-'}</span>`}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : `
        <div class="card-panel">
          <div class="card-panel-header">
            <h3 class="panel-title">
              Leaderboard ${COMPETITIONS.find(c => c.id === this.activeView)?.name}
            </h3>
          </div>
          <div class="table-container">
            ${this.renderSingleLombaLeaderboard(this.activeView, activeCat)}
          </div>
        </div>
      `}
    `;

    lucide.createIcons();
  },

  switchView(viewId) {
    this.activeView = viewId;
    this.render(document.getElementById('app-main-content'));
  },

  renderSingleLombaLeaderboard(lombaId, categoryFilter) {
    const list = window.Calculators.getLombaLeaderboard(lombaId, categoryFilter);
    const isSchoolComp = (lombaId === 'joged_komando' || lombaId === 'lkbb');

    return `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Lencana 3D Rank</th>
            <th>${isSchoolComp ? 'ID Basis' : 'ID Regu'}</th>
            ${isSchoolComp ? `<th>Sekolah / Pangkalan</th>` : `<th>Regu / Sangga</th><th>Pangkalan / Sekolah</th>`}
            <th>Kategori</th>
            <th>Total Skor Final</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${list.length === 0 ? `
            <tr><td colspan="${isSchoolComp ? 6 : 7}" style="text-align: center; color: #94a3b8; padding: 1.5rem;">Belum ada peserta/sekolah terdaftar.</td></tr>
          ` : list.map(item => {
            const rankClass = item.rank === 1 ? 'rank-1' : item.rank === 2 ? 'rank-2' : item.rank === 3 ? 'rank-3' : 'rank-other';
            const rankLabel = item.rank === '-' ? '-' : item.rank === 1 ? '👑 RANK 1' : item.rank === 2 ? '🥈 RANK 2' : item.rank === 3 ? '🥉 RANK 3' : `💎 RANK ${item.rank}`;
            
            const displayName = isSchoolComp ? (item.pangkalan || item.team.pangkalan || item.team.name) : item.team.name;
            const levelUpper = isSchoolComp ? (item.levelLabel || item.level || 'SD').toUpperCase() : (CATEGORIES.find(c => c.id === item.team.category)?.short || item.team.category);
            const badgeClass = isSchoolComp ? (levelUpper.includes('SD') ? 'badge-sd-pa' : levelUpper.includes('SMP') ? 'badge-smp-pa' : 'badge-penegak-pa') : (CATEGORIES.find(c => c.id === item.team.category)?.badgeClass || 'badge-sd-pa');
            const reguIdCode = item.basisId || item.scoreObj?.basisId || item.team.id || item.schoolId || '-';

            return `
              <tr>
                <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
                <td><span class="badge badge-id-regu">${reguIdCode}</span></td>
                <td><strong style="color: #fff; font-size: 0.92rem;">${displayName}</strong>${isSchoolComp ? `<br><span style="font-size: 0.72rem; color: #10b981; font-weight: 600;">(${item.reguCount || 2} Regu Terdaftar)</span>` : ''}</td>
                ${!isSchoolComp ? `<td>${item.team.pangkalan}</td>` : ''}
                <td><span class="badge ${badgeClass}">${levelUpper}</span></td>
                <td><strong style="color: var(--neon-yellow); font-size: 1.05rem; font-family: 'Poppins', sans-serif;">${item.totalScore > 0 ? item.totalScore : '-'}</strong></td>
                <td>${item.isTie ? `<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;">⚡ ${item.displayKet}</span>` : `<span style="font-size: 0.76rem; color: #94a3b8;">${item.displayKet || '-'}</span>`}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }
};

window.RankingComponent = RankingComponent;
