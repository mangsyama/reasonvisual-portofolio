/**
 * ReasonVisual - Admin CMS Logic
 * Terhubung langsung ke Supabase Database & Storage
 * Mendukung Kategori Dinamis & Tema Ganda (White & Dark)
 */

(function () {
  'use strict';

  // 1. Inisialisasi & Verifikasi Autentikasi Admin Asynchronous
  async function checkAuthAndInit() {
    try {
      if (!window.AdminAuth || !(await window.AdminAuth.isLoggedIn())) {
        window.location.href = '../login/';
        return;
      }
      setupEvents();
      loadData();
    } catch (err) {
      console.error('Auth verification error:', err);
      window.location.href = '../login/';
    }
  }

  // 2. DOM Elements
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const btnLogout = document.getElementById('btn-logout');
  const statPhotos = document.getElementById('stat-photos');
  const statVideos = document.getElementById('stat-videos');
  const statStorageUsed = document.getElementById('stat-storage-used');
  const statStoragePercent = document.getElementById('stat-storage-percent');
  const statStorageBar = document.getElementById('stat-storage-bar');
  const mediaContainer = document.getElementById('media-container');

  const filterSearch = document.getElementById('filter-search');
  const filterType = document.getElementById('filter-type');
  const filterCategory = document.getElementById('filter-category');
  const btnAddMedia = document.getElementById('btn-add-media');
  const btnManageCategories = document.getElementById('btn-manage-categories');

  // Modal Media Elements
  const mediaModal = document.getElementById('media-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const mediaForm = document.getElementById('media-form');
  const btnSaveMedia = document.getElementById('btn-save-media');

  const tabFoto = document.getElementById('tab-foto');
  const tabVideo = document.getElementById('tab-video');
  const inputTipeMedia = document.getElementById('input-tipe-media');
  const sectionFoto = document.getElementById('section-foto');
  const sectionVideo = document.getElementById('section-video');

  const btnModeUpload = document.getElementById('btn-mode-upload');
  const btnModeUrl = document.getElementById('btn-mode-url');
  const dropzoneBox = document.getElementById('dropzone-box');
  const fileFoto = document.getElementById('file-foto');
  const dropzonePrompt = document.getElementById('dropzone-prompt');
  const dropzonePreview = document.getElementById('dropzone-preview');
  const previewCountText = document.getElementById('preview-count-text');
  const previewThumbnailsGrid = document.getElementById('preview-thumbnails-grid');
  const previewTotalSize = document.getElementById('preview-total-size');
  const btnChangeFile = document.getElementById('btn-change-file');
  const urlBox = document.getElementById('url-box');
  const inputFotoUrl = document.getElementById('input-foto-url');

  const inputVideoUrl = document.getElementById('input-video-url');
  const fileVideoThumbnail = document.getElementById('file-video-thumbnail');
  const videoThumbDropzone = document.getElementById('video-thumb-dropzone');
  const videoThumbPrompt = document.getElementById('video-thumb-prompt');
  const videoThumbPreview = document.getElementById('video-thumb-preview');
  const videoThumbImg = document.getElementById('video-thumb-img');
  const videoThumbName = document.getElementById('video-thumb-name');
  const videoThumbSize = document.getElementById('video-thumb-size');
  const btnRemoveVideoThumb = document.getElementById('btn-remove-video-thumb');
  let selectedVideoThumbFile = null;

  const inputKategori = document.getElementById('input-kategori');
  const btnToggleNewCat = document.getElementById('btn-toggle-new-cat');
  const newCatBox = document.getElementById('new-cat-box');
  const inputKategoriBaru = document.getElementById('input-kategori-baru');
  const btnCancelNewCat = document.getElementById('btn-cancel-new-cat');

  const editId = document.getElementById('edit-id');

  const uploadProgressBox = document.getElementById('upload-progress-box');
  const progressPercent = document.getElementById('progress-percent');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  // Modal Category Elements
  const categoryModal = document.getElementById('category-modal');
  const modalCatClose = document.getElementById('modal-cat-close');
  const inputDirectNewCat = document.getElementById('input-direct-new-cat');
  const btnSaveDirectNewCat = document.getElementById('btn-save-direct-new-cat');
  const categoryListContainer = document.getElementById('category-list-container');

  // Delete Category Modal Elements
  const deleteCategoryModal = document.getElementById('delete-category-modal');
  const deleteCatSubtitle = document.getElementById('delete-cat-subtitle');
  const deleteCatSlug = document.getElementById('delete-cat-slug');
  const deleteCatZeroBox = document.getElementById('delete-cat-zero-box');
  const deleteCatNameZero = document.getElementById('delete-cat-name-zero');
  const deleteCatHasMediaBox = document.getElementById('delete-cat-has-media-box');
  const deleteCatNameMedia = document.getElementById('delete-cat-name-media');
  const deleteCatCount = document.getElementById('delete-cat-count');
  const deleteCatTargetSelect = document.getElementById('delete-cat-target-select');
  const btnCancelDeleteCat = document.getElementById('btn-cancel-delete-cat');
  const btnConfirmDeleteCat = document.getElementById('btn-confirm-delete-cat');

  // Edit Category Modal Elements
  const editCategoryModal = document.getElementById('edit-category-modal');
  const editCatOldSlug = document.getElementById('edit-cat-old-slug');
  const inputEditCatName = document.getElementById('input-edit-cat-name');
  const btnCloseEditCatModal = document.getElementById('btn-close-edit-cat-modal');
  const btnCancelEditCat = document.getElementById('btn-cancel-edit-cat');
  const btnSaveEditCat = document.getElementById('btn-save-edit-cat');

  // Delete Modal Elements
  const deleteModal = document.getElementById('delete-modal');
  const btnCancelDelete = document.getElementById('btn-cancel-delete');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');

  const toastContainer = document.getElementById('toast-container');

  // 3. State
  let allMedia = [];
  let selectedFiles = []; // Array of up to 5 File objects
  let currentUploadMode = 'file'; // 'file' or 'url'
  let deleteTargetId = null;
  let storageFileMap = {}; // mapping filename -> size in bytes

  const DEFAULT_CATEGORIES = ['travel', 'wedding', 'graduation', 'bali_ceremony', 'villa_property', 'event'];
  let dynamicCategories = [...DEFAULT_CATEGORIES];
  let categoryNameMap = {};

  // ─── SUPABASE API & SECURITY HELPERS ──────────────────────────────
  const { URL: SUPA_URL, ANON_KEY: SUPA_KEY, BUCKET_NAME } = window.SUPABASE_CONFIG || {};

  async function getSupaHeaders(extraHeaders = {}) {
    if (window.AdminAuth && typeof window.AdminAuth.getAuthHeaders === 'function') {
      const base = await window.AdminAuth.getAuthHeaders();
      return { ...base, ...extraHeaders };
    }
    return {
      'apikey': SUPA_KEY,
      'Authorization': `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      ...extraHeaders
    };
  }

  async function getSupaStorageHeaders(contentType = 'application/json', extraHeaders = {}) {
    const base = await getSupaHeaders();
    delete base['Content-Type'];
    if (contentType) {
      base['Content-Type'] = contentType;
    }
    return { ...base, ...extraHeaders };
  }

  function escapeHtml(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (/^(https?:\/\/|\/|data:image\/)/i.test(trimmed)) {
      return trimmed;
    }
    return '';
  }

  // ─── TOAST NOTIFICATIONS ──────────────────────────────────────────

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const isError = type === 'error';
    const iconClass = isSuccess ? 'fa-solid fa-circle-check text-emerald-500' : (isError ? 'fa-solid fa-circle-exclamation text-red-500' : 'fa-solid fa-circle-info text-accent');
    const bgClass = isSuccess ? 'bg-white dark:bg-[#18261E] border-emerald-500/30' : (isError ? 'bg-white dark:bg-[#2A1616] border-red-500/30' : 'bg-white dark:bg-[#221B16] border-accent/30');

    toast.className = `p-4 rounded-xl border ${bgClass} text-sand-900 dark:text-white flex items-center gap-3 text-xs max-w-sm transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto`;
    toast.innerHTML = `
      <i class="${iconClass} text-base flex-shrink-0"></i>
      <span class="flex-1 font-medium leading-relaxed">${message}</span>
      <button class="text-sand-400 hover:text-sand-700 dark:hover:text-white p-1" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ─── DYNAMIC CATEGORIES LOGIC (SUPABASE CLOUD + CACHE) ────────────

  function formatCategoryName(slug) {
    if (!slug) return '';
    if (categoryNameMap[slug]) return categoryNameMap[slug];
    return slug
      .split(/[_-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function markCategoryDeleted(slug) {
    if (!slug) return;
    delete categoryNameMap[slug];
    let deleted = [];
    try {
      deleted = JSON.parse(localStorage.getItem('rv-deleted-cats') || '[]');
    } catch {}
    if (!deleted.includes(slug)) {
      deleted.push(slug);
      localStorage.setItem('rv-deleted-cats', JSON.stringify(deleted));
    }

    try {
      let saved = JSON.parse(localStorage.getItem('rv-custom-cats') || '[]');
      saved = saved.filter((c) => c !== slug);
      localStorage.setItem('rv-custom-cats', JSON.stringify(saved));
    } catch {}

    try {
      let active = JSON.parse(localStorage.getItem('rv-active-cats') || '[]');
      active = active.filter((c) => c !== slug);
      localStorage.setItem('rv-active-cats', JSON.stringify(active));
    } catch {}
  }

  function unmarkCategoryDeleted(slug) {
    if (!slug) return;
    let deleted = [];
    try {
      deleted = JSON.parse(localStorage.getItem('rv-deleted-cats') || '[]');
      deleted = deleted.filter((c) => c !== slug);
      localStorage.setItem('rv-deleted-cats', JSON.stringify(deleted));
    } catch {}
  }

  async function fetchCategoriesFromDb() {
    try {
      const headers = await getSupaHeaders();
      const res = await fetch(`${SUPA_URL}/rest/v1/categories?select=*&order=urutan.asc,id.asc`, {
        headers
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Gagal membaca tabel categories dari Supabase:', err);
    }
    return null;
  }

  async function insertCategoryToDb(slug, name) {
    try {
      const headers = await getSupaHeaders({ 'Prefer': 'return=representation' });
      await fetch(`${SUPA_URL}/rest/v1/categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ slug, name, urutan: 0 })
      });
    } catch (err) {
      console.warn('Insert category to DB error:', err);
    }
  }

  async function updateCategoryInDb(oldSlug, newSlug, newName) {
    try {
      const headers = await getSupaHeaders({ 'Prefer': 'return=representation' });
      await fetch(`${SUPA_URL}/rest/v1/categories?slug=eq.${encodeURIComponent(oldSlug)}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ slug: newSlug, name: newName })
      });
    } catch (err) {
      console.warn('Update category in DB error:', err);
    }
  }

  async function deleteCategoryFromDb(slug) {
    try {
      const headers = await getSupaHeaders();
      await fetch(`${SUPA_URL}/rest/v1/categories?slug=eq.${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers
      });
    } catch (err) {
      console.warn('Delete category from DB error:', err);
    }
  }

  async function syncCategories() {
    // 1. Coba ambil dari tabel categories resmi di Supabase
    const remoteCats = await fetchCategoriesFromDb();
    if (remoteCats && remoteCats.length > 0) {
      dynamicCategories = remoteCats.map((c) => c.slug);
      categoryNameMap = {};
      remoteCats.forEach((c) => {
        categoryNameMap[c.slug] = c.name;
      });
      localStorage.setItem('rv-active-cats', JSON.stringify(dynamicCategories));
      updateCategoryDropdowns();
      return;
    }

    // 2. Fallback: jika tabel categories belum dibuat di Supabase
    let deletedCats = [];
    try {
      deletedCats = JSON.parse(localStorage.getItem('rv-deleted-cats') || '[]');
    } catch {}

    const fromMedia = allMedia.map((m) => m.kategori).filter(Boolean);
    let savedCats = [];
    try {
      savedCats = JSON.parse(localStorage.getItem('rv-custom-cats') || '[]');
    } catch {}

    const allCats = [...DEFAULT_CATEGORIES, ...fromMedia, ...savedCats];
    const filtered = allCats.filter((c) => !deletedCats.includes(c));

    const set = new Set(filtered);
    dynamicCategories = Array.from(set);

    if (dynamicCategories.length === 0) {
      dynamicCategories = ['general'];
    }

    localStorage.setItem('rv-active-cats', JSON.stringify(dynamicCategories));
    updateCategoryDropdowns();
  }

  async function saveCustomCategory(name) {
    if (!name) return null;
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (!slug) return null;

    categoryNameMap[slug] = name.trim();
    unmarkCategoryDeleted(slug);

    if (!dynamicCategories.includes(slug)) {
      dynamicCategories.push(slug);
      try {
        let savedCats = JSON.parse(localStorage.getItem('rv-custom-cats') || '[]');
        if (!savedCats.includes(slug)) {
          savedCats.push(slug);
          localStorage.setItem('rv-custom-cats', JSON.stringify(savedCats));
        }
      } catch {}
    }

    await insertCategoryToDb(slug, name.trim());
    localStorage.setItem('rv-active-cats', JSON.stringify(dynamicCategories));
    updateCategoryDropdowns();
    return slug;
  }

  function updateCategoryDropdowns() {
    // 1. Filter dropdown di Action Bar
    const currentFilterVal = filterCategory.value;
    filterCategory.innerHTML = `
      <option value="all">Semua Kategori</option>
      ${dynamicCategories.map((cat) => `<option value="${cat}">${formatCategoryName(cat)}</option>`).join('')}
    `;
    if (dynamicCategories.includes(currentFilterVal)) {
      filterCategory.value = currentFilterVal;
    } else {
      filterCategory.value = 'all';
    }

    // 2. Input kategori di Modal Form
    const currentInputVal = inputKategori.value;
    inputKategori.innerHTML = `
      <option value="" disabled ${!currentInputVal ? 'selected' : ''}>-- Pilih Kategori --</option>
      ${dynamicCategories.map((cat) => `<option value="${cat}">${formatCategoryName(cat)}</option>`).join('')}
      <option value="__new__">+ Tambah Kategori Baru...</option>
    `;
    if (dynamicCategories.includes(currentInputVal)) {
      inputKategori.value = currentInputVal;
    } else {
      inputKategori.value = '';
    }
    updateSaveButtonState();
  }

  /**
   * Mengatur status tombol Simpan Data (disabled jika kategori belum dipilih)
   */
  function updateSaveButtonState() {
    if (!btnSaveMedia) return;

    let isCategoryValid = false;
    const catVal = inputKategori ? inputKategori.value : '';
    const isNewCatVisible = newCatBox && !newCatBox.classList.contains('hidden');

    if (isNewCatVisible) {
      // Jika box kategori baru terbuka, harus ada nama kategori yang diketik
      isCategoryValid = !!(inputKategoriBaru && inputKategoriBaru.value.trim());
    } else if (catVal && catVal !== '' && catVal !== '__new__') {
      isCategoryValid = true;
    }

    btnSaveMedia.disabled = !isCategoryValid;
    if (!isCategoryValid) {
      btnSaveMedia.setAttribute('title', 'Silakan pilih atau buat kategori terlebih dahulu');
    } else {
      btnSaveMedia.removeAttribute('title');
    }
  }

  function renderCategoryListModal() {
    if (!categoryListContainer) return;

    if (dynamicCategories.length === 0) {
      categoryListContainer.innerHTML = `
        <div class="p-4 text-center text-xs text-sand-500">
          Belum ada kategori. Tambahkan kategori baru di atas!
        </div>
      `;
      return;
    }

    categoryListContainer.innerHTML = dynamicCategories
      .map((cat) => {
        const count = allMedia.filter((m) => m.kategori === cat).length;
        const name = formatCategoryName(cat);
        return `
          <div class="flex items-center justify-between p-3 rounded-xl bg-sand-50 dark:bg-[#202020] border border-sand-200 dark:border-white/10 hover:border-sand-300 dark:hover:border-white/20">
            <div class="flex items-center gap-3 min-w-0 pr-2">
              <span class="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0"></span>
              <div class="truncate">
                <span class="text-xs font-semibold text-sand-900 dark:text-white">${name}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="px-2.5 py-1 rounded-lg bg-sand-200/80 dark:bg-white/10 text-[11px] font-semibold text-sand-700 dark:text-sand-300">
                ${count} media
              </span>
              <button
                type="button"
                data-edit-cat="${cat}"
                class="w-8 h-8 rounded-lg bg-sand-200/80 dark:bg-white/10 hover:bg-accent/20 text-sand-600 dark:text-sand-300 hover:text-accent flex items-center justify-center text-xs"
                title="Ubah nama kategori ${name}"
              >
                <i class="fa-solid fa-pen text-[11px]"></i>
              </button>
              <button
                type="button"
                data-delete-cat="${cat}"
                class="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center justify-center text-xs"
                title="Hapus kategori ${name}"
              >
                <i class="fa-solid fa-trash text-[11px]"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    categoryListContainer.querySelectorAll('[data-edit-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-edit-cat');
        openEditCategoryModal(cat);
      });
    });

    categoryListContainer.querySelectorAll('[data-delete-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-delete-cat');
        openDeleteCategoryModal(cat);
      });
    });
  }

  function openCategoryModal() {
    renderCategoryListModal();
    inputDirectNewCat.value = '';
    categoryModal.classList.remove('hidden');
    categoryModal.classList.add('flex');
    inputDirectNewCat.focus();
  }

  function closeCategoryModal() {
    categoryModal.classList.add('hidden');
    categoryModal.classList.remove('flex');
  }

  // ─── SUPABASE GALLERY & STORAGE API ──────────────────────────────

  async function fetchMediaList() {
    try {
      const headers = await getSupaHeaders();
      const res = await fetch(`${SUPA_URL}/rest/v1/gallery?select=*&order=created_at.desc`, {
        headers
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memuat data.`);
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function insertMediaItem(data) {
    const headers = await getSupaHeaders({ 'Prefer': 'return=representation' });
    const res = await fetch(`${SUPA_URL}/rest/v1/gallery`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal menyimpan data: ${errText}`);
    }
    return await res.json();
  }

  async function updateMediaItem(id, data) {
    const headers = await getSupaHeaders({ 'Prefer': 'return=representation' });
    const res = await fetch(`${SUPA_URL}/rest/v1/gallery?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal mengupdate data: ${errText}`);
    }
    return await res.json();
  }

  async function deleteMediaFilesFromStorage(item) {
    if (!item) return;
    const pathsToDelete = [];

    const extractPath = (url) => {
      if (!url || typeof url !== 'string') return null;
      const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
      if (url.includes(marker)) {
        return decodeURIComponent(url.split(marker)[1].split('?')[0]);
      }
      const markerAlt = `/storage/v1/object/${BUCKET_NAME}/`;
      if (url.includes(markerAlt)) {
        return decodeURIComponent(url.split(markerAlt)[1].split('?')[0]);
      }
      return null;
    };

    if (item.sumber_media) {
      const p = extractPath(item.sumber_media);
      if (p && !pathsToDelete.includes(p)) pathsToDelete.push(p);
    }
    if (item.thumb_media) {
      const p = extractPath(item.thumb_media);
      if (p && !pathsToDelete.includes(p)) pathsToDelete.push(p);
    }
    if (item.cover_image) {
      const p = extractPath(item.cover_image);
      if (p && !pathsToDelete.includes(p)) pathsToDelete.push(p);
    }

    if (pathsToDelete.length > 0) {
      try {
        const headers = await getSupaStorageHeaders('application/json');
        await fetch(`${SUPA_URL}/storage/v1/object/${BUCKET_NAME}`, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({ prefixes: pathsToDelete })
        });
      } catch (err) {
        console.warn('Gagal menghapus file dari Storage Supabase:', err);
      }
    }
  }

  async function deleteMediaItem(id) {
    // 1. Cari data item untuk menghapus file fisik di Supabase Storage
    const item = allMedia.find((m) => String(m.id) === String(id));
    if (item) {
      await deleteMediaFilesFromStorage(item);
    }

    // 2. Hard delete permanen dari database
    const headers = await getSupaHeaders({ 'Prefer': 'return=representation' });
    const res = await fetch(`${SUPA_URL}/rest/v1/gallery?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal menghapus data dari database: ${errText}`);
    }

    // Update state allMedia secara lokal langsung
    allMedia = allMedia.filter((m) => String(m.id) !== String(id));
    return true;
  }

  async function bulkUpdateMediaCategory(oldCat, newCat) {
    const headers = await getSupaHeaders({ 'Prefer': 'return=representation' });
    const res = await fetch(`${SUPA_URL}/rest/v1/gallery?kategori=eq.${encodeURIComponent(oldCat)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ kategori: newCat })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal memindahkan kategori media: ${errText}`);
    }
    return await res.json();
  }

  async function bulkDeleteMediaByCategory(cat) {
    // 1. Bersihkan file fisik di storage untuk semua media dalam kategori ini
    const itemsToDelete = allMedia.filter((m) => m.kategori === cat);
    for (const it of itemsToDelete) {
      await deleteMediaFilesFromStorage(it);
    }

    // 2. Hard delete permanen dari database
    const headers = await getSupaHeaders({ 'Prefer': 'return=representation' });
    const res = await fetch(`${SUPA_URL}/rest/v1/gallery?kategori=eq.${encodeURIComponent(cat)}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal menghapus media berdasarkan kategori: ${errText}`);
    }
    allMedia = allMedia.filter((m) => m.kategori !== cat);
    return true;
  }

  /**
   * Ekstrak YouTube Video ID dari berbagai format link YouTube (watch, shorts, embed, youtu.be)
   * @param {string} url
   * @returns {string|null}
   */
  function getYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  }

  function resetVideoThumbDropzone() {
    if (fileVideoThumbnail) fileVideoThumbnail.value = '';
    selectedVideoThumbFile = null;
    if (videoThumbPrompt) videoThumbPrompt.classList.remove('hidden');
    if (videoThumbPreview) videoThumbPreview.classList.add('hidden');
    if (videoThumbImg) videoThumbImg.src = '';
  }

  function handleVideoThumbnailSelection(file) {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, WebP) untuk thumbnail video.', 'error');
      return;
    }

    selectedVideoThumbFile = file;
    if (videoThumbImg) videoThumbImg.src = URL.createObjectURL(file);
    if (videoThumbName) videoThumbName.textContent = file.name;
    if (videoThumbSize) videoThumbSize.textContent = `${formatBytes(file.size)} • Siap dikompres WebP`;

    if (videoThumbPrompt) videoThumbPrompt.classList.add('hidden');
    if (videoThumbPreview) videoThumbPreview.classList.remove('hidden');
  }

  /**
   * Kompresi gambar client-side menggunakan HTML5 Canvas
   * Mengonversi foto berukuran besar (misal 20 MB kamera) menjadi WebP tajam & ringan
   * @param {File|Blob} file
   * @param {Object} options - { maxWidth, maxHeight, quality, mimeType }
   * @returns {Promise<Blob>}
   */
  function compressImage(file, { maxWidth = 2400, maxHeight = 2400, quality = 0.85, mimeType = 'image/webp' } = {}) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Gagal membaca file untuk kompresi'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Gagal memproses gambar untuk kompresi'));
        img.onload = () => {
          let { width, height } = img;

          // Scaling proporsional jika melebihi batas resolusi maksimum
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export ke WebP Blob (dengan fallback JPEG)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                canvas.toBlob(
                  (fallbackBlob) => {
                    if (fallbackBlob) resolve(fallbackBlob);
                    else reject(new Error('Gagal menghasilkan blob gambar'));
                  },
                  'image/jpeg',
                  quality
                );
              }
            },
            mimeType,
            quality
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadBlobToStorage(blob, storagePath, mimeType = 'image/webp') {
    const uploadUrl = `${SUPA_URL}/storage/v1/object/${BUCKET_NAME}/${storagePath}`;
    const headers = await getSupaStorageHeaders(mimeType, { 'x-upsert': 'true' });

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: blob
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal upload file ke Storage (${storagePath}): ${errText}`);
    }

    return `${SUPA_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
  }

  async function uploadFileToStorage(file, folder = 'photos') {
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${timestamp}_${cleanName}`;

    // Upload via Supabase Storage REST API
    const uploadUrl = `${SUPA_URL}/storage/v1/object/${BUCKET_NAME}/${storagePath}`;
    const headers = await getSupaStorageHeaders(file.type || 'image/jpeg', { 'x-upsert': 'true' });

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: file
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gagal upload file ke Storage: ${errText}`);
    }

    // Public URL
    return `${SUPA_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
  }

  // ─── RENDER UI ────────────────────────────────────────────────────

  function updateStats() {
    if (statPhotos) statPhotos.textContent = allMedia.filter((m) => m.tipe_media === 'gambar').length;
    if (statVideos) statVideos.textContent = allMedia.filter((m) => m.tipe_media === 'video').length;
  }

  // ─── SUPABASE STORAGE TRACKING ────────────────────────────────────
  // Supabase Free Tier: 1 GB (1,073,741,824 bytes)
  const STORAGE_LIMIT_BYTES = 1024 * 1024 * 1024;

  function formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async function calculateStorageUsage() {
    try {
      const listFolder = async (prefix = '') => {
        const headers = await getSupaHeaders();
        const res = await fetch(`${SUPA_URL}/storage/v1/object/list/${BUCKET_NAME}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ prefix, limit: 100 })
        });
        if (!res.ok) return { totalBytes: 0, fileCount: 0 };
        const items = await res.json();
        let totalBytes = 0;
        let fileCount = 0;

        for (const item of items) {
          if (item.id === null) {
            // Folder, telusuri subfolder secara rekursif
            const subPrefix = prefix ? `${prefix}/${item.name}` : item.name;
            const sub = await listFolder(subPrefix);
            totalBytes += sub.totalBytes;
            fileCount += sub.fileCount;
          } else {
            const size = (item.metadata && item.metadata.size) || 0;
            totalBytes += size;
            fileCount++;
            storageFileMap[item.name] = size;
            try {
              storageFileMap[decodeURIComponent(item.name)] = size;
            } catch {}
          }
        }
        return { totalBytes, fileCount };
      };

      const { totalBytes, fileCount } = await listFolder();
      const percent = (totalBytes / STORAGE_LIMIT_BYTES) * 100;
      const percentFormatted = percent < 0.01 && totalBytes > 0 ? '<0.01%' : `${percent.toFixed(2)}%`;

      if (statStorageUsed) {
        statStorageUsed.textContent = formatBytes(totalBytes);
      }
      if (statStoragePercent) {
        statStoragePercent.textContent = `${percentFormatted} terpakai (${fileCount} file)`;
      }
      if (statStorageBar) {
        statStorageBar.style.width = `${Math.max(1, percent)}%`;
        if (percent >= 90) {
          statStorageBar.className = 'h-full bg-red-500 rounded-full transition-all duration-500';
        } else if (percent >= 70) {
          statStorageBar.className = 'h-full bg-amber-500 rounded-full transition-all duration-500';
        } else {
          statStorageBar.className = 'h-full bg-emerald-500 rounded-full transition-all duration-500';
        }
      }
    } catch (err) {
      console.warn('Gagal memuat status penyimpanan Supabase:', err);
    }
  }

  function getMediaSizeBadge(item) {
    if (item.tipe_media === 'video') {
      const isYt = item.sumber_media && (item.sumber_media.includes('youtube') || item.sumber_media.includes('youtu.be'));
      const isIg = item.sumber_media && item.sumber_media.includes('instagram');
      if (isYt) {
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-semibold tracking-wide" title="YouTube Video"><i class="fa-brands fa-youtube text-[10px]"></i> YouTube</span>`;
      }
      if (isIg) {
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-semibold tracking-wide" title="Instagram Reel"><i class="fa-brands fa-instagram text-[10px]"></i> Reel</span>`;
      }
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sand-200/70 dark:bg-white/10 text-sand-700 dark:text-sand-300 text-[10px] font-semibold" title="Video Stream"><i class="fa-solid fa-video text-[9px]"></i> Video</span>`;
    }

    // Foto
    if (!item.sumber_media) {
      return `<span class="text-[10px] text-sand-400">-</span>`;
    }

    const cleanUrl = item.sumber_media.split('?')[0];
    const filename = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);
    const size = storageFileMap[filename] || storageFileMap[decodeURIComponent(filename)];

    if (size) {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sand-200/70 dark:bg-white/10 border border-sand-300/60 dark:border-white/10 text-sand-700 dark:text-sand-300 text-[10px] font-mono font-medium" title="Ukuran file di Supabase Storage: ${formatBytes(size)}"><i class="fa-solid fa-hard-drive text-accent text-[9px]"></i> ${formatBytes(size)}</span>`;
    }

    if (item.sumber_media.startsWith('http') && !item.sumber_media.includes(SUPA_URL)) {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-medium" title="Gambar Eksternal URL"><i class="fa-solid fa-globe text-[9px]"></i> External</span>`;
    }

    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sand-200/50 dark:bg-white/5 text-sand-500 text-[10px] font-mono"><i class="fa-regular fa-image text-[9px]"></i> Foto</span>`;
  }

  function getFilteredMedia() {
    const search = (filterSearch.value || '').toLowerCase().trim();
    const type = filterType.value;
    const category = filterCategory.value;

    return allMedia.filter((item) => {
      const matchSearch =
        !search ||
        (item.sumber_media && item.sumber_media.toLowerCase().includes(search)) ||
        (item.kategori && item.kategori.toLowerCase().includes(search)) ||
        (item.judul_id && item.judul_id.toLowerCase().includes(search)) ||
        (item.judul_en && item.judul_en.toLowerCase().includes(search));

      const matchType = type === 'all' || item.tipe_media === type;
      const matchCategory = category === 'all' || item.kategori === category;

      return matchSearch && matchType && matchCategory;
    });
  }

  function renderSkeletonLoading(count = 8) {
    if (!mediaContainer) return;
    let items = '';
    for (let i = 0; i < count; i++) {
      items += `
        <div class="bg-sand-50/50 dark:bg-[#1A1A1A] border border-sand-200 dark:border-white/5 rounded-2xl overflow-hidden animate-pulse flex flex-col">
          <!-- Thumbnail Skeleton -->
          <div class="aspect-video bg-sand-200/70 dark:bg-white/5 relative flex items-center justify-center">
            <i class="fa-regular fa-image text-2xl text-sand-300 dark:text-white/10"></i>
            <div class="absolute top-2.5 left-2.5 w-12 h-4 bg-sand-300/60 dark:bg-white/10 rounded"></div>
          </div>
          <!-- Body Skeleton -->
          <div class="p-3.5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="h-3.5 bg-sand-300/70 dark:bg-white/10 rounded-md w-1/2"></div>
              <div class="h-2 bg-sand-200/60 dark:bg-white/5 rounded-md w-3/4"></div>
            </div>
            <!-- Bottom Actions Skeleton -->
            <div class="pt-3 border-t border-sand-100 dark:border-white/5 flex items-center justify-end gap-1.5">
              <div class="w-7 h-7 rounded-lg bg-sand-200 dark:bg-white/5"></div>
              <div class="w-7 h-7 rounded-lg bg-sand-200 dark:bg-white/5"></div>
              <div class="w-7 h-7 rounded-lg bg-sand-200 dark:bg-white/5"></div>
            </div>
          </div>
        </div>
      `;
    }

    mediaContainer.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        ${items}
      </div>
    `;
  }

  function renderMediaGrid() {
    const filtered = getFilteredMedia();

    if (filtered.length === 0) {
      mediaContainer.innerHTML = `
        <div class="py-20 px-4 bg-white dark:bg-[#171717] border border-sand-200 dark:border-white/5 rounded-2xl text-center transition-all">
          <div class="w-14 h-14 rounded-2xl bg-sand-100 dark:bg-sand-200/5 text-sand-500 flex items-center justify-center text-xl mx-auto mb-3">
            <i class="fa-solid fa-photo-film"></i>
          </div>
          <h4 class="text-sm font-semibold text-sand-900 dark:text-white">Tidak ada media yang ditemukan</h4>
          <p class="text-xs text-sand-500 max-w-sm mx-auto mt-1">
            ${allMedia.length === 0 ? 'Tabel galeri Anda di Supabase masih kosong. Mulai tambahkan media pertama Anda!' : 'Coba ubah kata kunci pencarian atau filter yang Anda gunakan.'}
          </p>
        </div>
      `;
      return;
    }

    mediaContainer.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        ${filtered.map((item) => renderCard(item)).join('')}
      </div>
    `;

    // Attach Event Listeners to cards
    mediaContainer.querySelectorAll('[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = allMedia.find((m) => String(m.id) === String(id));
        if (item) openEditModal(item);
      });
    });

    mediaContainer.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openDeleteModal(id);
      });
    });

    mediaContainer.querySelectorAll('[data-badge-cat]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cat = btn.getAttribute('data-badge-cat');
        if (cat) {
          filterCategory.value = cat;
          renderMediaGrid();
          showToast(`Filter kategori: ${formatCategoryName(cat)}`, 'info');
        }
      });
    });
  }

  function renderCard(item) {
    const isVideo = item.tipe_media === 'video';
    const rawCatName = formatCategoryName(item.kategori || 'General');
    const catName = escapeHtml(rawCatName);
    
    // Resolve thumbnail
    let thumbUrl = item.thumb_media || item.sumber_media;
    let isYouTube = false;
    let isInstagram = false;

    if (isVideo) {
      isYouTube = typeof item.sumber_media === 'string' && (item.sumber_media.includes('youtube.com') || item.sumber_media.includes('youtu.be'));
      isInstagram = typeof item.sumber_media === 'string' && item.sumber_media.includes('instagram.com');

      if (item.cover_image) {
        thumbUrl = item.cover_image;
      } else if (isYouTube) {
        const ytId = getYouTubeId(item.sumber_media);
        thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';
      } else {
        thumbUrl = '';
      }
    }

    const safeThumbUrl = sanitizeUrl(thumbUrl);
    const safeSource = sanitizeUrl(item.sumber_media);
    const displaySource = escapeHtml(item.sumber_media || '');
    const safeItemId = escapeHtml(String(item.id || ''));
    const safeCatSlug = escapeHtml(item.kategori || '');

    return `
      <div class="group bg-white dark:bg-[#171717] border border-sand-200 dark:border-white/5 hover:border-accent/40 dark:hover:border-white/15 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col">
        <!-- Media Preview -->
        <div class="relative aspect-video bg-sand-200 dark:bg-[#1F1F1F] overflow-hidden">
          ${safeThumbUrl ? `
            <img
              src="${safeThumbUrl}"
              alt="${catName}"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onerror="this.src='https://placehold.co/600x400/222/999?text=Video+Preview';"
            />
          ` : (isInstagram ? `
            <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#FD1D1D]/85 via-[#E1306C]/85 to-[#405DE6]/85 text-white p-3 text-center">
              <i class="fa-brands fa-instagram text-3xl mb-1 drop-shadow-md"></i>
              <span class="text-[10px] font-semibold tracking-wider uppercase drop-shadow-sm">Instagram Reel</span>
            </div>
          ` : `
            <div class="w-full h-full flex flex-col items-center justify-center bg-sand-800 text-white p-3 text-center">
              <i class="fa-solid fa-play text-2xl mb-1 text-sand-300"></i>
              <span class="text-[10px] font-medium text-sand-400">Video Preview</span>
            </div>
          `)}
          <!-- Badge Tipe -->
          <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${isVideo ? 'bg-red-500/90 text-white' : 'bg-black/70 text-sand-100 border border-white/10'} flex items-center gap-1.5">
            <i class="${isVideo ? 'fa-solid fa-play' : 'fa-solid fa-camera'} text-[9px]"></i>
            <span>${isVideo ? 'Video' : 'Foto'}</span>
          </div>
        </div>

        <!-- Info Body -->
        <div class="p-3.5 flex-1 flex flex-col justify-between">
          <div>
            <button
              type="button"
              data-badge-cat="${safeCatSlug}"
              class="text-xs font-semibold text-sand-900 dark:text-white hover:text-accent transition-colors truncate text-left cursor-pointer block max-w-full"
              title="Klik untuk memfilter kategori ${catName}"
            >
              ${catName}
            </button>
            <div class="text-[10px] text-sand-400 dark:text-sand-600 mt-1 font-mono truncate" title="${displaySource}">
              <i class="fa-solid fa-link mr-1"></i>${displaySource}
            </div>
          </div>

          <!-- Actions & File Size (Posisi #urutan sebelumnya) -->
          <div class="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-sand-100 dark:border-white/5">
            <!-- File Size / Type Badge (Di posisi #urutan) -->
            <div class="min-w-0 flex items-center">
              ${getMediaSizeBadge(item)}
            </div>

            <div class="flex items-center gap-1.5 flex-shrink-0">
              <a
                href="${safeSource || '#'}"
                target="_blank"
                rel="noopener noreferrer"
                class="w-7 h-7 rounded-lg bg-sand-100 dark:bg-white/5 hover:bg-sand-200 dark:hover:bg-white/10 text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-white flex items-center justify-center text-xs transition-colors"
                title="Buka Link Asli"
              >
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
              <button
                data-action="edit"
                data-id="${safeItemId}"
                class="w-7 h-7 rounded-lg bg-sand-100 dark:bg-white/5 hover:bg-accent/20 text-sand-600 dark:text-sand-400 hover:text-accent flex items-center justify-center text-xs transition-colors"
                title="Edit Data"
              >
                <i class="fa-solid fa-pen-to-square text-[11px]"></i>
              </button>
              <button
                data-action="delete"
                data-id="${safeItemId}"
                class="w-7 h-7 rounded-lg bg-sand-100 dark:bg-white/5 hover:bg-red-500/20 text-sand-600 dark:text-sand-400 hover:text-red-500 flex items-center justify-center text-xs transition-colors"
                title="Hapus Data"
              >
                <i class="fa-solid fa-trash text-[11px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ─── MODAL CONTROLS ───────────────────────────────────────────────

  function openAddModal() {
    modalTitle.innerHTML = '<i class="fa-solid fa-plus text-accent"></i><span>Tambah Media Baru</span>';
    editId.value = '';
    mediaForm.reset();
    selectedFiles = [];
    currentUploadMode = 'file';
    resetDropzone();
    resetVideoThumbDropzone();
    switchTab('gambar');

    newCatBox.classList.add('hidden');
    inputKategoriBaru.value = '';
    inputKategori.value = ''; // Ensure default "-- Pilih Kategori --" placeholder is shown

    uploadProgressBox.classList.add('hidden');
    mediaModal.classList.remove('hidden');
    mediaModal.classList.add('flex');
    updateSaveButtonState();
  }

  function openEditModal(item) {
    modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square text-accent"></i><span>Edit Media</span>';
    editId.value = item.id;
    selectedFiles = [];
    resetDropzone();
    resetVideoThumbDropzone();

    newCatBox.classList.add('hidden');
    inputKategoriBaru.value = '';

    switchTab(item.tipe_media || 'gambar');

    if (item.tipe_media === 'gambar') {
      currentUploadMode = 'url';
      dropzoneBox.classList.add('hidden');
      urlBox.classList.remove('hidden');
      inputFotoUrl.value = item.sumber_media || '';
      btnModeUrl.classList.add('text-accent', 'underline');
      btnModeUpload.classList.remove('text-accent', 'underline');
      btnModeUpload.classList.add('text-sand-400');
    } else {
      inputVideoUrl.value = item.sumber_media || '';
      if (item.cover_image) {
        if (videoThumbImg) videoThumbImg.src = item.cover_image;
        if (videoThumbName) videoThumbName.textContent = 'Thumbnail Tersimpan';
        if (videoThumbSize) videoThumbSize.textContent = 'Cloud Storage';
        if (videoThumbPrompt) videoThumbPrompt.classList.add('hidden');
        if (videoThumbPreview) videoThumbPreview.classList.remove('hidden');
      }
    }

    // Pastikan kategori item ada di list dropdown
    if (item.kategori && !dynamicCategories.includes(item.kategori)) {
      saveCustomCategory(item.kategori);
    }
    inputKategori.value = item.kategori || '';

    uploadProgressBox.classList.add('hidden');
    mediaModal.classList.remove('hidden');
    mediaModal.classList.add('flex');
    updateSaveButtonState();
  }

  function closeModal() {
    mediaModal.classList.add('hidden');
    mediaModal.classList.remove('flex');
    mediaForm.reset();
    selectedFiles = [];
    resetDropzone();
    resetVideoThumbDropzone();
    newCatBox.classList.add('hidden');
    inputKategoriBaru.value = '';
    inputKategori.value = '';
    updateSaveButtonState();
  }

  function switchTab(type) {
    inputTipeMedia.value = type;
    if (type === 'gambar') {
      tabFoto.className = "py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-accent text-white";
      tabVideo.className = "py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-white";
      sectionFoto.classList.remove('hidden');
      sectionVideo.classList.add('hidden');
    } else {
      tabVideo.className = "py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-accent text-white";
      tabFoto.className = "py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-white";
      sectionVideo.classList.remove('hidden');
      sectionFoto.classList.add('hidden');
    }
  }

  function resetDropzone() {
    fileFoto.value = '';
    selectedFiles = [];
    dropzonePrompt.classList.remove('hidden');
    dropzonePreview.classList.add('hidden');
    if (previewThumbnailsGrid) previewThumbnailsGrid.innerHTML = '';
    if (previewCountText) previewCountText.textContent = '0 Foto Dipilih';
    if (previewTotalSize) previewTotalSize.textContent = 'Total: 0 KB';
  }

  function renderSelectedFilesPreview() {
    if (selectedFiles.length === 0) {
      resetDropzone();
      return;
    }

    dropzonePrompt.classList.add('hidden');
    dropzonePreview.classList.remove('hidden');

    if (previewCountText) {
      previewCountText.textContent = `${selectedFiles.length} Foto Dipilih`;
    }

    let totalBytes = 0;
    selectedFiles.forEach((f) => { totalBytes += f.size; });
    if (previewTotalSize) {
      previewTotalSize.textContent = `Total: ${formatBytes(totalBytes)}`;
    }

    if (previewThumbnailsGrid) {
      previewThumbnailsGrid.innerHTML = selectedFiles.map((file, idx) => {
        const objUrl = URL.createObjectURL(file);
        return `
          <div class="relative group rounded-xl overflow-hidden border border-sand-300 dark:border-white/10 bg-white dark:bg-[#202020] flex flex-col shadow-xs">
            <div class="aspect-video w-full bg-sand-200 dark:bg-white/5 relative overflow-hidden">
              <img src="${objUrl}" alt="${file.name}" class="w-full h-full object-cover" />
              <button
                type="button"
                data-remove-file-idx="${idx}"
                class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Hapus foto ini"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
              <div class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono font-medium text-white">
                #${idx + 1}
              </div>
            </div>
            <div class="p-2 text-[10px] flex items-center justify-between gap-1">
              <span class="truncate text-sand-800 dark:text-sand-200 font-medium" title="${file.name}">${file.name}</span>
              <span class="text-sand-500 font-mono text-[9px] flex-shrink-0">${formatBytes(file.size)}</span>
            </div>
          </div>
        `;
      }).join('');

      previewThumbnailsGrid.querySelectorAll('[data-remove-file-idx]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-remove-file-idx'), 10);
          selectedFiles.splice(idx, 1);
          renderSelectedFilesPreview();
        });
      });
    }
  }

  function handleFileSelection(files) {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter((f) => f.type && f.type.startsWith('image/'));

    if (validFiles.length === 0) {
      showToast('Harap pilih file gambar yang valid (JPG, PNG, WebP).', 'error');
      return;
    }

    selectedFiles = [...selectedFiles, ...validFiles];
    renderSelectedFilesPreview();
  }

  // ─── FORM SUBMIT (CREATE / UPDATE) ────────────────────────────────

  async function handleFormSubmit(e) {
    e.preventDefault();
    const isEdit = !!editId.value;
    const type = inputTipeMedia.value;
    
    // Resolve dynamic category
    let kategori = inputKategori.value;
    if (!newCatBox.classList.contains('hidden') && inputKategoriBaru.value.trim()) {
      const createdSlug = await saveCustomCategory(inputKategoriBaru.value.trim());
      if (createdSlug) {
        kategori = createdSlug;
      }
    }

    // Validasi kategori tidak boleh kosong atau masih placeholder
    if (!kategori || kategori === '__new__' || (!newCatBox.classList.contains('hidden') && !inputKategoriBaru.value.trim())) {
      showToast('Harap pilih kategori portofolio terlebih dahulu atau buat kategori baru.', 'error');
      return;
    }

    btnSaveMedia.disabled = true;
    btnSaveMedia.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i><span>Memproses...</span>';

    try {
      // 1. Kasus Tambah Foto Baru dengan Multi-File & Kompresi Dual-Tier WebP
      if (type === 'gambar' && currentUploadMode === 'file' && !isEdit) {
        if (selectedFiles.length === 0) {
          throw new Error('Silakan pilih minimal 1 file foto untuk di-upload.');
        }

        uploadProgressBox.classList.remove('hidden');
        const total = selectedFiles.length;

        for (let i = 0; i < total; i++) {
          const file = selectedFiles[i];
          const baseCleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
          const timestamp = Date.now() + i;

          // Progress Step
          const stepPercent = Math.round((i / total) * 90) + 5;
          progressBar.style.width = `${stepPercent}%`;
          progressPercent.textContent = `${stepPercent}%`;
          progressText.textContent = `Mengompres foto ${i + 1} dari ${total} (${file.name})...`;

          // Kompresi Dual-Tier:
          // a. High-Res Compressed (max 2400px, quality 0.85) untuk lightbox / tampilan detail tajam
          const highResBlob = await compressImage(file, { maxWidth: 2400, maxHeight: 2400, quality: 0.85 });
          // b. Thumbnail Compressed (max 720px, quality 0.75) untuk preview super ringan & instan
          const thumbBlob = await compressImage(file, { maxWidth: 720, maxHeight: 720, quality: 0.75 });

          progressText.textContent = `Mengunggah foto ${i + 1} dari ${total} ke cloud...`;

          const highResPath = `photos/${kategori}/${timestamp}_${i + 1}_${baseCleanName}.webp`;
          const thumbPath = `thumbnails/${kategori}/${timestamp}_thumb_${i + 1}_${baseCleanName}.webp`;

          const sumber_media = await uploadBlobToStorage(highResBlob, highResPath, 'image/webp');
          const thumb_media = await uploadBlobToStorage(thumbBlob, thumbPath, 'image/webp');

          // Catat ukuran lokal
          storageFileMap[`${timestamp}_${i + 1}_${baseCleanName}.webp`] = highResBlob.size;
          storageFileMap[`${timestamp}_thumb_${i + 1}_${baseCleanName}.webp`] = thumbBlob.size;

          // Insert ke database Supabase
          const payload = {
            tipe_media: 'gambar',
            sumber_media: sumber_media,
            thumb_media: thumb_media,
            cover_image: null,
            kategori: kategori,
            judul_id: '',
            judul_en: '',
            urutan: 0
          };

          await insertMediaItem(payload);
        }

        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';
        progressText.textContent = 'Selesai diunggah!';
        showToast(`Berhasil mengompres dan mengunggah ${total} foto!`);
        closeModal();
        await loadData();
        return;
      }

      // 2. Kasus Edit atau Tambah URL / Video
      const existing = isEdit ? allMedia.find((m) => String(m.id) === String(editId.value)) : null;
      const urutan = existing && existing.urutan ? existing.urutan : 0;
      const judul_id = existing && existing.judul_id ? existing.judul_id : '';
      const judul_en = existing && existing.judul_en ? existing.judul_en : '';

      let sumber_media = '';
      let thumb_media = null;
      let cover_image = null;

      if (type === 'gambar') {
        if (currentUploadMode === 'file') {
          if (selectedFiles.length > 0) {
            // Edit tapi user memilih file baru
            const file = selectedFiles[0];
            const baseCleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
            const timestamp = Date.now();

            uploadProgressBox.classList.remove('hidden');
            progressBar.style.width = '30%';
            progressPercent.textContent = '30%';
            progressText.textContent = `Mengompres foto (${file.name})...`;

            const highResBlob = await compressImage(file, { maxWidth: 2400, maxHeight: 2400, quality: 0.85 });
            const thumbBlob = await compressImage(file, { maxWidth: 720, maxHeight: 720, quality: 0.75 });

            progressBar.style.width = '75%';
            progressPercent.textContent = '75%';
            progressText.textContent = 'Mengunggah ke cloud...';

            const highResPath = `photos/${kategori}/${timestamp}_${baseCleanName}.webp`;
            const thumbPath = `thumbnails/${kategori}/${timestamp}_thumb_${baseCleanName}.webp`;

            sumber_media = await uploadBlobToStorage(highResBlob, highResPath, 'image/webp');
            thumb_media = await uploadBlobToStorage(thumbBlob, thumbPath, 'image/webp');

            storageFileMap[`${timestamp}_${baseCleanName}.webp`] = highResBlob.size;
            storageFileMap[`${timestamp}_thumb_${baseCleanName}.webp`] = thumbBlob.size;
          } else {
            // Edit tanpa ganti file
            sumber_media = existing ? existing.sumber_media : '';
            thumb_media = existing ? existing.thumb_media : null;
          }
        } else {
          // Mode URL Gambar
          const rawUrl = inputFotoUrl.value.trim();
          const cleanUrl = sanitizeUrl(rawUrl);
          if (!cleanUrl) throw new Error('Harap masukkan format URL foto yang valid (diawali https:// atau http://).');
          sumber_media = cleanUrl;
          thumb_media = cleanUrl;
        }
      } else {
        // Mode Video
        const rawUrl = inputVideoUrl.value.trim();
        const cleanUrl = sanitizeUrl(rawUrl);
        if (!cleanUrl) throw new Error('Harap masukkan format link video (YouTube / IG) yang valid (diawali https:// atau http://).');
        sumber_media = cleanUrl;

        const isYouTube = typeof sumber_media === 'string' && (sumber_media.includes('youtube.com') || sumber_media.includes('youtu.be'));
        const ytId = getYouTubeId(sumber_media);

        if (selectedVideoThumbFile) {
          uploadProgressBox.classList.remove('hidden');
          progressBar.style.width = '35%';
          progressPercent.textContent = '35%';
          progressText.textContent = `Mengompres foto thumbnail (${selectedVideoThumbFile.name})...`;

          // Kompresi WebP khusus thumbnail (~40-70 KB, max 720px, quality 0.75)
          const thumbBlob = await compressImage(selectedVideoThumbFile, { maxWidth: 720, maxHeight: 720, quality: 0.75 });

          progressBar.style.width = '75%';
          progressPercent.textContent = '75%';
          progressText.textContent = 'Mengunggah thumbnail ke cloud...';

          const baseCleanName = selectedVideoThumbFile.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
          const timestamp = Date.now();
          const thumbPath = `thumbnails/${kategori}/${timestamp}_thumb_${baseCleanName}.webp`;

          cover_image = await uploadBlobToStorage(thumbBlob, thumbPath, 'image/webp');
          thumb_media = cover_image;

          storageFileMap[`${timestamp}_thumb_${baseCleanName}.webp`] = thumbBlob.size;
        } else if (isEdit && existing && existing.cover_image && !selectedVideoThumbFile) {
          // Pertahankan thumbnail lama jika edit dan tidak diubah
          cover_image = existing.cover_image;
          thumb_media = cover_image;
        } else if (isYouTube && ytId) {
          // Jika YouTube dan tanpa thumbnail kustom: gunakan otomatis thumbnail bawaan YouTube
          cover_image = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          thumb_media = cover_image;
        } else {
          cover_image = null;
          thumb_media = null;
        }
      }

      const payload = {
        tipe_media: type,
        sumber_media: sumber_media,
        thumb_media: thumb_media,
        cover_image: cover_image,
        kategori: kategori,
        judul_id: judul_id,
        judul_en: judul_en,
        urutan: urutan
      };

      if (isEdit) {
        await updateMediaItem(editId.value, payload);
        showToast('Media berhasil diperbarui!');
      } else {
        await insertMediaItem(payload);
        showToast('Media baru berhasil ditambahkan ke database!');
      }

      closeModal();
      await loadData();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Terjadi kesalahan.', 'error');
    } finally {
      btnSaveMedia.disabled = false;
      btnSaveMedia.innerHTML = '<i class="fa-solid fa-floppy-disk text-xs"></i><span>Simpan Data</span>';
      uploadProgressBox.classList.add('hidden');
      progressBar.style.width = '0%';
    }
  }

  // ─── DELETE ACTIONS ───────────────────────────────────────────────

  function openDeleteModal(id) {
    deleteTargetId = id;
    deleteModal.classList.remove('hidden');
    deleteModal.classList.add('flex');
  }

  function closeDeleteModal() {
    deleteTargetId = null;
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
  }

  async function handleConfirmDelete() {
    if (!deleteTargetId) return;

    btnConfirmDelete.disabled = true;
    btnConfirmDelete.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Menghapus...';

    try {
      await deleteMediaItem(deleteTargetId);
      showToast('Media berhasil dihapus.');
      closeDeleteModal();
      await loadData();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Gagal menghapus item.', 'error');
    } finally {
      btnConfirmDelete.disabled = false;
      btnConfirmDelete.textContent = 'Ya, Hapus';
    }
  }

  // ─── CATEGORY DELETE & EDIT ACTIONS ────────────────────────────────

  function openDeleteCategoryModal(slug) {
    const count = allMedia.filter((m) => m.kategori === slug).length;
    const name = formatCategoryName(slug);

    deleteCatSlug.value = slug;

    if (count === 0) {
      deleteCatZeroBox.classList.remove('hidden');
      deleteCatHasMediaBox.classList.add('hidden');
      deleteCatNameZero.textContent = `"${name}"`;
      btnConfirmDeleteCat.innerHTML = '<i class="fa-solid fa-trash-can text-xs"></i><span>Ya, Hapus Kategori</span>';
    } else {
      deleteCatZeroBox.classList.add('hidden');
      deleteCatHasMediaBox.classList.remove('hidden');
      deleteCatNameMedia.textContent = `"${name}"`;
      deleteCatCount.textContent = count;

      // Populate target category options (all other categories)
      const otherCats = dynamicCategories.filter((c) => c !== slug);
      if (otherCats.length > 0) {
        deleteCatTargetSelect.innerHTML = otherCats
          .map((c) => `<option value="${c}">${formatCategoryName(c)}</option>`)
          .join('');
      } else {
        deleteCatTargetSelect.innerHTML = '<option value="general">General (Umum)</option>';
      }

      btnConfirmDeleteCat.innerHTML = '<i class="fa-solid fa-trash-can text-xs"></i><span>Proses & Hapus Kategori</span>';
    }

    deleteCategoryModal.classList.remove('hidden');
    deleteCategoryModal.classList.add('flex');
  }

  function closeDeleteCategoryModal() {
    deleteCategoryModal.classList.add('hidden');
    deleteCategoryModal.classList.remove('flex');
    deleteCatSlug.value = '';
  }

  async function handleConfirmDeleteCategory() {
    const slug = deleteCatSlug.value;
    if (!slug) return;

    const count = allMedia.filter((m) => m.kategori === slug).length;
    btnConfirmDeleteCat.disabled = true;
    btnConfirmDeleteCat.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i><span>Menghapus...</span>';

    try {
      if (count > 0) {
        const actionRadio = document.querySelector('input[name="cat-media-action"]:checked');
        const action = actionRadio ? actionRadio.value : 'move';

        if (action === 'move') {
          const targetCat = deleteCatTargetSelect.value || 'general';
          await bulkUpdateMediaCategory(slug, targetCat);
          showToast(`${count} media berhasil dipindahkan ke kategori "${formatCategoryName(targetCat)}".`);
        } else if (action === 'delete_all') {
          await bulkDeleteMediaByCategory(slug);
          showToast(`Kategori dan ${count} media terkait berhasil dihapus.`);
        }
      }

      await deleteCategoryFromDb(slug);
      markCategoryDeleted(slug);
      delete categoryNameMap[slug];

      // Reset filter jika sedang memfilter kategori yang dihapus
      if (filterCategory.value === slug) {
        filterCategory.value = 'all';
      }

      closeDeleteCategoryModal();
      await loadData();
      renderCategoryListModal();

      if (count === 0) {
        showToast(`Kategori "${formatCategoryName(slug)}" berhasil dihapus.`);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Gagal menghapus kategori.', 'error');
    } finally {
      btnConfirmDeleteCat.disabled = false;
      btnConfirmDeleteCat.innerHTML = '<i class="fa-solid fa-trash-can text-xs"></i><span>Ya, Hapus Kategori</span>';
    }
  }

  function openEditCategoryModal(slug) {
    editCatOldSlug.value = slug;
    inputEditCatName.value = formatCategoryName(slug);
    editCategoryModal.classList.remove('hidden');
    editCategoryModal.classList.add('flex');
    setTimeout(() => {
      inputEditCatName.focus();
      inputEditCatName.select();
    }, 50);
  }

  function closeEditCategoryModal() {
    editCategoryModal.classList.add('hidden');
    editCategoryModal.classList.remove('flex');
    editCatOldSlug.value = '';
  }

  async function handleSaveEditCategory() {
    const oldSlug = editCatOldSlug.value;
    const newName = inputEditCatName.value.trim();
    if (!newName) {
      showToast('Nama kategori baru tidak boleh kosong.', 'error');
      return;
    }

    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (!newSlug) {
      showToast('Nama kategori tidak valid.', 'error');
      return;
    }

    if (newSlug === oldSlug) {
      categoryNameMap[oldSlug] = newName;
      await updateCategoryInDb(oldSlug, oldSlug, newName);
      closeEditCategoryModal();
      await loadData();
      renderCategoryListModal();
      showToast(`Nama kategori berhasil diubah menjadi "${newName}".`);
      return;
    }

    btnSaveEditCat.disabled = true;
    btnSaveEditCat.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i><span>Menyimpan...</span>';

    try {
      const count = allMedia.filter((m) => m.kategori === oldSlug).length;
      if (count > 0) {
        await bulkUpdateMediaCategory(oldSlug, newSlug);
      }

      await updateCategoryInDb(oldSlug, newSlug, newName);
      markCategoryDeleted(oldSlug);
      unmarkCategoryDeleted(newSlug);
      categoryNameMap[newSlug] = newName;
      delete categoryNameMap[oldSlug];

      // Update local storage backup
      try {
        let savedCats = JSON.parse(localStorage.getItem('rv-custom-cats') || '[]');
        savedCats = savedCats.filter((c) => c !== oldSlug);
        if (!savedCats.includes(newSlug)) savedCats.push(newSlug);
        localStorage.setItem('rv-custom-cats', JSON.stringify(savedCats));
      } catch {}

      if (filterCategory.value === oldSlug) {
        filterCategory.value = newSlug;
      }

      closeEditCategoryModal();
      await loadData();
      renderCategoryListModal();

      showToast(`Kategori berhasil diubah menjadi "${newName}"${count > 0 ? ` (${count} media diperbarui)` : ''}.`);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Gagal mengubah nama kategori.', 'error');
    } finally {
      btnSaveEditCat.disabled = false;
      btnSaveEditCat.innerHTML = '<i class="fa-solid fa-floppy-disk text-xs"></i><span>Simpan</span>';
    }
  }

  // ─── LOAD DATA ────────────────────────────────────────────────────

  async function loadData() {
    renderSkeletonLoading(8);
    try {
      allMedia = await fetchMediaList();
      await syncCategories();
      updateStats();
      await calculateStorageUsage();
      renderMediaGrid();
    } catch (err) {
      console.error('Error fetching media:', err);
      mediaContainer.innerHTML = `
        <div class="py-12 px-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-red-500">
          <i class="fa-solid fa-triangle-exclamation text-2xl mb-2"></i>
          <p class="text-xs font-semibold">Gagal memuat galeri dari Supabase</p>
          <p class="text-[11px] text-sand-500 mt-1">${err.message}</p>
          <button onclick="window.location.reload()" class="mt-3 px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-white/10 hover:bg-sand-300 dark:hover:bg-white/20 text-sand-800 dark:text-white text-xs font-medium">
            Coba Lagi
          </button>
        </div>
      `;
    }
  }

  // ─── SETUP EVENT LISTENERS ────────────────────────────────────────

  function setupEvents() {
    // Theme Toggle
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('rv-theme', isDark ? 'dark' : 'light');
      });
    }


    // Logout
    btnLogout.addEventListener('click', async () => {
      if (window.AdminAuth && typeof window.AdminAuth.logout === 'function') {
        await window.AdminAuth.logout();
      }
      window.location.href = '../login/';
    });

    // Filters
    filterSearch.addEventListener('input', renderMediaGrid);
    filterType.addEventListener('change', renderMediaGrid);
    filterCategory.addEventListener('change', renderMediaGrid);

    // Modal Triggers
    btnAddMedia.addEventListener('click', openAddModal);
    modalClose.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);

    // Tab Switchers
    tabFoto.addEventListener('click', () => switchTab('gambar'));
    tabVideo.addEventListener('click', () => switchTab('video'));

    // Dynamic Category Events
    if (btnToggleNewCat) {
      btnToggleNewCat.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = newCatBox.classList.toggle('hidden');
        if (!isHidden) {
          inputKategoriBaru.focus();
        }
        updateSaveButtonState();
      });
    }

    if (btnCancelNewCat) {
      btnCancelNewCat.addEventListener('click', (e) => {
        e.preventDefault();
        newCatBox.classList.add('hidden');
        inputKategoriBaru.value = '';
        if (inputKategori.value === '__new__') {
          inputKategori.value = '';
        }
        updateSaveButtonState();
      });
    }

    if (inputKategori) {
      inputKategori.addEventListener('change', () => {
        if (inputKategori.value === '__new__') {
          newCatBox.classList.remove('hidden');
          inputKategoriBaru.focus();
        } else {
          newCatBox.classList.add('hidden');
          inputKategoriBaru.value = '';
        }
        updateSaveButtonState();
      });
    }

    if (inputKategoriBaru) {
      inputKategoriBaru.addEventListener('input', updateSaveButtonState);
    }

    // Category Modal Events
    if (btnManageCategories) {
      btnManageCategories.addEventListener('click', (e) => {
        e.preventDefault();
        openCategoryModal();
      });
    }

    if (modalCatClose) {
      modalCatClose.addEventListener('click', closeCategoryModal);
    }

    if (categoryModal) {
      categoryModal.addEventListener('click', (e) => {
        if (e.target === categoryModal || e.target.classList.contains('backdrop-blur-sm')) {
          closeCategoryModal();
        }
      });
    }

    if (btnSaveDirectNewCat) {
      btnSaveDirectNewCat.addEventListener('click', async (e) => {
        e.preventDefault();
        const val = inputDirectNewCat.value.trim();
        if (!val) {
          showToast('Ketikkan nama kategori yang ingin ditambahkan.', 'error');
          return;
        }
        btnSaveDirectNewCat.disabled = true;
        btnSaveDirectNewCat.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i><span>Menambahkan...</span>';
        try {
          const slug = await saveCustomCategory(val);
          if (slug) {
            showToast(`Kategori "${formatCategoryName(slug)}" berhasil ditambahkan!`);
            renderCategoryListModal();
            inputDirectNewCat.value = '';
          }
        } catch (err) {
          console.error(err);
          showToast('Gagal menambahkan kategori.', 'error');
        } finally {
          btnSaveDirectNewCat.disabled = false;
          btnSaveDirectNewCat.innerHTML = '<i class="fa-solid fa-plus text-xs"></i><span>Tambah Kategori</span>';
        }
      });
    }

    if (inputDirectNewCat) {
      inputDirectNewCat.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          btnSaveDirectNewCat.click();
        }
      });
    }

    // Upload mode switchers
    btnModeUpload.addEventListener('click', () => {
      currentUploadMode = 'file';
      dropzoneBox.classList.remove('hidden');
      urlBox.classList.add('hidden');
      btnModeUpload.classList.add('text-accent', 'underline');
      btnModeUrl.classList.remove('text-accent', 'underline');
      btnModeUrl.classList.add('text-sand-400');
    });

    btnModeUrl.addEventListener('click', () => {
      currentUploadMode = 'url';
      dropzoneBox.classList.add('hidden');
      urlBox.classList.remove('hidden');
      btnModeUrl.classList.add('text-accent', 'underline');
      btnModeUpload.classList.remove('text-accent', 'underline');
      btnModeUpload.classList.add('text-sand-400');
    });

    // Dropzone Events
    dropzoneBox.addEventListener('click', (e) => {
      if (e.target.closest('#dropzone-preview')) return;
      fileFoto.click();
    });

    fileFoto.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files);
      }
    });

    btnChangeFile.addEventListener('click', (e) => {
      e.stopPropagation();
      resetDropzone();
      fileFoto.click();
    });

    // Drag & Drop
    dropzoneBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzoneBox.classList.add('border-accent');
    });
    dropzoneBox.addEventListener('dragleave', () => {
      dropzoneBox.classList.remove('border-accent');
    });
    dropzoneBox.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzoneBox.classList.remove('border-accent');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files);
      }
    });

    // Video Thumbnail Dropzone Events
    if (videoThumbDropzone) {
      videoThumbDropzone.addEventListener('click', (e) => {
        if (e.target.closest('#video-thumb-preview')) return;
        if (fileVideoThumbnail) fileVideoThumbnail.click();
      });

      videoThumbDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        videoThumbDropzone.classList.add('border-accent');
      });
      videoThumbDropzone.addEventListener('dragleave', () => {
        videoThumbDropzone.classList.remove('border-accent');
      });
      videoThumbDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        videoThumbDropzone.classList.remove('border-accent');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleVideoThumbnailSelection(e.dataTransfer.files[0]);
        }
      });
    }

    if (fileVideoThumbnail) {
      fileVideoThumbnail.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleVideoThumbnailSelection(e.target.files[0]);
        }
      });
    }

    if (btnRemoveVideoThumb) {
      btnRemoveVideoThumb.addEventListener('click', (e) => {
        e.stopPropagation();
        resetVideoThumbDropzone();
      });
    }

    // Form Submit
    mediaForm.addEventListener('submit', handleFormSubmit);

    // Delete Modal
    btnCancelDelete.addEventListener('click', closeDeleteModal);
    btnConfirmDelete.addEventListener('click', handleConfirmDelete);

    // Category Delete Modal Events
    if (btnCancelDeleteCat) {
      btnCancelDeleteCat.addEventListener('click', closeDeleteCategoryModal);
    }
    if (btnConfirmDeleteCat) {
      btnConfirmDeleteCat.addEventListener('click', handleConfirmDeleteCategory);
    }
    if (deleteCategoryModal) {
      deleteCategoryModal.addEventListener('click', (e) => {
        if (e.target === deleteCategoryModal || e.target.classList.contains('backdrop-blur-sm')) {
          closeDeleteCategoryModal();
        }
      });
    }

    // Category Edit Modal Events
    if (btnCloseEditCatModal) {
      btnCloseEditCatModal.addEventListener('click', closeEditCategoryModal);
    }
    if (btnCancelEditCat) {
      btnCancelEditCat.addEventListener('click', closeEditCategoryModal);
    }
    if (btnSaveEditCat) {
      btnSaveEditCat.addEventListener('click', handleSaveEditCategory);
    }
    if (inputEditCatName) {
      inputEditCatName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSaveEditCategory();
        }
      });
    }
    if (editCategoryModal) {
      editCategoryModal.addEventListener('click', (e) => {
        if (e.target === editCategoryModal || e.target.classList.contains('backdrop-blur-sm')) {
          closeEditCategoryModal();
        }
      });
    }
  }

  // Init
  checkAuthAndInit();

})();
