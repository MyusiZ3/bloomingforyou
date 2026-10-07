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

  // Foto Kenangan Asli dari folder Moments (Multi-Photo Spreads)
  polaroids: [
    // Spread 1 (Trio - 3 Photos)
    {
      id: "first-together",
      spread: 1,
      title: "First Pic Together",
      image: "assets/images/Moments/first.jpg",
      caption: "first pic together btw :3",
      rotation: "-5.5deg"
    },
    {
      id: "where-it-started",
      spread: 1,
      title: "Where It Started",
      image: "assets/images/Moments/moment.jpg",
      caption: "look where it all started...",
      rotation: "2.5deg"
    },
    {
      id: "pretty-girl",
      spread: 1,
      title: "Pretty Girl Spotted",
      image: "assets/images/Moments/cutee.jpg",
      caption: "pretty girl spotted (*/ω＼*)",
      rotation: "-3deg"
    },

    // Spread 2 (Duo - 2 Photos)
    {
      id: "favorite-us",
      spread: 2,
      title: "Favorite Us",
      image: "assets/images/Moments/look at.jpg",
      caption: "one of my favorite us",
      rotation: "-4deg"
    },
    {
      id: "still-love-gurl",
      spread: 2,
      title: "Still Loving You",
      image: "assets/images/Moments/stilllove.jpg",
      caption: "yeah... i still love this gurll (〜￣▽￣)〜",
      rotation: "3.5deg"
    },

    // Spread 3 (Trio - 3 Photos)
    {
      id: "replay-days",
      spread: 3,
      title: "Wish to Replay",
      image: "assets/images/Moments/replay.jpg",
      caption: "one of those days i wish i could replay 😘",
      rotation: "-6deg"
    },
    {
      id: "fav-view",
      spread: 3,
      title: "My Favorite View",
      image: "assets/images/Moments/favv.jpg",
      caption: "my favorite view",
      rotation: "2.5deg"
    },
    {
      id: "choose-you-again",
      spread: 3,
      title: "Choose You Again",
      image: "assets/images/Moments/keep.jpg",
      caption: "and i'd choose you all over again.",
      rotation: "-2deg"
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
