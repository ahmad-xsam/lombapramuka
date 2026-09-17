/* ==========================================================================
   SiMika - Data Models & Storage Manager
   Initial Seed Data, LocalStorage Store, & MongoDB Atlas Auto-Sync Engine
   ========================================================================== */

const SIMIKA_TEAMS_KEY = 'simika_teams_data_v2';
const SIMIKA_SCORES_KEY = 'simika_scores_data_v2';
const SIMIKA_USERS_KEY = 'simika_users_data_v2';
const SIMIKA_SESSION_KEY = 'simika_session_user_v2';
const SIMIKA_COMPETITIONS_KEY = 'simika_competitions_data_v2';

const CATEGORIES = [
  { id: 'sd_pa', level: 'sd', gender: 'pa', name: 'Penggalang SD Putra', label: 'Penggalang SD Putra', short: 'SD PUTRA', badgeClass: 'badge-sd-pa' },
  { id: 'sd_pi', level: 'sd', gender: 'pi', name: 'Penggalang SD Putri', label: 'Penggalang SD Putri', short: 'SD PUTRI', badgeClass: 'badge-sd-pi' },
  { id: 'smp_pa', level: 'smp', gender: 'pa', name: 'Penggalang SMP Putra', label: 'Penggalang SMP Putra', short: 'SMP PUTRA', badgeClass: 'badge-smp-pa' },
  { id: 'smp_pi', level: 'smp', gender: 'pi', name: 'Penggalang SMP Putri', label: 'Penggalang SMP Putri', short: 'SMP PUTRI', badgeClass: 'badge-smp-pi' },
  { id: 'penegak_pa', level: 'penegak', gender: 'pa', name: 'Sangga Penegak Putra', label: 'Sangga Penegak Putra', short: 'PENEGAK PUTRA', badgeClass: 'badge-penegak-pa' },
  { id: 'penegak_pi', level: 'penegak', gender: 'pi', name: 'Sangga Penegak Putri', label: 'Sangga Penegak Putri', short: 'PENEGAK PUTRI', badgeClass: 'badge-penegak-pi' }
];

const INITIAL_COMPETITIONS = [
  { id: 'administrasi', name: 'Lomba Administrasi', icon: 'file-text', type: 'administrasi', order: 0 },
  { id: 'banksoal', name: 'Lomba Bank Soal', icon: 'help-circle', type: 'single', order: 1 },
  { id: 'p3k', name: 'Lomba P3K', icon: 'heart-pulse', type: 'dual', order: 2 },
  { id: 'pioneering', name: 'Lomba Pioneering', icon: 'compass', type: 'single', order: 3 },
  { id: 'sandi', name: 'Lomba Sandi', icon: 'key', type: 'single', order: 4 },
  { id: 'morse', name: 'Lomba Morse', icon: 'radio', type: 'single', order: 5 },
  { id: 'semaphore', name: 'Lomba Semaphore', icon: 'flag', type: 'single', order: 6 },
  { id: 'ketangkasan', name: 'Lomba Ketangkasan', icon: 'zap', type: 'single', order: 7 },
  { id: 'joged_komando', name: 'Lomba Joged Komando', icon: 'music', type: 'school', order: 8 },
  { id: 'lkbb', name: 'Lomba LKBB', icon: 'shield', type: 'school', order: 9 }
];

