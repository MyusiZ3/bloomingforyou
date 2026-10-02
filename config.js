/**
 * ========================================================
 * BLOOMING FOR YOU - CONFIGURATION FILE
 * ========================================================
 * Kamu bisa dengan mudah mengubah isi ucapan, nama, foto,
 * lagu, dan pesan rahasia di sini tanpa perlu mengubah HTML/CSS.
 */

const CONFIG = {
  // Informasi Penerima
  recipient: {
    name: "Aliya",
    nickname: "My Love",
    envelopeLabel: "A Birthday Bouquet For",
    waxSealInitials: "A & M", // Inisial pada segel lilin
  },

  // Tanggal & Hari Spesial (Opsional untuk counter atau badge)
  dates: {
    birthdayDate: "2026-10-02", // Format: YYYY-MM-DD
    anniversaryDate: "2024-05-18", // Sesuaikan jika ada tanggal jadian
    tagline: "Celebrating Another Year of Your Beautiful Bloom",
  },

  // Pengaturan Lagu (BGM)
  music: {
    title: "Red Cooper - On the Frost Bridge",
    subtitle: "Acoustic Piano & Strings",
    // File audio default. Kamu bisa mengganti file ini di folder 'assets/audio/'
    // atau mengganti source ke file MP3 lagumu sendiri!
    src: "assets/audio/bgm.ogg",
    autoplayOnOpen: true, // Otomatis putar saat amplop dibuka
  },

  // Surat Ucapan Cinta & Ulang Tahun
  letter: {
    salutation: "Untuk Aliya tersayang,",
    paragraphs: [
      "Selamat ulang tahun, cintaku. Di hari yang begitu istimewa ini, aku hanya ingin berhenti sejenak dari riuhnya dunia untuk merayakan satu hal yang paling aku syukuri: hadirnya kamu dalam hidupku.",
      "Melihatmu tumbuh, tertawa, dan melangkah sejauh ini adalah salah satu pemandangan terindah yang pernah kumiliki. Terima kasih sudah menjadi sosok yang selalu menenangkan dengan senyum manismu, yang selalu tulus dalam setiap perhatian kecil, dan yang membuat hari-hari biasa terasa sangat berarti.",
      "Bunga-bunga vintage di sini kupilih khusus untukmu—karena seperti bunga yang mekar abadi di atas kanvas waktu, doaku untuk bahagiamu, kesehatanmu, dan impian-impianmu tidak akan pernah layu.",
      "Semoga di usiamu yang baru ini, semesta selalu melimpahkanmu hal-hal baik, ketenangan hati, dan kebahagiaan yang meluap-luap. Aku berjanji akan terus ada di sampingmu, menggenggam tanganmu di setiap musim yang akan kita lewati."
    ],
    closing: "Dengan segenap rasa sayangku,",
    signature: "Selalu Untukmu ❤️",
  },

  // Bunga & Pesan Filosofi Cinta (Interaktif saat bunga di-klik)
  flowers: [
    {
      id: "rose",
      name: "Rosa Centifolia",
      commonName: "English Cabbage Rose",
      meaning: "Cinta yang Tak Pernah Pudar & Ketulusan Hati",
      image: "assets/images/rose.jpg",
      cutout: "assets/images/rose_cutout.png",
      note: "Setiap helai kelopaknya melambangkan rasa kagumku padamu. Dari hari pertama hingga hari ini, caramu tersenyum tetap menjadi hal paling favorit di mataku.",
    },
    {
      id: "peony",
      name: "Paeonia Officinalis",
      commonName: "Heritage Garden Peony",
      meaning: "Kemakmuran, Keanggunan & Kasih yang Mendalam",
      image: "assets/images/peony.jpg",
      cutout: "assets/images/peony_cutout.png",
      note: "Peony dikenal sebagai bunga yang mekar dengan penuh keanggunan. Bagiku, itu adalah gambaran dirimu—selalu anggun, hangat, dan membawa kedamaian bagi siapa saja di sekitarmu.",
    },
    {
      id: "chrysanthemum",
      name: "Chrysanthème Doré",
      commonName: "Golden Sunlight Dahlia",
      meaning: "Kebahagiaan Abadi, Optimisme & Cahaya Hidup",
      image: "assets/images/chrysanthemum.jpg",
      cutout: "assets/images/chrysanthemum_cutout.png",
      note: "Warna keemasannya melambangkan harapan dan sukacita. Semoga tawamu tidak pernah padam, dan setiap langkahmu selalu disinari kehangatan.",
    }
  ],

  // Foto Kenangan (Polaroid Scrapbook)
  polaroids: [
    {
      id: "first-meet",
      chapter: "Chapter 01",
      title: "When We First Met",
      date: "Pertemuan Pertama",
      image: "assets/images/polaroids/first_meet.jpg",
      caption: "Hari pertama mataku tertuju padamu. Masih ingat rasa canggung tapi bahagia saat kita saling menyapa?",
      rotation: "-3deg"
    },
    {
      id: "mutual-feelings",
      chapter: "Chapter 02",
      title: "When We Knew We Liked Each Other",
      date: "Saat Rasa Mulai Bicara",
      image: "assets/images/polaroids/falling_in_love.jpg",
      caption: "Momen saat kita sadar bahwa obrolan kita bukan lagi sekadar basa-basi, melainkan dua hati yang mulai saling mencari.",
      rotation: "2.5deg"
    },
    {
      id: "official-day",
      chapter: "Chapter 03",
      title: "The Day It Began",
      date: "Momen Kita Jadian",
      image: "assets/images/polaroids/dating.jpg",
      caption: "Hari paling manis saat kamu menerima perasaanku. Titik awal perjalanan indah kita berdua.",
      rotation: "-2deg"
    }
  ],

  // Efek Animasi
  effects: {
    floatingPetals: true, // Animasi kelopak bunga melayang
    petalColors: ["#d97d7d", "#e8a598", "#f4c2ba", "#c96f6f", "#e0b084"],
    sparkles: true,
  }
};
