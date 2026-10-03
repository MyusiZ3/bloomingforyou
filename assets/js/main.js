/**
 * ========================================================
 * BLOOMING FOR YOU - MAIN LOGIC
 * Includes:
 * - Floral Curtain Gate with 6-Digit Passcode (081004) & Heart Padlock
 * - Ultra-Snappy Unlock Transition (< 0.8s)
 * - Quick-Reveal Scratch-Off Photos (No floating badge)
 * - Authentic Vintage Paper Letter Integration
 * - Background Music (wave to earth - seasons)
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const giftStage = document.getElementById('gift-stage');
  const flowerCurtain = document.getElementById('flower-curtain');
  const centerLock = document.getElementById('curtain-center-lock');
  const padlockBtn = document.getElementById('heart-padlock-btn');
  const directUnlockBtn = document.getElementById('btn-direct-unlock');
  const btnLockCurtain = document.getElementById('btn-lock-curtain');
  
  const bgmAudio = document.getElementById('bgm-audio');
  const musicPill = document.getElementById('music-pill');
  const vinylDisc = document.getElementById('vinyl-disc');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const iconPause = musicToggleBtn ? musicToggleBtn.querySelector('.icon-pause') : null;
  const iconPlay = musicToggleBtn ? musicToggleBtn.querySelector('.icon-play') : null;

  const polaroidModal = document.getElementById('polaroid-modal');
  const polaroidModalClose = document.getElementById('polaroid-modal-close');
  const btnShareLove = document.getElementById('btn-share-love');
  const btnScratchAll = document.getElementById('btn-scratch-all');

  let isPlaying = false;
  let isUnlocking = false;
  let enteredCode = [];

  // ========================================================
  // CONFIGURATION INJECTION
  // ========================================================
  function applyConfig() {
    const configData = (typeof CONFIG !== 'undefined') ? CONFIG : (window.CONFIG || null);
    if (!configData) return;

    // Recipient Info
    const r = configData.recipient || {};
    const headerName = document.getElementById('header-name');
    if (headerName) headerName.textContent = r.name || "Aliya";

    // Dates & Tagline
    if (configData.dates && configData.dates.tagline) {
      const headerTagline = document.getElementById('header-tagline');
      if (headerTagline) headerTagline.textContent = configData.dates.tagline;
    }

    // Music Info
    if (configData.music) {
      const titleEl = document.getElementById('pill-music-title');
      if (titleEl) titleEl.textContent = configData.music.title || "wave to earth - seasons";
      if (configData.music.src && bgmAudio && bgmAudio.getAttribute('src') !== configData.music.src) {
        bgmAudio.src = configData.music.src;
      }
    }

    // Letter Content
    if (configData.letter) {
      const l = configData.letter;
      const salutationEl = document.getElementById('letter-salutation');
      const closingEl = document.getElementById('letter-closing');
      const signatureEl = document.getElementById('letter-signature');
      const letterBody = document.getElementById('letter-body');

      if (salutationEl) salutationEl.textContent = l.salutation || `Hai ${r.name || 'Aliya'} sayang,`;
      if (closingEl) closingEl.textContent = l.closing || "Sayang kamu banyak-banyak,";
      if (signatureEl) signatureEl.textContent = l.signature || "Pacarmu yang paling beruntung ❤️";

      if (letterBody) {
        letterBody.innerHTML = '';
        (l.paragraphs || []).forEach(pText => {
          const p = document.createElement('p');
          p.textContent = pText;
          letterBody.appendChild(p);
        });
      }
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
  // AUDIO CONTROLS (wave to earth - seasons)
  // ========================================================
  function playAudio() {
    if (!bgmAudio) return;
    bgmAudio.volume = 0;
    const playPromise = bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        if (vinylDisc) vinylDisc.classList.remove('paused');
        if (iconPause) iconPause.classList.remove('hidden');
        if (iconPlay) iconPlay.classList.add('hidden');

        // Smooth volume fade-in
        let vol = 0;
        const fadeInterval = setInterval(() => {
          if (vol < 0.75) {
            vol += 0.05;
            bgmAudio.volume = Math.min(vol, 0.75);
          } else {
            clearInterval(fadeInterval);
          }
        }, 100);
      }).catch(err => {
        console.log("Autoplay was prevented by browser:", err);
      });
    }
  }

  function pauseAudio() {
    if (!bgmAudio) return;
    bgmAudio.pause();
    isPlaying = false;
    if (vinylDisc) vinylDisc.classList.add('paused');
    if (iconPause) iconPause.classList.add('hidden');
    if (iconPlay) iconPlay.classList.remove('hidden');
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // ========================================================
  // SECRET GATEWAY: PASSCODE (081004) & PADLOCK UNLOCK
  // ========================================================
  function updateDots() {
    const dots = document.querySelectorAll('.padlock-pass-dots .p-dot');
    dots.forEach((dot, idx) => {
      if (idx < enteredCode.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  function triggerUnlock() {
    if (isUnlocking) return;
    isUnlocking = true;

    // 1. Immediately play audio & unlock heart padlock shackle
    playAudio();

    if (padlockBtn) padlockBtn.classList.add('unlocked');
    document.querySelectorAll('.padlock-pass-dots .p-dot').forEach(d => d.classList.add('filled'));

    if (centerLock) createSparkleBurst(centerLock);
    if (musicPill) musicPill.classList.remove('hidden');

    // 2. Part the massive floral curtains swiftly (no annoying delays!)
    setTimeout(() => {
      if (flowerCurtain) {
        flowerCurtain.classList.remove('curtains-closed');
        flowerCurtain.classList.add('curtains-open');
      }
      if (giftStage) giftStage.classList.remove('hidden');

      // Re-trigger layout/resize for smooth polaroid display
      window.dispatchEvent(new Event('resize'));

      // Once parted, remove curtain overlay so user interacts immediately
      setTimeout(() => {
        if (flowerCurtain) {
          flowerCurtain.classList.remove('active', 'curtains-open');
        }
        isUnlocking = false;
        enteredCode = [];
        updateDots();
        if (padlockBtn) padlockBtn.classList.remove('unlocked');
      }, 850);

    }, 150);
  }

  // Keypad Number Handling
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.key;

      if (key === 'del') {
        if (enteredCode.length > 0) {
          enteredCode.pop();
          updateDots();
        }
      } else if (btn.id === 'key-auto') {
        // Magic button: instant unlock
        triggerUnlock();
      } else if (key !== undefined) {
        if (enteredCode.length < 6) {
          enteredCode.push(key);
          updateDots();

          // When 6 digits entered
          if (enteredCode.length === 6) {
            const entered = enteredCode.join('');
            const targetPin = (typeof CONFIG !== 'undefined' && CONFIG.security && CONFIG.security.pin) ? CONFIG.security.pin : '081004';

            if (entered === targetPin || entered === '081004') {
              setTimeout(triggerUnlock, 120);
            } else {
              // Shake card gently on wrong PIN and reset
              const noteCard = document.querySelector('.padlock-note-card');
              if (noteCard) {
                noteCard.classList.add('shake-error');
                setTimeout(() => {
                  noteCard.classList.remove('shake-error');
                  enteredCode = [];
                  updateDots();
                }, 400);
              }
            }
          }
        }
      }
    });
  });

  // Direct click on padlock or unlock button opens immediately
  if (padlockBtn) {
    padlockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerUnlock();
    });
  }

  if (directUnlockBtn) {
    directUnlockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerUnlock();
    });
  }

  // Re-lock Curtain Button ("Kunci Tirai Bunga Lagi")
  if (btnLockCurtain) {
    btnLockCurtain.addEventListener('click', () => {
      enteredCode = [];
      updateDots();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (flowerCurtain) {
        flowerCurtain.classList.remove('curtains-open');
        flowerCurtain.classList.add('active', 'curtains-closed');
      }
      if (padlockBtn) padlockBtn.classList.remove('unlocked');
    });
  }

  // ========================================================
  // SCRATCH-OFF POLAROID CARDS (FAST REVEAL, NO FLOATING BADGE)
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

      // Notice: Floating badge has been completely removed as requested
      card.innerHTML = `
        <div class="washi-tape"></div>
        <div class="polaroid-img-box" id="box-${item.id}">
          <img src="${item.image}" alt="${item.title}" class="polaroid-photo-img" loading="lazy">
          <canvas class="scratch-canvas" id="canvas-${item.id}"></canvas>
        </div>
        <div class="polaroid-caption-box">
          <span class="polaroid-chapter">${item.chapter || `Chapter 0${index + 1}`}</span>
          <h3 class="polaroid-title">${item.title}</h3>
          <p class="polaroid-click-hint">Usap foto untuk membukanya ✦</p>
        </div>
      `;

      grid.appendChild(card);

      const canvas = card.querySelector('.scratch-canvas');
      const imgBox = card.querySelector('.polaroid-img-box');

      // Initialize scratch functionality for this polaroid
      initScratchCard(canvas, imgBox, item, card);

      // Clicking opened polaroid triggers lightbox modal
      card.addEventListener('click', () => {
        if (canvas && !canvas.classList.contains('is-revealed')) {
          // If not revealed yet, gentle click can also trigger quick reveal
          if (canvas.revealCard) canvas.revealCard();
          return;
        }
        openPolaroidModal(item);
      });
    });
  }

  function initScratchCard(canvas, imgBox, item, card) {
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Vintage Shimmering Rose-Gold Foil
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#d8ac9c');
      grad.addColorStop(0.3, '#ebd4cb');
      grad.addColorStop(0.6, '#caa090');
      grad.addColorStop(0.85, '#e4c9bd');
      grad.addColorStop(1, '#be8f7e');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Delicate vintage frame border
      ctx.strokeStyle = 'rgba(125, 80, 60, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      ctx.strokeStyle = 'rgba(125, 80, 60, 0.2)';
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(15, 15, width - 30, height - 30);
      ctx.setLineDash([]);

      // Subtle vintage icon & hint (No obstructive floating badge)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = '#6b4334';
      ctx.font = '22px serif';
      ctx.fillText('❦', width / 2, height / 2 - 20);

      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('USAP FOTO ✨', width / 2, height / 2 + 10);

      ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#7a4e3d';
      ctx.fillText('Kenangan Kita', width / 2, height / 2 + 28);
    }

    requestAnimationFrame(paintFoil);
    window.addEventListener('resize', () => {
      if (!isRevealed) paintFoil();
    });

    function scratch(x, y) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 65;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 32, 0, Math.PI * 2);
      ctx.fill();

      lastX = x;
      lastY = y;
      strokeCount++;

      // User requested: "cuma digosok ga banyak dan muncul aja"
      // Quick reveal with just 3-4 gentle swipes
      if (strokeCount >= 4) {
        revealCard();
        return;
      }

      if (strokeCount % 2 === 0) {
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
        const step = 64;
        const total = Math.floor(imgData.length / (4 * step));

        for (let i = 3; i < imgData.length; i += 4 * step) {
          if (imgData[i] < 128) {
            transparent++;
          }
        }

        const percent = (transparent / total) * 100;
        // As requested: very low threshold for immediate reveal
        if (percent >= 10 || strokeCount >= 4) {
          revealCard();
        }
      } catch (err) {
        if (strokeCount > 4) revealCard();
      }
    }

    function revealCard() {
      if (isRevealed) return;
      isRevealed = true;
      canvas.classList.add('is-revealed');
      imgBox.classList.add('revealed-glow');

      const hint = card.querySelector('.polaroid-click-hint');
      if (hint) {
        hint.textContent = '✨ Sentuh untuk membaca cerita lengkap ✦';
        hint.style.color = 'var(--gold-antique)';
      }

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

    // Expose revealCard on canvas for bulk action or single tap
    canvas.revealCard = revealCard;
  }

  // Sparkle Burst Particle Effect
  function createSparkleBurst(container) {
    if (!container) return;
    const symbols = ['💖', '✨', '🌸', '✦', '⭐'];
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < 9; i++) {
      const el = document.createElement('div');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.position = 'fixed';
      el.style.left = `${rect.left + rect.width / 2}px`;
      el.style.top = `${rect.top + rect.height / 2}px`;
      el.style.fontSize = `${16 + Math.random() * 12}px`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '99999';
      el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      el.style.opacity = '1';

      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${0.6 + Math.random() * 0.7})`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 850);
    }
  }

  // Reveal All Button Handler
  if (btnScratchAll) {
    btnScratchAll.addEventListener('click', () => {
      const canvases = document.querySelectorAll('.scratch-canvas:not(.is-revealed)');
      canvases.forEach((c, idx) => {
        setTimeout(() => {
          if (c.revealCard) c.revealCard();
        }, idx * 150);
      });
    });
  }

  // Bouquet Flower Click Handlers (Spring bounce & heart float, no hover badges)
  document.querySelectorAll('.flower-layer').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      item.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      item.style.transform += ' scale(1.12)';
      setTimeout(() => {
        item.style.transform = item.style.transform.replace(' scale(1.12)', '');
      }, 250);

      const rect = item.getBoundingClientRect();
      const heart = document.createElement('div');
      heart.textContent = '💖';
      heart.style.position = 'fixed';
      heart.style.left = `${rect.left + rect.width / 2}px`;
      heart.style.top = `${rect.top + 20}px`;
      heart.style.fontSize = '22px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.transition = 'all 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)';
      heart.style.opacity = '1';
      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translateY(-55px) scale(1.35)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 950);
    });
  });

  // Polaroid Lightbox Modal Management
  function openPolaroidModal(item) {
    if (!polaroidModal) return;
    const imgEl = document.getElementById('lightbox-polaroid-img');
    const chEl = document.getElementById('lightbox-chapter');
    const titleEl = document.getElementById('lightbox-title');
    const capEl = document.getElementById('lightbox-caption');

    if (imgEl) imgEl.src = item.image;
    if (chEl) chEl.textContent = item.chapter || "";
    if (titleEl) titleEl.textContent = item.title;
    if (capEl) capEl.textContent = item.caption;

    polaroidModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closePolaroidModal() {
    if (!polaroidModal) return;
    polaroidModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (polaroidModalClose) polaroidModalClose.addEventListener('click', closePolaroidModal);
  if (polaroidModal) {
    polaroidModal.addEventListener('click', (e) => {
      if (e.target === polaroidModal) closePolaroidModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePolaroidModal();
  });

  // Apply Configuration
  applyConfig();
});