const INITIAL_TEAMS = [
  // Penggalang SD Putra
  { id: 'SD-PA-01', name: 'Regu Garuda 01', pangkalan: 'SDN Nusantara 01', pembina: 'Kak Budi Santoso', category: 'sd_pa', members: 8 },
  { id: 'SD-PA-02', name: 'Regu Elang 02', pangkalan: 'SDN Merdeka 03', pembina: 'Kak Ahmad Ridwan', category: 'sd_pa', members: 8 },
  { id: 'SD-PA-03', name: 'Regu Rajawali 05', pangkalan: 'SD Tunas Bangsa', pembina: 'Kak Dedi Prasetyo', category: 'sd_pa', members: 8 },
  
  // Penggalang SD Putri
  { id: 'SD-PI-01', name: 'Regu Mawar 01', pangkalan: 'SDN Nusantara 01', pembina: 'Kak Siti Rahma', category: 'sd_pi', members: 8 },
  { id: 'SD-PI-02', name: 'Regu Melati 02', pangkalan: 'SDN Merdeka 03', pembina: 'Kak Maya Indah', category: 'sd_pi', members: 8 },
  { id: 'SD-PI-03', name: 'Regu Anggrek 04', pangkalan: 'SD Tunas Bangsa', pembina: 'Kak Rina Wati', category: 'sd_pi', members: 8 },

  // Penggalang SMP Putra
  { id: 'SMP-PA-01', name: 'Regu Cobra 01', pangkalan: 'SMPN 1 Kota', pembina: 'Kak Hendra Wijaya', category: 'smp_pa', members: 8 },
  { id: 'SMP-PA-02', name: 'Regu Harimau 02', pangkalan: 'SMPN 3 Sukabumi', pembina: 'Kak Agus Setiawan', category: 'smp_pa', members: 8 },

  // Penggalang SMP Putri
  { id: 'SMP-PI-01', name: 'Regu Cendrawasih 01', pangkalan: 'SMPN 1 Kota', pembina: 'Kak Nina Kartika', category: 'smp_pi', members: 8 },
  { id: 'SMP-PI-02', name: 'Regu Teratai 02', pangkalan: 'SMPN 3 Sukabumi', pembina: 'Kak Dewi Lestari', category: 'smp_pi', members: 8 },

  // Sangga Penegak Putra
  { id: 'PNG-PA-01', name: 'Sangga Perintis 01', pangkalan: 'SMKN 1 Garut', pembina: 'Kak Irfan Hakim', category: 'penegak_pa', members: 8 },
  { id: 'PNG-PA-02', name: 'Sangga Penegas 02', pangkalan: 'SMAN 2 Kota', pembina: 'Kak Bambang Utomo', category: 'penegak_pa', members: 8 },

  // Sangga Penegak Putri
  { id: 'PNG-PI-01', name: 'Sangga Pendobrak 01', pangkalan: 'SMKN 1 Garut', pembina: 'Kak Fitriani', category: 'penegak_pi', members: 8 },
  { id: 'PNG-PI-02', name: 'Sangga Pencoba 02', pangkalan: 'SMAN 2 Kota', pembina: 'Kak Ani Maryani', category: 'penegak_pi', members: 8 }
];

const INITIAL_USERS = [
  { username: 'ahmadsam', password: '123', name: 'ahmadsam', role: 'Super Admin', avatar: 'B4' }
];

const INITIAL_SCORES = {
  administrasi: {},
  banksoal: {
    'SD-PA-01': { score: 92, ket: 'Waktu: 12 Menit' },
    'SD-PA-02': { score: 85, ket: 'Waktu: 14 Menit' },
    'SD-PA-03': { score: 78, ket: 'Waktu: 15 Menit' },
    'SD-PI-01': { score: 95, ket: 'Waktu: 11 Menit' },
    'SD-PI-02': { score: 88, ket: 'Waktu: 13 Menit' },
    'SMP-PA-01': { score: 94, ket: 'Waktu: 10 Menit' },
    'SMP-PI-01': { score: 98, ket: 'Waktu: 09 Menit' },
    'PNG-PA-01': { score: 90, ket: 'Waktu: 12 Menit' },
    'PNG-PI-01': { score: 96, ket: 'Waktu: 10 Menit' }
  },
  p3k: {
    'SD-PA-01': { teori: 90, praktek: 94, ket: 'Pembalutan Rapi' },
    'SD-PA-02': { teori: 85, praktek: 88, ket: 'Pembalutan Baik' },
    'SD-PI-01': { teori: 95, praktek: 96, ket: 'Evakuasi Cepat' },
    'SMP-PA-01': { teori: 92, praktek: 95, ket: 'Sangat Baik' },
    'SMP-PI-01': { teori: 96, praktek: 98, ket: 'Sempurna' },
    'PNG-PA-01': { teori: 88, praktek: 92, ket: 'Baik' },
    'PNG-PI-01': { teori: 94, praktek: 96, ket: 'Sangat Baik' }
  },
  joged_komando: {},
  lkbb: {
    'SD-PA-01': {
      dp: 91,
      pbbDasar: { juri1: 94, juri2: 95, juri3: 93 },
      variasi: { juri1: 88, juri2: 90, juri3: 89 },
      danton: { juri1: 92, juri2: 91, juri3: 93 },
      ket: 'PBB Dasar Sangat Tegas'
    },
    'SD-PI-01': {
      dp: 95,
      pbbDasar: { juri1: 96, juri2: 97, juri3: 95 },
      variasi: { juri1: 92, juri2: 94, juri3: 93 },
      danton: { juri1: 95, juri2: 96, juri3: 94 },
      ket: 'Juara PBB Dasar & Danpas'
    }
  }
};

