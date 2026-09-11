/* ==========================================================================
   SiPraja - Calculation & Ranking Algorithms Engine
   ========================================================================== */

const Calculators = {
  // 1. Administrasi Total
  calculateAdministrasi(scoreObj) {
    if (!scoreObj) return 0;
    return (
      (Number(scoreObj.pendaftaran) || 0) +
      (Number(scoreObj.pernyataan) || 0) +
      (Number(scoreObj.kta) || 0) +
      (Number(scoreObj.kwitansi) || 0) +
      (Number(scoreObj.mandat) || 0) +
      (Number(scoreObj.ijin) || 0) +
      (Number(scoreObj.asuransi) || 0) +
      (Number(scoreObj.bumbung) || 0)
    );
  },

  // 2. Bank Soal Total
  calculateBankSoal(scoreObj) {
    if (!scoreObj) return 0;
    return Number(scoreObj.score) || 0;
  },

  // 3. P3K Total
  calculateP3K(scoreObj) {
    if (!scoreObj) return 0;
    return (Number(scoreObj.teori) || 0) + (Number(scoreObj.praktek) || 0);
  },

  // 4. Pioneering Total
  calculatePioneering(scoreObj) {
    if (!scoreObj) return 0;
    return Number(scoreObj.score) || 0;
  },

  // 5. Sandi Total
  calculateSandi(scoreObj) {
    if (!scoreObj) return 0;
    return Number(scoreObj.score) || 0;
  },

  // 6. Morse Total
  calculateMorse(scoreObj) {
    if (!scoreObj) return 0;
    return Number(scoreObj.score) || 0;
  },

  // 7. Semaphore Total
  calculateSemaphore(scoreObj) {
    if (!scoreObj) return 0;
    return Number(scoreObj.score) || 0;
  },

  // 8. Ketangkasan Total
  calculateKetangkasan(scoreObj) {
    if (!scoreObj) return 0;
    return Number(scoreObj.score) || 0;
  },

  // 9. Joged Komando Total (3 Judges + Penalty)
  calculateJogedKomando(scoreObj) {
    if (!scoreObj) return { totalJuri1: 0, totalJuri2: 0, totalJuri3: 0, penalty: 0, total: 0 };
    const j1 = scoreObj.juri1 || {};
    const j2 = scoreObj.juri2 || {};
    const j3 = scoreObj.juri3 || {};

    const totalJ1 = (Number(j1.kreativitas) || 0) + (Number(j1.kekompakkan) || 0) + (Number(j1.musik) || 0);
    const totalJ2 = (Number(j2.kreativitas) || 0) + (Number(j2.kekompakkan) || 0) + (Number(j2.musik) || 0);
    const totalJ3 = (Number(j3.kreativitas) || 0) + (Number(j3.kekompakkan) || 0) + (Number(j3.musik) || 0);
    const penalty = Number(scoreObj.penalty) || 0;

    const total = (totalJ1 + totalJ2 + totalJ3) - penalty;
    return {
      totalJuri1: totalJ1,
      totalJuri2: totalJ2,
      totalJuri3: totalJ3,
      penalty,
      total: Math.max(0, total)
    };
  },

  // 10. LKBB Breakdown (DP, PBB Dasar, Variasi Formasi, & Danton dipisahkan)
  calculateLKBB(scoreObj) {
    if (!scoreObj) return { totalDp: 0, totalPbb: 0, totalVariasi: 0, totalDanton: 0, total: 0 };
    
    let totalDp = 0;
    if (typeof scoreObj.dp === 'number') {
      totalDp = scoreObj.dp;
    } else if (typeof scoreObj.dp === 'object' && scoreObj.dp !== null) {
      totalDp = (Number(scoreObj.dp.juri1) || 0) + (Number(scoreObj.dp.juri2) || 0) + (Number(scoreObj.dp.juri3) || 0);
    } else {
      totalDp = Number(scoreObj.dp) || 0;
    }

    const pbb = scoreObj.pbbDasar || {};
    const varForm = scoreObj.variasi || {};
    const danton = scoreObj.danton || {};

    const totalPbb = (Number(pbb.juri1) || 0) + (Number(pbb.juri2) || 0) + (Number(pbb.juri3) || 0);
    const totalVariasi = (Number(varForm.juri1) || 0) + (Number(varForm.juri2) || 0) + (Number(varForm.juri3) || 0);
    const totalDanton = (Number(danton.juri1) || 0) + (Number(danton.juri2) || 0) + (Number(danton.juri3) || 0);

    const total = totalDp + totalPbb + totalVariasi + totalDanton;

    return {
      totalDp,
      totalPbb,
      totalVariasi,
      totalDanton,
      total
    };
  },

  // Generic total calculation for any competition ID
  getCompetitionTotalScore(lombaId, scoreObj) {
    if (!scoreObj) return 0;
    switch (lombaId) {
      case 'administrasi': return this.calculateAdministrasi(scoreObj);
      case 'banksoal': return this.calculateBankSoal(scoreObj);
      case 'p3k': return this.calculateP3K(scoreObj);
      case 'pioneering': return this.calculatePioneering(scoreObj);
      case 'sandi': return this.calculateSandi(scoreObj);
      case 'morse': return this.calculateMorse(scoreObj);
      case 'semaphore': return this.calculateSemaphore(scoreObj);
      case 'ketangkasan': return this.calculateKetangkasan(scoreObj);
      case 'joged_komando': return this.calculateJogedKomando(scoreObj).total;
      case 'lkbb': return this.calculateLKBB(scoreObj).total;
      default:
        if (typeof scoreObj.score === 'number' || typeof scoreObj.score === 'string') {
          return Number(scoreObj.score) || 0;
        }
        return (Number(scoreObj.teori) || 0) + (Number(scoreObj.praktek) || 0);
    }
  },

  // Helper to flag ties for top 6 ranks (Juara 1..6)
  flagTop6Ties(results, scoreKey, rankKey) {
    const scoreCounts = {};
    results.forEach(item => {
      const val = item[scoreKey];
      if (val > 0) {
        scoreCounts[val] = (scoreCounts[val] || 0) + 1;
      }
    });

    results.forEach(item => {
      const val = item[scoreKey];
      const rankVal = item[rankKey];
      const isTieScore = val > 0 && scoreCounts[val] > 1;
      const isTop6Rank = typeof rankVal === 'number' && rankVal <= 6;

      if (isTieScore && isTop6Rank) {
        item.isTie = true;
        const orig = item.scoreObj?.ket ? item.scoreObj.ket.trim() : '';
        if (!orig || orig === '-') {
          item.displayKet = 'Nilai Sama Tanding Ulang';
        } else if (!orig.includes('Nilai Sama Tanding Ulang')) {
          item.displayKet = `Nilai Sama Tanding Ulang (${orig})`;
        } else {
          item.displayKet = orig;
        }
      } else {
        item.isTie = false;
        item.displayKet = item.scoreObj?.ket || '-';
      }
    });
  },

  // Leaderboard Calculation per Lomba & Category
  getLombaLeaderboard(lombaId, categoryFilter = 'all') {
    const isSchoolCompetition = (lombaId === 'joged_komando' || lombaId === 'lkbb');

    if (isSchoolCompetition) {
      const allTeams = window.dataStore.getTeams('all');
      const scores = window.dataStore.getScoresForLomba(lombaId);

      // Group teams by school name (pangkalan) & level (sd, smp, penegak)
      const schoolMap = {};

      allTeams.forEach(team => {
        const catObj = CATEGORIES.find(c => c.id === team.category);
        const level = catObj?.level || 'sd';
        const pangkalanName = (team.pangkalan || 'Tanpa Pangkalan').trim();
        const key = `${level}_${pangkalanName}`;

        if (!schoolMap[key]) {
          schoolMap[key] = {
            pangkalan: pangkalanName,
            level: level,
            levelLabel: level.toUpperCase(),
            teams: []
          };
        }
        schoolMap[key].teams.push(team);
      });

      // Filter schools by categoryFilter & qualification rule (must send > 1 regu)
      const schoolList = Object.values(schoolMap).filter(school => {
        // Qualification rule: school must send MORE THAN 1 REGU
        if (school.teams.length <= 1) return false;

        // Level filtering
        if (categoryFilter === 'sd' || categoryFilter === 'sd_pa' || categoryFilter === 'sd_pi') {
          return school.level === 'sd';
        }
        if (categoryFilter === 'smp' || categoryFilter === 'smp_pa' || categoryFilter === 'smp_pi') {
          return school.level === 'smp';
        }
        if (categoryFilter === 'penegak' || categoryFilter === 'penegak_pa' || categoryFilter === 'penegak_pi') {
          return school.level === 'penegak';
        }
        return true; // 'all'
      });

      const results = schoolList.map(school => {
        const safePangkalan = school.pangkalan.replace(/[^a-zA-Z0-9]/g, '_');
        const schoolId = `SCH_${school.level.toUpperCase()}_${safePangkalan}`;

        // Look for score under schoolId for school competitions
        const scoreObj = scores[schoolId];

        const totalScore = this.getCompetitionTotalScore(lombaId, scoreObj);
        const basisId = scoreObj?.basisId || schoolId;

        return {
          isSchool: true,
          schoolId: schoolId,
          basisId: basisId,
          pangkalan: school.pangkalan,
          level: school.level,
          levelLabel: school.level.toUpperCase(),
          reguCount: school.teams.length,
          team: {
            id: basisId,
            rawId: schoolId,
            name: school.pangkalan,
            pangkalan: school.pangkalan,
            category: `${school.level}_pa`
          },
          scoreObj,
          totalScore
        };
      });

      results.sort((a, b) => b.totalScore - a.totalScore);

      let currentRank = 1;
      results.forEach((item, index) => {
        if (index > 0 && item.totalScore < results[index - 1].totalScore) {
          currentRank = index + 1;
        }
        item.rank = item.totalScore > 0 ? currentRank : '-';
      });

      this.flagTop6Ties(results, 'totalScore', 'rank');
      return results;
    }

    // Default per-regu competitions
    const teams = window.dataStore.getTeams(categoryFilter);
    const scores = window.dataStore.getScoresForLomba(lombaId);

    const results = teams.map(team => {
      const scoreObj = scores[team.id];
      const totalScore = this.getCompetitionTotalScore(lombaId, scoreObj);
      return {
        team,
        scoreObj,
        totalScore
      };
    });

    results.sort((a, b) => b.totalScore - a.totalScore);

    let currentRank = 1;
    results.forEach((item, index) => {
      if (index > 0 && item.totalScore < results[index - 1].totalScore) {
        currentRank = index + 1;
      }
      item.rank = item.totalScore > 0 ? currentRank : '-';
    });

    this.flagTop6Ties(results, 'totalScore', 'rank');
    return results;
  },

  // LKBB Detailed Sub-Rankings (Per-Sekolah if regu > 1)
  getLKBBSubLeaderboards(categoryFilter = 'all') {
    const allTeams = window.dataStore.getTeams('all');
    const scores = window.dataStore.getScoresForLomba('lkbb');

    const schoolMap = {};
    allTeams.forEach(team => {
      const catObj = CATEGORIES.find(c => c.id === team.category);
      const level = catObj?.level || 'sd';
      const pangkalanName = (team.pangkalan || 'Tanpa Pangkalan').trim();
      const key = `${level}_${pangkalanName}`;

      if (!schoolMap[key]) {
        schoolMap[key] = {
          pangkalan: pangkalanName,
          level: level,
          levelLabel: level.toUpperCase(),
          teams: []
        };
      }
      schoolMap[key].teams.push(team);
    });

    const schoolList = Object.values(schoolMap).filter(school => {
      if (school.teams.length <= 1) return false;
      if (categoryFilter === 'sd' || categoryFilter === 'sd_pa' || categoryFilter === 'sd_pi') return school.level === 'sd';
      if (categoryFilter === 'smp' || categoryFilter === 'smp_pa' || categoryFilter === 'smp_pi') return school.level === 'smp';
      if (categoryFilter === 'penegak' || categoryFilter === 'penegak_pa' || categoryFilter === 'penegak_pi') return school.level === 'penegak';
      return true;
    });

    const results = schoolList.map(school => {
      const safePangkalan = school.pangkalan.replace(/[^a-zA-Z0-9]/g, '_');
      const schoolId = `SCH_${school.level.toUpperCase()}_${safePangkalan}`;
      const scoreObj = scores[schoolId];
      const breakdown = this.calculateLKBB(scoreObj);
      const basisId = scoreObj?.basisId || schoolId;
      return {
        isSchool: true,
        schoolId: schoolId,
        basisId: basisId,
        pangkalan: school.pangkalan,
        level: school.level,
        levelLabel: school.level.toUpperCase(),
        reguCount: school.teams.length,
        team: { id: basisId, rawId: schoolId, name: school.pangkalan, pangkalan: school.pangkalan },
        scoreObj,
        ...breakdown
      };
    });

    const assignRanks = (list, scoreKey, rankKey) => {
      list.sort((a, b) => b[scoreKey] - a[scoreKey]);
      let currentRank = 1;
      list.forEach((item, index) => {
        if (index > 0 && item[scoreKey] < list[index - 1][scoreKey]) {
          currentRank = index + 1;
        }
        item[rankKey] = item[scoreKey] > 0 ? currentRank : '-';
      });
    };

    assignRanks(results, 'totalDp', 'rankDp');
    assignRanks(results, 'totalPbb', 'rankPbb');
    assignRanks(results, 'totalVariasi', 'rankVariasi');
    assignRanks(results, 'totalDanton', 'rankDanton');

    const overallList = [...results];
    assignRanks(overallList, 'total', 'rankOverall');

    this.flagTop6Ties(overallList, 'total', 'rankOverall');
    return overallList;
  },

  // Combined Score Engine (Materi Gabungan - Juara Umum per Tingkat & Overall)
  getCombinedLeaderboard(selectedLombaIds = [], levelFilter = 'all', genderFilter = 'all') {
    let teams = window.dataStore.getTeams('all');

    // Filter by Level (SD, SMP, Penegak, or All)
    if (levelFilter !== 'all') {
      teams = teams.filter(t => {
        const catObj = CATEGORIES.find(c => c.id === t.category);
        return catObj?.level === levelFilter;
      });
    }

    // Filter by Gender (Pa, Pi, or All)
    if (genderFilter !== 'all') {
      teams = teams.filter(t => {
        const catObj = CATEGORIES.find(c => c.id === t.category);
        return catObj?.gender === genderFilter;
      });
    }

    const results = teams.map(team => {
      let combinedTotal = 0;
      const breakdown = {};

      selectedLombaIds.forEach(lombaId => {
        const scores = window.dataStore.getScoresForLomba(lombaId);
        const scoreObj = scores[team.id];
        const scoreVal = this.getCompetitionTotalScore(lombaId, scoreObj);
        breakdown[lombaId] = scoreVal;
        combinedTotal += scoreVal;
      });

      return {
        team,
        combinedTotal,
        breakdown
      };
    });

    // Sort descending by combined total
    results.sort((a, b) => b.combinedTotal - a.combinedTotal);

    let currentRank = 1;
    results.forEach((item, index) => {
      if (index > 0 && item.combinedTotal < results[index - 1].combinedTotal) {
        currentRank = index + 1;
      }
      item.rank = item.combinedTotal > 0 ? currentRank : '-';
    });

    this.flagTop6Ties(results, 'combinedTotal', 'rank');
    return results;
  },

  // Check if a score object contains valid input data
  hasValidScore(scoreObj) {
    if (!scoreObj || typeof scoreObj !== 'object') return false;

    // Single score competitions (banksoal, pioneering, sandi, morse, semaphore, ketangkasan)
    if ((typeof scoreObj.score === 'number' || typeof scoreObj.score === 'string') && Number(scoreObj.score) > 0) return true;

    // Administrasi
    if ((Number(scoreObj.pendaftaran) || 0) > 0 || (Number(scoreObj.pernyataan) || 0) > 0 || (Number(scoreObj.kta) || 0) > 0 ||
        (Number(scoreObj.kwitansi) || 0) > 0 || (Number(scoreObj.mandat) || 0) > 0 || (Number(scoreObj.ijin) || 0) > 0 ||
        (Number(scoreObj.asuransi) || 0) > 0 || (Number(scoreObj.bumbung) || 0) > 0) return true;

    // P3K
    if ((Number(scoreObj.teori) || 0) > 0 || (Number(scoreObj.praktek) || 0) > 0) return true;

    // Joged Komando
    if (scoreObj.juri1 || scoreObj.juri2 || scoreObj.juri3 || scoreObj.penalty) {
      const j1 = scoreObj.juri1 || {};
      const j2 = scoreObj.juri2 || {};
      const j3 = scoreObj.juri3 || {};
      if ((Number(j1.kreativitas) || 0) > 0 || (Number(j1.kekompakkan) || 0) > 0 || (Number(j1.musik) || 0) > 0 ||
          (Number(j2.kreativitas) || 0) > 0 || (Number(j2.kekompakkan) || 0) > 0 || (Number(j2.musik) || 0) > 0 ||
          (Number(j3.kreativitas) || 0) > 0 || (Number(j3.kekompakkan) || 0) > 0 || (Number(j3.musik) || 0) > 0 ||
          (Number(scoreObj.penalty) || 0) > 0) {
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
          (Number(pbb.juri1) || 0) > 0 || (Number(pbb.juri2) || 0) > 0 || (Number(pbb.juri3) || 0) > 0 ||
          (Number(vf.juri1) || 0) > 0 || (Number(vf.juri2) || 0) > 0 || (Number(vf.juri3) || 0) > 0 ||
          (Number(dt.juri1) || 0) > 0 || (Number(dt.juri2) || 0) > 0 || (Number(dt.juri3) || 0) > 0) {
        return true;
      }
    }

    return false;
  },

  // Calculate Progress Rekap Input for SD, SMP, PENEGAK & Overall
  getRekapProgressAllLevels() {
    const levels = [
      { id: 'sd', name: 'Penggalang SD', short: 'SD', color: '#00f5d4', badgeClass: 'badge-sd-pa', gradient: 'linear-gradient(90deg, #00f5d4, #0284c7)' },
      { id: 'smp', name: 'Penggalang SMP', short: 'SMP', color: '#c084fc', badgeClass: 'badge-smp-pa', gradient: 'linear-gradient(90deg, #a855f7, #ec4899)' },
      { id: 'penegak', name: 'Sangga Penegak', short: 'PENEGAK', color: '#10b981', badgeClass: 'badge-penegak-pa', gradient: 'linear-gradient(90deg, #10b981, #059669)' }
    ];

    const competitions = (typeof COMPETITIONS !== 'undefined' ? COMPETITIONS : window.COMPETITIONS) || [];
    const levelStats = {};
    let grandTotalExpected = 0;
    let grandTotalCompleted = 0;

    const compBreakdown = competitions.map(comp => {
      return {
        id: comp.id,
        name: comp.name,
        icon: comp.icon,
        sd: { total: 0, completed: 0, percentage: 0 },
        smp: { total: 0, completed: 0, percentage: 0 },
        penegak: { total: 0, completed: 0, percentage: 0 },
        totalExpected: 0,
        totalCompleted: 0,
        percentage: 0
      };
    });

    levels.forEach(lvl => {
      let lvlExpected = 0;
      let lvlCompleted = 0;
      let completedCompCount = 0;
      const compDetails = [];

      competitions.forEach((comp, idx) => {
        const leaderboard = this.getLombaLeaderboard(comp.id, lvl.id);
        const total = leaderboard.length;
        let completed = 0;

        leaderboard.forEach(item => {
          if (this.hasValidScore(item.scoreObj)) {
            completed++;
          }
        });

        lvlExpected += total;
        lvlCompleted += completed;

        if (total > 0 && completed === total) {
          completedCompCount++;
        }

        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        compDetails.push({
          id: comp.id,
          name: comp.name,
          total,
          completed,
          percentage: pct
        });

        compBreakdown[idx][lvl.id] = { total, completed, percentage: pct };
        compBreakdown[idx].totalExpected += total;
        compBreakdown[idx].totalCompleted += completed;
      });

      const lvlPct = lvlExpected > 0 ? Math.round((lvlCompleted / lvlExpected) * 100) : 0;

      levelStats[lvl.id] = {
        ...lvl,
        total: lvlExpected,
        completed: lvlCompleted,
        percentage: lvlPct,
        completedCompCount,
        competitions: compDetails
      };

      grandTotalExpected += lvlExpected;
      grandTotalCompleted += lvlCompleted;
    });

    compBreakdown.forEach(item => {
      item.percentage = item.totalExpected > 0 ? Math.round((item.totalCompleted / item.totalExpected) * 100) : 0;
    });

    const grandPercentage = grandTotalExpected > 0 ? Math.round((grandTotalCompleted / grandTotalExpected) * 100) : 0;

    return {
      overall: {
        total: grandTotalExpected,
        completed: grandTotalCompleted,
        percentage: grandPercentage
      },
      levels: levelStats,
      compBreakdown
    };
  }
};

window.Calculators = Calculators;
