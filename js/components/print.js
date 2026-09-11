/* ==========================================================================
   SiMika - Print & PDF Export Component
   - Clean, Minimalist UI without Content Button Icons
   - All Bahasa Indonesia UI
   ========================================================================== */

const PrintComponent = {
  currentDocType: 'sk_kejuaraan', // 'sk_kejuaraan' | 'berita_acara'
  currentCategory: 'all',
  currentLomba: 'combined', // 'combined' | 'all_comp' | lombaId

  renderPrintPage(container) {
    if (!container) return;

    const activeCatObj = CATEGORIES.find(c => c.id === this.currentCategory);
    const catLabel = activeCatObj ? activeCatObj.label : 'Semua Kategori (SD, SMP, & Penegak)';

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">
            Cetak SK Resmi & Berita Acara SiMika
          </h1>
          <p class="page-subtitle">Cetak SK Kejuaraan Resmi dan Berita Acara Penyerahan Piala Seluruh Kategori Mata Lomba</p>
        </div>
        <button class="btn-yellow-pill" onclick="window.print()">
          Cetak Dokumen (Print PDF)
        </button>
      </div>

      <!-- Document Type Switcher Tabs -->
      <div class="doc-type-switcher" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
        <button class="sub-tab-btn ${this.currentDocType === 'sk_kejuaraan' ? 'active' : ''}" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;" onclick="PrintComponent.setDocType('sk_kejuaraan')">
          CETAK SK KEJUARAAN
        </button>
        <button class="sub-tab-btn ${this.currentDocType === 'berita_acara' ? 'active' : ''}" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;" onclick="PrintComponent.setDocType('berita_acara')">
          CETAK BERITA ACARA PENYERAHAN PIALA
        </button>
      </div>

      <!-- Category Filter Tabs -->
      <div class="category-filter-bar" style="margin-bottom: 1rem;">
        <button class="filter-tab-btn ${this.currentCategory === 'all' ? 'active' : ''}" onclick="PrintComponent.setCategory('all')">
          SEMUA KATEGORI
        </button>
        <button class="filter-tab-btn ${this.currentCategory === 'sd_pa' ? 'active' : ''}" onclick="PrintComponent.setCategory('sd_pa')">
          SD PUTRA
        </button>
        <button class="filter-tab-btn ${this.currentCategory === 'sd_pi' ? 'active' : ''}" onclick="PrintComponent.setCategory('sd_pi')">
          SD PUTRI
        </button>
        <button class="filter-tab-btn ${this.currentCategory === 'smp_pa' ? 'active' : ''}" onclick="PrintComponent.setCategory('smp_pa')">
          SMP PUTRA
        </button>
        <button class="filter-tab-btn ${this.currentCategory === 'smp_pi' ? 'active' : ''}" onclick="PrintComponent.setCategory('smp_pi')">
          SMP PUTRI
        </button>
        <button class="filter-tab-btn ${this.currentCategory === 'penegak_pa' ? 'active' : ''}" onclick="PrintComponent.setCategory('penegak_pa')">
          PENEGAK PUTRA
        </button>
        <button class="filter-tab-btn ${this.currentCategory === 'penegak_pi' ? 'active' : ''}" onclick="PrintComponent.setCategory('penegak_pi')">
          PENEGAK PUTRI
        </button>
      </div>

      <!-- Competition Selector -->
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; background: rgba(0,0,0,0.3); padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--border-creator);">
        <label style="font-weight: 700; color: var(--neon-cyan); font-size: 0.82rem; white-space: nowrap;">
          Pilih Bidang Lomba:
        </label>
        <select class="form-control" style="max-width: 380px;" onchange="PrintComponent.setLomba(this.value)">
          <option value="combined" ${this.currentLomba === 'combined' ? 'selected' : ''}>Materi Gabungan (Juara Umum)</option>
          <option value="all_comp" ${this.currentLomba === 'all_comp' ? 'selected' : ''}>Seluruh ${COMPETITIONS.length} Mata Bidang Lomba</option>
          ${COMPETITIONS.map(c => `<option value="${c.id}" ${this.currentLomba === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>

      <!-- Printable Document Preview Card -->
      <div class="card-panel">
        <div class="card-panel-header">
          <h3 class="panel-title">
            Pratinjau Dokumen Cetak (${this.currentDocType === 'sk_kejuaraan' ? 'SK Penetapan Kejuaraan' : 'Berita Acara Penyerahan Piala'})
          </h3>
          <button class="btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.78rem;" onclick="window.print()">
            Cetak Dokumen
          </button>
        </div>

        <div class="printable-document" style="background: #fff; color: #000; padding: 2.5rem; border-radius: var(--radius-md); font-family: 'Times New Roman', serif; line-height: 1.5;">
          ${this.currentDocType === 'sk_kejuaraan' ? this.renderSKTemplate(catLabel) : this.renderBeritaAcaraTemplate(catLabel)}
        </div>
      </div>
    `;

    lucide.createIcons();
  },

  setDocType(type) {
    this.currentDocType = type;
    this.renderPrintPage(document.getElementById('app-main-content'));
  },

  setCategory(cat) {
    this.currentCategory = cat;
    this.renderPrintPage(document.getElementById('app-main-content'));
  },

  setLomba(lombaId) {
    this.currentLomba = lombaId;
    this.renderPrintPage(document.getElementById('app-main-content'));
  },

  renderHeaderKop() {
    return `
      <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 0.8rem; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.5rem; text-transform: uppercase; font-weight: bold; margin: 0;">GERAKAN PRAMUKA KWARTIR CABANG</h2>
        <h3 style="font-size: 1.2rem; text-transform: uppercase; font-weight: bold; margin: 0.2rem 0;">PANITIA REKAPITULASI LOMBA PRAMUKA JUARA "SIMIKA"</h3>
        <p style="font-size: 0.88rem; margin: 0;">Sekretariat Utama: Bumi Perkemahan Pramuka &bull; Website: simika.pramuka.or.id &bull; Email: info@simika.or.id</p>
      </div>
    `;
  },

  renderSKTemplate(catLabel) {
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let tablesHTML = '';

    if (this.currentLomba === 'combined') {
      const levelKey = this.currentCategory === 'all' ? 'all' : (this.currentCategory.startsWith('sd_') ? 'sd' : this.currentCategory.startsWith('smp_') ? 'smp' : 'penegak');
      const genderKey = this.currentCategory.includes('_pa') ? 'pa' : this.currentCategory.includes('_pi') ? 'pi' : 'all';
      const list = window.Calculators.getCombinedLeaderboard(
        COMPETITIONS.map(c => c.id),
        levelKey,
        genderKey
      );

      tablesHTML = `
        <h4 style="font-size: 1.05rem; font-weight: bold; margin: 1.5rem 0 0.5rem 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 4px;">
          DAFTAR PEMENANG JUARA UMUM / MATERI GABUNGAN (${catLabel.toUpperCase()})
        </h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">Peringkat Juara</th>
              <th style="border: 1px solid #000; padding: 6px;">ID Regu</th>
              <th style="border: 1px solid #000; padding: 6px;">Nama Regu / Sangga</th>
              <th style="border: 1px solid #000; padding: 6px;">Pangkalan / Sekolah</th>
              <th style="border: 1px solid #000; padding: 6px;">Kategori</th>
              <th style="border: 1px solid #000; padding: 6px;">Total Akumulasi Skor</th>
              <th style="border: 1px solid #000; padding: 6px;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${list.length === 0 ? `
              <tr><td colspan="7" style="text-align: center; border: 1px solid #000; padding: 10px;">Belum ada peserta terdaftar.</td></tr>
            ` : list.map(item => {
              const catObj = CATEGORIES.find(c => c.id === item.team.category);
              const rankLabel = item.rank === 1 ? 'JUARA UMUM I' : item.rank === 2 ? 'JUARA UMUM II' : item.rank === 3 ? 'JUARA UMUM III' : `Peringkat ${item.rank}`;
              const reguIdCode = item.team.id || item.schoolId || '-';
              return `
                <tr>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${rankLabel}</td>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${reguIdCode}</td>
                  <td style="border: 1px solid #000; padding: 6px; font-weight: bold;">${item.team.name}</td>
                  <td style="border: 1px solid #000; padding: 6px;">${item.team.pangkalan}</td>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center;">${catObj?.short || item.team.category}</td>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${item.combinedTotal} Pts</td>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center; color: ${item.isTie ? '#dc2626' : '#000'}; font-weight: ${item.isTie ? 'bold' : 'normal'};">${item.displayKet || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else if (this.currentLomba === 'all_comp') {
      tablesHTML = COMPETITIONS.map(c => {
        const list = window.Calculators.getLombaLeaderboard(c.id, this.currentCategory);
        const isSchoolComp = (c.id === 'joged_komando' || c.id === 'lkbb');
        return `
          <h4 style="font-size: 1rem; font-weight: bold; margin: 1.5rem 0 0.5rem 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px;">
            DAFTAR PEMENANG ${c.name.toUpperCase()} (${catLabel.toUpperCase()})
          </h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.88rem;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="border: 1px solid #000; padding: 5px;">Peringkat</th>
                <th style="border: 1px solid #000; padding: 5px;">${isSchoolComp ? 'ID Basis' : 'ID Regu'}</th>
                ${isSchoolComp ? `<th style="border: 1px solid #000; padding: 5px;">Sekolah / Pangkalan</th><th style="border: 1px solid #000; padding: 5px;">Tingkat</th>` : `<th style="border: 1px solid #000; padding: 5px;">Nama Regu / Sangga</th><th style="border: 1px solid #000; padding: 5px;">Pangkalan / Sekolah</th>`}
                <th style="border: 1px solid #000; padding: 5px;">Skor Final</th>
                <th style="border: 1px solid #000; padding: 5px;">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${list.length === 0 ? `
                <tr><td colspan="6" style="text-align: center; border: 1px solid #000; padding: 8px;">Belum ada peserta/sekolah dinilai.</td></tr>
              ` : list.map(item => {
                const rankLabel = item.rank === '-' ? '-' : item.rank === 1 ? 'JUARA I' : item.rank === 2 ? 'JUARA II' : item.rank === 3 ? 'JUARA III' : item.rank === 4 ? 'HARAPAN I' : item.rank === 5 ? 'HARAPAN II' : item.rank === 6 ? 'HARAPAN III' : `Peringkat ${item.rank}`;
                const displayName = isSchoolComp ? (item.pangkalan || item.team.pangkalan || item.team.name) : item.team.name;
                const levelText = (item.levelLabel || item.level || 'SD').toUpperCase();
                const reguIdCode = item.basisId || item.scoreObj?.basisId || item.team.id || item.schoolId || '-';
                return `
                  <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${rankLabel}</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${reguIdCode}</td>
                    <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">${displayName}</td>
                    <td style="border: 1px solid #000; padding: 5px; ${isSchoolComp ? 'text-align: center;' : ''}">${isSchoolComp ? levelText : item.team.pangkalan}</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${item.totalScore > 0 ? item.totalScore : '-'}</td>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center; color: ${item.isTie ? '#dc2626' : '#000'}; font-weight: ${item.isTie ? 'bold' : 'normal'};">${item.displayKet || '-'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      }).join('');
    } else {
      const compObj = COMPETITIONS.find(c => c.id === this.currentLomba);
      const list = window.Calculators.getLombaLeaderboard(this.currentLomba, this.currentCategory);
      const isSchoolComp = (this.currentLomba === 'joged_komando' || this.currentLomba === 'lkbb');
      tablesHTML = `
        <h4 style="font-size: 1.05rem; font-weight: bold; margin: 1.5rem 0 0.5rem 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 4px;">
          DAFTAR PEMENANG ${compObj?.name.toUpperCase()} (${catLabel.toUpperCase()})
        </h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">Peringkat</th>
              <th style="border: 1px solid #000; padding: 6px;">${isSchoolComp ? 'ID Basis' : 'ID Regu'}</th>
              ${isSchoolComp ? `<th style="border: 1px solid #000; padding: 6px;">Sekolah / Pangkalan</th><th style="border: 1px solid #000; padding: 6px;">Tingkat Kategori</th>` : `<th style="border: 1px solid #000; padding: 6px;">Nama Regu / Sangga</th><th style="border: 1px solid #000; padding: 6px;">Pangkalan / Sekolah</th>`}
              <th style="border: 1px solid #000; padding: 6px;">Skor Final</th>
              <th style="border: 1px solid #000; padding: 6px;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${list.length === 0 ? `
              <tr><td colspan="6" style="text-align: center; border: 1px solid #000; padding: 10px;">Belum ada peserta/sekolah dinilai.</td></tr>
            ` : list.map(item => {
              const rankLabel = item.rank === '-' ? '-' : item.rank === 1 ? 'JUARA I' : item.rank === 2 ? 'JUARA II' : item.rank === 3 ? 'JUARA III' : item.rank === 4 ? 'HARAPAN I' : item.rank === 5 ? 'HARAPAN II' : item.rank === 6 ? 'HARAPAN III' : `Peringkat ${item.rank}`;
              const displayName = isSchoolComp ? (item.pangkalan || item.team.pangkalan || item.team.name) : item.team.name;
              const levelText = (item.levelLabel || item.level || 'SD').toUpperCase();
              const reguIdCode = item.basisId || item.scoreObj?.basisId || item.team.id || item.schoolId || '-';
              return `
                <tr>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${rankLabel}</td>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${reguIdCode}</td>
                  <td style="border: 1px solid #000; padding: 6px; font-weight: bold;">${displayName}</td>
                  <td style="border: 1px solid #000; padding: 6px; ${isSchoolComp ? 'text-align: center;' : ''}">${isSchoolComp ? levelText : item.team.pangkalan}</td>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${item.totalScore > 0 ? item.totalScore : '-'}</td>
                  <td style="border: 1px solid #000; padding: 6px; text-align: center; color: ${item.isTie ? '#dc2626' : '#000'}; font-weight: ${item.isTie ? 'bold' : 'normal'};">${item.displayKet || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    return `
      ${this.renderHeaderKop()}

      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.25rem; font-weight: bold; text-decoration: underline; margin-bottom: 0.2rem;">SURAT KEPUTUSAN DEWAN JURI</h3>
        <p style="font-size: 0.95rem; font-weight: bold; margin: 0;">Nomor: SK/042/PAN-SIMIKA/2026</p>
        <p style="font-size: 0.9rem; font-style: italic; margin-top: 0.4rem;">
          TENTANG PENETAPAN PEMENANG &amp; KEJUARAAN LOMBA PRAMUKA JUARA "SIMIKA"
        </p>
      </div>

      <div style="font-size: 0.9rem; text-align: justify; margin-bottom: 1.25rem;">
        <p><strong>MENIMBANG:</strong> Bahwa demi kelancaran, objektivitas, serta keabsahan pelaksanaan Lomba Pramuka SiMika, dipandang perlu untuk menetapkan Pemenang dan Kejuaraan melalui Surat Keputusan Resmi Dewan Juri.</p>
        <p><strong>MENGINGAT:</strong> 1. Anggaran Dasar dan Anggaran Rumah Tangga Gerakan Pramuka.<br>2. Hasil Penilaian Tim Juri Seluruh Mata Bidang Lomba yang telah dikompilasi oleh Sistem Rekapitulasi SiMika.</p>
        <p><strong>MEMUTUSKAN:</strong> Menetapkan nama-nama regu/sangga/sekolah berikut ini sebagai pemenang resmi kejuaraan lomba (${catLabel}):</p>
      </div>

      ${tablesHTML}

      <div style="font-size: 0.88rem; margin-top: 1rem;">
        <p>Keputusan Dewan Juri ini bersifat MUTLAK dan tidak dapat diganggu gugat.</p>
        <p style="text-align: right;">Ditetapkan di: Bumi Perkemahan Utama<br>Pada Tanggal: ${dateStr}</p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 2.5rem; text-align: center; font-size: 0.9rem;">
        <div>
          <p style="margin-bottom: 3.5rem;">Ketua Dewan Juri,</p>
          <p style="font-weight: bold; text-decoration: underline;">( Kak Ir. H. Supriyadi, M.Pd )</p>
          <p style="font-size: 0.85rem;">NTA. 12.01.002.88</p>
        </div>
        <div>
          <p style="margin-bottom: 3.5rem;">Ketua Panitia Pelaksana,</p>
          <p style="font-weight: bold; text-decoration: underline;">( Kak Dr. Ahmad Fauzi, M.Si )</p>
          <p style="font-size: 0.85rem;">NTA. 12.01.001.04</p>
        </div>
      </div>
    `;
  },

  renderBeritaAcaraTemplate(catLabel) {
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let winnersList = [];

    if (this.currentLomba === 'combined') {
      const levelKey = this.currentCategory === 'all' ? 'all' : (this.currentCategory.startsWith('sd_') ? 'sd' : this.currentCategory.startsWith('smp_') ? 'smp' : 'penegak');
      const genderKey = this.currentCategory.includes('_pa') ? 'pa' : this.currentCategory.includes('_pi') ? 'pi' : 'all';
      const list = window.Calculators.getCombinedLeaderboard(COMPETITIONS.map(c => c.id), levelKey, genderKey);

      winnersList = list.slice(0, 6).map(item => ({
        reguId: item.team.id || item.schoolId || '-',
        compName: 'Materi Gabungan (Juara Umum)',
        rankLabel: item.rank === 1 ? 'Juara Umum I (Piala Bergilir)' : item.rank === 2 ? 'Juara Umum II' : item.rank === 3 ? 'Juara Umum III' : `Peringkat ${item.rank}`,
        teamName: item.team.name,
        pangkalan: item.team.pangkalan,
        score: `${item.combinedTotal} Pts`
      }));
    } else if (this.currentLomba === 'all_comp') {
      COMPETITIONS.forEach(c => {
        const list = window.Calculators.getLombaLeaderboard(c.id, this.currentCategory);
        const isSchoolComp = (c.id === 'joged_komando' || c.id === 'lkbb');
        list.slice(0, 3).forEach(item => {
          winnersList.push({
            reguId: item.basisId || item.scoreObj?.basisId || item.team.id || item.schoolId || '-',
            compName: c.name,
            rankLabel: item.rank === 1 ? 'Juara I' : item.rank === 2 ? 'Juara II' : 'Juara III',
            teamName: isSchoolComp ? (item.pangkalan || item.team.pangkalan || item.team.name) : item.team.name,
            pangkalan: isSchoolComp ? `Tingkat ${(item.levelLabel || item.level || 'SD').toUpperCase()}` : item.team.pangkalan,
            score: `${item.totalScore}`
          });
        });
      });
    } else {
      const compObj = COMPETITIONS.find(c => c.id === this.currentLomba);
      const list = window.Calculators.getLombaLeaderboard(this.currentLomba, this.currentCategory);
      const isSchoolComp = (this.currentLomba === 'joged_komando' || this.currentLomba === 'lkbb');
      winnersList = list.slice(0, 6).map(item => ({
        reguId: item.basisId || item.scoreObj?.basisId || item.team.id || item.schoolId || '-',
        compName: compObj?.name || 'Lomba',
        rankLabel: item.rank === 1 ? 'Juara I' : item.rank === 2 ? 'Juara II' : item.rank === 3 ? 'Juara III' : `Peringkat ${item.rank}`,
        teamName: isSchoolComp ? (item.pangkalan || item.team.pangkalan || item.team.name) : item.team.name,
        pangkalan: isSchoolComp ? `Tingkat ${(item.levelLabel || item.level || 'SD').toUpperCase()}` : item.team.pangkalan,
        score: `${item.totalScore}`
      }));
    }

    return `
      ${this.renderHeaderKop()}

      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.25rem; font-weight: bold; text-decoration: underline; margin-bottom: 0.2rem;">BERITA ACARA SERAH TERIMA PIALA &amp; TROPHY KEJUARAAN</h3>
        <p style="font-size: 0.95rem; font-weight: bold; margin: 0;">Nomor: BA/088/PAN-SIMIKA/2026</p>
      </div>

      <div style="font-size: 0.9rem; text-align: justify; margin-bottom: 1.25rem; line-height: 1.6;">
        <p>Pada hari ini, <strong>${dateStr}</strong>, bertempat di Bumi Perkemahan Utama, kami yang bertanda tangan di bawah ini:</p>
        <ol style="margin-top: 0.3rem; padding-left: 1.2rem;">
          <li><strong>PANITIA PELAKSANA SIMIKA</strong>, selanjutnya disebut sebagai <strong>PIHAK PERTAMA (Penyerah)</strong>.</li>
          <li><strong>PEMBINA / PENDAMPING REGU JUARA</strong>, selanjutnya disebut sebagai <strong>PIHAK KEDUA (Penerima)</strong>.</li>
        </ol>
        <p>Bahwa PIHAK PERTAMA telah menyerahkan Piala &amp; Trophy Kejuaraan kepada PIHAK KEDUA dalam keadaan baik dan lengkap sesuai daftar penerima berikut:</p>
      </div>

      <h4 style="font-size: 1rem; font-weight: bold; margin: 1rem 0 0.5rem 0; text-transform: uppercase;">
        DAFTAR PENERIMA PIALA &amp; TROPHY KEJUARAAN (${catLabel.toUpperCase()})
      </h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 0.88rem;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #000; padding: 6px; width: 4%;">No</th>
            <th style="border: 1px solid #000; padding: 6px; width: 14%;">ID Regu</th>
            <th style="border: 1px solid #000; padding: 6px; width: 20%;">Mata Lomba</th>
            <th style="border: 1px solid #000; padding: 6px; width: 18%;">Peringkat Trophy</th>
            <th style="border: 1px solid #000; padding: 6px; width: 22%;">Regu / Sangga Penerima</th>
            <th style="border: 1px solid #000; padding: 6px; width: 14%;">Pangkalan / Sekolah</th>
            <th style="border: 1px solid #000; padding: 6px; width: 8%;">Tanda Tangan Penerima</th>
          </tr>
        </thead>
        <tbody>
          ${winnersList.length === 0 ? `
            <tr><td colspan="7" style="text-align: center; border: 1px solid #000; padding: 10px;">Belum ada data penerima piala.</td></tr>
          ` : winnersList.map((w, idx) => `
            <tr>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">${idx + 1}</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${w.reguId}</td>
              <td style="border: 1px solid #000; padding: 6px; font-weight: bold;">${w.compName}</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${w.rankLabel}</td>
              <td style="border: 1px solid #000; padding: 6px;">${w.teamName}</td>
              <td style="border: 1px solid #000; padding: 6px;">${w.pangkalan}</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center; height: 35px; vertical-align: bottom; font-size: 0.75rem; color: #64748b;">
                ${idx + 1}. .........
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <p style="font-size: 0.9rem; margin-bottom: 2rem;">Demikian Berita Acara Serah Terima Piala ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>

      <div style="display: flex; justify-content: space-between; text-align: center; font-size: 0.9rem;">
        <div style="width: 45%;">
          <p style="margin-bottom: 4rem;">PIHAK KEDUA<br>Perwakilan Pembina Pendamping,</p>
          <p style="font-weight: bold; text-decoration: underline;">( .................................................. )</p>
          <p style="font-size: 0.85rem;">NTA / NIP. .................................</p>
        </div>
        <div style="width: 45%;">
          <p style="margin-bottom: 4rem;">PIHAK PERTAMA<br>Panitia Pelaksana SiMika,</p>
          <p style="font-weight: bold; text-decoration: underline;">( Kak Dr. Ahmad Fauzi, M.Si )</p>
          <p style="font-size: 0.85rem;">NTA. 12.01.001.04</p>
        </div>
      </div>
    `;
  }
};

window.PrintComponent = PrintComponent;