class DataStore {
  constructor() {
    this.initStore();
    this.syncWithMongoDB();
  }

  initStore() {
    if (localStorage.getItem(SIMIKA_COMPETITIONS_KEY) === null) {
      const initialWithOrder = INITIAL_COMPETITIONS.map((c, idx) => ({ ...c, order: idx }));
      localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(initialWithOrder));
    }
    if (localStorage.getItem(SIMIKA_TEAMS_KEY) === null) {
      localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(INITIAL_TEAMS));
    }
    if (localStorage.getItem(SIMIKA_SCORES_KEY) === null) {
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(INITIAL_SCORES));
    } else {
      const storedScores = JSON.parse(localStorage.getItem(SIMIKA_SCORES_KEY)) || {};
      if (storedScores.joged_komando) {
        let cleaned = false;
        Object.keys(storedScores.joged_komando).forEach(k => {
          if (!k.startsWith('SCH_')) {
            delete storedScores.joged_komando[k];
            cleaned = true;
          }
        });
        if (cleaned) {
          localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(storedScores));
        }
      }
    }
    const rawUsers = localStorage.getItem(SIMIKA_USERS_KEY);
    if (rawUsers === null) {
      localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(INITIAL_USERS));
    } else {
      let list = JSON.parse(rawUsers) || [];
      // Clean up sample demo accounts ('admin', 'juri', 'panitia')
      list = list.filter(u => !['admin', 'juri', 'panitia'].includes(u.username));
      if (!list.some(u => u.username === 'ahmadsam')) {
        list.unshift({ username: 'ahmadsam', password: '123', name: 'ahmadsam', role: 'Super Admin', avatar: 'B4' });
      }
      localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(list));
    }

    // Ensure session user is valid
    const sessionRaw = localStorage.getItem(SIMIKA_SESSION_KEY);
    if (sessionRaw) {
      try {
        const sessUser = JSON.parse(sessionRaw);
        if (sessUser && ['admin', 'juri', 'panitia'].includes(sessUser.username)) {
          const currentUserList = JSON.parse(localStorage.getItem(SIMIKA_USERS_KEY)) || INITIAL_USERS;
          const validUser = currentUserList.find(u => u.username === 'ahmadsam') || currentUserList[0];
          localStorage.setItem(SIMIKA_SESSION_KEY, JSON.stringify(validUser));
        }
      } catch (e) {}
    }
  }

  async syncWithMongoDB() {
    try {
      const res = await fetch('/api/sync');
      if (!res.ok) return;
      const json = await res.json();
      if (json.connected && json.data) {
        const { competitions, teams, scores, users } = json.data;

        // If Mongo has competitions, sort by order and update localStorage
        if (Array.isArray(competitions) && competitions.length > 0) {
          competitions.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(competitions));
        } else {
          // If Mongo has no competitions, push local competitions to Mongo
          const localComps = this.competitions;
          if (localComps.length > 0) {
            this.reorderCompetitions(localComps);
          }
        }

        // Sync Teams
        const isWiped = localStorage.getItem('simika_data_wiped_v1') === 'true';
        if (Array.isArray(teams)) {
          if (teams.length > 0) {
            localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(teams));
          } else if (isWiped) {
            localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify([]));
          }
        }

        // Sync Scores
        if (scores && typeof scores === 'object') {
          if (Object.keys(scores).length > 0) {
            localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(scores));
          } else if (isWiped) {
            localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify({}));
          }
        }

        if (Array.isArray(users) && users.length > 0) {
          const filteredUsers = users.filter(u => !['admin', 'juri', 'panitia'].includes(u.username));
          if (filteredUsers.length > 0) {
            localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(filteredUsers));
          }
        }
      }
    } catch (e) {
      console.warn('[MongoDB Sync]: Operating offline / fallback to LocalStorage mode', e);
    }
  }

  async postToMongo(url, payload, method = 'POST') {
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn(`[Mongo API Error ${url}]:`, err);
    }
  }

  get competitions() {
    const val = localStorage.getItem(SIMIKA_COMPETITIONS_KEY);
    const list = val !== null ? JSON.parse(val) : INITIAL_COMPETITIONS;
    if (Array.isArray(list)) {
      return [...list]
        .map((c, idx) => ({ ...c, order: typeof c.order === 'number' ? c.order : idx }))
        .sort((a, b) => a.order - b.order);
    }
    return list;
  }

  get teams() {
    const val = localStorage.getItem(SIMIKA_TEAMS_KEY);
    const list = val !== null ? JSON.parse(val) : INITIAL_TEAMS;
    if (Array.isArray(list)) {
      return list.sort((a, b) => {
        const idA = String(a.id || a.idRegu || '').trim();
        const idB = String(b.id || b.idRegu || '').trim();
        return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
      });
    }
    return list;
  }

  get scores() {
    const val = localStorage.getItem(SIMIKA_SCORES_KEY);
    return val !== null ? JSON.parse(val) : INITIAL_SCORES;
  }

  get users() {
    return JSON.parse(localStorage.getItem(SIMIKA_USERS_KEY)) || [];
  }

  get currentUser() {
    return JSON.parse(sessionStorage.getItem(SIMIKA_SESSION_KEY)) || null;
  }

  setCurrentUser(user) {
    if (user) {
      sessionStorage.setItem(SIMIKA_SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SIMIKA_SESSION_KEY);
    }
  }

  get isCompetitionsLocked() {
    const val = localStorage.getItem('simika_competitions_locked_v2');
    if (val === null || val === undefined) return true;
    return val === 'true' || val === true;
  }

  setCompetitionsLocked(isLocked) {
    const boolVal = Boolean(isLocked);
    localStorage.setItem('simika_competitions_locked_v2', boolVal ? 'true' : 'false');
    return boolVal;
  }

  toggleCompetitionsLock() {
    const current = this.isCompetitionsLocked;
    const next = !current;
    this.setCompetitionsLocked(next);
    return next;
  }

  reorderCompetitions(newOrderedList) {
    if (!Array.isArray(newOrderedList)) return;
    const ordered = newOrderedList.map((c, idx) => ({ ...c, order: idx }));
    localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(ordered));
    this.postToMongo('/api/competitions/reorder', { competitions: ordered });
  }

  moveCompetition(fromIndex, toIndex) {
    const list = [...this.competitions];
    if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return list;
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    this.reorderCompetitions(list);
    return list;
  }

  addCompetition(compData) {
    const current = this.competitions;
    const rawId = (compData.name || 'Lomba Baru')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^lomba_/, '');
    const id = compData.id || `lomba_${rawId}_${Date.now().toString().slice(-4)}`;
    
    let compName = compData.name.trim();
    if (!compName.toLowerCase().startsWith('lomba ')) {
      compName = `Lomba ${compName}`;
    }

    const newComp = {
      id,
      name: compName,
      icon: compData.icon || 'trophy',
      type: compData.type || 'single', // 'single' | 'dual'
      isCustom: true,
      order: current.length
    };

    current.push(newComp);
    const ordered = current.map((c, idx) => ({ ...c, order: idx }));
    localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(ordered));

    // Ensure score bucket exists
    const allScores = this.scores;
    if (!allScores[id]) {
      allScores[id] = {};
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(allScores));
    }

    // Sync to MongoDB Atlas
    this.postToMongo('/api/competitions', newComp);
    this.postToMongo('/api/competitions/reorder', { competitions: ordered });

    return newComp;
  }

  updateCompetition(id, updatedData) {
    const current = this.competitions;
    const index = current.findIndex(c => c.id === id);
    if (index === -1) return null;

    let compName = (updatedData.name || '').trim();
    if (compName && !compName.toLowerCase().startsWith('lomba ')) {
      compName = `Lomba ${compName}`;
    }

    const updated = {
      ...current[index],
      name: compName || current[index].name,
      icon: updatedData.icon || current[index].icon
    };

    current[index] = updated;
    const ordered = current.map((c, idx) => ({ ...c, order: idx }));
    localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(ordered));

    // Sync to MongoDB Atlas
    this.postToMongo('/api/competitions', updated, 'PUT');
    this.postToMongo('/api/competitions/reorder', { competitions: ordered });

    return updated;
  }

  deleteCompetition(id) {
    if (this.isCompetitionsLocked) {
      console.warn('[DataStore]: Competition deletion prevented because store is locked.');
      return false;
    }
    const updated = this.competitions.filter(c => c.id !== id);
    const ordered = updated.map((c, idx) => ({ ...c, order: idx }));
    localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(ordered));

    const allScores = this.scores;
    if (allScores[id]) {
      delete allScores[id];
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(allScores));
    }

    // Sync deletion & order update to MongoDB Atlas
    this.postToMongo(`/api/competitions?id=${encodeURIComponent(id)}`, { id }, 'DELETE');
    this.postToMongo('/api/competitions/reorder', { competitions: ordered });
    return true;
  }

  getTeams(categoryFilter = 'all') {
    const all = this.teams;
    let filtered = all;
    if (categoryFilter && categoryFilter !== 'all') {
      if (categoryFilter === 'sd' || categoryFilter === 'smp' || categoryFilter === 'penegak') {
        filtered = all.filter(t => {
          const catObj = CATEGORIES.find(c => c.id === t.category);
          return catObj ? catObj.level === categoryFilter : t.category.startsWith(categoryFilter + '_');
        });
      } else {
        filtered = all.filter(t => t.category === categoryFilter);
      }
    }
    return filtered.sort((a, b) => {
      const idA = String(a.id || a.idRegu || '').trim();
      const idB = String(b.id || b.idRegu || '').trim();
      return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  getTeamById(id) {
    if (!id) return null;
    const found = this.teams.find(t => t.id === id);
    if (found) return found;
    if (id.startsWith('SCH_')) {
      const all = this.teams;
      for (const t of all) {
        const catObj = CATEGORIES.find(c => c.id === t.category);
        const level = catObj?.level || 'sd';
        const safePangkalan = (t.pangkalan || 'Tanpa Pangkalan').trim().replace(/[^a-zA-Z0-9]/g, '_');
        const schId = `SCH_${level.toUpperCase()}_${safePangkalan}`;
        if (schId === id) {
          return {
            id: schId,
            name: t.pangkalan,
            pangkalan: t.pangkalan,
            category: t.category,
            isSchool: true
          };
        }
      }
    }
    return null;
  }

  generateSuggestedId(category) {
    const current = this.teams;
    const catCode = (category || 'sd_pa').toUpperCase().replace('_', '-');
    const existingCount = current.filter(t => t.category === category).length;
    const seq = (existingCount + 1).toString().padStart(2, '0');
    return `${catCode}-${seq}`;
  }

  addTeam(teamData) {
    const current = this.teams;
    const targetId = (teamData.id && teamData.id.trim()) 
      ? teamData.id.trim() 
      : this.generateSuggestedId(teamData.category);

    // Check if ID already exists
    if (current.some(t => t.id.toLowerCase() === targetId.toLowerCase())) {
      alert(`❌ ID Regu/Sangga "${targetId}" sudah digunakan oleh peserta lain! Silakan gunakan ID yang berbeda.`);
      return null;
    }

    const newTeam = {
      ...teamData,
      id: targetId
    };
    current.push(newTeam);
    localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(current));

    // Sync to MongoDB Atlas
    this.postToMongo('/api/teams', newTeam);

    return newTeam;
  }

  deleteTeam(id) {
    const updated = this.teams.filter(t => t.id !== id);
    localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(updated));

    const allScores = this.scores;
    let modified = false;
    Object.keys(allScores).forEach(lombaId => {
      if (allScores[lombaId] && allScores[lombaId][id]) {
        delete allScores[lombaId][id];
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(allScores));
    }

    // Sync deletion to MongoDB Atlas
    this.postToMongo('/api/teams', { id }, 'DELETE');
  }

  updateTeam(oldId, teamData) {
    const current = this.teams;
    const index = current.findIndex(t => t.id === oldId);
    if (index === -1) return null;

    const newId = (teamData.id && teamData.id.trim()) ? teamData.id.trim() : oldId;

    // Check duplicate if ID changed
    if (newId.toLowerCase() !== oldId.toLowerCase() && current.some(t => t.id.toLowerCase() === newId.toLowerCase())) {
      alert(`❌ ID Regu/Sangga "${newId}" sudah digunakan oleh peserta lain! Silakan gunakan ID yang berbeda.`);
      return null;
    }

    const updatedTeam = {
      ...current[index],
      ...teamData,
      id: newId
    };

    current[index] = updatedTeam;
    localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(current));

    // If ID changed, migrate scores linked to oldId to newId
    if (newId !== oldId) {
      const allScores = this.scores;
      let modified = false;
      Object.keys(allScores).forEach(lombaId => {
        if (allScores[lombaId] && allScores[lombaId][oldId]) {
          allScores[lombaId][newId] = allScores[lombaId][oldId];
          delete allScores[lombaId][oldId];
          modified = true;
        }
      });
      if (modified) {
        localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(allScores));
        this.postToMongo('/api/scores', { fullScores: allScores });
      }

      // Delete old ID record in Mongo and save new team
      this.postToMongo('/api/teams', { id: oldId }, 'DELETE');
      this.postToMongo('/api/teams', updatedTeam, 'POST');
    } else {
      this.postToMongo('/api/teams', updatedTeam, 'PUT');
    }

    return updatedTeam;
  }

  getScoresForLomba(lombaId) {
    const allScores = this.scores;
    return allScores[lombaId] || {};
  }

  saveScore(lombaId, teamId, scoreObj) {
    const allScores = this.scores;
    if (!allScores[lombaId]) {
      allScores[lombaId] = {};
    }
    allScores[lombaId][teamId] = scoreObj;
    localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(allScores));

    // Sync score to MongoDB Atlas
    this.postToMongo('/api/scores', { lombaId, teamId, scoreObj });
  }

  addUser(userData) {
    const current = this.users;
    const initials = userData.name ? userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
    const newUser = {
      ...userData,
      avatar: userData.avatar || initials
    };
    current.push(newUser);
    localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(current));

    // Sync to MongoDB Atlas
    this.postToMongo('/api/users', newUser);

    return newUser;
  }

  updateUser(originalUsername, updatedData) {
    const current = this.users;
    const index = current.findIndex(u => u.username === originalUsername);
    if (index !== -1) {
      const initials = updatedData.name ? updatedData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : current[index].avatar;
      current[index] = {
        ...current[index],
        ...updatedData,
        avatar: initials
      };
      localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(current));

      const activeSession = this.currentUser;
      if (activeSession && activeSession.username === originalUsername) {
        this.setCurrentUser(current[index]);
      }

      // Sync to MongoDB Atlas
      this.postToMongo('/api/users', current[index]);
    }
  }

  deleteUser(username) {
    const updated = this.users.filter(u => u.username !== username);
    localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(updated));

    // Sync deletion to MongoDB Atlas
    this.postToMongo('/api/users', { username }, 'DELETE');
  }

  resetData(isFullWipe = true) {
    if (isFullWipe) {
      // 100% WIPE / ERASE ALL TEAMS & SCORES
      localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify([]));
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify({}));
      localStorage.setItem('simika_data_wiped_v1', 'true');
      localStorage.removeItem('simika_draw_order');
      localStorage.removeItem('simika_draw_data');

      // Sync Delete All to MongoDB Atlas
      this.postToMongo('/api/teams?all=true', {}, 'DELETE');
      this.postToMongo('/api/scores?all=true', {}, 'DELETE');
    } else {
      // Restore sample demo data
      localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(INITIAL_COMPETITIONS));
      localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(INITIAL_TEAMS));
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(INITIAL_SCORES));
      localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(INITIAL_USERS));
      localStorage.removeItem('simika_data_wiped_v1');

      // Sync Seed Data to MongoDB Atlas
      this.postToMongo('/api/scores', { fullScores: INITIAL_SCORES });
      INITIAL_TEAMS.forEach(t => this.postToMongo('/api/teams', t));
    }
  }
}

window.CATEGORIES = CATEGORIES;
window.INITIAL_COMPETITIONS = INITIAL_COMPETITIONS;
window.INITIAL_TEAMS = INITIAL_TEAMS;
window.INITIAL_SCORES = INITIAL_SCORES;
window.INITIAL_USERS = INITIAL_USERS;
window.dataStore = new DataStore();

Object.defineProperty(window, 'COMPETITIONS', {
  get: () => window.dataStore ? window.dataStore.competitions : INITIAL_COMPETITIONS,
  configurable: true
});
