/* ==========================================================================
   SiMika - Streamlined Admin Dashboard Component
   - Clean, Full-Width Dashboard Layout
   - Real-time Progress Input Rekap (SD, SMP, PENEGAK)
   - All Bahasa Indonesia UI
   ========================================================================== */

const DashboardComponent = {
  render(container) {
    if (!container) return;

    const teams = window.dataStore.teams || [];
    const activeCat = window.currentCategoryFilter || 'all';
    const lkbbList = window.Calculators.getLKBBSubLeaderboards(activeCat);
    const progressData = window.Calculators.getRekapProgressAllLevels();

    const { overall, levels, compBreakdown } = progressData;

    // Helper for level badge status
    const getStatusBadge = (pct) => {
      if (pct === 100) {
        return `<span class="badge badge-completed" style="font-weight: 800;"><i data-lucide="check-circle" style="width: 12px; height: 12px; vertical-align: middle;"></i> Selesai 100%</span>`;
      } else if (pct > 0) {
        return `<span class="badge badge-process" style="font-weight: 800;"><i data-lucide="clock" style="width: 12px; height: 12px; vertical-align: middle;"></i> Proses ${pct}%</span>`;
      } else {
        return `<span class="badge badge-pending" style="font-weight: 800;"><i data-lucide="alert-circle" style="width: 12px; height: 12px; vertical-align: middle;"></i> Belum Dimulai</span>`;
      }
    };

    container.innerHTML = `
      <div style="width: 100%;">
        <!-- Proportional 3 Metric Cards Grid -->
        <div class="creator-metrics-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div class="creator-metric-card">
            <div class="creator-metric-label">👥 TOTAL REGUS / PESERTA</div>
            <div class="creator-metric-val" style="color: var(--neon-cyan);">${teams.length} Regu</div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.25rem;">Terdaftar di SD, SMP, & Penegak</div>
          </div>

          <div class="creator-metric-card">
            <div class="creator-metric-label">📊 PROGRESS REKAP TOTAL</div>
            <div class="creator-metric-val" style="color: #ffffff;">${overall.completed} / ${overall.total} Entry</div>
            <div style="font-size: 0.72rem; color: var(--neon-yellow); margin-top: 0.25rem; font-weight: 700;">${overall.percentage}% Total Skor Ter-input</div>
          </div>

          <div class="creator-metric-card">
            <div class="creator-metric-label">🏆 STATUS MATA LOMBA</div>
            <div class="creator-metric-val" style="color: #34d399;">${COMPETITIONS.length} / ${COMPETITIONS.length} Lomba</div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.25rem;">Modul Penilaian Terhubung</div>
          </div>
        </div>

        <!-- Progress Input Rekap Status Card Panel -->
        <div class="card-panel" style="margin-bottom: 1.5rem;">
          <div class="card-panel-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--border-creator); padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
            <div>
              <h3 class="panel-title" style="display: flex; align-items: center; gap: 0.5rem; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 800;">
                <i data-lucide="bar-chart-3" style="color: var(--neon-cyan);"></i>
                STATUS PROGRESS INPUT REKAP NILAI PER TINGKAT
              </h3>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.76rem; color: #94a3b8;">
                Pantauan real-time status penginputan nilai regu/sekolah oleh Tim Rekap Nilai
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn-yellow-pill" style="padding: 0.4rem 0.85rem; font-size: 0.78rem; background: linear-gradient(135deg, #00f5d4, #0284c7); color: #090d16; font-weight: 900; box-shadow: 0 4px 14px rgba(0, 245, 212, 0.4); border: none; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;" onclick="window.appRouter.navigate('scoring'); setTimeout(() => window.ScoringComponent.openAddLombaModal(), 100);">
                <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> TAMBAH JENIS LOMBA
              </button>
              <div style="display: flex; align-items: center; gap: 0.35rem; background: rgba(0, 245, 212, 0.15); border: 1px solid var(--neon-cyan); padding: 0.3rem 0.75rem; border-radius: 20px; font-weight: 900; font-size: 0.82rem; color: var(--neon-cyan);">
                Grand Progress: ${overall.percentage}%
              </div>
            </div>
          </div>

          <!-- 3 Level Cards Grid -->
          <div class="level-progress-grid">
            <!-- Level SD Card -->
            <div class="level-progress-card card-sd">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <span class="badge ${levels.sd.badgeClass}" style="font-size: 0.68rem; margin-bottom: 0.35rem; display: inline-block;">SD / PENGGALANG</span>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 900; color: #ffffff;">Penggalang SD</h4>
                </div>
                ${getStatusBadge(levels.sd.percentage)}
              </div>

              <div style="margin-top: 0.25rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.74rem; font-weight: 700; margin-bottom: 0.35rem;">
                  <span style="color: #94a3b8;">Progres Penginputan:</span>
                  <span style="color: #00f5d4;">${levels.sd.completed} / ${levels.sd.total} (${levels.sd.percentage}%)</span>
                </div>
                <div class="progress-track-bg">
                  <div class="progress-fill-bar" style="width: ${levels.sd.percentage}%; background: ${levels.sd.gradient};"></div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.72rem; color: #cbd5e1; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 0.6rem;">
                <span><i data-lucide="check-square" style="width: 12px; height: 12px; vertical-align: middle; color: #00f5d4;"></i> ${levels.sd.completedCompCount} / ${COMPETITIONS.length} Lomba Selesai</span>
                <button class="btn-action-input-nilai" onclick="window.appRouter.navigate('scoring')">
                  <i data-lucide="edit-3"></i> Rekap SD
                </button>
              </div>
            </div>

            <!-- Level SMP Card -->
            <div class="level-progress-card card-smp">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <span class="badge ${levels.smp.badgeClass}" style="font-size: 0.68rem; margin-bottom: 0.35rem; display: inline-block;">SMP / PENGGALANG</span>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 900; color: #ffffff;">Penggalang SMP</h4>
                </div>
                ${getStatusBadge(levels.smp.percentage)}
              </div>

              <div style="margin-top: 0.25rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.74rem; font-weight: 700; margin-bottom: 0.35rem;">
                  <span style="color: #94a3b8;">Progres Penginputan:</span>
                  <span style="color: #c084fc;">${levels.smp.completed} / ${levels.smp.total} (${levels.smp.percentage}%)</span>
                </div>
                <div class="progress-track-bg">
                  <div class="progress-fill-bar" style="width: ${levels.smp.percentage}%; background: ${levels.smp.gradient};"></div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.72rem; color: #cbd5e1; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 0.6rem;">
                <span><i data-lucide="check-square" style="width: 12px; height: 12px; vertical-align: middle; color: #c084fc;"></i> ${levels.smp.completedCompCount} / ${COMPETITIONS.length} Lomba Selesai</span>
                <button class="btn-action-input-nilai" onclick="window.appRouter.navigate('scoring')">
                  <i data-lucide="edit-3"></i> Rekap SMP
                </button>
              </div>
            </div>

            <!-- Level PENEGAK Card -->
            <div class="level-progress-card card-penegak">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <span class="badge ${levels.penegak.badgeClass}" style="font-size: 0.68rem; margin-bottom: 0.35rem; display: inline-block;">PENEGAK / SANGGA</span>
                  <h4 style="margin: 0; font-size: 1.05rem; font-weight: 900; color: #ffffff;">Sangga Penegak</h4>
                </div>
                ${getStatusBadge(levels.penegak.percentage)}
              </div>

              <div style="margin-top: 0.25rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.74rem; font-weight: 700; margin-bottom: 0.35rem;">
                  <span style="color: #94a3b8;">Progres Penginputan:</span>
                  <span style="color: #10b981;">${levels.penegak.completed} / ${levels.penegak.total} (${levels.penegak.percentage}%)</span>
                </div>
                <div class="progress-track-bg">
                  <div class="progress-fill-bar" style="width: ${levels.penegak.percentage}%; background: ${levels.penegak.gradient};"></div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.72rem; color: #cbd5e1; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 0.6rem;">
                <span><i data-lucide="check-square" style="width: 12px; height: 12px; vertical-align: middle; color: #10b981;"></i> ${levels.penegak.completedCompCount} / ${COMPETITIONS.length} Lomba Selesai</span>
                <button class="btn-action-input-nilai" onclick="window.appRouter.navigate('scoring')">
                  <i data-lucide="edit-3"></i> Rekap Penegak
                </button>
              </div>
            </div>
          </div>

          <!-- Breakdown Progress per Mata Lomba Accordion / Table Toggle -->
          <div style="margin-top: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 0.85rem;">
            <details style="background: rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 0.6rem 0.85rem; border: 1px solid rgba(255, 255, 255, 0.05);">
              <summary style="cursor: pointer; font-weight: 800; font-size: 0.82rem; color: var(--neon-cyan); display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="list-checks" style="width: 16px; height: 16px;"></i>
                Rincian Status Input Nilai per ${COMPETITIONS.length} Mata Lomba (SD, SMP, PENEGAK)
              </summary>
              <div class="table-container" style="margin-top: 0.75rem;">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th style="width: 25%;">Nama Mata Lomba</th>
                      <th style="width: 20%;">Tingkat SD</th>
                      <th style="width: 20%;">Tingkat SMP</th>
                      <th style="width: 20%;">Tingkat PENEGAK</th>
                      <th style="width: 15%; text-align: center;">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${compBreakdown.map(comp => {
                      return `
                        <tr>
                          <td>
                            <strong style="color: #ffffff; display: flex; align-items: center; gap: 0.35rem;">
                              <i data-lucide="${comp.icon}" style="width: 14px; height: 14px; color: var(--neon-yellow);"></i>
                              ${comp.name}
                            </strong>
                          </td>
                          <td>
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                              <div style="display: flex; justify-content: space-between; font-size: 0.68rem; font-weight: 700;">
                                <span style="color: #94a3b8;">${comp.sd.completed}/${comp.sd.total}</span>
                                <span style="color: #00f5d4;">${comp.sd.percentage}%</span>
                              </div>
                              <div class="progress-track-bg" style="height: 5px;">
                                <div class="progress-fill-bar" style="width: ${comp.sd.percentage}%; background: #00f5d4;"></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                              <div style="display: flex; justify-content: space-between; font-size: 0.68rem; font-weight: 700;">
                                <span style="color: #94a3b8;">${comp.smp.completed}/${comp.smp.total}</span>
                                <span style="color: #c084fc;">${comp.smp.percentage}%</span>
                              </div>
                              <div class="progress-track-bg" style="height: 5px;">
                                <div class="progress-fill-bar" style="width: ${comp.smp.percentage}%; background: #a855f7;"></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                              <div style="display: flex; justify-content: space-between; font-size: 0.68rem; font-weight: 700;">
                                <span style="color: #94a3b8;">${comp.penegak.completed}/${comp.penegak.total}</span>
                                <span style="color: #10b981;">${comp.penegak.percentage}%</span>
                              </div>
                              <div class="progress-track-bg" style="height: 5px;">
                                <div class="progress-fill-bar" style="width: ${comp.penegak.percentage}%; background: #10b981;"></div>
                              </div>
                            </div>
                          </td>
                          <td style="text-align: center;">
                            <button class="btn-action-input-nilai ${comp.percentage > 0 ? 'btn-has-score' : ''}" style="font-size: 0.65rem; padding: 0.2rem 0.5rem;" onclick="window.appRouter.navigate('scoring')">
                              ${comp.percentage === 100 ? 'Edit' : 'Input'} Nilai
                            </button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>

        <!-- Active Leaderboard Overview Table -->
        <div class="card-panel">
          <div class="card-panel-header">
            <h3 class="panel-title">
              <i data-lucide="crown" style="color: #fbbf24;"></i>
              Klasemen Sementara Lomba LKBB (Rincian DP & PBB Dasar)
            </h3>
            <button class="btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;" onclick="window.appRouter.navigate('ranking')">
              Lihat Semua Peringkat
            </button>
          </div>

          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Lencana 3D Rank</th>
                  <th>Nama Regu / Sangga</th>
                  <th>Nilai DP</th>
                  <th>Nilai PBB Dasar</th>
                  <th>Variasi Formasi</th>
                  <th>Danton</th>
                  <th>Total Overall</th>
                </tr>
              </thead>
              <tbody>
                ${lkbbList.length === 0 ? `
                  <tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">Belum ada peserta terdaftar untuk kategori ini.</td></tr>
                ` : lkbbList.slice(0, 5).map(item => {
                  const rankClass = item.rankOverall === 1 ? 'rank-1' : item.rankOverall === 2 ? 'rank-2' : item.rankOverall === 3 ? 'rank-3' : 'rank-other';
                  const rankLabel = item.rankOverall === 1 ? '👑 RANK 1' : item.rankOverall === 2 ? '🥈 RANK 2' : item.rankOverall === 3 ? '🥉 RANK 3' : `💎 RANK ${item.rankOverall}`;

                  return `
                    <tr>
                      <td><span class="rank-badge-game ${rankClass}">${rankLabel}</span></td>
                      <td><strong style="color: #fff;">${item.team.name}</strong><br><span style="font-size: 0.75rem; color: #94a3b8;">${item.team.pangkalan}</span></td>
                      <td>${item.totalDp}</td>
                      <td>${item.totalPbb}</td>
                      <td>${item.totalVariasi}</td>
                      <td>${item.totalDanton}</td>
                      <td><strong style="color: var(--neon-yellow); font-size: 1rem; font-family: 'Poppins', sans-serif;">${item.total}</strong></td>
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
};

window.DashboardComponent = DashboardComponent;

