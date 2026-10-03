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

  const polaroidModal = document.getElementById('polaroid-modal');
  const polaroidModalClose = document.getElementById('polaroid-modal-close');
  const btnReopen = document.getElementById('btn-reopen-envelope');
  const btnShareLove = document.getElementById('btn-share-love');

  let isPlaying = false;
  let envelopeOpened = false;

  // Initialize Data from CONFIG
  function applyConfig() {
    const configData = (typeof CONFIG !== 'undefined') ? CONFIG : (window.CONFIG || null);
    if (!configData) return;

    // Recipient Info
    const r = configData.recipient || {};
    document.getElementById('envelope-recipient-name').textContent = r.name || "Aliya";
    document.getElementById('slip-recipient-name').textContent = r.name || "Aliya";
    document.getElementById('header-name').textContent = r.name || "Aliya";
    document.getElementById('wax-monogram').textContent = r.waxSealInitials || "A & M";
    if (r.envelopeLabel) {
      document.getElementById('envelope-caption').textContent = r.envelopeLabel;
    }

    // Dates & Tagline
    if (configData.dates && configData.dates.tagline) {
      document.getElementById('header-tagline').textContent = configData.dates.tagline;
    }

    // Music Info
    if (configData.music) {
      document.getElementById('pill-music-title').textContent = configData.music.title || "Red Cooper - On the Frost Bridge";
      if (configData.music.src) {
        const sourceEl = bgmAudio.querySelector('source');
        if (sourceEl && sourceEl.getAttribute('src') !== configData.music.src) {
          sourceEl.src = configData.music.src;
          bgmAudio.load();
        }
      }
    }

    // Letter
    if (configData.letter) {
      const l = configData.letter;
      document.getElementById('letter-salutation').textContent = l.salutation || `Untuk ${r.name} tersayang,`;
      document.getElementById('letter-closing').textContent = l.closing || "Sayang kamu banyak-banyak,";
      document.getElementById('letter-signature').textContent = l.signature || "Pacarmu yang paling beruntung ❤️";

      const letterBody = document.getElementById('letter-body');
      letterBody.innerHTML = '';
      (l.paragraphs || []).forEach(pText => {
        const p = document.createElement('p');
        p.textContent = pText;
        letterBody.appendChild(p);
      });
    }

    // Polaroids
    renderPolaroids(configData);

    // Share / Reply Button Link
    if (btnShareLove) {
      const waText = encodeURIComponent(`Sayanggg, aku udah buka bunganyaa... Suka banget gemes dan lucu parah! Makasih banyak yaa, love you so much! ❤️🌹`);
      btnShareLove.href = `https://api.whatsapp.com/send?text=${waText}`;
    }
  }

  // Render Polaroids
  function renderPolaroids(configData) {
    const grid = document.getElementById('polaroid-grid');
    const cfg = configData || (typeof CONFIG !== 'undefined' ? CONFIG : window.CONFIG);
    if (!grid || !cfg || !cfg.polaroids) return;

    grid.innerHTML = '';
    cfg.polaroids.forEach((item, index) => {
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

  // Flower Click Handlers (Bouquet tap playful heart effect)
  document.querySelectorAll('.flower-layer').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Add spring bounce animation
      item.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      item.style.transform += ' scale(1.15)';
      setTimeout(() => {
        item.style.transform = item.style.transform.replace(' scale(1.15)', '');
      }, 250);

      // Create floating mini heart
      const rect = item.getBoundingClientRect();
      const heart = document.createElement('div');
      heart.textContent = '💖';
      heart.style.position = 'fixed';
      heart.style.left = `${rect.left + rect.width / 2}px`;
      heart.style.top = `${rect.top + 20}px`;
      heart.style.fontSize = '24px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '999';
      heart.style.transition = 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
      heart.style.opacity = '1';
      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translateY(-60px) scale(1.4)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => {
        heart.remove();
      }, 1000);
    });
  });

  // Polaroid Lightbox Modal Management
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
      closePolaroidModal();
    }
  });

  // Apply Configuration
  applyConfig();
});
