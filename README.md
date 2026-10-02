# 🌸 Blooming For You — Special Birthday Gift for Aliya

Sebuah website ucapan ulang tahun interaktif bertema **Vintage Botanical & Forever Flower Bouquet**, terinspirasi dari keindahan dan kehangatan [flowerisblooming.com](https://flowerisblooming.com). Dibuat khusus tanpa overengineering, ringan, dan siap diakses langsung di peramban (smartphone maupun desktop) selamanya.

---

## ✨ Fitur Utama

1. **The Sealed Envelope (3D Vintage Wax Seal)**:
   - Amplop bergaya surat klasik vintage lengkap dengan stempel pos udara dan alamat bertuliskan nama **Aliya**.
   - Segel lilin (*wax seal*) interaktif berinisial yang dapat disentuh untuk membuka kado.
2. **Smooth Ambient BGM Player**:
   - Musik latar (*Red Cooper - On the Frost Bridge*) otomatis memutar perlahan (*fade-in*) begitu amplop dibuka.
   - Dilengkapi *floating vinyl player* di pojok kanan bawah dengan kontrol play/pause.
3. **The Grand Blooming Bouquet**:
   - Buket bunga vintage mekar (*Rosa Centifolia, Paeonia Officinalis, Chrysanthème Doré*).
   - Efek kelopak bunga melayang lembut (*floating petals canvas*).
   - Setiap bunga interaktif: sentuh bunga untuk membaca makna filosofi dan pesan cinta rahasia.
4. **The Heartfelt Parchment Letter**:
   - Surat cinta bergaya kertas vintage berserat alami dengan ucapan tulus dan puitis untuk hari ulang tahun Aliya.
5. **Polaroid Scrapbook Memories**:
   - Galeri foto polaroid bertengger alami dengan selotip washi tape:
     - *Chapter 01: When We First Met*
     - *Chapter 02: When We Knew We Liked Each Other*
     - *Chapter 03: The Day It Began*
   - Sentuh foto untuk melihat tampilan perbesar (*lightbox*) beserta cerita kenangannya.
6. **Botanical Herbarium Collection**:
   - Kartu botani klasik bergaya pelat ilustrasi Pierre-Joseph Redouté.
7. **Replay & One-Tap WhatsApp Reply**:
   - Tombol untuk melipat dan membuka amplop kembali kapan saja.
   - Tombol untuk membalas pesan cinta secara otomatis ke WhatsApp.

---

## 🛠️ Cara Mengubah Pesan & Foto Sendiri

Semua konfigurasi teks, nama, lagu, dan foto tersimpan rapi di dalam file [`config.js`](file:///c:/Users/muham/Documents/Github/bloomingforyou/config.js). Kamu tidak perlu menyentuh kode HTML atau CSS sama sekali!

### 1. Mengganti Foto Polaroid Sendiri
Cukup simpan foto kenangan kalian ke dalam folder:
`assets/images/polaroids/`
Lalu ganti nama filenya di [`config.js`](file:///c:/Users/muham/Documents/Github/bloomingforyou/config.js) bagian `polaroids`:
```javascript
polaroids: [
  {
    chapter: "Chapter 01",
    title: "When We First Met",
    image: "assets/images/polaroids/foto_pertama_kita.jpg",
    caption: "Cerita singkat momen ini...",
  },
  // ...
]
```

### 2. Mengganti Musik (BGM)
Jika kamu memiliki file MP3 lagu pilihanmu (misalnya `lagu_kita.mp3`), cukup letakkan file tersebut di:
`assets/audio/`
Lalu ubah pengaturannya di [`config.js`](file:///c:/Users/muham/Documents/Github/bloomingforyou/config.js):
```javascript
music: {
  title: "Red Cooper - On the Frost Bridge",
  src: "assets/audio/lagu_kita.mp3",
}
```

### 3. Mengubah Teks Surat Ucapan
Di [`config.js`](file:///c:/Users/muham/Documents/Github/bloomingforyou/config.js) bagian `letter`, kamu bisa mengubah paragraf surat sesuka hatimu.

---

## 🚀 Cara Mengaktifkan GitHub Pages (Hosting Gratis Selamanya)

Agar web ini bisa langsung dibuka oleh Aliya melalui link URL (misal: `https://myusiz3.github.io/bloomingforyou/`):

1. Buka repository kamu di GitHub: [https://github.com/MyusiZ3/bloomingforyou](https://github.com/MyusiZ3/bloomingforyou)
2. Klik tab **Settings** di bagian atas repository.
3. Di menu sebelah kiri, klik **Pages**.
4. Di bagian **Build and deployment > Source**, pilih **Deploy from a branch**.
5. Pilih Branch: **main** dan folder: **/ (root)**, lalu klik **Save**.
6. Tunggu 1–2 menit, link website akan aktif dan bisa langsung dikirim ke pacarmu! 💌
