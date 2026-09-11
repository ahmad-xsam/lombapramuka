/* ==========================================================================
   SiMika - Data Models & Storage Manager
   Initial Seed Data & LocalStorage Store
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
  { id: 'administrasi', name: 'Lomba Administrasi', icon: 'file-text', type: 'administrasi' },
  { id: 'banksoal', name: 'Lomba Bank Soal', icon: 'help-circle', type: 'single' },
  { id: 'p3k', name: 'Lomba P3K', icon: 'heart-pulse', type: 'dual' },
  { id: 'pioneering', name: 'Lomba Pioneering', icon: 'compass', type: 'single' },
  { id: 'sandi', name: 'Lomba Sandi', icon: 'key', type: 'single' },
  { id: 'morse', name: 'Lomba Morse', icon: 'radio', type: 'single' },
  { id: 'semaphore', name: 'Lomba Semaphore', icon: 'flag', type: 'single' },
  { id: 'ketangkasan', name: 'Lomba Ketangkasan', icon: 'zap', type: 'single' },
  { id: 'joged_komando', name: 'Lomba Joged Komando', icon: 'music', type: 'school' },
  { id: 'lkbb', name: 'Lomba LKBB', icon: 'shield', type: 'school' }
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
  { username: 'admin', password: '123', name: 'Kak Juri Utama', role: 'Super Admin', avatar: 'SA' },
  { username: 'juri', password: '123', name: 'Tim Juri Lapangan', role: 'Juri Penilai', avatar: 'TJ' },
  { username: 'panitia', password: '123', name: 'Panitia Rekap', role: 'Operator Rekap', avatar: 'PR' }
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
  }

  initStore() {
    if (!localStorage.getItem(SIMIKA_COMPETITIONS_KEY)) {
      localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(INITIAL_COMPETITIONS));
    }
    if (!localStorage.getItem(SIMIKA_TEAMS_KEY)) {
      localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(INITIAL_TEAMS));
    }
    if (!localStorage.getItem(SIMIKA_SCORES_KEY)) {
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(INITIAL_SCORES));
    } else {
      // Cleanup legacy seeded regu scores for joged_komando if present
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
    if (!localStorage.getItem(SIMIKA_USERS_KEY)) {
      localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(INITIAL_USERS));
    }
  }

  get competitions() {
    return JSON.parse(localStorage.getItem(SIMIKA_COMPETITIONS_KEY)) || INITIAL_COMPETITIONS;
  }

  get teams() {
    return JSON.parse(localStorage.getItem(SIMIKA_TEAMS_KEY)) || [];
  }

  get scores() {
    return JSON.parse(localStorage.getItem(SIMIKA_SCORES_KEY)) || {};
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
      isCustom: true
    };

    current.push(newComp);
    localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(current));

    // Ensure score bucket exists
    const allScores = this.scores;
    if (!allScores[id]) {
      allScores[id] = {};
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(allScores));
    }

    return newComp;
  }

  deleteCompetition(id) {
    const updated = this.competitions.filter(c => c.id !== id);
    localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(updated));

    const allScores = this.scores;
    if (allScores[id]) {
      delete allScores[id];
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(allScores));
    }
  }

  getTeams(categoryFilter = 'all') {
    const all = this.teams;
    if (!categoryFilter || categoryFilter === 'all') return all;
    if (categoryFilter === 'sd' || categoryFilter === 'smp' || categoryFilter === 'penegak') {
      return all.filter(t => {
        const catObj = CATEGORIES.find(c => c.id === t.category);
        return catObj ? catObj.level === categoryFilter : t.category.startsWith(categoryFilter + '_');
      });
    }
    return all.filter(t => t.category === categoryFilter);
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

  addTeam(teamData) {
    const current = this.teams;
    const catCode = teamData.category.toUpperCase().replace('_', '-');
    const seq = (current.filter(t => t.category === teamData.category).length + 1).toString().padStart(2, '0');
    const newTeam = {
      id: `${catCode}-${seq}`,
      ...teamData
    };
    current.push(newTeam);
    localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(current));

    // Ensure no orphan score exists for the newly added team ID
    const allScores = this.scores;
    let modified = false;
    Object.keys(allScores).forEach(lombaId => {
      if (allScores[lombaId] && allScores[lombaId][newTeam.id]) {
        delete allScores[lombaId][newTeam.id];
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(allScores));
    }

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
  }

  updateTeam(id, teamData) {
    const current = this.teams;
    const index = current.findIndex(t => t.id === id);
    if (index !== -1) {
      current[index] = {
        ...current[index],
        ...teamData
      };
      localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(current));
      return current[index];
    }
    return null;
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

      // Sync active session if the current user updated their own profile
      const activeSession = this.currentUser;
      if (activeSession && activeSession.username === originalUsername) {
        this.setCurrentUser(current[index]);
      }
    }
  }

  deleteUser(username) {
    const updated = this.users.filter(u => u.username !== username);
    localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(updated));
  }

  resetData() {
    localStorage.setItem(SIMIKA_COMPETITIONS_KEY, JSON.stringify(INITIAL_COMPETITIONS));
    localStorage.setItem(SIMIKA_TEAMS_KEY, JSON.stringify(INITIAL_TEAMS));
    localStorage.setItem(SIMIKA_SCORES_KEY, JSON.stringify(INITIAL_SCORES));
    localStorage.setItem(SIMIKA_USERS_KEY, JSON.stringify(INITIAL_USERS));
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

