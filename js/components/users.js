/* ==========================================================================
   SiMika - User Management (Kelola Admin / Pengguna) Component
   - Clean, Minimalist UI without Content Button Icons
   - Full CRUD (Tambah, Ubah/Edit, Hapus Akses Login)
   - All Bahasa Indonesia UI
   ========================================================================== */

const UsersComponent = {
  editingUsername: null,

  render(container) {
    if (!container) return;

    const users = window.dataStore.users;
    const currentUser = window.dataStore.currentUser;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">
            Kelola Pengguna Admin & Akses Login
          </h1>
          <p class="page-subtitle">Manajemen Akun Login Panitia, Dewan Juri, & Super Admin SiMika</p>
        </div>
        <button class="btn-yellow-pill" onclick="UsersComponent.openAddModal()">
          Tambah Akun Admin Baru
        </button>
      </div>

      <div class="card-panel">
        <div class="card-panel-header">
          <h3 class="panel-title">
            Daftar Akses Login Terdaftar (${users.length} Akun)
          </h3>
        </div>

        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Username</th>
                <th>Nama Lengkap Kakak</th>
                <th>Peran / Role Akses</th>
                <th>Password</th>
                <th>Status Akun</th>
                <th style="text-align: right;">Aksi Management</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => {
                const isCurrent = currentUser && currentUser.username === u.username;
                const roleBadge = u.role === 'Super Admin' ? 'badge-sd' : (u.role === 'Juri Penilai' || u.role === 'Juri Lomba') ? 'badge-smp' : 'badge-penegak';

                return `
                  <tr>
                    <td>
                      <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #a855f7, #06b6d4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.78rem; color: #fff; box-shadow: 0 0 10px rgba(168,85,247,0.3);">
                        ${u.avatar || 'SA'}
                      </div>
                    </td>
                    <td><strong style="color: #fff; font-family: monospace; font-size: 0.9rem;">${u.username}</strong></td>
                    <td><strong style="color: #ffffff;">${u.name}</strong></td>
                    <td><span class="badge ${roleBadge}">${u.role}</span></td>
                    <td>
                      <span style="font-family: monospace; color: var(--neon-cyan); letter-spacing: 0.15em;">${u.password || '••••••••'}</span>
                    </td>
                    <td>
                      ${isCurrent ? `
                        <span class="badge" style="background: var(--neon-cyan); color: #090d16; font-weight: 900;">Sedang Aktif</span>
                      ` : `
                        <span class="badge" style="background: rgba(255,255,255,0.06); color: #94a3b8;">Aktif</span>
                      `}
                    </td>
                    <td style="text-align: right;">
                      <div style="display: inline-flex; gap: 0.35rem; justify-content: flex-end;">
                        <button class="btn-outline" style="padding: 0.25rem 0.55rem; font-size: 0.7rem; color: var(--neon-cyan); border-color: rgba(0, 245, 212, 0.3); background: rgba(0, 245, 212, 0.08);" onclick="UsersComponent.openEditModal('${u.username}')" title="Ubah / Edit Akun">
                          Edit
                        </button>
                        ${isCurrent ? `
                          <button class="btn-outline" style="padding: 0.25rem 0.55rem; font-size: 0.7rem; opacity: 0.4; cursor: not-allowed;" title="Tidak dapat menghapus akun yang sedang aktif digunakan" disabled>
                            Hapus
                          </button>
                        ` : `
                          <button class="btn-outline" style="padding: 0.25rem 0.55rem; font-size: 0.7rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.08);" onclick="UsersComponent.deleteUser('${u.username}')" title="Hapus Akses Login">
                            Hapus
                          </button>
                        `}
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

  openAddModal() {
    this.editingUsername = null;
    this.renderFormModal('Tambah Akun Admin Baru', null);
  },

  openEditModal(username) {
    const user = window.dataStore.users.find(u => u.username === username);
    if (!user) return;
    this.editingUsername = username;
    this.renderFormModal(`Ubah / Edit Akun (${username})`, user);
  },

  validatePasswordStrength(pwd) {
    if (!pwd || pwd.length < 6) {
      return 'Password minimal 6 karakter!';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password wajib memiliki minimal 1 huruf besar (A-Z)!';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password wajib memiliki minimal 1 huruf kecil (a-z)!';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password wajib memiliki minimal 1 angka (0-9)!';
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return 'Password wajib memiliki minimal 1 karakter/simbol (contoh: @, #, $, !, %, dll)!';
    }
    return null;
  },

  renderFormModal(title, user) {
    this.closeModal();

    const isEdit = !!user;

    const modalHTML = `
      <div class="modal-overlay open" id="user-modal">
        <div class="modal-container" style="max-width: 520px;">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" onclick="UsersComponent.closeModal()">✕</button>
          </div>
          <form onsubmit="UsersComponent.saveUser(event)">
            <div id="user-modal-error" style="display: none; margin-bottom: 0.85rem;" class="login-alert-danger"></div>

            <div class="form-grid" style="grid-template-columns: 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label>Username (ID Akses Login) *</label>
                <input type="text" id="input-user-username" class="form-control" placeholder="Contoh: ahmadsam" value="${isEdit ? user.username : ''}" required />
              </div>
              <div class="form-group">
                <label>Password *</label>
                <input type="text" id="input-user-password" class="form-control" placeholder="Contoh: Rahasia#2026" value="${isEdit ? user.password : ''}" required />
                <small style="display: block; margin-top: 0.35rem; color: #94a3b8; font-size: 0.74rem; line-height: 1.4;">
                  🔒 Password wajib kombinasi: <strong>Minimal 6 Karakter, Huruf Besar (A-Z), Huruf Kecil (a-z), Angka (0-9), & Karakter/Simbol (@#$!)</strong>.
                </small>
              </div>
              <div class="form-group">
                <label>Nama Lengkap Kakak *</label>
                <input type="text" id="input-user-name" class="form-control" placeholder="Contoh: Kak Ahmad Samsudin, S.T." value="${isEdit ? user.name : ''}" required />
              </div>
              <div class="form-group">
                <label>Peran / Access Role *</label>
                <select id="input-user-role" class="form-control" required>
                  <option value="Super Admin" ${isEdit && user.role === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
                  <option value="Juri Penilai" ${isEdit && (user.role === 'Juri Penilai' || user.role === 'Juri Lomba') ? 'selected' : ''}>Juri Penilai</option>
                  <option value="Operator Rekap" ${isEdit && (user.role === 'Operator Rekap' || user.role === 'Panitia Rekap') ? 'selected' : ''}>Operator Rekap</option>
                </select>
              </div>
            </div>

            <div class="modal-footer" style="margin-top: 1.15rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
              <button type="button" class="btn-outline" onclick="UsersComponent.closeModal()">Batal</button>
              <button type="submit" class="btn-yellow-pill">
                ${isEdit ? 'Simpan Perubahan Akun' : 'Simpan Akun Admin Baru'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
  },

  closeModal() {
    const el = document.getElementById('user-modal');
    if (el) el.remove();
  },

  saveUser(e) {
    if (e && e.preventDefault) e.preventDefault();
    const username = document.getElementById('input-user-username').value.trim();
    const password = document.getElementById('input-user-password').value.trim();
    const name = document.getElementById('input-user-name').value.trim();
    const role = document.getElementById('input-user-role').value;
    const errorBox = document.getElementById('user-modal-error');

    if (!username || !password || !name) {
      if (errorBox) {
        errorBox.textContent = '❌ Seluruh field wajib diisi!';
        errorBox.style.display = 'block';
      }
      return;
    }

    const users = window.dataStore.users;
    const existingUser = this.editingUsername ? users.find(u => u.username === this.editingUsername) : null;

    // Validate strong password if creating a new user or if existing user changed password
    const isPasswordChanged = !existingUser || existingUser.password !== password;
    if (isPasswordChanged) {
      const passError = this.validatePasswordStrength(password);
      if (passError) {
        if (errorBox) {
          errorBox.textContent = `❌ ${passError}`;
          errorBox.style.display = 'block';
        }
        return;
      }
    }

    const avatarCode = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'SA';

    if (this.editingUsername) {
      if (username !== this.editingUsername && users.some(u => u.username === username)) {
        if (errorBox) {
          errorBox.textContent = `❌ Username "${username}" sudah digunakan akun lain!`;
          errorBox.style.display = 'block';
        }
        return;
      }
      window.dataStore.updateUser(this.editingUsername, { username, password, name, role, avatar: avatarCode });
    } else {
      if (users.some(u => u.username === username)) {
        if (errorBox) {
          errorBox.textContent = `❌ Username "${username}" sudah terdaftar!`;
          errorBox.style.display = 'block';
        }
        return;
      }
      window.dataStore.addUser({ username, password, name, role, avatar: avatarCode });
    }

    this.closeModal();
    window.appRouter.updateUIForAuth();
    this.render(document.getElementById('app-main-content'));
  },

  deleteUser(username) {
    if (confirm(`Apakah Anda yakin ingin menghapus akun admin "${username}"?`)) {
      window.dataStore.deleteUser(username);
      window.appRouter.updateUIForAuth();
      this.render(document.getElementById('app-main-content'));
    }
  }
};

window.UsersComponent = UsersComponent;
