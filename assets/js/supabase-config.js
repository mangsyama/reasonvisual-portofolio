/**
 * ReasonVisual - Supabase & Admin Security Configuration
 * Dilengkapi Supabase Auth Resmi, Rate Limiting (Anti-Brute Force), dan Token JWT
 */
window.SUPABASE_CONFIG = {
  // Project URL dari Dashboard Supabase -> Project Settings -> API
  URL: 'https://cyrpgvcttshdxzchttga.supabase.co', 

  // Project API Key (anon / public) dari Dashboard Supabase -> Project Settings -> API
  ANON_KEY: 'sb_publishable_sf726CPCIa81ejExCC5f4Q_R24i8Sdm',

  // Nama Storage Bucket yang digunakan untuk menyimpan media
  BUCKET_NAME: 'gallery'
};

// Inisialisasi Supabase Client jika library Supabase CDN sudah dimuat
if (window.supabase && window.SUPABASE_CONFIG.URL && window.SUPABASE_CONFIG.ANON_KEY) {
  try {
    window.supabaseClient = window.supabase.createClient(
      window.SUPABASE_CONFIG.URL,
      window.SUPABASE_CONFIG.ANON_KEY
    );
    console.log('✅ Supabase client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Gagal inisialisasi Supabase client:', err);
  }
}

// ─── HELPER AUTENTIKASI & KEAMANAN ADMIN (SUPABASE AUTH + ANTI BRUTE-FORCE) ───
window.AdminAuth = {
  SESSION_KEY: 'reasonvisual_admin_session',
  LOCKOUT_KEY: 'reasonvisual_admin_lockout',
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 10 * 60 * 1000, // 10 menit lockout jika 5x salah

  // Periksa apakah sedang terkena lockout (brute-force defense)
  getLockoutStatus() {
    try {
      const data = JSON.parse(localStorage.getItem(this.LOCKOUT_KEY) || '{}');
      if (data.lockedUntil && Date.now() < data.lockedUntil) {
        const remainingSec = Math.ceil((data.lockedUntil - Date.now()) / 1000);
        return { isLocked: true, remainingSec, attempts: data.attempts || this.MAX_ATTEMPTS };
      }
      if (data.lockedUntil && Date.now() >= data.lockedUntil) {
        localStorage.removeItem(this.LOCKOUT_KEY);
      }
      return { isLocked: false, remainingSec: 0, attempts: data.attempts || 0 };
    } catch {
      return { isLocked: false, remainingSec: 0, attempts: 0 };
    }
  },

  recordFailedAttempt() {
    try {
      const data = JSON.parse(localStorage.getItem(this.LOCKOUT_KEY) || '{}');
      const attempts = (data.attempts || 0) + 1;
      let lockedUntil = null;
      if (attempts >= this.MAX_ATTEMPTS) {
        lockedUntil = Date.now() + this.LOCKOUT_DURATION_MS;
      }
      localStorage.setItem(this.LOCKOUT_KEY, JSON.stringify({ attempts, lockedUntil }));
      return { attempts, lockedUntil };
    } catch {
      return { attempts: 1, lockedUntil: null };
    }
  },

  clearFailedAttempts() {
    localStorage.removeItem(this.LOCKOUT_KEY);
  },

  // Login resmi melalui Supabase Auth
  async login(emailOrUser, password, remember = true) {
    const lockout = this.getLockoutStatus();
    if (lockout.isLocked) {
      const mins = Math.ceil(lockout.remainingSec / 60);
      return {
        success: false,
        message: `Terlalu banyak percobaan gagal. Form dikunci sementara demi keamanan. Silakan coba lagi dalam ${mins} menit.`
      };
    }

    const input = (emailOrUser || '').trim();
    if (!input || !password) {
      return { success: false, message: 'Email/username dan password wajib diisi.' };
    }

    // Ubah format input menjadi email valid jika pengguna hanya mengetik username
    const email = input.includes('@') ? input : `${input}@reasonvisual.com`;

    // 1. Coba login melalui Supabase Auth resmi (Database Token Terenkripsi)
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (!error && data && data.session) {
          this.clearFailedAttempts();
          const sessionData = {
            authenticated: true,
            user: data.user.email,
            id: data.user.id,
            access_token: data.session.access_token,
            expires_at: data.session.expires_at,
            loggedAt: new Date().toISOString()
          };

          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
          if (remember) {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
          }
          return { success: true, user: data.user, session: data.session };
        } else if (error) {
          console.warn('Supabase Auth error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase Auth exception:', err);
      }
    }

    // Catat percobaan gagal jika tidak berhasil
    const record = this.recordFailedAttempt();
    const remaining = this.MAX_ATTEMPTS - record.attempts;

    if (record.lockedUntil) {
      return {
        success: false,
        message: '5 kali salah password berturut-turut! Form login dikunci selama 10 menit demi keamanan sistem.'
      };
    }

    return {
      success: false,
      message: `Email atau password salah. Sisa kesempatan: ${remaining} kali.`
    };
  },

  async getSession() {
    // 1. Ambil session aktif dari Supabase Client jika tersedia
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session) return session;
      } catch {}
    }

    // 2. Fallback dari local/session storage cache
    try {
      const raw = sessionStorage.getItem(this.SESSION_KEY) || localStorage.getItem(this.SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.authenticated) return parsed;
      }
    } catch {}

    return null;
  },

  async isLoggedIn() {
    const session = await this.getSession();
    return !!session;
  },

  async logout() {
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        await window.supabaseClient.auth.signOut();
      } catch {}
    }
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  },

  // Mendapatkan Authorization Header resmi (membawa Token JWT Admin jika sudah login)
  async getAuthHeaders() {
    const session = await this.getSession();
    const token = session && session.access_token ? session.access_token : window.SUPABASE_CONFIG.ANON_KEY;
    return {
      'apikey': window.SUPABASE_CONFIG.ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
};
