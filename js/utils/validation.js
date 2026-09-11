/* ==========================================================================
   SiMika - Smart Score Validation & Final Check Engine
   - Intelligent Input Bounds & Range Checking
   - Judge Anomaly & Discrepancy Warning System
   - Completeness & Digital Verification Matrix
   ========================================================================== */

class SmartValidator {

  /**
   * Validate score entry for any competition ID
   * @param {string} lombaId 
   * @param {object} scoreObj 
   * @returns {object} { valid: boolean, errors: [], warnings: [], summary: {} }
   */
  validate(lombaId, scoreObj) {
    const errors = [];
    const warnings = [];

    if (!scoreObj || typeof scoreObj !== 'object') {
      errors.push('Objek nilai tidak valid atau kosong.');
      return { valid: false, errors, warnings, summary: { status: 'INVALID' } };
    }

    switch (lombaId) {
      case 'administrasi':
        this.validateAdministrasi(scoreObj, errors, warnings);
        break;
      case 'p3k':
        this.validateP3K(scoreObj, errors, warnings);
        break;
      case 'joged_komando':
        this.validateJogedKomando(scoreObj, errors, warnings);
        break;
      case 'lkbb':
        this.validateLKBB(scoreObj, errors, warnings);
        break;
      default:
        // Single score competitions (banksoal, pioneering, sandi, morse, semaphore, ketangkasan)
        this.validateSingleScore(scoreObj, errors, warnings);
        break;
    }

    const valid = errors.length === 0;
    return {
      valid,
      errors,
      warnings,
      summary: {
        totalScore: window.Calculators ? window.Calculators.getCompetitionTotalScore(lombaId, scoreObj) : 0,
        status: !valid ? 'ERROR' : warnings.length > 0 ? 'WARNING' : 'PASSED'
      }
    };
  }

  // 1. Single Score Competitions (Bank Soal, Sandi, Morse, etc.)
  validateSingleScore(scoreObj, errors, warnings) {
    const score = Number(scoreObj.score) || 0;

    if (score < 0) {
      errors.push('Nilai tidak boleh bernilai negatif.');
    }
    if (score > 100) {
      errors.push('Nilai maksimal melebihi batas standar (Maksimal 100).');
    }
    if (score === 0) {
      warnings.push('Nilai dimasukkan sebagai 0 (Nol). Pastikan peserta memang tidak memperoleh poin.');
    }
  }

  // 2. Administrasi Validation
  validateAdministrasi(scoreObj, errors, warnings) {
    const fields = [
      { key: 'pendaftaran', label: 'Formulir Pendaftaran', max: 50 },
      { key: 'pernyataan', label: 'Surat Pernyataan', max: 20 },
      { key: 'kta', label: 'KTA Pramuka', max: 20 },
      { key: 'kwitansi', label: 'Kwitansi Pembayaran', max: 10 },
      { key: 'mandat', label: 'Surat Mandat', max: 20 },
      { key: 'ijin', label: 'Izin Orang Tua', max: 20 },
      { key: 'asuransi', label: 'Asuransi / BPJS', max: 10 },
      { key: 'bumbung', label: 'Bumbung Kemanusiaan', max: 10 }
    ];

    let filledCount = 0;
    fields.forEach(f => {
      const val = Number(scoreObj[f.key]) || 0;
      if (val < 0) {
        errors.push(`${f.label} tidak boleh bernilai negatif.`);
      }
      if (val > f.max) {
        errors.push(`${f.label} melebihi batas maksimum (${f.max} poin).`);
      }
      if (val > 0) filledCount++;
    });

    if (filledCount === 0) {
      warnings.push('Belum ada kriteria administrasi yang terisi.');
    }
  }

