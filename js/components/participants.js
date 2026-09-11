/* ==========================================================================
   SiMika - Participants Management Component
   - Clean, Minimalist UI without Content Button Icons
   - Export Feature (SD, SMP, PENEGAK)
   - All Bahasa Indonesia UI
   ========================================================================== */

const ParticipantsComponent = {
  render(container) {
    if (!container) return;

    const activeCat = window.currentCategoryFilter || 'all';
    const teams = window.dataStore.getTeams(activeCat);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">
            Manajemen Data Peserta Regu & Sangga
          </h1>
          <p class="page-subtitle">Daftar Kontingen Penggalang SD/SMP dan Sangga Penegak yang Terdaftar</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-outline" style="background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.35); color: #ef4444; font-weight: 700;" onclick="ParticipantsComponent.confirmResetAllData()">
            <i data-lucide="trash-2" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 4px;"></i> HAPUS SEMUA DATA
          </button>
          <button class="btn-outline" style="background: rgba(0, 245, 212, 0.08); border-color: rgba(0, 245, 212, 0.3); color: var(--neon-cyan);" onclick="ParticipantsComponent.openExportModal()">
            Export Data Peserta
          </button>
          <button class="btn-yellow-pill" onclick="ParticipantsComponent.openAddModal()">
            Tambah Peserta Baru
          </button>
        </div>
      </div>

      <div class="card-panel">
        <div class="card-panel-header">
          <h3 class="panel-title">
            Daftar Peserta (${teams.length} Kontingen)
          </h3>
          <div style="font-size: 0.78rem; color: #94a3b8;">
            Kategori Aktif: <strong style="color: var(--neon-cyan);">${CATEGORIES.find(c => c.id === activeCat)?.label || 'Semua Kategori'}</strong>
          </div>
        </div>

        <!-- Filter Regu SD PA/PI, SMP PA/PI, PENEGAK PA/PI -->
        <div class="category-filter-bar">
          <button class="filter-tab-btn ${activeCat === 'all' ? 'active' : ''}" onclick="ParticipantsComponent.setFilter('all')">
            SEMUA PESERTA
          </button>
          <button class="filter-tab-btn ${activeCat === 'sd_pa' ? 'active' : ''}" onclick="ParticipantsComponent.setFilter('sd_pa')">
            REGU SD PUTRA
          </button>
          <button class="filter-tab-btn ${activeCat === 'sd_pi' ? 'active' : ''}" onclick="ParticipantsComponent.setFilter('sd_pi')">
            REGU SD PUTRI
          </button>
          <button class="filter-tab-btn ${activeCat === 'smp_pa' ? 'active' : ''}" onclick="ParticipantsComponent.setFilter('smp_pa')">
            REGU SMP PUTRA
          </button>
          <button class="filter-tab-btn ${activeCat === 'smp_pi' ? 'active' : ''}" onclick="ParticipantsComponent.setFilter('smp_pi')">
            REGU SMP PUTRI
          </button>
          <button class="filter-tab-btn ${activeCat === 'penegak_pa' ? 'active' : ''}" onclick="ParticipantsComponent.setFilter('penegak_pa')">
            PENEGAK PUTRA
          </button>
          <button class="filter-tab-btn ${activeCat === 'penegak_pi' ? 'active' : ''}" onclick="ParticipantsComponent.setFilter('penegak_pi')">
            PENEGAK PUTRI
          </button>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID Regu</th>
                <th>Nama Regu / Sangga</th>
                <th>Pangkalan / Sekolah</th>
                <th>Pembina / Pendamping</th>
                <th>Kategori</th>
                <th>Anggota</th>
                <th style="text-align: right;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${teams.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; color: #94a3b8; padding: 1.5rem;">
                    Belum ada data regu/sangga untuk kategori ini.
                  </td>
                </tr>
              ` : teams.map(t => {
                const catObj = CATEGORIES.find(c => c.id === t.category);

                return `
                  <tr>
                    <td><span style="font-family: monospace; font-weight: 700; color: var(--neon-cyan);">${t.id}</span></td>
                    <td><strong style="color: #fff;">${t.name}</strong></td>
                    <td>${t.pangkalan}</td>
                    <td>${t.pembina}</td>
                    <td>
                      <span class="badge ${catObj?.badgeClass || 'badge-sd'}">${catObj?.short || t.category}</span>
                    </td>
                    <td>${t.members} Anggota</td>
                    <td style="text-align: right;">
                      <div style="display: inline-flex; gap: 0.35rem; justify-content: flex-end;">
                        <button class="btn-outline" onclick="ParticipantsComponent.openEditModal('${t.id}')" title="Edit Data Peserta" style="padding: 0.25rem 0.55rem; font-size: 0.7rem; color: var(--neon-cyan); border-color: rgba(0, 245, 212, 0.3); background: rgba(0, 245, 212, 0.08);">
                          Edit
                        </button>
                        <button class="btn-outline" onclick="ParticipantsComponent.deleteTeam('${t.id}')" title="Hapus Peserta" style="padding: 0.25rem 0.55rem; font-size: 0.7rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.08);">
                          Hapus
                        </button>
                      </div>
                    </td>
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

  setFilter(cat) {
    window.currentCategoryFilter = cat;
    this.render(document.getElementById('app-main-content'));
  },

  openAddModal() {
    this.closeModal();

    const modalHTML = `
      <div class="modal-overlay open" id="participant-modal">
        <div class="modal-container" style="max-width: 580px;">
          <div class="modal-header">
            <h3 class="modal-title">Form Registrasi Peserta (Regu / Sangga)</h3>
            <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="ParticipantsComponent.closeModal()">✕</button>
          </div>
          <form onsubmit="ParticipantsComponent.saveTeam(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Nama Regu / Sangga *</label>
                <input type="text" id="input-team-name" class="form-control" placeholder="Contoh: Regu Garuda 01" required />
              </div>
              <div class="form-group">
                <label>Pangkalan / Sekolah *</label>
                <input type="text" id="input-pangkalan" class="form-control" placeholder="Contoh: SDN Nusantara 01" required />
              </div>
              <div class="form-group">
                <label>Nama Pembina / Pendamping *</label>
                <input type="text" id="input-pembina" class="form-control" placeholder="Contoh: Kak Budi Santoso" required />
              </div>
              <div class="form-group">
                <label>Kategori Lomba *</label>
                <select id="input-category" class="form-control" required>
                  ${CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Jumlah Anggota</label>
                <input type="number" id="input-members" class="form-control" value="8" min="1" max="15" required />
              </div>
            </div>
            <div class="modal-footer" style="margin-top: 1.25rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
              <button type="button" class="btn-outline" onclick="ParticipantsComponent.closeModal()">Batal</button>
              <button type="submit" class="btn-yellow-pill">Simpan Peserta</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
  },

  openEditModal(id) {
    const team = window.dataStore.getTeamById(id);
    if (!team) return alert('Data peserta tidak ditemukan!');

    this.closeModal();

    const modalHTML = `
      <div class="modal-overlay open" id="participant-modal">
        <div class="modal-container" style="max-width: 580px;">
          <div class="modal-header">
            <h3 class="modal-title">Edit Data Peserta (${team.id})</h3>
            <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="ParticipantsComponent.closeModal()">✕</button>
          </div>
          <form onsubmit="ParticipantsComponent.saveTeam(event, '${team.id}')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Nama Regu / Sangga *</label>
                <input type="text" id="input-team-name" class="form-control" value="${team.name}" required />
              </div>
              <div class="form-group">
                <label>Pangkalan / Sekolah *</label>
                <input type="text" id="input-pangkalan" class="form-control" value="${team.pangkalan}" required />
              </div>
              <div class="form-group">
                <label>Nama Pembina / Pendamping *</label>
                <input type="text" id="input-pembina" class="form-control" value="${team.pembina}" required />
              </div>
              <div class="form-group">
                <label>Kategori Lomba *</label>
                <select id="input-category" class="form-control" required>
                  ${CATEGORIES.map(c => `<option value="${c.id}" ${c.id === team.category ? 'selected' : ''}>${c.label}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Jumlah Anggota</label>
                <input type="number" id="input-members" class="form-control" value="${team.members || 8}" min="1" max="15" required />
              </div>
            </div>
            <div class="modal-footer" style="margin-top: 1.25rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
              <button type="button" class="btn-outline" onclick="ParticipantsComponent.closeModal()">Batal</button>
              <button type="submit" class="btn-yellow-pill">Update Data Peserta</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
  },

  openExportModal() {
    this.closeModal();

    const modalHTML = `
      <div class="modal-overlay open" id="export-modal">
        <div class="modal-container" style="max-width: 520px;">
          <div class="modal-header">
            <h3 class="modal-title">Export Data Peserta Regu & Sangga</h3>
            <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="ParticipantsComponent.closeExportModal()">✕</button>
          </div>
          
          <div style="padding: 1rem 0;">
            <p style="color: #cbd5e1; font-size: 0.82rem; margin-bottom: 1rem;">
              Pilih tingkatan data peserta yang ingin Anda unduh ke format Microsoft Excel / CSV:
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.6rem; max-height: 440px; overflow-y: auto; padding-right: 4px;">
              <!-- Semua Data -->
              <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.9rem; background: rgba(0, 245, 212, 0.1); border-color: rgba(0, 245, 212, 0.4); color: #ffffff;" onclick="ParticipantsComponent.exportData('all')">
                <span style="font-weight: 800;">🌐 Export SEMUA DATA Peserta (SD, SMP, PENEGAK)</span>
                <span>&rarr;</span>
              </button>

              <!-- Tingkat SD -->
              <div style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-top: 0.4rem; letter-spacing: 0.05em;">Tingkat SD (Penggalang SD)</div>
              <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(255, 255, 255, 0.03); border-color: var(--border-creator); color: #ffffff;" onclick="ParticipantsComponent.exportData('sd')">
                <span style="font-weight: 700;">Export Gabungan SD (Putra & Putri)</span>
                <span>&rarr;</span>
              </button>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171;" onclick="ParticipantsComponent.exportData('sd_pa')">
                  <span style="font-weight: 700;">🏆 SD Putra</span>
                  <span>&rarr;</span>
                </button>
                <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(244, 63, 94, 0.1); border-color: rgba(244, 63, 94, 0.3); color: #fb7185;" onclick="ParticipantsComponent.exportData('sd_pi')">
                  <span style="font-weight: 700;">🌸 SD Putri</span>
                  <span>&rarr;</span>
                </button>
              </div>

              <!-- Tingkat SMP -->
              <div style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-top: 0.4rem; letter-spacing: 0.05em;">Tingkat SMP (Penggalang SMP)</div>
              <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(255, 255, 255, 0.03); border-color: var(--border-creator); color: #ffffff;" onclick="ParticipantsComponent.exportData('smp')">
                <span style="font-weight: 700;">Export Gabungan SMP (Putra & Putri)</span>
                <span>&rarr;</span>
              </button>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); color: #60a5fa;" onclick="ParticipantsComponent.exportData('smp_pa')">
                  <span style="font-weight: 700;">🛡️ SMP Putra</span>
                  <span>&rarr;</span>
                </button>
                <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.3); color: #c084fc;" onclick="ParticipantsComponent.exportData('smp_pi')">
                  <span style="font-weight: 700;">🌺 SMP Putri</span>
                  <span>&rarr;</span>
                </button>
              </div>

              <!-- Tingkat PENEGAK -->
              <div style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-top: 0.4rem; letter-spacing: 0.05em;">Tingkat PENEGAK (Sangga Penegak)</div>
              <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(255, 255, 255, 0.03); border-color: var(--border-creator); color: #ffffff;" onclick="ParticipantsComponent.exportData('penegak')">
                <span style="font-weight: 700;">Export Gabungan Penegak (Putra & Putri)</span>
                <span>&rarr;</span>
              </button>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(234, 179, 8, 0.1); border-color: rgba(234, 179, 8, 0.3); color: #facc15;" onclick="ParticipantsComponent.exportData('penegak_pa')">
                  <span style="font-weight: 700;">⚜️ Penegak Putra</span>
                  <span>&rarr;</span>
                </button>
                <button class="btn-outline" style="display: flex; justify-content: space-between; align-items: center; padding: 0.55rem 0.85rem; background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3); color: #fde047;" onclick="ParticipantsComponent.exportData('penegak_pi')">
                  <span style="font-weight: 700;">👑 Penegak Putri</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="margin-top: 0.5rem; display: flex; justify-content: flex-end;">
            <button type="button" class="btn-outline" onclick="ParticipantsComponent.closeExportModal()">Tutup</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
  },

  closeModal() {
    const el = document.getElementById('participant-modal');
    if (el) el.remove();
  },

  closeExportModal() {
    const el = document.getElementById('export-modal');
    if (el) el.remove();
  },

  exportData(level) {
    const allTeams = window.dataStore.teams || [];
    let filtered = [];

    if (level === 'sd_pa') {
      filtered = allTeams.filter(t => t.category === 'sd_pa');
    } else if (level === 'sd_pi') {
      filtered = allTeams.filter(t => t.category === 'sd_pi');
    } else if (level === 'smp_pa') {
      filtered = allTeams.filter(t => t.category === 'smp_pa');
    } else if (level === 'smp_pi') {
      filtered = allTeams.filter(t => t.category === 'smp_pi');
    } else if (level === 'penegak_pa') {
      filtered = allTeams.filter(t => t.category === 'penegak_pa');
    } else if (level === 'penegak_pi') {
      filtered = allTeams.filter(t => t.category === 'penegak_pi');
    } else if (level === 'sd') {
      filtered = allTeams.filter(t => t.category && t.category.startsWith('sd_'));
    } else if (level === 'smp') {
      filtered = allTeams.filter(t => t.category && t.category.startsWith('smp_'));
    } else if (level === 'penegak') {
      filtered = allTeams.filter(t => t.category && t.category.startsWith('penegak_'));
    } else {
      filtered = allTeams;
    }

    if (filtered.length === 0) {
      alert('Tidak ada data peserta untuk kategori yang dipilih!');
      return;
    }

    let headerBg = '#6b7280'; // Abu-abu default
    let headerText = '#ffffff';
    let idColName = 'ID Regu/Sangga';
    let nameColName = 'Nama Regu/Sangga';
    let mainTitle = 'DAFTAR PESERTA LOMBA PRAMUKA';

    if (level === 'sd' || level === 'sd_pa' || level === 'sd_pi') {
      headerBg = '#dc2626'; // Merah
      headerText = '#ffffff';
      idColName = 'ID Regu';
      nameColName = 'Nama Regu';
      mainTitle = level === 'sd_pa' ? 'DAFTAR PESERTA LOMBA PRAMUKA PENGGALANG SD PUTRA' :
                  level === 'sd_pi' ? 'DAFTAR PESERTA LOMBA PRAMUKA PENGGALANG SD PUTRI' :
                  'DAFTAR PESERTA LOMBA PRAMUKA TINGKAT SD';
    } else if (level === 'smp' || level === 'smp_pa' || level === 'smp_pi') {
      headerBg = '#2563eb'; // Biru
      headerText = '#ffffff';
      idColName = 'ID Regu';
      nameColName = 'Nama Regu';
      mainTitle = level === 'smp_pa' ? 'DAFTAR PESERTA LOMBA PRAMUKA PENGGALANG SMP PUTRA' :
                  level === 'smp_pi' ? 'DAFTAR PESERTA LOMBA PRAMUKA PENGGALANG SMP PUTRI' :
                  'DAFTAR PESERTA LOMBA PRAMUKA TINGKAT SMP';
    } else if (level === 'penegak' || level === 'penegak_pa' || level === 'penegak_pi') {
      headerBg = '#eab308'; // Kuning
      headerText = '#000000';
      idColName = 'ID Sangga';
      nameColName = 'Nama Sangga';
      mainTitle = level === 'penegak_pa' ? 'DAFTAR PESERTA LOMBA PRAMUKA SANGGA PENEGAK PUTRA' :
                  level === 'penegak_pi' ? 'DAFTAR PESERTA LOMBA PRAMUKA SANGGA PENEGAK PUTRI' :
                  'DAFTAR PESERTA LOMBA PRAMUKA TINGKAT PENEGAK';
    }

    let htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Data Peserta</x:Name>
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
          .kop-title { font-size: 14pt; font-weight: bold; text-align: center; margin: 0; padding: 10px; color: #000000; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th { background-color: ${headerBg}; color: ${headerText}; font-weight: bold; text-align: center; border: 1px solid #000000; padding: 8px 10px; font-size: 11pt; }
          td { border: 1px solid #000000; padding: 6px 10px; vertical-align: middle; font-size: 10pt; color: #000000; }
          .text-center { text-align: center; }
          .text-left { text-align: left; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="7" class="kop-title" style="border: none;">${mainTitle}</td></tr>
          <tr><td colspan="7" style="height: 10px; border: none;"></td></tr>
          <thead>
            <tr>
              <th style="width: 5%;">No.</th>
              <th style="width: 12%;">${idColName}</th>
              <th style="width: 25%;">${nameColName}</th>
              <th style="width: 23%;">Sekolah</th>
              <th style="width: 20%;">Pembina / Pendamping</th>
              <th style="width: 20%;">Kategori</th>
              <th style="width: 10%;">Jumlah Anggota</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((t, idx) => {
              const catObj = CATEGORIES.find(c => c.id === t.category);
              const catName = catObj ? catObj.label : t.category;
              return `
                <tr>
                  <td class="text-center">${idx + 1}</td>
                  <td class="text-center" style="font-weight: bold;">${t.id || ''}</td>
                  <td class="text-left" style="font-weight: bold;">${t.name || ''}</td>
                  <td class="text-left">${t.pangkalan || ''}</td>
                  <td class="text-left">${t.pembina || ''}</td>
                  <td class="text-left">${catName}</td>
                  <td class="text-center">${t.members || 8}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const levelLabel = level === 'sd' ? 'SD' : level === 'smp' ? 'SMP' : level === 'penegak' ? 'PENEGAK' : 'SEMUA';
    link.setAttribute("href", url);
    link.setAttribute("download", `data_peserta_${levelLabel.toLowerCase()}_simika.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.closeExportModal();
  },

  saveTeam(e, editId = null) {
    e.preventDefault();
    const name = document.getElementById('input-team-name').value;
    const pangkalan = document.getElementById('input-pangkalan').value;
    const pembina = document.getElementById('input-pembina').value;
    const category = document.getElementById('input-category').value;
    const members = Number(document.getElementById('input-members').value) || 8;

    if (editId) {
      window.dataStore.updateTeam(editId, { name, pangkalan, pembina, category, members });
    } else {
      window.dataStore.addTeam({ name, pangkalan, pembina, category, members });
    }

    this.closeModal();
    this.render(document.getElementById('app-main-content'));
  },

  deleteTeam(id) {
    if (confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
      window.dataStore.deleteTeam(id);
      this.render(document.getElementById('app-main-content'));
    }
  },

  confirmResetAllData() {
    this.closeModal();

    const totalTeams = (window.dataStore.teams || []).length;
    const modalHTML = `
      <div class="modal-overlay open" id="reset-data-modal" onclick="if(event.target === this) ParticipantsComponent.closeResetModal()">
        <div class="modal-container" style="max-width: 480px;">
          <div class="modal-header" style="border-bottom: 1px solid rgba(239, 68, 68, 0.4);">
            <div>
              <h3 class="modal-title" style="display: flex; align-items: center; gap: 0.5rem; color: #ef4444;">
                <i data-lucide="alert-triangle" style="color: #ef4444;"></i> PERINGATAN! HAPUS SEMUA DATA
              </h3>
              <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.15rem;">Tindakan ini tidak dapat diurungkan (permanen)</p>
            </div>
            <button class="btn-outline" type="button" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="ParticipantsComponent.closeResetModal()">✕</button>
          </div>

          <div style="padding: 1.25rem 0;">
            <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
              <p style="color: #f87171; font-weight: 700; margin: 0 0 0.5rem 0; font-size: 0.88rem;">
                ⚠️ Anda akan menghapus <strong>${totalTeams} data peserta regu/sangga</strong> beserta seluruh data nilai yang terkait.
              </p>
              <ul style="color: #94a3b8; font-size: 0.78rem; margin: 0; padding-left: 1.25rem; line-height: 1.7;">
                <li>Semua data regu/sangga akan terhapus</li>
                <li>Semua nilai rekap lomba akan terhapus</li>
                <li>Data akan kembali ke kondisi awal (data seed)</li>
                <li>Tindakan ini TIDAK bisa dibatalkan</li>
              </ul>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label style="color: #fff; font-weight: 700; font-size: 0.82rem;">Ketik <strong style="color: #ef4444;">HAPUS SEMUA</strong> untuk konfirmasi:</label>
              <input type="text" id="reset-confirm-input" class="form-control" placeholder="Ketik: HAPUS SEMUA" style="border-color: rgba(239, 68, 68, 0.4); margin-top: 0.4rem; font-family: monospace; font-weight: 700;"/>
            </div>
          </div>

          <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button type="button" class="btn-outline" onclick="ParticipantsComponent.closeResetModal()">Batal</button>
            <button type="button" id="btn-confirm-reset" style="background: linear-gradient(135deg, #dc2626, #991b1b); color: #fff; font-weight: 900; border: none; padding: 0.55rem 1.2rem; border-radius: 999px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;" onclick="ParticipantsComponent.resetAllData()">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i> Ya, Hapus Semua Data
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
  },

  closeResetModal() {
    const el = document.getElementById('reset-data-modal');
    if (el) el.remove();
  },

  resetAllData() {
    const inputVal = (document.getElementById('reset-confirm-input')?.value || '').trim();
    if (inputVal !== 'HAPUS SEMUA') {
      alert('❌ Konfirmasi tidak sesuai! Ketik tepat: HAPUS SEMUA');
      return;
    }

    window.dataStore.resetData();
    this.closeResetModal();
    this.render(document.getElementById('app-main-content'));

    if (window.SecurityEngine) {
      window.SecurityEngine.showSecurityToast('🗑️ Semua data peserta & nilai telah direset ke kondisi awal.');
    } else {
      alert('✅ Data berhasil direset ke kondisi awal!');
    }
  }
};

window.ParticipantsComponent = ParticipantsComponent;
