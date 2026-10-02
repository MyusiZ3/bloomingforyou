/**
 * ========================================================
 * BLOOMING FOR YOU - MAIN LOGIC
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeStage = document.getElementById('envelope-stage');
  const giftStage = document.getElementById('gift-stage');
  const envelopeContainer = document.getElementById('envelope-container');
  const waxSeal = document.getElementById('wax-seal');
  
  const bgmAudio = document.getElementById('bgm-audio');
  const musicPill = document.getElementById('music-pill');
  const vinylDisc = document.getElementById('vinyl-disc');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const iconPause = musicToggleBtn.querySelector('.icon-pause');
  const iconPlay = musicToggleBtn.querySelector('.icon-play');

  const flowerModal = document.getElementById('flower-modal');
  const flowerModalClose = document.getElementById('flower-modal-close');
  const polaroidModal = document.getElementById('polaroid-modal');
  const polaroidModalClose = document.getElementById('polaroid-modal-close');
  const btnReopen = document.getElementById('btn-reopen-envelope');
  const btnShareLove = document.getElementById('btn-share-love');

  let isPlaying = false;
  let envelopeOpened = false;

  // Initialize Data from CONFIG
  function applyConfig() {
    if (!window.CONFIG) return;

    // Recipient Info
    const r = CONFIG.recipient || {};
    document.getElementById('envelope-recipient-name').textContent = r.name || "Aliya";
    document.getElementById('slip-recipient-name').textContent = r.name || "Aliya";
    document.getElementById('header-name').textContent = r.name || "Aliya";
    document.getElementById('wax-monogram').textContent = r.waxSealInitials || "A & M";
    if (r.envelopeLabel) {
      document.getElementById('envelope-caption').textContent = r.envelopeLabel;
    }

    // Dates & Tagline
    if (CONFIG.dates && CONFIG.dates.tagline) {
      document.getElementById('header-tagline').textContent = CONFIG.dates.tagline;
    }

    // Music Info
    if (CONFIG.music) {
      document.getElementById('pill-music-title').textContent = CONFIG.music.title || "Red Cooper - On the Frost Bridge";
      if (CONFIG.music.src) {
        bgmAudio.src = CONFIG.music.src;
      }
    }

    // Letter
    if (CONFIG.letter) {
      const l = CONFIG.letter;
      document.getElementById('letter-salutation').textContent = l.salutation || `Untuk ${r.name} tersayang,`;
      document.getElementById('letter-closing').textContent = l.closing || "Dengan segenap rasa sayangku,";
      document.getElementById('letter-signature').textContent = l.signature || "Selalu Untukmu ❤️";

      const letterBody = document.getElementById('letter-body');
      letterBody.innerHTML = '';
      (l.paragraphs || []).forEach(pText => {
        const p = document.createElement('p');
        p.textContent = pText;
        letterBody.appendChild(p);
      });
    }

    // Polaroids
    renderPolaroids();

    // Herbarium
    renderHerbarium();

    // Share / Reply Button Link
    if (btnShareLove) {
      const waText = encodeURIComponent(`Halo sayang, aku udah buka web bunganya... Cantik dan manis banget! Makasih yaa, i love you! ❤️🌹`);
      btnShareLove.href = `https://api.whatsapp.com/send?text=${waText}`;
    }
  }

  // Render Polaroids
  function renderPolaroids() {
    const grid = document.getElementById('polaroid-grid');
    if (!grid || !CONFIG.polaroids) return;

    grid.innerHTML = '';
    CONFIG.polaroids.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'polaroid-item';
      card.style.transform = `rotate(${item.rotation || '0deg'})`;

      card.innerHTML = `
        <div class="washi-tape"></div>
        <div class="polaroid-img-box">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="polaroid-caption-box">
          <span class="polaroid-chapter">${item.chapter || `Chapter 0${index + 1}`}</span>
          <h3 class="polaroid-title">${item.title}</h3>
          <p class="polaroid-click-hint">Sentuh foto untuk membaca ✦</p>
        </div>
      `;

      card.addEventListener('click', () => openPolaroidModal(item));
      grid.appendChild(card);
    });
  }

  // Render Herbarium Specimen Cards
  function renderHerbarium() {
    const grid = document.getElementById('herbarium-grid');
    if (!grid || !CONFIG.flowers) return;

    grid.innerHTML = '';
    CONFIG.flowers.forEach(flower => {
      const card = document.createElement('div');
      card.className = 'herbarium-card';
      card.innerHTML = `
        <div class="herbarium-img-wrap">
          <img src="${flower.image}" alt="${flower.name}" loading="lazy">
        </div>
        <div class="herbarium-info">
          <h3 class="herbarium-scientific">${flower.name}</h3>
          <span class="herbarium-common">${flower.commonName}</span>
          <p class="herbarium-meaning">${flower.meaning}</p>
          <span class="herbarium-tap">Buka Pesan Khusus ❦</span>
        </div>
      `;

      card.addEventListener('click', () => openFlowerModal(flower));
      grid.appendChild(card);
    });
  }

  // Audio Playback with smooth fade-in
  function playAudio() {
    bgmAudio.volume = 0;
    const playPromise = bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        vinylDisc.classList.remove('paused');
        iconPause.classList.remove('hidden');
        iconPlay.classList.add('hidden');

        // Smooth volume fade-in
        let vol = 0;
        const fadeInterval = setInterval(() => {
          if (vol < 0.75) {
            vol += 0.05;
            bgmAudio.volume = Math.min(vol, 0.75);
          } else {
            clearInterval(fadeInterval);
          }
        }, 120);
      }).catch(err => {
        console.log("Autoplay was prevented by browser:", err);
      });
    }
  }

  function pauseAudio() {
    bgmAudio.pause();
    isPlaying = false;
    vinylDisc.classList.add('paused');
    iconPause.classList.add('hidden');
    iconPlay.classList.remove('hidden');
  }

  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  // Open Envelope Flow
  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Add opening animation to envelope
    envelopeContainer.classList.add('is-open');

    // Trigger audio
    playAudio();

    // Show floating music pill
    setTimeout(() => {
      musicPill.classList.remove('hidden');
    }, 600);

    // Fade out envelope stage and reveal gift stage
    setTimeout(() => {
      envelopeStage.classList.add('stage-fade-out');

      setTimeout(() => {
        envelopeStage.classList.add('hidden');
        giftStage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);

    }, 1400);
  }

  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  envelopeContainer.addEventListener('click', () => {
    openEnvelope();
  });

  // Re-open Envelope (Replay)
  btnReopen.addEventListener('click', () => {
    giftStage.classList.add('hidden');
    envelopeStage.classList.remove('hidden');
    envelopeStage.classList.remove('stage-fade-out');
    envelopeContainer.classList.remove('is-open');
    envelopeOpened = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Flower Click Handlers (Bouquet)
  document.querySelectorAll('.flower-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const flowerId = item.getAttribute('data-flower-id');
      const flowerData = (CONFIG.flowers || []).find(f => f.id === flowerId);
      if (flowerData) {
        openFlowerModal(flowerData);
      }
    });
  });

  // Modals Management
  function openFlowerModal(flower) {
    document.getElementById('modal-flower-img').src = flower.image;
    document.getElementById('modal-flower-name').textContent = flower.name;
    document.getElementById('modal-flower-common').textContent = flower.commonName;
    document.getElementById('modal-flower-meaning').textContent = flower.meaning;
    document.getElementById('modal-flower-note').textContent = flower.note;

    flowerModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeFlowerModal() {
    flowerModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  flowerModalClose.addEventListener('click', closeFlowerModal);
  flowerModal.addEventListener('click', (e) => {
    if (e.target === flowerModal) closeFlowerModal();
  });

  function openPolaroidModal(item) {
    document.getElementById('lightbox-polaroid-img').src = item.image;
    document.getElementById('lightbox-chapter').textContent = item.chapter || "";
    document.getElementById('lightbox-title').textContent = item.title;
    document.getElementById('lightbox-caption').textContent = item.caption;

    polaroidModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closePolaroidModal() {
    polaroidModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  polaroidModalClose.addEventListener('click', closePolaroidModal);
  polaroidModal.addEventListener('click', (e) => {
    if (e.target === polaroidModal) closePolaroidModal();
  });

  // Escape key to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFlowerModal();
      closePolaroidModal();
    }
  });

  // Apply Configuration
  applyConfig();
});
