/**
 * ========================================================
 * BLOOMING FOR YOU - MAIN LOGIC
 * Includes: Floral Curtain Transition, Scratch-Off Photos,
 * Wave to Earth BGM integration, and Romantic Animations
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeStage = document.getElementById('envelope-stage');
  const giftStage = document.getElementById('gift-stage');
  const envelopeContainer = document.getElementById('envelope-container');
  const waxSeal = document.getElementById('wax-seal');
  const flowerCurtain = document.getElementById('flower-curtain');
  
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
  const btnScratchAll = document.getElementById('btn-scratch-all');

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
      document.getElementById('pill-music-title').textContent = configData.music.title || "wave to earth - seasons";
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

    // Render Scratchable Polaroids
    renderPolaroids(configData);

    // Share / Reply Button Link
    if (btnShareLove) {
      const waText = encodeURIComponent(`Sayanggg, aku udah buka bunganyaa... Suka banget gemes dan lucu parah! Makasih banyak yaa, love you so much! ❤️🌹`);
      btnShareLove.href = `https://api.whatsapp.com/send?text=${waText}`;
    }
  }

  // ========================================================
  // SCRATCH-OFF POLAROID CARDS
  // ========================================================
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
        <div class="polaroid-img-box" id="box-${item.id}">
          <img src="${item.image}" alt="${item.title}" class="polaroid-photo-img" loading="lazy">
          <canvas class="scratch-canvas" id="canvas-${item.id}"></canvas>
          <div class="scratch-badge" id="badge-${item.id}">
            <span class="scratch-icon">🪄</span>
            <span>Gosok fotonya yuk</span>
          </div>
        </div>
        <div class="polaroid-caption-box">
          <span class="polaroid-chapter">${item.chapter || `Chapter 0${index + 1}`}</span>
          <h3 class="polaroid-title">${item.title}</h3>
          <p class="polaroid-click-hint">Usap foto untuk membukanya ✦</p>
        </div>
      `;

      grid.appendChild(card);

      const canvas = card.querySelector('.scratch-canvas');
      const badge = card.querySelector('.scratch-badge');
      const imgBox = card.querySelector('.polaroid-img-box');

      // Initialize scratch functionality for this polaroid
      initScratchCard(canvas, badge, imgBox, item, card);

      // Clicking opened polaroid triggers lightbox modal
      card.addEventListener('click', (e) => {
        // If clicking while still not revealed or during scratch, don't open modal
        if (canvas && !canvas.classList.contains('is-revealed')) {
          return;
        }
        openPolaroidModal(item);
      });
    });
  }

  function initScratchCard(canvas, badge, imgBox, item, card) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let isRevealed = false;
    let strokeCount = 0;

    function paintFoil() {
      const rect = imgBox.getBoundingClientRect();
      const width = rect.width || 280;
      const height = rect.height || 280;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);

      // Vintage Shimmering Metallic Rose-Gold Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#d2a494');
      grad.addColorStop(0.25, '#ebd1c7');
      grad.addColorStop(0.55, '#c59382');
      grad.addColorStop(0.85, '#e4c4b8');
      grad.addColorStop(1, '#b88270');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Delicate vintage frame border
      ctx.strokeStyle = 'rgba(125, 80, 60, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      ctx.strokeStyle = 'rgba(125, 80, 60, 0.25)';
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(16, 16, width - 32, height - 32);
      ctx.setLineDash([]);

      // Stamped Typographic Crest
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Floral Icon
      ctx.fillStyle = '#6b4334';
      ctx.font = '22px serif';
      ctx.fillText('❦', width / 2, height / 2 - 38);

      // Main Call to Action
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('✦ GOSOK DI SINI ✦', width / 2, height / 2 - 6);

      // Subtitle
      ctx.font = 'italic 14px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#7a4e3d';
      ctx.fillText('Kepingan Kenangan Kita', width / 2, height / 2 + 18);

      // Micro Hint
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(107, 67, 52, 0.75)';
      ctx.fillText('(Usap dengan jarimu ✨)', width / 2, height / 2 + 42);
    }

    // Initial paint and resize listener
    requestAnimationFrame(paintFoil);
    window.addEventListener('resize', () => {
      if (!isRevealed) paintFoil();
    });

    function scratch(x, y) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 50;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();

      lastX = x;
      lastY = y;
      strokeCount++;

      // Fade out badge on first rub
      if (badge && !badge.classList.contains('fade-out')) {
        badge.classList.add('fade-out');
      }

      // Check progress periodically
      if (strokeCount % 6 === 0) {
        checkProgress();
      }
    }

    function checkProgress() {
      if (isRevealed) return;
      try {
        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.getImageData(0, 0, w, h).data;
        let transparent = 0;
        const step = 64; // Sample every 64 pixels for performance
        const total = Math.floor(imgData.length / (4 * step));

        for (let i = 3; i < imgData.length; i += 4 * step) {
          if (imgData[i] < 128) {
            transparent++;
          }
        }

        const percent = (transparent / total) * 100;
        if (percent >= 38) {
          revealCard();
        }
      } catch (err) {
        if (strokeCount > 35) revealCard();
      }
    }

    function revealCard() {
      if (isRevealed) return;
      isRevealed = true;
      canvas.classList.add('is-revealed');
      imgBox.classList.add('revealed-glow');
      if (badge) badge.classList.add('fade-out');

      const hint = card.querySelector('.polaroid-click-hint');
      if (hint) {
        hint.textContent = '✨ Sentuh untuk membaca cerita lengkap ✦';
        hint.style.color = 'var(--gold-antique)';
      }

      // Confetti & heart burst celebration
      createSparkleBurst(imgBox);
    }

    // Pointer events (Mobile Touch + Desktop Mouse unified)
    canvas.addEventListener('pointerdown', (e) => {
      if (isRevealed) return;
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      scratch(lastX, lastY);
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!isDrawing || isRevealed) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      scratch(x, y);
    });

    const stopScratch = (e) => {
      if (isDrawing) {
        isDrawing = false;
        checkProgress();
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };

    canvas.addEventListener('pointerup', stopScratch);
    canvas.addEventListener('pointercancel', stopScratch);

    // Expose revealCard on canvas for bulk action
    canvas.revealCard = revealCard;
  }

  // Sparkle Burst Particle Effect
  function createSparkleBurst(container) {
    const symbols = ['💖', '✨', '🌸', '✦', '⭐'];
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const el = document.createElement('div');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.position = 'fixed';
      el.style.left = `${rect.left + rect.width / 2}px`;
      el.style.top = `${rect.top + rect.height / 2}px`;
      el.style.fontSize = `${16 + Math.random() * 12}px`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '9999';
      el.style.transition = 'all 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
      el.style.opacity = '1';

      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 70;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${0.6 + Math.random() * 0.7})`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 950);
    }
  }

  // Reveal All Button Handler
  if (btnScratchAll) {
    btnScratchAll.addEventListener('click', () => {
      const canvases = document.querySelectorAll('.scratch-canvas:not(.is-revealed)');
      canvases.forEach((c, idx) => {
        setTimeout(() => {
          if (c.revealCard) c.revealCard();
        }, idx * 200);
      });
    });
  }

  // ========================================================
  // AUDIO CONTROLS (wave to earth - seasons)
  // ========================================================
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

  // ========================================================
  // CINEMATIC FLORAL CURTAIN & ENVELOPE OPENING
  // ========================================================
  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Add opening animation to envelope
    envelopeContainer.classList.add('is-open');

    // Trigger wave to earth BGM
    playAudio();

    // Show floating music pill
    setTimeout(() => {
      musicPill.classList.remove('hidden');
    }, 500);

    // Trigger Flower Curtain Transition (closes across the screen)
    setTimeout(() => {
      if (flowerCurtain) {
        flowerCurtain.classList.remove('hidden');
        flowerCurtain.classList.add('active');
        flowerCurtain.classList.remove('curtains-open');
        flowerCurtain.classList.add('curtains-closed');

        // When curtains have fully met in the center (~1s)
        setTimeout(() => {
          // Switch to Gift Stage behind closed curtains
          envelopeStage.classList.add('hidden');
          giftStage.classList.remove('hidden');
          window.scrollTo({ top: 0, behavior: 'instant' });

          // Repaint canvases if gift stage just became visible
          document.querySelectorAll('.scratch-canvas:not(.is-revealed)').forEach(c => {
            window.dispatchEvent(new Event('resize'));
          });

          // Hold closed curtain for a moment so Aliya sees the monogram & blooming flowers
          setTimeout(() => {
            // Part the curtains open to unveil the grand bouquet
            flowerCurtain.classList.remove('curtains-closed');
            flowerCurtain.classList.add('curtains-open');

            // Once fully opened, hide curtain overlay
            setTimeout(() => {
              flowerCurtain.classList.remove('active', 'curtains-open');
            }, 1200);
          }, 850);

        }, 1100);
      } else {
        // Fallback
        envelopeStage.classList.add('stage-fade-out');
        setTimeout(() => {
          envelopeStage.classList.add('hidden');
          giftStage.classList.remove('hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 700);
      }
    }, 700);
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
    if (flowerCurtain) {
      flowerCurtain.classList.remove('active', 'curtains-closed', 'curtains-open');
    }
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
