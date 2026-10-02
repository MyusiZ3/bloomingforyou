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
    title: "Red Cooper - On the Frost Bridge",
    subtitle: "Acoustic Piano & Strings",
    src: "assets/audio/bgm.mp3",
    autoplayOnOpen: true,
  },

  // Surat Ucapan Ultah (Natural, santai, manis, dan tulus)
  letter: {
    salutation: "Hai Aliya sayang,",
    paragraphs: [
      "Selamat ulang tahun yaa! Ga kerasa waktu jalan cepet banget, dan sekarang kamu udah nambah umur lagi.",
      "Jujur aku bukan tipe orang yang pinter ngerangkai kata-kata puitis kek di novel atau quotes sosmed. Tapi yang jelas, aku bener-bener bersyukur dan seneng banget bisa ngerayain hari ulang tahunmu bareng kamu.",
      "Makasih banyak yaa udah selalu ada, udah sabar sama aku, udah mau dengerin cerita-cerita randomku, dan makasih udah jadi orang yang selalu bisa bikin aku senyum bahkan pas hari-hariku lagi capek. Kamu yang kadang ngeselin tapi aslinya gemesin banget itu selalu jadi orang favoritku.",
      "Di umurmu yang baru ini, doa aku sederhana tapi tulus dari hati: semoga kamu selalu sehat, selalu dilimpahkan bahagia, dijauhin dari hal-hal yang bikin sedih atau overthinking, dan semua hal yang lagi kamu usahain atau impikan bisa dipermudah jalannya.",
      "Tetep jadi Aliya yang aku kenal ya. Jangan pernah ngerasa sendirian kalau lagi ada masalah, karena ada aku di sini yang bakal selalu siap nemenin dan dengerin kamu kapan pun."
    ],
    closing: "Sayang kamu banyak-banyak,",
    signature: "Pacarmu yang paling beruntung ❤️",
  },

  // Bunga & Pesan Lucu / Manis (Asset Asli dari flowerisblooming)
  flowers: [
    {
      id: "peony",
      name: "Heritage Peony",
      commonName: "Bunga Peony Lembut",
      meaning: "Kasih yang Tulus & Membawa Kehangatan",
      image: "assets/images/flowers/peony.webp",
      note: "Peony itu lambang kehangatan dan ketulusan. Pas banget buat kamu yang selalu bikin aku ngerasa nyaman dan tenang tiap ada di dekatmu."
    },
    {
      id: "rose",
      name: "Classic Rose",
      commonName: "Mawar Klasik",
      meaning: "Cinta & Ketulusan yang Tak Pernah Pudar",
      image: "assets/images/flowers/rose.webp",
      note: "Bunga klasik yang ga pernah gagal. Kayak rasa sayangku ke kamu yang selalu mekar tiap hari."
    },
    {
      id: "tulip",
      name: "Blushing Tulip",
      commonName: "Bunga Tulip Merah Muda",
      meaning: "Kasih Sayang Manis & Perasaan yang Tumbuh",
      image: "assets/images/flowers/tulip.webp",
      note: "Tiap liat tulip manis ini bawaannya inget senyummu pas lagi salting dan ketawa malu-malu haha."
    },
    {
      id: "hydrangea",
      name: "Blue Hydrangea",
      commonName: "Bunga Hydrangea Biru",
      meaning: "Rasa Syukur & Ketulusan Mendalam",
      image: "assets/images/flowers/hydrangea.webp",
      note: "Kelopaknya yang rimbun ngingetin aku sama banyaknya hal-hal kecil dari kamu yang selalu aku syukuri setiap saat."
    },
    {
      id: "sunflower",
      name: "Golden Sunflower",
      commonName: "Bunga Matahari Ceria",
      meaning: "Keceriaan, Semangat & Kehangatan Hidup",
      image: "assets/images/flowers/sunflower.webp",
      note: "Kamu yang ceria dan selalu bawa tawa itu ibarat matahari di hari-hariku yang lagi mendung atau capek."
    },
    {
      id: "daisy",
      name: "Sweet Daisy",
      commonName: "Bunga Daisy Putih",
      meaning: "Ketulusan, Kesetiaan & Hati yang Murni",
      image: "assets/images/flowers/daisy.webp",
      note: "Simpel tapi gemesin banget. Tetep jadi Aliya yang ceria dan manis kayak daisy ini yaa."
    }
  ],

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

