/**
 * ========================================================
 * BLOOMING FOR YOU - CONFIGURATION FILE
 * ========================================================
 */

const CONFIG = {
  // Informasi Penerima
  recipient: {
    name: "Aliya",
    nickname: "Sayang",
    envelopeLabel: "Ada Kado Kecil Buat:",
    waxSealInitials: "A & M",
  },

  // Tagline & Tanggal
  dates: {
    birthdayDate: "2026-10-02",
    tagline: "Happy Birthday to the Prettiest Girl",
  },

  // Pengaturan Lagu (BGM)
  music: {
    title: "wave to earth - seasons",
    subtitle: "I can't be your love, 'cause I'm afraid...",
    src: "assets/audio/track.dat",
    autoplayOnOpen: true,
  },

  // PIN Rahasia Masuk (Ulang Tahun Aliya: 08-10-04)
  security: {
    pin: "081004",
    hint: "Ketik 081004 atau sentuh gembok",
  },

  // Surat Ucapan Ultah (Manis, tulus, tidak terlalu panjang)
  letter: {
    salutation: "Hai Aliya sayang,",
    paragraphs: [
      "Selamat ulang tahun yaa! Makasih banyak udah selalu ada, udah sabar sama aku, dan selalu jadi orang yang paling bisa bikin aku senyum bahkan pas hari-hariku lagi capek.",
      "Doa aku sederhana tapi tulus dari hati: semoga kamu selalu sehat, bahagia terus, dijauhin dari hal-hal yang bikin sedih, dan semua impianmu dipermudah jalannya.",
      "Tetep jadi Aliya kesayanganku ya. I love you in every season ❤️"
    ],
    closing: "Sayang kamu banyak-banyak,",
    signature: "Pacarmu yang paling beruntung ❤️",
  },

  // Foto Kenangan Asli dari folder Moments (Natural & Real)
  polaroids: [
    {
      id: "first-meet",
      chapter: "Chapter 01",
      title: "Awal Banget Ketemu",
      date: "Pertama Kali Kenal",
      image: "assets/images/Moments/foto1.jpg",
      caption: "Inget ga sih momen ini? Masih pada malu-malu tapi aslinya aku udah curi-curi pandang terus ke kamu haha. Liat tuh pose kedipmu, gemes banget!",
      rotation: "-3deg"
    },
    {
      id: "mutual-feelings",
      chapter: "Chapter 02",
      title: "Mulai Salting Sendiri",
      date: "Saling Suka",
      image: "assets/images/Moments/foto2.jpg",
      caption: "Momen waktu kita udah sama-sama sadar kalau saling suka, tapi masih pada jaim. Pose dua jari andalanmu yang selalu lucu.",
      rotation: "2.5deg"
    },
    {
      id: "official-day",
      chapter: "Chapter 03",
      title: "Momen Kita Jadian",
      date: "Hari Bahagia Kita",
      image: "assets/images/Moments/foto3.jpg",
      caption: "Hari paling bikin lega dan bahagia. Akhirnya resmi bisa manggil kamu pacar dan jalanin hari-hari bareng kamu.",
      rotation: "-2deg"
    },
    {
      id: "random-nights",
      chapter: "Chapter 04",
      title: "Cerita Random Bareng Kamu",
      date: "Momen Seru Kita",
      image: "assets/images/Moments/foto4.jpg",
      caption: "Walau fotonya rada remang-remang begini, tapi momen ngobrol ngalor-ngidul sama kamu itu selalu jadi hal paling seru yang ga pengen cepet selesai.",
      rotation: "2.8deg"
    }
  ],

  // Efek Animasi
  effects: {
    floatingPetals: true,
    petalColors: ["#d97d7d", "#e8a598", "#f4c2ba", "#c96f6f", "#e0b084"],
    sparkles: true,
  }
};

// Pastikan CONFIG tersedia di window untuk browser
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