  // 3. P3K Validation
  validateP3K(scoreObj, errors, warnings) {
    const teori = Number(scoreObj.teori) || 0;
    const praktek = Number(scoreObj.praktek) || 0;

    if (teori < 0 || praktek < 0) {
      errors.push('Nilai Teori maupun Praktek P3K tidak boleh negatif.');
    }
    if (teori > 100) {
      errors.push('Nilai Teori P3K melebihi batas 100 poin.');
    }
    if (praktek > 100) {
      errors.push('Nilai Praktek P3K melebihi batas 100 poin.');
    }
    if (Math.abs(teori - praktek) > 40 && teori > 0 && praktek > 0) {
      warnings.push(`⚠️ ANOMALI P3K: Selisih antara Nilai Teori (${teori}) dan Praktek (${praktek}) cukup signifikan (${Math.abs(teori - praktek)} poin).`);
    }
  }

  // 4. Joged Komando Discrepancy & Anomaly Detection (3 Judges)
  validateJogedKomando(scoreObj, errors, warnings) {
    const j1 = scoreObj.juri1 || {};
    const j2 = scoreObj.juri2 || {};
    const j3 = scoreObj.juri3 || {};

    const calcTotalJuri = (j) => (Number(j.kreativitas) || 0) + (Number(j.kekompakkan) || 0) + (Number(j.musik) || 0);

    const t1 = calcTotalJuri(j1);
    const t2 = calcTotalJuri(j2);
    const t3 = calcTotalJuri(j3);

    // Range checks
    [ { name: 'Juri 1', obj: j1 }, { name: 'Juri 2', obj: j2 }, { name: 'Juri 3', obj: j3 } ].forEach(j => {
      ['kreativitas', 'kekompakkan', 'musik'].forEach(k => {
        const val = Number(j.obj[k]) || 0;
        if (val < 0) errors.push(`Nilai ${k} pada ${j.name} tidak boleh negatif.`);
        if (val > 100) errors.push(`Nilai ${k} pada ${j.name} melebihi batas (Maksimal 100).`);
      });
    });

    // Check discrepancy between 3 judges
    const totals = [ { label: 'Juri 1', val: t1 }, { label: 'Juri 2', val: t2 }, { label: 'Juri 3', val: t3 } ];

    for (let i = 0; i < totals.length; i++) {
      for (let j = i + 1; j < totals.length; j++) {
        const diff = Math.abs(totals[i].val - totals[j].val);
        if (diff > 25 && totals[i].val > 0 && totals[j].val > 0) {
          warnings.push(`⚠️ SELISIH JURI TINGGI: Terdapat perbedaan ${diff} poin antara ${totals[i].label} (${totals[i].val}) dan ${totals[j].label} (${totals[j].val}).`);
        }
      }
    }
  }

  // 5. LKBB Discrepancy & Anomaly Detection
  validateLKBB(scoreObj, errors, warnings) {
    const pbb = scoreObj.pbbDasar || {};
    const vf = scoreObj.variasi || {};
    const dt = scoreObj.danton || {};

    // PBB Dasar Check
    const pbbJ1 = Number(pbb.juri1) || 0;
    const pbbJ2 = Number(pbb.juri2) || 0;
    const pbbJ3 = Number(pbb.juri3) || 0;

    const diffPbb = Math.max(pbbJ1, pbbJ2, pbbJ3) - Math.min(pbbJ1 > 0 ? pbbJ1 : Infinity, pbbJ2 > 0 ? pbbJ2 : Infinity, pbbJ3 > 0 ? pbbJ3 : Infinity);
    if (diffPbb > 25 && diffPbb < Infinity) {
      warnings.push(`⚠️ ANOMALI PBB DASAR: Selisih antar juri PBB Dasar mencapai ${diffPbb} poin.`);
    }

    // Check bounds
    [pbbJ1, pbbJ2, pbbJ3].forEach((v, idx) => {
      if (v < 0) errors.push(`Nilai PBB Dasar Juri ${idx + 1} tidak boleh negatif.`);
      if (v > 100) errors.push(`Nilai PBB Dasar Juri ${idx + 1} melebihi 100 poin.`);
    });
  }
}

window.SmartValidator = new SmartValidator();
