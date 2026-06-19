/**
 * ReasonVisual — Documentation Services
 * Vanilla JavaScript ES6
 * Light/Dark Theme + Dynamic Gallery
 */

(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────────────
  const DATA_URL = './data.json';
  const WHATSAPP_NUMBER = '6281805230948';
  const WHATSAPP_MSG = encodeURIComponent(
    'Halo! Saya tertarik dengan jasa dokumentasi Anda. Bisa konsultasi lebih lanjut?'
  );

  const PACKAGES = {
    silver_drone: {
      name_en: "Silver - Drone Video Only",
      name_id: "Silver - Video Drone Only",
      price: "Rp 999.000"
    },
    silver_photo: {
      name_en: "Silver - Photo Documentation Only",
      name_id: "Silver - Foto Dokumentasi Only",
      price: "Rp 1.499.000"
    },
    premium: {
      name_en: "Premium Package",
      name_id: "Premium Package",
      price: "Rp 2.999.000"
    },
    gold: {
      name_en: "Gold Package",
      name_id: "Gold Package",
      price: "Rp 1.999.000"
    }
  };

  // ─── TRANSLATIONS ─────────────────────────────────────────────
  const TRANSLATIONS = {
    en: {
      nav_home: "Home",
      nav_about: "About",
      nav_pricelist: "Price List",
      nav_gallery: "Gallery",
      nav_contact: "Contact",
      hero_tagline: "Documentation Services",
      hero_title: "Capture Your Moments",
      btn_prices: "View Prices",
      btn_gallery: "View Gallery",
      tag_wedding: "Wedding",
      tag_prewedding: "Pre-Wedding",
      tag_event: "Event",
      tag_travel: "Travel",
      tag_company: "Company",
      tag_graduation: "Graduation",
      tag_drone: "Drone",
      tag_cinematic: "Cinematic",
      tag_others: "Others",
      tag_more: "& More",
      about_title: "About Us",
      about_p1: "ReasonVisual is a professional documentation team providing photo, video, and drone shoot services for various needs — ranging from wedding, pre-wedding, event, travel, company profile, graduation, to other custom documentation needs according to your requests.",
      about_p2: "We believe that every moment has a story worth capturing. With modern equipment and a creative eye, we turn ordinary moments into memorable visual works that can be cherished forever.",
      stats_projects: "Completed Projects",
      stats_clients: "Satisfied Clients",
      stats_experience: "Years of Experience",
      price_eyebrow: "Package Price List",
      price_title: "Choose Documentation Package",
      price_subtitle: "Professional documentation services for Wedding, Pre-Wedding, Event, Travel, Company, Graduation & other documentations.",
      price_silver_desc: "Budget-friendly option for specific documentation needs.",
      price_drone_only: "Drone Video Only",
      price_no_edit: "No Edit",
      price_photo_only: "Photo Documentation Only",
      price_btn_silver: "Choose Silver",
      price_btn_silver_drone: "Choose Drone Only",
      price_btn_silver_photo: "Choose Photo Only",
      price_best_value: "Best Value",
      price_best_complete: "Best complete package",
      price_feature_photo_video: "Photo & Video Documentation",
      price_feature_drone: "Drone Shoot",
      price_feature_all_files: "All Edited & Raw Files",
      price_feature_flashdisk: "Flash Drive",
      price_btn_premium: "Choose Premium",
      price_video_complete: "Complete video documentation",
      price_feature_video_doc: "Video Documentation",
      price_feature_all_edited: "All Edited Files",
      price_btn_gold: "Choose Gold",
      gallery_eyebrow: "Portfolio",
      gallery_title: "Gallery",
      gallery_desc: "Our documentation collection from various wedding, event, travel, and corporate projects.",
      filter_all: "All",
      filter_photo: "Photos",
      filter_video: "Videos",
      contact_eyebrow: "Contact",
      contact_title: "Book Now",
      contact_desc: "Contact us for consultation and booking your documentation schedule.",
      contact_btn_wa: "Contact via WhatsApp",
      contact_phone_label: "Phone",
      footer_rights: "All rights reserved.",
      modal_title: "Book Package",
      modal_subtitle: "Please fill in the details below to prepare your WhatsApp message.",
      modal_package_selected: "Selected Package",
      modal_price: "Price",
      modal_label_name: "Your Name",
      modal_placeholder_name: "e.g., Alex Johnson",
      modal_label_date: "Event Date",
      modal_label_location: "Event Location",
      modal_placeholder_location: "e.g., Bali, Indonesia",
      modal_btn_send: "Send via WhatsApp",
      modal_btn_cancel: "Cancel",
      modal_label_chat_lang: "Chat Language"
    },
    id: {
      nav_home: "Beranda",
      nav_about: "Tentang Kami",
      nav_pricelist: "Daftar Harga",
      nav_gallery: "Galeri",
      nav_contact: "Kontak",
      hero_tagline: "Jasa Dokumentasi",
      hero_title: "Abadikan Momen Anda",
      btn_prices: "Lihat Harga",
      btn_gallery: "Lihat Galeri",
      tag_wedding: "Wedding",
      tag_prewedding: "Pre-Wedding",
      tag_event: "Event",
      tag_travel: "Travel",
      tag_company: "Company",
      tag_graduation: "Wisuda",
      tag_drone: "Drone",
      tag_cinematic: "Cinematic",
      tag_others: "Lainnya",
      tag_more: "& Lainnya",
      about_title: "Tentang Kami",
      about_p1: "ReasonVisual adalah tim dokumentasi profesional yang menghadirkan layanan foto, video, dan drone shoot untuk berbagai kebutuhan — mulai dari wedding, pre-wedding, event, travel, company profile, wisuda, hingga berbagai jenis dokumentasi lainnya sesuai kebutuhan Anda.",
      about_p2: "Kami percaya bahwa setiap momen memiliki cerita yang layak diabadikan. Dengan peralatan modern dan mata kreatif, kami mengubah momen biasa menjadi karya visual yang berkesan dan bisa dikenang selamanya.",
      stats_projects: "Proyek Selesai",
      stats_clients: "Klien Puas",
      stats_experience: "Tahun Pengalaman",
      price_eyebrow: "Package Price List",
      price_title: "Pilih Paket Dokumentasi",
      price_subtitle: "Layanan dokumentasi profesional untuk Wedding, Pre-Wedding, Event, Travel, Company, Wisuda & dokumentasi lainnya.",
      price_silver_desc: "Pilihan hemat untuk kebutuhan dokumentasi spesifik.",
      price_drone_only: "Video Drone Only",
      price_no_edit: "No Edit",
      price_photo_only: "Foto Documentation Only",
      price_btn_silver: "Pilih Silver",
      price_btn_silver_drone: "Pilih Video Drone Only",
      price_btn_silver_photo: "Pilih Foto Only",
      price_best_value: "Best Value",
      price_best_complete: "Paket lengkap terbaik",
      price_feature_photo_video: "Foto & Video Documentation",
      price_feature_drone: "Shoot Drone",
      price_feature_all_files: "All File Edit dan Mentah",
      price_feature_flashdisk: "Flash Disk",
      price_btn_premium: "Pilih Premium",
      price_video_complete: "Dokumentasi video lengkap",
      price_feature_video_doc: "Video Documentation",
      price_feature_all_edited: "All File Edit",
      price_btn_gold: "Pilih Gold",
      gallery_eyebrow: "Portofolio",
      gallery_title: "Gallery",
      gallery_desc: "Koleksi hasil dokumentasi kami dari berbagai proyek wedding, event, travel, dan company.",
      filter_all: "Semua",
      filter_photo: "Foto",
      filter_video: "Video",
      contact_eyebrow: "Kontak",
      contact_title: "Booking Sekarang",
      contact_desc: "Hubungi kami untuk konsultasi dan booking jadwal dokumentasi Anda.",
      contact_btn_wa: "Hubungi via WhatsApp",
      contact_phone_label: "Telepon",
      footer_rights: "Hak Cipta Dilindungi.",
      modal_title: "Booking Paket",
      modal_subtitle: "Silakan isi detail di bawah untuk menyiapkan pesan WhatsApp Anda.",
      modal_package_selected: "Paket Terpilih",
      modal_price: "Harga",
      modal_label_name: "Nama Anda",
      modal_placeholder_name: "contoh: Budi Santoso",
      modal_label_date: "Tanggal Acara",
      modal_label_location: "Lokasi Acara",
      modal_placeholder_location: "contoh: Bali, Indonesia",
      modal_btn_send: "Kirim via WhatsApp",
      modal_btn_cancel: "Batal",
      modal_label_chat_lang: "Bahasa Chat"
    }
  };

  let currentLang = localStorage.getItem('rv-lang') || 'en';

  // ─── DOM ──────────────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const galleryGrid = $('#gallery-grid');
  const galleryLoader = $('#gallery-loader');
  const navbar = $('#navbar');
  const mobileMenuBtn = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  const themeToggle = $('#theme-toggle');
  const langToggle = $('#lang-toggle');
  const yearSpan = $('#current-year');
  const ctaWa = $('#cta-whatsapp');

  const bookingModal = $('#booking-modal');
  const bookingForm = $('#booking-form');
  const modalBackdrop = $('#modal-backdrop');
  const modalBox = $('#modal-box');
  const modalClose = $('#modal-close');
  const modalCancelBtn = $('#modal-cancel-btn');
  const modalPackageName = $('#modal-package-name');
  const modalPackagePrice = $('#modal-package-price');

  // ─── THEME ────────────────────────────────────────────────────

  function applyTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('rv-theme', dark ? 'dark' : 'light');
  }

  function initTheme() {
    const stored = localStorage.getItem('rv-theme');
    applyTheme(stored === 'dark');
  }

  function setupThemeToggle() {
    if (!themeToggle) return;
    themeToggle.addEventListener('click', () => {
      applyTheme(!document.documentElement.classList.contains('dark'));
    });
  }

  // ─── LANGUAGE ─────────────────────────────────────────────────

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('rv-lang', lang);

    // Update switcher button label
    if (langToggle) {
      langToggle.innerHTML = `<i class="fa-solid fa-language text-sm"></i><span>${lang.toUpperCase()}</span>`;
    }

    // Set page title & SEO description
    document.title = lang === 'en' ? 'ReasonVisual - Documentation Services' : 'ReasonVisual - Jasa Dokumentasi';
    const metaDesc = $('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        lang === 'en'
          ? 'ReasonVisual - Professional documentation services for Wedding, Pre-Wedding, Event, Travel, Company Profile, Graduation & other documentations. High quality photos, videos, and drone shoots.'
          : 'ReasonVisual - Jasa dokumentasi profesional untuk Wedding, Pre-Wedding, Event, Travel, Company Profile, Wisuda & dokumentasi lainnya. Foto, video, dan drone shoot berkualitas tinggi.'
      );
    }

    // Translate all elements tagged with data-i18n
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        el.innerHTML = TRANSLATIONS[lang][key];
      }
    });

    // Refresh gallery items text dynamically if already loaded
    refreshGallery();
  }

  function setupLangToggle() {
    if (!langToggle) return;
    langToggle.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'id' : 'en');
    });
  }

  function refreshGallery() {
    if (!window.galleryData) return;
    const activeBtn = $('.gallery-filter-btn.bg-accent');
    const filterVal = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    if (window.galleryData.length === 0) {
      renderEmptyPlaceholders(filterVal);
      return;
    }
    const filtered = filterVal === 'all'
      ? window.galleryData
      : window.galleryData.filter((item) => item.tipe_media === filterVal);
    renderGalleryItems(filtered);
  }

  // ─── NAVBAR ───────────────────────────────────────────────────

  function handleNavScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  // ─── ACTIVE LINK ──────────────────────────────────────────────

  function highlightActiveLink() {
    const scrollY = window.scrollY + 120;
    $$('section[id]').forEach((sec) => {
      const active = scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight;
      const id = sec.id;
      $$('.nav-link').forEach((l) => {
        if (l.getAttribute('href') === `#${id}`) l.classList.toggle('active', active);
      });
      $$('.mobile-nav-link').forEach((l) => {
        if (l.getAttribute('href') === `#${id}`) l.classList.toggle('active', active);
      });
    });
  }

  // ─── MOBILE MENU ──────────────────────────────────────────────

  function setupMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;
    mobileMenuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('menu-open');
      if (navbar) navbar.classList.toggle('mobile-open', open);
      mobileMenuBtn.setAttribute('aria-expanded', String(open));
      const bars = mobileMenuBtn.querySelectorAll('span');
      if (open) {
        bars[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        bars.forEach((b) => { b.style.transform = ''; b.style.opacity = ''; });
      }
    });
    $$('.mobile-nav-link').forEach((l) => {
      l.addEventListener('click', () => {
        mobileMenu.classList.remove('menu-open');
        if (navbar) navbar.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.querySelectorAll('span').forEach((b) => {
          b.style.transform = ''; b.style.opacity = '';
        });
      });
    });
  }

  // ─── SCROLL REVEAL ────────────────────────────────────────────

  function setupReveal() {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('show'); observer.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    $$('.reveal').forEach((el) => observer.observe(el));
  }

  // ─── WHATSAPP & BOOKING MODAL ─────────────────────────────────

  let selectedPackage = null;
  let modalChatLang = 'en';

  function updateModalLangUI(lang) {
    modalChatLang = lang;

    // Update modal language selector pills active state classes
    const btnEn = $('#modal-lang-en');
    const btnId = $('#modal-lang-id');
    if (btnEn && btnId) {
      if (lang === 'en') {
        btnEn.className = "py-2 rounded-lg text-xs font-semibold tracking-wider transition-all bg-white dark:bg-[#1C1C1C] text-sand-900 dark:text-sand-100 shadow-sm";
        btnId.className = "py-2 rounded-lg text-xs font-semibold tracking-wider transition-all text-sand-500 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-200";
      } else {
        btnId.className = "py-2 rounded-lg text-xs font-semibold tracking-wider transition-all bg-white dark:bg-[#1C1C1C] text-sand-900 dark:text-sand-100 shadow-sm";
        btnEn.className = "py-2 rounded-lg text-xs font-semibold tracking-wider transition-all text-sand-500 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-200";
      }
    }

    // Update placeholders based on chat language selection
    const nameInput = $('#booking-name');
    if (nameInput) {
      nameInput.placeholder = lang === 'en' ? 'e.g., Alex Johnson' : 'contoh: Budi Santoso';
    }
    const locationInput = $('#booking-location');
    if (locationInput) {
      locationInput.placeholder = lang === 'en' ? 'e.g., Bali, Indonesia' : 'contoh: Bali, Indonesia';
    }

    // Update package name text based on chat language selection
    if (selectedPackage && PACKAGES[selectedPackage]) {
      const pkg = PACKAGES[selectedPackage];
      const name = lang === 'en' ? pkg.name_en : pkg.name_id;
      if (modalPackageName) modalPackageName.textContent = name;
    }
  }

  function openBookingModal(pkgId) {
    selectedPackage = pkgId;
    const pkg = PACKAGES[pkgId];
    if (!pkg) return;

    // Initialize the modal chat language matching the website's current active language
    updateModalLangUI(currentLang);

    const name = currentLang === 'en' ? pkg.name_en : pkg.name_id;
    if (modalPackageName) modalPackageName.textContent = name;
    if (modalPackagePrice) modalPackagePrice.textContent = pkg.price;

    if (bookingModal && modalBackdrop && modalBox) {
      bookingModal.classList.remove('hidden');
      bookingModal.classList.add('flex');

      setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalBackdrop.classList.add('opacity-100');
        modalBox.classList.remove('scale-95', 'opacity-0');
        modalBox.classList.add('scale-100', 'opacity-100');
      }, 10);

      document.body.style.overflow = 'hidden';
    }
  }

  function closeBookingModal() {
    if (!bookingModal || !modalBackdrop || !modalBox) return;

    modalBackdrop.classList.remove('opacity-100');
    modalBackdrop.classList.add('opacity-0');
    modalBox.classList.remove('scale-100', 'opacity-100');
    modalBox.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      bookingModal.classList.add('hidden');
      bookingModal.classList.remove('flex');
      if (bookingForm) bookingForm.reset();
      selectedPackage = null;
    }, 300);

    document.body.style.overflow = '';
  }

  function handleBookingSubmit(e) {
    e.preventDefault();
    if (!selectedPackage) return;

    const nameInput = $('#booking-name');
    const dateInput = $('#booking-date');
    const locationInput = $('#booking-location');

    const name = nameInput ? nameInput.value.trim() : '';
    const dateVal = dateInput ? dateInput.value : '';
    const location = locationInput ? locationInput.value.trim() : '';

    let formattedDate = dateVal;
    if (dateVal) {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        // Use chosen modalChatLang for date format
        formattedDate = d.toLocaleDateString(modalChatLang === 'en' ? 'en-US' : 'id-ID', options);
      }
    }

    const pkg = PACKAGES[selectedPackage];
    const pkgName = modalChatLang === 'en' ? pkg.name_en : pkg.name_id;
    const pkgPrice = pkg.price;

    let text = "";
    if (modalChatLang === 'en') {
      text = `Hello!\n\nI am interested in booking the ${pkgName}.\nPrice: ${pkgPrice}\n\nBooking Details:\n- Name: ${name}\n- Date: ${formattedDate}\n- Location: ${location}\n\nIs this slot available?`;
    } else {
      text = `Halo!\n\nSaya tertarik untuk memesan paket ${pkgName}.\nHarga: ${pkgPrice}\n\nDetail Booking:\n- Nama: ${name}\n- Tanggal Acara: ${formattedDate}\n- Lokasi Acara: ${location}\n\nApakah slot tanggal tersebut masih tersedia?`;
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    closeBookingModal();
  }

  function setupWhatsapp() {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
    if (ctaWa) ctaWa.href = url;

    $$('[data-package]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pkgId = btn.getAttribute('data-package');
        openBookingModal(pkgId);
      });
    });

    // Modal language selector events - does not affect global site language
    const btnEn = $('#modal-lang-en');
    const btnId = $('#modal-lang-id');
    if (btnEn) btnEn.addEventListener('click', () => updateModalLangUI('en'));
    if (btnId) btnId.addEventListener('click', () => updateModalLangUI('id'));

    if (modalClose) modalClose.addEventListener('click', closeBookingModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeBookingModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeBookingModal);
    if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  // ─── GALLERY RENDER ───────────────────────────────────────────

  function getImageSrc(media) {
    return media.startsWith('http') ? media : `assets/images/${media}`;
  }

  function skeletonCard(type = 'photo') {
    const isVideo = type === 'video';
    const iconClass = isVideo ? 'fa-solid fa-video' : 'fa-solid fa-camera';
    const labelKey = isVideo ? 'filter_video' : 'filter_photo';
    let label = TRANSLATIONS[currentLang] ? TRANSLATIONS[currentLang][labelKey] : (isVideo ? 'Video' : 'Photo');
    if (currentLang === 'en') {
      label = isVideo ? 'Video' : 'Photo';
    }

    const d = document.createElement('div');
    d.className = 'rounded-xl overflow-hidden bg-white dark:bg-[#1F1F1F] border border-sand-200 dark:border-sand-800 shadow-sm';
    d.innerHTML = `
      <div class="aspect-video bg-sand-200 dark:bg-sand-800/40 skeleton flex flex-col items-center justify-center text-sand-500/50 dark:text-sand-500/30 gap-2">
        <i class="${iconClass} text-2xl"></i>
        <span class="text-[10px] tracking-wider uppercase font-semibold">${label}</span>
      </div>
    `;
    return d;
  }

  function renderEmptyPlaceholders(filterVal = 'all') {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      let type = 'photo';
      if (filterVal === 'all') {
        type = i % 2 === 0 ? 'photo' : 'video';
      } else if (filterVal === 'video') {
        type = 'video';
      } else {
        type = 'photo';
      }
      galleryGrid.appendChild(skeletonCard(type));
    }
  }

  function imageCard(item) {
    const title = currentLang === 'en' ? item.judul_en : item.judul_id;
    return `
      <div class="gallery-card rounded-xl overflow-hidden bg-white dark:bg-[#1F1F1F] border border-sand-200 dark:border-sand-800 shadow-sm">
        <div class="relative aspect-video bg-sand-200 dark:bg-sand-800 skeleton overflow-hidden group">
          <img
            src="${getImageSrc(item.sumber_media)}"
            alt="${title}"
            loading="lazy"
            class="relative z-10 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105"
            onload="this.style.opacity='1'; this.parentElement.classList.remove('skeleton');"
            onerror="this.style.display='none';"
          />
        </div>
      </div>
    `;
  }

  function videoCard(item) {
    const title = currentLang === 'en' ? item.judul_en : item.judul_id;
    return `
      <div class="gallery-card rounded-xl overflow-hidden bg-white dark:bg-[#1F1F1F] border border-sand-200 dark:border-sand-800 shadow-sm">
        <div class="relative aspect-video bg-sand-200 dark:bg-sand-800 overflow-hidden">
          <iframe
            src="${item.sumber_media}"
            title="${title}"
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy"
          ></iframe>
        </div>
      </div>
    `;
  }

  function renderGalleryItems(items) {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = items
      .map((item) => (item.tipe_media === 'video' ? videoCard(item) : imageCard(item)))
      .join('');

    galleryGrid.querySelectorAll('.gallery-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 40);
    });
  }

  function setupGalleryFilters() {
    const filterBtns = $$('.gallery-filter-btn');
    if (filterBtns.length === 0) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');

        // Update active classes on filter buttons
        filterBtns.forEach((b) => {
          b.classList.remove('bg-accent', 'text-white', 'shadow-md', 'shadow-accent/15');
          b.classList.add('bg-sand-200', 'dark:bg-sand-800', 'text-sand-700', 'dark:text-sand-300', 'hover:bg-sand-300', 'dark:hover:bg-sand-700');
        });

        btn.classList.add('bg-accent', 'text-white', 'shadow-md', 'shadow-accent/15');
        btn.classList.remove('bg-sand-200', 'dark:bg-sand-800', 'text-sand-700', 'dark:text-sand-300', 'hover:bg-sand-300', 'dark:hover:bg-sand-700');

        // Render filtered items
        if (window.galleryData) {
          if (window.galleryData.length === 0) {
            renderEmptyPlaceholders(filterVal);
          } else {
            const filtered = filterVal === 'all'
              ? window.galleryData
              : window.galleryData.filter((item) => item.tipe_media === filterVal);
            renderGalleryItems(filtered);
          }
        }
      });
    });
  }

  async function loadGallery() {
    if (galleryLoader) {
      galleryLoader.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        const type = i % 2 === 0 ? 'photo' : 'video';
        galleryLoader.appendChild(skeletonCard(type));
      }
    }

    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      await new Promise((r) => setTimeout(r, 400));
      if (galleryLoader) galleryLoader.style.display = 'none';

      if (galleryGrid) {
        window.galleryData = data;
        if (data.length === 0) {
          renderEmptyPlaceholders('all');
        } else {
          renderGalleryItems(data);
        }
        setupGalleryFilters();
      }
    } catch (err) {
      console.error('Gallery load error:', err);
      if (galleryGrid) {
        renderEmptyPlaceholders('all');
      }
      if (galleryLoader) galleryLoader.style.display = 'none';
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────

  function init() {
    initTheme();
    setupThemeToggle();
    setLanguage(currentLang);
    setupLangToggle();
    setupMobileMenu();
    setupWhatsapp();
    setupReveal();
    handleNavScroll();
    highlightActiveLink();
    loadGallery();

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    window.addEventListener('scroll', () => { handleNavScroll(); highlightActiveLink(); });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
