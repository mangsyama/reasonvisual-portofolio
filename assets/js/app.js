/**
 * ReasonVisual — Documentation Services
 * Vanilla JavaScript ES6
 * Light/Dark Theme + Dynamic Gallery
 */

(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────────────
  const WHATSAPP_NUMBER = '6281805230948';
  const WHATSAPP_MSG = encodeURIComponent(
    'Halo! Saya tertarik dengan jasa dokumentasi Anda. Bisa konsultasi lebih lanjut?'
  );

  const PACKAGES = {
    silver_drone: {
      name_en: "Silver A - Drone Video Only",
      name_id: "Silver A - Video Drone Only",
      price: "Rp 999.000"
    },
    silver_photo: {
      name_en: "Silver B - Photo Only",
      name_id: "Silver B - Photo Only",
      price: "Rp 1.499.000"
    },
    gold: {
      name_en: "Gold - Complete Video Documentation",
      name_id: "Gold - Complete Video Documentation",
      price: "Rp 1.999.000"
    },
    premium: {
      name_en: "Premium - All-In Documentation",
      name_id: "Premium - All-In Documentation",
      price: "Rp 2.999.000"
    },
    drone_property: {
      name_en: "Drone Property Photo Only (B2B)",
      name_id: "Drone Property Photo Only (B2B)",
      price: "Rp 500.000 - Rp 750.000"
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
      hero_title: "Capture Your<br />Moments with Us",
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
      tag_property: "Villa & Property",
      tag_others: "Others",
      tag_more: "& More",
      about_title: "About Us",
      about_p1: "ReasonVisual is a professional documentation team providing photo, video, and drone shoot services for various needs — ranging from wedding, pre-wedding, event, travel, company profile, graduation, to villa & property commercial documentations.",
      about_p2: "We believe that every moment has a story worth capturing. With modern equipment and a creative eye, we turn ordinary moments into memorable visual works that can be cherished forever.",
      stats_projects: "Completed Projects",
      stats_clients: "Satisfied Clients",
      stats_experience: "Years of Experience",
      price_eyebrow: "Package Price List",
      price_title: "Choose Documentation Package",
      price_subtitle: "Professional documentation services for Wedding, Pre-Wedding, Event, Travel, Company, Villa & Property documentations.",
      price_silver_desc: "Budget-friendly entry options for specific photo or drone video needs.",
      price_drone_only: "Silver A: Drone Video Only",
      price_drone_desc: "1 Hour Flight (Maximum 2 Batteries) • RAW Clips 4K/1080p • Drive Link",
      price_photo_only: "Silver B: Photo Only",
      price_photo_desc: "1 Pro Photographer • Maximum 6 Hours Location Coverage • All Edited (Color Graded) + Original RAW/JPEG Access",
      price_btn_silver: "Choose Silver",
      price_btn_silver_drone: "Choose Drone Only",
      price_btn_silver_photo: "Choose Photo Only",
      price_best_value: "Best Value",
      price_gold_title: "Gold: Complete Video Documentation",
      price_gold_desc: "Integrated video & drone documentation package for high engagement.",
      price_gold_f1: "1 Videographer + 1 Drone Pilot (Combined)",
      price_gold_f2: "1 Main Video / Cinematic Highlight (Duration 2–3 Minutes)",
      price_gold_f3: "Bonus: 1 Vertical Short Video (Reels / TikTok / Shorts 30–60 Seconds)",
      price_gold_f4: "Full Editing, Sound Design & Licensed Music",
      price_gold_f5: "Delivery via Google Drive Link",
      price_btn_gold: "Choose Gold",
      price_premium_title: "Premium: All-In Documentation",
      price_premium_desc: "The ultimate flagship coverage with complete media deliverables.",
      price_premium_f1: "Full Team: 1 Photographer + 1 Videographer + 1 Drone Pilot",
      price_premium_f2: "Half Day Coverage (6 Hours Location Coverage)",
      price_premium_f3: "Output: All Edited Photos + 1 Main Video + 1 Shorts Video",
      price_premium_f4: "Value Booster: Bonus 1 Exclusive Flash Drive + Google Drive Link",
      price_btn_premium: "Choose Premium",
      price_b2b_tag: "Villa & Property Segment",
      price_b2b_title: "Drone Property Photo Only",
      price_b2b_subtitle: "High-impact visual perspective crafted specifically for Airbnb, Booking.com, & Instagram commercial promotion.",
      price_b2b_price: "Rp 500.000 – Rp 750.000",
      price_b2b_f1: "Dedicated aerial photoshoot for exterior, landscape & architectural angles",
      price_b2b_f2: "1 Hour Flight Session (Maximum 2 Batteries)",
      price_b2b_f3: "10–15 High Resolution Aerial Shots",
      price_b2b_f4: "Advanced Property Editing (Sky Replacement & Architectural Color Grading)",
      price_b2b_f5: "Commercial Digital Use License Included",
      price_b2b_f6: "Fast Delivery via Google Drive Link",
      price_btn_b2b: "Choose Property Package",
      gallery_eyebrow: "Portfolio",
      gallery_title: "Gallery",
      gallery_desc: "Our documentation collection from various wedding, event, travel, and corporate projects.",
      filter_all: "All",
      filter_photo: "Photos",
      filter_video: "Videos",
      sub_all: "All Photos",
      sub_all_photos: "All Photos",
      sub_all_videos: "All Videos",
      tag_bali: "Bali Ceremony",
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
      hero_title: "Abadikan Momen Anda<br />Bersama Kami",
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
      tag_property: "Villa & Properti",
      tag_others: "Lainnya",
      tag_more: "& Lainnya",
      about_title: "Tentang Kami",
      about_p1: "ReasonVisual adalah tim dokumentasi profesional yang menghadirkan layanan foto, video, dan drone shoot untuk berbagai kebutuhan — mulai dari wedding, pre-wedding, event, travel, company profile, wisuda, hingga dokumentasi komersial villa & properti.",
      about_p2: "Kami percaya bahwa setiap momen memiliki cerita yang layak diabadikan. Dengan peralatan modern dan mata kreatif, kami mengubah momen biasa menjadi karya visual yang berkesan dan bisa dikenang selamanya.",
      stats_projects: "Proyek Selesai",
      stats_clients: "Klien Puas",
      stats_experience: "Tahun Pengalaman",
      price_eyebrow: "Package Price List",
      price_title: "Pilih Paket Dokumentasi",
      price_subtitle: "Layanan dokumentasi profesional untuk Wedding, Pre-Wedding, Event, Travel, Company, Wisuda, Villa & Properti.",
      price_silver_desc: "Pilihan fleksibel untuk kebutuhan spesifik foto atau video drone.",
      price_drone_only: "Silver A: Video Drone Only",
      price_drone_desc: "1 Jam Terbang (Maksimal 2 Baterai) • RAW Clips 4K/1080p • Drive Link",
      price_photo_only: "Silver B: Photo Only",
      price_photo_desc: "1 Fotografer Profesional • Durasi Maksimal 6 Jam di Lokasi • All Foto Edited (Color Graded) + Akses Foto Asli (RAW/JPEG)",
      price_btn_silver: "Pilih Silver",
      price_btn_silver_drone: "Pilih Video Drone Only",
      price_btn_silver_photo: "Pilih Photo Only",
      price_best_value: "Best Value",
      price_gold_title: "Gold: Complete Video Documentation",
      price_gold_desc: "Paket dokumentasi video & drone sinematik terintegrasi.",
      price_gold_f1: "1 Videografer + 1 Pilot Drone (Kombinasi)",
      price_gold_f2: "1 Video Utama / Cinematic Highlight (Durasi 2–3 Menit)",
      price_gold_f3: "Bonus: 1 Video Pendek Vertikal (Reels / TikTok / Shorts 30–60 Detik)",
      price_gold_f4: "Proses Editing Penuh, Penataan Suara (Sound Design) & Musik Berlisensi Resmi",
      price_gold_f5: "Pengiriman File via Google Drive Link",
      price_btn_gold: "Pilih Gold",
      price_premium_title: "Premium: All-In Documentation",
      price_premium_desc: "Paket dokumentasi terlengkap dengan benefit fisik & digital eksklusif.",
      price_premium_f1: "Tim Lengkap: 1 Fotografer + 1 Videografer + 1 Pilot Drone",
      price_premium_f2: "Half Day Coverage (6 Jam Kerja di Lokasi)",
      price_premium_f3: "Output: All Foto (Edited Color Graded) + 1 Video Liputan Utama + 1 Video Shorts",
      price_premium_f4: "Value Booster: Bonus 1 Flashdisk Eksklusif + Akses Link Google Drive",
      price_btn_premium: "Pilih Premium",
      price_b2b_tag: "Segmen Villa & Properti",
      price_b2b_title: "Drone Property Photo Only",
      price_b2b_subtitle: "Estetika sudut pandang komersial khusus untuk kebutuhan promosi listing Airbnb, Booking.com, & Instagram.",
      price_b2b_price: "Rp 500.000 – Rp 750.000",
      price_b2b_f1: "Sesi foto udara khusus eksterior, lanskap & arsitektur bangunan luar",
      price_b2b_f2: "1 Jam Sesi Penerbangan (Flight Time / Maksimal 2 Baterai)",
      price_b2b_f3: "10–15 Foto Udara Resolusi Tinggi (High Resolution Aerial Shots)",
      price_b2b_f4: "Advanced Editing: Edit tingkat lanjut properti (Sky Replacement & Penajaman Warna Bangunan)",
      price_b2b_f5: "Termasuk Hak Lisensi Penggunaan Komersial Digital (Commercial Use License)",
      price_b2b_f6: "Pengiriman via Google Drive Link",
      price_btn_b2b: "Pilih Paket Properti",
      gallery_eyebrow: "Portofolio",
      gallery_title: "Gallery",
      gallery_desc: "Koleksi hasil dokumentasi kami dari berbagai proyek wedding, event, travel, dan company.",
      filter_all: "Semua",
      filter_photo: "Foto",
      filter_video: "Video",
      sub_all: "Semua Foto",
      sub_all_photos: "Semua Foto",
      sub_all_videos: "Semua Video",
      tag_bali: "Upacara Bali",
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
  const GALLERY_ROTATION_MS = 5000; // 5 seconds per rotation
  let galleryRotationInterval = null;
  let activeGallerySubset = [];
  let nextGallerySubset = [];
  let isLightboxOpen = false;
  let currentCategorySubfilter = 'all';

  // ─── DOM ──────────────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const galleryGrid = $('#gallery-grid');
  const navbar = $('#navbar');
  const mobileMenuBtn = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  const themeToggles = $$('.theme-toggle');
  const langToggles = $$('.lang-toggle');
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

  const lightboxModal = $('#lightbox-modal');
  const lightboxBackdrop = $('#lightbox-backdrop');
  const lightboxBox = $('#lightbox-box');
  const lightboxImg = $('#lightbox-img');
  const lightboxVideoContainer = $('#lightbox-video-container');
  const lightboxIframe = $('#lightbox-iframe');
  const lightboxClose = $('#lightbox-close');

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
    themeToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(!document.documentElement.classList.contains('dark'));
      });
    });
  }

  // ─── LANGUAGE ─────────────────────────────────────────────────

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('rv-lang', lang);

    // Update all switcher button labels
    langToggles.forEach((btn) => {
      btn.innerHTML = `<i class="fa-solid fa-language text-sm"></i><span>${lang.toUpperCase()}</span>`;
    });

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
    langToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'id' : 'en');
      });
    });
  }

  function refreshGallery() {
    if (!window.galleryData) return;
    renderDynamicPhotoSubFilters();
    if (activeGallerySubset && activeGallerySubset.length > 0) {
      renderGalleryItems(activeGallerySubset);
    } else {
      const activeBtn = $('.gallery-filter-btn.bg-accent');
      const filterVal = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      startGalleryRotation(filterVal);
    }
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

  function closeMobileMenu() {
    if (!mobileMenu || !mobileMenu.classList.contains('menu-open')) return;
    mobileMenu.classList.remove('menu-open');
    if (navbar) navbar.classList.remove('mobile-open');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.querySelectorAll('span').forEach((b) => {
        b.style.transform = ''; b.style.opacity = '';
      });
    }
  }

  function setupMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
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

    // Close when clicking nav links
    $$('.mobile-nav-link').forEach((l) => {
      l.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside of mobile menu & button
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('menu-open') &&
        !mobileMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
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
    if (!media || typeof media !== 'string') return '';
    return (media.startsWith('http') || media.startsWith('data:')) ? media : `assets/images/${media}`;
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
    d.className = 'rounded-xl overflow-hidden bg-white dark:bg-[#1F1F1F] border border-sand-200 dark:border-sand-800';
    d.innerHTML = `
      <div class="aspect-video w-full bg-sand-200/80 dark:bg-sand-800/50 skeleton flex flex-col items-center justify-center p-3 sm:p-4 text-center select-none">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sand-300/60 dark:bg-sand-700/50 flex items-center justify-center mb-1.5 sm:mb-2 transition-transform">
          <i class="${iconClass} text-xs sm:text-sm text-sand-600 dark:text-sand-300"></i>
        </div>
        <span class="text-[9px] sm:text-[10px] tracking-wider uppercase font-medium text-sand-600/70 dark:text-sand-400/60">${label}</span>
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
    if (/^(https?:\/\/|\/|data:image\/|\.\/)/i.test(trimmed)) {
      return trimmed;
    }
    return '';
  }

  function imageCard(item) {
    const rawTitle = (currentLang === 'en' ? item.judul_en : item.judul_id) || 'ReasonVisual';
    const title = escapeHtml(rawTitle);
    const thumbSrc = item.thumb_media || (typeof item.sumber_media === 'string' && item.sumber_media.includes('gallery-photo/')
      ? item.sumber_media.replace('gallery-photo/', 'gallery-photo-thumb/')
      : item.sumber_media);
    const safeSrc = sanitizeUrl(getImageSrc(item.sumber_media));
    const safeThumb = sanitizeUrl(getImageSrc(thumbSrc));
    return `
      <div class="gallery-card rounded-xl overflow-hidden bg-white dark:bg-[#1F1F1F] border border-sand-200 dark:border-sand-800 shadow-sm cursor-pointer" data-type="gambar" data-src="${safeSrc}" data-alt="${title}">
        <div class="relative aspect-video bg-sand-200 dark:bg-sand-800 skeleton overflow-hidden group">
          <img
            src="${safeThumb}"
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

  function getYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  }

  function videoCard(item) {
    const rawTitle = (currentLang === 'en' ? item.judul_en : item.judul_id) || 'ReasonVisual';
    const title = escapeHtml(rawTitle);
    const isYouTube = typeof item.sumber_media === 'string' && (item.sumber_media.includes('youtube.com') || item.sumber_media.includes('youtu.be'));
    const isInstagram = typeof item.sumber_media === 'string' && item.sumber_media.includes('instagram.com');

    let badgeIcon = '<i class="fa-solid fa-play text-xs text-white"></i>';
    if (isYouTube) {
      badgeIcon = '<i class="fa-brands fa-youtube text-xs text-white"></i>';
    } else if (isInstagram) {
      badgeIcon = '<i class="fa-brands fa-instagram text-xs text-white"></i>';
    }

    let coverSrc = item.cover_image;
    if (!coverSrc && isYouTube) {
      const ytId = getYouTubeId(item.sumber_media);
      if (ytId) coverSrc = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }

    const cleanUrl = typeof item.sumber_media === 'string' ? item.sumber_media.replace('/embed/', '/') : '';
    const safeSrc = sanitizeUrl(cleanUrl);
    const safeCoverSrc = sanitizeUrl(getImageSrc(coverSrc));

    if (coverSrc) {
      return `
        <div class="gallery-card rounded-xl overflow-hidden bg-white dark:bg-[#1F1F1F] border border-sand-200 dark:border-sand-800 shadow-sm cursor-pointer" data-type="video" data-src="${safeSrc}" data-alt="${title}">
          <div class="relative aspect-video bg-sand-200 dark:bg-sand-800 skeleton overflow-hidden group">
            <img
              src="${safeCoverSrc}"
              alt="${title}"
              loading="lazy"
              class="relative z-10 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105"
              onload="this.style.opacity='1'; this.parentElement.classList.remove('skeleton');"
              onerror="this.style.display='none';"
            />
            <!-- Play Overlay (Centered Play Icon with Smooth Diffused Shadow) -->
            <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none">
              <i class="fa-solid fa-play text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transform group-hover:scale-110 transition-transform duration-300 ml-0.5 sm:ml-1"></i>
            </div>
            <!-- Platform Badge (White Icon) -->
            <div class="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-sm">
              ${badgeIcon}
            </div>
          </div>
        </div>
      `;
    }

    if (isInstagram) {
      return `
        <div class="gallery-card rounded-xl overflow-hidden bg-white dark:bg-[#1F1F1F] border border-sand-200 dark:border-sand-800 shadow-sm cursor-pointer" data-type="video" data-src="${safeSrc}" data-alt="${title}">
          <div class="relative aspect-video bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] overflow-hidden group flex flex-col items-center justify-center text-white">
            <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/15 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-1.5 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <i class="fa-brands fa-instagram text-2xl sm:text-3xl text-white"></i>
              </div>
              <span class="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white/90 drop-shadow">Instagram Reel</span>
            </div>
            <div class="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-sm">
              ${badgeIcon}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="gallery-card rounded-xl overflow-hidden bg-white dark:bg-[#1F1F1F] border border-sand-200 dark:border-sand-800 shadow-sm cursor-pointer" data-type="video" data-src="${safeSrc}" data-alt="${title}">
        <div class="relative aspect-video bg-sand-900 overflow-hidden group flex flex-col items-center justify-center text-white">
          <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors duration-300 pointer-events-none">
            <i class="fa-solid fa-play text-2xl sm:text-3xl text-white drop-shadow mb-1.5 transform group-hover:scale-110 transition-transform duration-300"></i>
            <span class="text-[11px] sm:text-xs font-medium text-sand-300">Tonton Video</span>
          </div>
          <div class="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-sm">
            ${badgeIcon}
          </div>
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

  function getRandomSubset(arr, limit) {
    if (arr.length <= limit) return arr;
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, limit);
  }

  function preloadImages(items) {
    if (!items || items.length === 0) return;
    items.forEach((item) => {
      if (item.tipe_media === 'gambar') {
        const img = new Image();
        const thumbSrc = item.thumb_media || (typeof item.sumber_media === 'string' && item.sumber_media.includes('gallery-photo/')
          ? item.sumber_media.replace('gallery-photo/', 'gallery-photo-thumb/')
          : item.sumber_media);
        img.src = getImageSrc(thumbSrc);
      }
    });
  }

  function getFilteredGalleryData(filterVal) {
    if (!window.galleryData) return [];
    if (filterVal === 'all') {
      return window.galleryData;
    }
    let data = window.galleryData.filter((item) => item.tipe_media === filterVal);
    if (currentCategorySubfilter !== 'all') {
      data = data.filter((item) => item.kategori === currentCategorySubfilter);
    }
    return data;
  }

  function refreshGallery() {
    if (!galleryGrid) return;
    const activeBtn = $('.gallery-filter-btn.bg-accent');
    const filterVal = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    if (filterVal === 'gambar' || filterVal === 'video') {
      renderDynamicSubFilters(filterVal);
    } else {
      hideSubFilters();
    }
    startGalleryRotation(filterVal);
  }

  function renderEmptyDatabaseState() {
    if (!galleryGrid) return;
    const isEn = currentLang === 'en';
    const title = isEn ? 'No media found in this section.' : 'Belum ada media yang ditampilkan.';
    const desc = isEn
      ? 'There are currently no photos or videos available in this section.'
      : 'Saat ini belum ada foto atau video yang tersedia untuk ditampilkan.';

    galleryGrid.innerHTML = `
      <div class="col-span-full py-16 sm:py-20 px-4 text-center rounded-2xl bg-sand-100/50 dark:bg-white/[0.02] border border-dashed border-sand-300 dark:border-white/10 flex flex-col items-center justify-center">
        <div class="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-xl mx-auto mb-3 shadow-xs">
          <i class="fa-solid fa-photo-film"></i>
        </div>
        <h4 class="text-sm sm:text-base font-semibold text-sand-800 dark:text-sand-200">${title}</h4>
        <p class="text-xs text-sand-500 dark:text-sand-400 max-w-sm mt-1.5 leading-relaxed">
          ${desc}
        </p>
      </div>
    `;
  }

  function startGalleryRotation(filterVal) {
    if (galleryRotationInterval) {
      clearInterval(galleryRotationInterval);
      galleryRotationInterval = null;
    }

    if (window.isSupabaseConnected && (!window.galleryData || window.galleryData.length === 0)) {
      renderEmptyDatabaseState();
      return;
    }

    if (!window.galleryData || window.galleryData.length === 0) {
      renderEmptyPlaceholders(filterVal);
      return;
    }

    const filtered = getFilteredGalleryData(filterVal);

    if (filtered.length === 0) {
      const isVideo = filterVal === 'video';
      const catLabel = currentCategorySubfilter !== 'all' ? formatCategoryName(currentCategorySubfilter) : '';
      
      let emptyMsg = '';
      let hintMsg = '';

      if (currentLang === 'en') {
        if (catLabel) {
          emptyMsg = isVideo ? `No videos in "${catLabel}" category yet.` : `No photos in "${catLabel}" category yet.`;
        } else {
          emptyMsg = isVideo ? 'No videos found in this section.' : 'No media found in this section.';
        }
        hintMsg = isVideo
          ? 'Try selecting another category or view "All Videos".'
          : 'Try selecting another category or view "All Photos".';
      } else {
        if (catLabel) {
          emptyMsg = isVideo ? `Belum ada video untuk kategori "${catLabel}".` : `Belum ada foto untuk kategori "${catLabel}".`;
        } else {
          emptyMsg = isVideo ? 'Belum ada video di bagian ini.' : 'Belum ada media yang ditampilkan.';
        }
        hintMsg = isVideo
          ? 'Silakan pilih kategori lainnya atau lihat "Semua Video".'
          : 'Silakan pilih kategori lainnya atau lihat "Semua Foto".';
      }

      const iconClass = isVideo ? 'fa-solid fa-video' : 'fa-solid fa-camera';

      galleryGrid.innerHTML = `
        <div class="col-span-full py-16 sm:py-20 px-4 text-center rounded-2xl bg-sand-100/50 dark:bg-white/[0.02] border border-dashed border-sand-300 dark:border-white/10 flex flex-col items-center justify-center">
          <div class="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-xl mx-auto mb-3 shadow-xs">
            <i class="${iconClass}"></i>
          </div>
          <h4 class="text-sm sm:text-base font-semibold text-sand-800 dark:text-sand-200">${emptyMsg}</h4>
          <p class="text-xs text-sand-500 dark:text-sand-400 max-w-sm mt-1.5 leading-relaxed">${hintMsg}</p>
        </div>
      `;
      return;
    }

    activeGallerySubset = getRandomSubset(filtered, 8);
    renderGalleryItems(activeGallerySubset);

    if (filtered.length > 8) {
      nextGallerySubset = getRandomSubset(filtered, 8);
      preloadImages(nextGallerySubset);

      galleryRotationInterval = setInterval(() => {
        if (isLightboxOpen) return;

        const cards = galleryGrid.querySelectorAll('.gallery-card');
        if (cards.length > 0) {
          cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-15px)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          });
          setTimeout(() => {
            activeGallerySubset = nextGallerySubset;
            renderGalleryItems(activeGallerySubset);
            
            nextGallerySubset = getRandomSubset(filtered, 8);
            preloadImages(nextGallerySubset);
          }, 400);
        } else {
          activeGallerySubset = nextGallerySubset;
          renderGalleryItems(activeGallerySubset);
          nextGallerySubset = getRandomSubset(filtered, 8);
          preloadImages(nextGallerySubset);
        }
      }, GALLERY_ROTATION_MS);
    }
  }

  function resumeGalleryRotation(filterVal) {
    if (galleryRotationInterval) {
      clearInterval(galleryRotationInterval);
      galleryRotationInterval = null;
    }

    const filtered = getFilteredGalleryData(filterVal);

    if (filtered.length > 8) {
      nextGallerySubset = getRandomSubset(filtered, 8);
      preloadImages(nextGallerySubset);

      galleryRotationInterval = setInterval(() => {
        if (isLightboxOpen) return;

        const cards = galleryGrid.querySelectorAll('.gallery-card');
        if (cards.length > 0) {
          cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-15px)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          });
          setTimeout(() => {
            activeGallerySubset = nextGallerySubset;
            renderGalleryItems(activeGallerySubset);
            
            nextGallerySubset = getRandomSubset(filtered, 8);
            preloadImages(nextGallerySubset);
          }, 400);
        } else {
          activeGallerySubset = nextGallerySubset;
          renderGalleryItems(activeGallerySubset);
          nextGallerySubset = getRandomSubset(filtered, 8);
          preloadImages(nextGallerySubset);
        }
      }, GALLERY_ROTATION_MS);
    }
  }

  function openLightbox(src, alt, type = 'gambar') {
    if (!lightboxModal || !lightboxBackdrop || !lightboxBox) return;

    isLightboxOpen = true;

    if (galleryRotationInterval) {
      clearInterval(galleryRotationInterval);
      galleryRotationInterval = null;
    }

    if (type === 'video') {
      const ytId = getYouTubeId(src);
      if (ytId) {
        if (lightboxImg) {
          lightboxImg.src = '';
          lightboxImg.classList.add('hidden');
        }
        if (lightboxVideoContainer && lightboxIframe) {
          lightboxIframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
          lightboxVideoContainer.classList.remove('hidden');
        }
      } else {
        // Fallback for external links like Instagram
        const cleanUrl = src.replace('/embed/', '/');
        window.open(cleanUrl, '_blank', 'noopener,noreferrer');
        isLightboxOpen = false;
        const activeBtn = $('.gallery-filter-btn.bg-accent');
        const filterVal = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
        resumeGalleryRotation(filterVal);
        return;
      }
    } else {
      if (lightboxVideoContainer && lightboxIframe) {
        lightboxIframe.src = '';
        lightboxVideoContainer.classList.add('hidden');
      }
      if (lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightboxImg.classList.remove('hidden');
      }
    }

    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');

    setTimeout(() => {
      lightboxBackdrop.classList.remove('opacity-0');
      lightboxBackdrop.classList.add('opacity-100');
      lightboxBox.classList.remove('scale-95', 'opacity-0');
      lightboxBox.classList.add('scale-100', 'opacity-100');
    }, 10);

    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal || !lightboxBackdrop || !lightboxBox) return;

    lightboxBackdrop.classList.remove('opacity-100');
    lightboxBackdrop.classList.add('opacity-0');
    lightboxBox.classList.remove('scale-100', 'opacity-100');
    lightboxBox.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
      
      if (lightboxIframe) lightboxIframe.src = '';
      if (lightboxImg) lightboxImg.src = '';
      if (lightboxVideoContainer) lightboxVideoContainer.classList.add('hidden');
      isLightboxOpen = false;

      const activeBtn = $('.gallery-filter-btn.bg-accent');
      const filterVal = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      resumeGalleryRotation(filterVal);
    }, 300);

    document.body.style.overflow = '';
  }

  function setupLightbox() {
    if (galleryGrid) {
      galleryGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.gallery-card');
        if (!card) return;
        
        const type = card.getAttribute('data-type') || 'gambar';
        const src = card.getAttribute('data-src');
        const alt = card.getAttribute('data-alt') || '';

        if (src) {
          openLightbox(src, alt, type);
        }
      });
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        closeLightbox();
      }
    });
  }

  function hideSubFilters() {
    const subFilters = $('#photo-sub-filters');
    if (!subFilters) return;
    subFilters.classList.remove('sub-filters-open');
    currentCategorySubfilter = 'all';
  }

  let dynamicCategoriesList = null;
  let dynamicCategoryNameMap = {};

  async function fetchCategoriesFromDb() {
    if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.URL && window.SUPABASE_CONFIG.ANON_KEY) {
      try {
        const url = `${window.SUPABASE_CONFIG.URL}/rest/v1/categories?select=*&order=urutan.asc,id.asc`;
        const res = await fetch(url, {
          headers: {
            'apikey': window.SUPABASE_CONFIG.ANON_KEY,
            'Authorization': `Bearer ${window.SUPABASE_CONFIG.ANON_KEY}`
          }
        });
        if (res.ok) {
          const cats = await res.json();
          if (Array.isArray(cats) && cats.length > 0) {
            dynamicCategoriesList = cats.map((c) => c.slug);
            dynamicCategoryNameMap = {};
            cats.forEach((c) => {
              dynamicCategoryNameMap[c.slug] = c.name;
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Gagal membaca tabel categories:', err);
      }
    }
  }

  function formatCategoryName(slug) {
    if (!slug) return '';
    if (dynamicCategoryNameMap && dynamicCategoryNameMap[slug]) {
      return dynamicCategoryNameMap[slug];
    }
    const key = `tag_${slug}`;
    if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
      return TRANSLATIONS[currentLang][key];
    }
    return slug
      .split(/[_-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Mengambil daftar kategori yang HANYA memiliki media aktif di database
   * @param {'gambar'|'video'} mediaType
   * @returns {string[]}
   */
  function getCategoriesWithMedia(mediaType) {
    if (!window.galleryData || !Array.isArray(window.galleryData)) return [];

    const catsWithMedia = new Set();
    window.galleryData.forEach((item) => {
      if (item.tipe_media === mediaType && item.kategori) {
        catsWithMedia.add(item.kategori);
      }
    });

    if (dynamicCategoriesList && dynamicCategoriesList.length > 0) {
      const sorted = dynamicCategoriesList.filter((cat) => catsWithMedia.has(cat));
      catsWithMedia.forEach((cat) => {
        if (!sorted.includes(cat)) sorted.push(cat);
      });
      return sorted;
    }

    return Array.from(catsWithMedia);
  }

  /**
   * Render sub-filter kategori secara dinamis untuk Foto maupun Video
   * Hanya menampilkan kategori yang memiliki isi media (tidak kosong)
   * @param {'gambar'|'video'} mediaType
   */
  function renderDynamicSubFilters(mediaType) {
    const subFilters = $('#photo-sub-filters');
    if (!subFilters) return;

    const availableCats = getCategoriesWithMedia(mediaType);

    // Jika tidak ada kategori yang memiliki media pada tipe ini, sembunyikan subfilter
    if (availableCats.length === 0) {
      subFilters.innerHTML = '';
      subFilters.classList.remove('sub-filters-open');
      return;
    }

    subFilters.classList.add('sub-filters-open');

    const isVideo = mediaType === 'video';
    const allLabel = isVideo
      ? (TRANSLATIONS[currentLang]?.sub_all_videos || (currentLang === 'en' ? 'All Videos' : 'Semua Video'))
      : (TRANSLATIONS[currentLang]?.sub_all_photos || (currentLang === 'en' ? 'All Photos' : 'Semua Foto'));

    // Validasi apakah kategori yang aktif masih tersedia di daftar kategori berisi media
    if (currentCategorySubfilter !== 'all' && !availableCats.includes(currentCategorySubfilter)) {
      currentCategorySubfilter = 'all';
    }

    let html = `
      <button class="photo-sub-filter-btn px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all ${currentCategorySubfilter === 'all' ? 'bg-accent text-white' : 'bg-sand-200 dark:bg-sand-800 text-sand-700 dark:text-sand-300 hover:bg-sand-300 dark:hover:bg-sand-700'}" data-subfilter="all">
        ${allLabel}
      </button>
    `;

    availableCats.forEach((cat) => {
      const active = currentCategorySubfilter === cat;
      const label = formatCategoryName(cat);
      html += `
        <button class="photo-sub-filter-btn px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all ${active ? 'bg-accent text-white' : 'bg-sand-200 dark:bg-sand-800 text-sand-700 dark:text-sand-300 hover:bg-sand-300 dark:hover:bg-sand-700'}" data-subfilter="${cat}">
          ${label}
        </button>
      `;
    });

    subFilters.innerHTML = html;

    // Pasang event listener untuk tombol-tombol subfilter
    const subBtns = subFilters.querySelectorAll('.photo-sub-filter-btn');
    subBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const subVal = btn.getAttribute('data-subfilter');
        currentCategorySubfilter = subVal;

        subBtns.forEach((b) => {
          b.classList.remove('bg-accent', 'text-white', 'shadow-sm');
          b.classList.add('bg-sand-200', 'dark:bg-sand-800', 'text-sand-700', 'dark:text-sand-300', 'hover:bg-sand-300', 'dark:hover:bg-sand-700');
        });

        btn.classList.add('bg-accent', 'text-white');
        btn.classList.remove('bg-sand-200', 'dark:bg-sand-800', 'text-sand-700', 'dark:text-sand-300', 'hover:bg-sand-300', 'dark:hover:bg-sand-700', 'shadow-sm');

        startGalleryRotation(mediaType);
      });
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

        btn.classList.add('bg-accent', 'text-white');
        btn.classList.remove('bg-sand-200', 'dark:bg-sand-800', 'text-sand-700', 'dark:text-sand-300', 'hover:bg-sand-300', 'dark:hover:bg-sand-700', 'shadow-md', 'shadow-accent/15');

        // Reset subfilter category when switching top filter tab
        currentCategorySubfilter = 'all';

        if (filterVal === 'gambar') {
          renderDynamicSubFilters('gambar');
        } else if (filterVal === 'video') {
          renderDynamicSubFilters('video');
        } else {
          hideSubFilters();
        }

        startGalleryRotation(filterVal);
      });
    });
  }

  async function loadGallery() {
    // Tampilkan 4 skeleton placeholder yang proporsional langsung di dalam galleryGrid
    renderEmptyPlaceholders('all');

    try {
      let data = null;

      // Ambil master kategori dari tabel categories di Supabase
      await fetchCategoriesFromDb();

      // 1. Coba ambil dari Supabase jika koneksi & config aktif
      if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.URL && window.SUPABASE_CONFIG.ANON_KEY) {
        try {
          // A. Coba menggunakan Supabase JS client jika tersedia
          if (window.supabaseClient) {
            const { data: supaData, error: supaErr } = await window.supabaseClient
              .from('gallery')
              .select('*')
              .order('created_at', { ascending: false });

            if (!supaErr && Array.isArray(supaData)) {
              data = supaData;
              window.isSupabaseConnected = true;
              console.log(`✨ Galeri terhubung ke Supabase Client (${data.length} item).`);
            } else if (supaErr) {
              console.warn('⚠️ Supabase client query warning:', supaErr.message);
            }
          }

          // B. Native REST API fetch (sangat cepat & tanpa ketergantungan library CDN)
          if (data === null) {
            const url = `${window.SUPABASE_CONFIG.URL}/rest/v1/gallery?select=*&order=created_at.desc`;
            const res = await fetch(url, {
              headers: {
                'apikey': window.SUPABASE_CONFIG.ANON_KEY,
                'Authorization': `Bearer ${window.SUPABASE_CONFIG.ANON_KEY}`
              }
            });

            if (res.ok) {
              const supaData = await res.json();
              if (Array.isArray(supaData)) {
                data = supaData;
                window.isSupabaseConnected = true;
                console.log(`✨ Galeri terhubung ke Supabase REST API (${data.length} item).`);
              }
            }
          }
        } catch (err) {
          console.warn('⚠️ Koneksi Supabase gagal:', err);
        }
      }

      // 2. Default jika data kosong atau koneksi Supabase belum ada data
      if (!Array.isArray(data)) {
        data = [];
      }

      await new Promise((r) => setTimeout(r, 250));

      if (galleryGrid) {
        window.galleryData = data;
        setupGalleryFilters();
        if (data.length > 0) {
          startGalleryRotation('all');
        } else {
          renderEmptyPlaceholders('all');
        }
      }
    } catch (err) {
      console.error('Gallery load error:', err);
      if (galleryGrid) {
        renderEmptyPlaceholders('all');
      }
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
    setupLightbox();

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    window.addEventListener('scroll', () => { handleNavScroll(); highlightActiveLink(); });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
