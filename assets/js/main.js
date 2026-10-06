/**
 * Blooming For You - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeStage = document.getElementById('envelope-stage');
  const envelopeBox = document.getElementById('envelope-box');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const cakeStage = document.getElementById('cake-stage');
  const cakeImageWrap = document.getElementById('cake-image-wrap');
  const cakeClownReveal = document.getElementById('cake-clown-reveal');
  const candleLeft = document.getElementById('candle-left');
  const candleRight = document.getElementById('candle-right');
  const cakeStatusBadge = document.getElementById('cake-status-badge');
  const candleCountText = document.getElementById('candle-count-text');
  const cakeProceedAction = document.getElementById('cake-proceed-action');
  const btnProceedGift = document.getElementById('btn-proceed-gift');
  const giftStage = document.getElementById('gift-stage');
  const btnLockCurtain = document.getElementById('btn-lock-curtain');
  
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
  let isOpeningEnvelope = false;
  let isCandleLeftLit = true;
  let isCandleRightLit = true;
  let hasTransitionedToGift = false;

  // --- In-Memory Audio Engine (No Idm Popups) ---
  let bgmAudio = null;
  let isAudioLoading = false;
  let isAudioReady = false;
  let shouldPlayWhenReady = false;
  let audioSrcUrl = "assets/audio/track.dat";

  function loadAudioBlob(url) {
    if (isAudioReady || isAudioLoading) return;
    isAudioLoading = true;
    const targetUrl = url || audioSrcUrl;

    fetch(targetUrl)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.arrayBuffer();
      })
      .then(arrayBuffer => {
        const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const blobUrl = URL.createObjectURL(audioBlob);
        bgmAudio = new Audio(blobUrl);
        bgmAudio.loop = true;
        bgmAudio.preload = 'auto';
        isAudioReady = true;
        isAudioLoading = false;

        if (shouldPlayWhenReady) {
          playAudio();
        }
      })
      .catch(err => {
        console.warn("Blob audio fetch failed, falling back to direct Audio:", err);
        try {
          bgmAudio = new Audio(targetUrl);
          bgmAudio.loop = true;
          isAudioReady = true;
          isAudioLoading = false;
          if (shouldPlayWhenReady) {
            playAudio();
          }
        } catch (_) {}
      });
  }

  // Preload audio immediately when DOM loads
  loadAudioBlob();

  function playAudio() {
    shouldPlayWhenReady = true;

    if (!isAudioReady || !bgmAudio) {
      loadAudioBlob();
      return;
    }

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
            if (bgmAudio) bgmAudio.volume = Math.min(vol, 0.75);
          } else {
            clearInterval(fadeInterval);
          }
        }, 100);
      }).catch(err => {
        console.log("Audio autoplay prevented by browser:", err);
      });
    }
  }

  function pauseAudio() {
    shouldPlayWhenReady = false;
    isPlaying = false;

    if (bgmAudio) {
      bgmAudio.pause();
    }

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

  // --- Configuration Injection ---
  function applyConfig() {
    const configData = (typeof CONFIG !== 'undefined') ? CONFIG : (window.CONFIG || null);
    if (!configData) return;

    // Recipient Info
    const r = configData.recipient || {};
    const recipientName = r.name || "Aliya";

    const headerName = document.getElementById('header-name');
    if (headerName) headerName.textContent = recipientName;

    const slipName = document.getElementById('slip-recipient-name');
    if (slipName) slipName.textContent = recipientName;

    const envName = document.getElementById('envelope-recipient-name');
    if (envName) envName.textContent = recipientName;

    const cakeName = document.getElementById('cake-recipient-name');
    if (cakeName) cakeName.textContent = recipientName;

    const paperName = document.getElementById('paper-recipient-name');
    if (paperName) paperName.textContent = recipientName;

    // Dates & Tagline
    if (configData.dates && configData.dates.tagline) {
      const headerTagline = document.getElementById('header-tagline');
      if (headerTagline) headerTagline.textContent = configData.dates.tagline;
    }

    // Music Info
    if (configData.music) {
      const titleEl = document.getElementById('pill-music-title');
      if (titleEl) titleEl.textContent = configData.music.title || "wave to earth - seasons";
      if (configData.music.src && configData.music.src !== audioSrcUrl) {
        audioSrcUrl = configData.music.src;
        isAudioReady = false;
        loadAudioBlob(audioSrcUrl);
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

    const curtainRecipient = document.getElementById('curtain-recipient-name');
    if (curtainRecipient) curtainRecipient.textContent = recipientName;

    // Share / Reply Button Link
    if (btnShareLove) {
      const waText = encodeURIComponent(`Sayanggg, aku udah buka bunganyaa... Suka banget gemes dan lucu parah! Makasih banyak yaa, love you so much! ❤️🌹`);
      btnShareLove.href = `https://api.whatsapp.com/send?text=${waText}`;
    }
  }

  // --- Theatrical Floral Curtain Gateway & Golden Heart Padlock ---
  const flowerCurtain = document.getElementById('flower-curtain');
  const padlockHeartBtn = document.getElementById('padlock-heart-btn');
  let isCurtainUnlocked = false;

  function unlockFlowerCurtain() {
    if (isCurtainUnlocked) return;
    isCurtainUnlocked = true;

    // Pop the padlock shackle & create golden sparkles
    if (padlockHeartBtn) {
      padlockHeartBtn.classList.add('unlocked');
      createSparkleBurst(padlockHeartBtn);
    }

    // Start background music smoothly
    playAudio();

    // Play unlocking chime
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.55);
          }, i * 90);
        });
      }
    } catch (_) {}

    // Slide curtains open after the shackle pop animation
    setTimeout(() => {
      if (flowerCurtain) {
        flowerCurtain.classList.remove('curtains-closed');
        flowerCurtain.classList.add('curtains-open');
      }

      // Hide curtain overlay completely after slide transition
      setTimeout(() => {
        if (flowerCurtain) {
          flowerCurtain.classList.remove('active');
        }
      }, 1250);
    }, 450);
  }

  // Click / tap on Golden Heart Padlock opens the curtain
  if (padlockHeartBtn) {
    padlockHeartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unlockFlowerCurtain();
    });
    padlockHeartBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        unlockFlowerCurtain();
      }
    });
  }

  // Clicking anywhere on the curtain also unlocks
  if (flowerCurtain) {
    flowerCurtain.addEventListener('click', () => {
      unlockFlowerCurtain();
    });
  }

  // --- Vintage Envelope Unsealing ---
  function openEnvelope() {
    if (isOpeningEnvelope) return;
    isOpeningEnvelope = true;

    // 1. Play Background Music immediately
    playAudio();

    // 2. Open 3D Envelope Flap & raise wax seal
    if (envelopeBox) {
      envelopeBox.classList.add('is-open');
    }

    if (waxSealBtn) {
      createSparkleBurst(waxSealBtn);
    }

    // 3. Transition from Envelope to Birthday Cake Stage
    setTimeout(() => {
      if (envelopeStage) {
        envelopeStage.classList.add('stage-fade-out');
      }

      setTimeout(() => {
        if (envelopeStage) {
          envelopeStage.classList.add('hidden');
        }
        if (cakeStage) {
          cakeStage.classList.remove('hidden');
        }
        isOpeningEnvelope = false;
      }, 800);

    }, 2800);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (envelopeBox) {
    envelopeBox.addEventListener('click', () => {
      openEnvelope();
    });
  }

  // --- Birthday Cake & 22 Candles Blowout ---
  function playPuffSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Gentle soft blowing noise / sparkle chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch (_) {}
  }

  function extinguishCandle(candleEl, isLeft) {
    if (isLeft && !isCandleLeftLit) return;
    if (!isLeft && !isCandleRightLit) return;

    if (isLeft) isCandleLeftLit = false;
    else isCandleRightLit = false;

    candleEl.classList.remove('candle-active');
    candleEl.classList.add('is-extinguished');

    // Create extinguish particle burst & sound
    createSparkleBurst(candleEl);
    playPuffSound();

    const cakeHint = document.getElementById('cake-instruction-hint');

    // Check if both extinguished
    if (!isCandleLeftLit && !isCandleRightLit) {
      if (cakeHint) {
        cakeHint.textContent = "Permohonanmu terkabul... ✨";
        cakeHint.style.color = "var(--gold-antique)";
      }
      
      // Celebrate with delicate floral sparkle burst
      triggerBirthdayCelebration();

      // Transition cake & butterflies out
      if (cakeImageWrap) {
        cakeImageWrap.classList.add('cake-wrap-exit');
      }

      const cakeTitleEl = document.querySelector('.cake-title');
      if (cakeTitleEl) {
        cakeTitleEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        cakeTitleEl.style.opacity = '0';
        cakeTitleEl.style.transform = 'translateY(-6px)';
      }

      // 3-Step Character Story Sequence
      const characterStory = [
        {
          src: 'assets/images/character/clown.png',
          alt: 'Queen and Clown',
          title: 'a special day for <span class="cake-highlight-name">my little gurl...</span>',
          duration: 3000
        },
        {
          src: 'assets/images/character/menunjuk.png',
          alt: 'Look at Her',
          title: 'look at her... <span class="cake-highlight-name">she\'s 22 now</span>',
          duration: 3000
        },
        {
          src: 'assets/images/character/short.png',
          alt: 'Still Cute',
          title: 'still cute tho. <span class="cake-highlight-name">unfortunately :3...</span>',
          duration: 3000
        }
      ];

      // Preload story character images for instant display
      characterStory.forEach(item => {
        const img = new Image();
        img.src = item.src;
      });

      function playCharacterStep(index) {
        if (index >= characterStory.length) {
          proceedToGiftStage();
          return;
        }

        const step = characterStory[index];
        const characterImg = document.getElementById('cake-character-img');

        if (index === 0) {
          setTimeout(() => {
            if (cakeImageWrap) cakeImageWrap.classList.add('hidden');
            if (cakeClownReveal) cakeClownReveal.classList.remove('hidden');
            if (characterImg) {
              characterImg.src = step.src;
              characterImg.alt = step.alt;
            }
            if (cakeTitleEl) {
              cakeTitleEl.innerHTML = step.title;
              cakeTitleEl.style.opacity = '1';
              cakeTitleEl.style.transform = 'translateY(0)';
            }

            setTimeout(() => {
              playCharacterStep(index + 1);
            }, step.duration);
          }, 350);
        } else {
          if (cakeTitleEl) {
            cakeTitleEl.style.opacity = '0';
            cakeTitleEl.style.transform = 'translateY(-6px)';
          }
          if (characterImg) {
            characterImg.classList.add('character-fade');
          }

          setTimeout(() => {
            if (characterImg) {
              characterImg.src = step.src;
              characterImg.alt = step.alt;
              characterImg.classList.remove('character-fade');
            }
            if (cakeTitleEl) {
              cakeTitleEl.innerHTML = step.title;
              cakeTitleEl.style.opacity = '1';
              cakeTitleEl.style.transform = 'translateY(0)';
            }

            setTimeout(() => {
              playCharacterStep(index + 1);
            }, step.duration);
          }, 350);
        }
      }

      playCharacterStep(0);
    }
  }

  if (candleLeft) {
    candleLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      extinguishCandle(candleLeft, true);
    });
  }

  if (candleRight) {
    candleRight.addEventListener('click', (e) => {
      e.stopPropagation();
      extinguishCandle(candleRight, false);
    });
  }

  function triggerBirthdayCelebration() {
    const symbols = ['🌸', '✦', '✨', '✧', '🌷', '•', '💖'];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.position = 'fixed';
        el.style.left = `${Math.random() * 90 + 5}vw`;
        el.style.top = `${Math.random() * 70 + 15}vh`;
        el.style.fontSize = `${16 + Math.random() * 16}px`;
        el.style.color = '#b78a48';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '99999';
        el.style.transition = 'all 1.3s cubic-bezier(0.2, 0.8, 0.3, 1)';
        el.style.opacity = '0.9';
        el.style.transform = 'scale(0.4)';

        document.body.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transform = `translateY(-${50 + Math.random() * 80}px) scale(${1 + Math.random() * 0.4}) rotate(${Math.random() * 60 - 30}deg)`;
          el.style.opacity = '0';
        });

        setTimeout(() => el.remove(), 1400);
      }, i * 50);
    }
  }

  // --- Transition To Blooming Gift & Letter Stage ---
  function proceedToGiftStage() {
    if (hasTransitionedToGift) return;
    hasTransitionedToGift = true;

    if (cakeStage) {
      cakeStage.classList.add('stage-fade-out');
    }

    setTimeout(() => {
      if (cakeStage) cakeStage.classList.add('hidden');
      if (giftStage) giftStage.classList.remove('hidden');
      if (musicPill) musicPill.classList.remove('hidden');

      // Unveil the blooming side botanicals and meadow foreground
      const sideBotanicals = document.getElementById('side-botanical-parallax-track');
      const meadowWrap = document.getElementById('page-bottom-meadow-wrap');
      
      if (sideBotanicals) sideBotanicals.classList.remove('hidden');
      if (meadowWrap) meadowWrap.classList.remove('hidden');

      if (typeof updateParallaxFn === 'function') {
        requestAnimationFrame(updateParallaxFn);
      }

      // Initialize all scratch canvases with correct dimensions
      setTimeout(() => {
        document.querySelectorAll('.scratch-canvas').forEach(c => {
          if (c.paintFoilIfNotPainted) c.paintFoilIfNotPainted();
        });
      }, 300);
    }, 700);
  }

  if (btnProceedGift) {
    btnProceedGift.addEventListener('click', (e) => {
      e.stopPropagation();
      proceedToGiftStage();
    });
  }

  // Re-lock / Re-light Cake ("Tiup Lilin Ulang")
  if (btnLockCurtain) {
    btnLockCurtain.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset candles
      isCandleLeftLit = true;
      isCandleRightLit = true;
      hasTransitionedToGift = false;

      if (candleLeft) {
        candleLeft.classList.remove('is-extinguished');
        candleLeft.classList.add('candle-active');
      }
      if (candleRight) {
        candleRight.classList.remove('is-extinguished');
        candleRight.classList.add('candle-active');
      }
      const cakeHint = document.getElementById('cake-instruction-hint');
      if (cakeHint) {
        cakeHint.textContent = "Tiup lilinnya dan buat permohonanmu";
        cakeHint.style.color = "";
      }
      if (cakeProceedAction) {
        cakeProceedAction.classList.remove('is-ready');
      }

      const sideBotanicals = document.getElementById('side-botanical-parallax-track');
      const meadowWrap = document.getElementById('page-bottom-meadow-wrap');
      if (sideBotanicals) sideBotanicals.classList.add('hidden');
      if (meadowWrap) meadowWrap.classList.add('hidden');

      if (cakeImageWrap) {
        cakeImageWrap.classList.remove('hidden', 'cake-wrap-exit');
      }
      if (cakeClownReveal) {
        cakeClownReveal.classList.add('hidden');
      }

      if (giftStage) giftStage.classList.add('hidden');
      if (cakeStage) {
        cakeStage.classList.remove('hidden', 'stage-fade-out');
      }
    });
  }

  // --- Scratch-Off Polaroid Cards (Natural Scratch, No Auto-Click Reveal) ---
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

      // Initialize realistic scratch functionality for this polaroid
      initScratchCard(canvas, imgBox, item, card);

      // CRITICAL FIX: Clicking does NOT reveal card!
      // Only opens the lightbox modal if the card is ALREADY revealed.
      card.addEventListener('click', () => {
        if (canvas.isRevealed) {
          openPolaroidModal(item);
        }
      });
    });
  }

  function initScratchCard(canvas, imgBox, item, card) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let strokeCount = 0;
    let hasPainted = false;

    canvas.isRevealed = false;

    function paintFoil() {
      if (canvas.isRevealed) return;
      const width = imgBox.offsetWidth || imgBox.getBoundingClientRect().width || 280;
      const height = imgBox.offsetHeight || imgBox.getBoundingClientRect().height || 280;
      if (width < 30) return;

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

      // Subtle vintage icon & hint (No floating badge)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = '#6b4334';
      ctx.font = '22px serif';
      ctx.fillText('✨', width / 2, height / 2 - 20);

      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('USAP FOTO ✨', width / 2, height / 2 + 10);

      ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#7a4e3d';
      ctx.fillText('Kenangan Kita', width / 2, height / 2 + 28);

      hasPainted = true;
    }

    requestAnimationFrame(paintFoil);

    window.addEventListener('resize', () => {
      if (!canvas.isRevealed && strokeCount === 0) {
        paintFoil();
      }
    });

    canvas.paintFoilIfNotPainted = () => {
      if (!hasPainted && !canvas.isRevealed) {
        paintFoil();
      }
    };

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    // Realistic coin-scratch thickness (26px)
    function scratch(x, y) {
      if (canvas.isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 26;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
      strokeCount++;

      if (strokeCount % 4 === 0) {
        checkProgress();
      }
    }

    function checkProgress() {
      if (canvas.isRevealed) return;
      try {
        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.getImageData(0, 0, w, h).data;
        let transparent = 0;
        const step = 32;
        const total = Math.floor(imgData.length / (4 * step));

        for (let i = 3; i < imgData.length; i += 4 * step) {
          if (imgData[i] < 128) {
            transparent++;
          }
        }

        const percent = (transparent / total) * 100;
        if (percent >= 35 || strokeCount >= 45) {
          revealCard();
        }
      } catch (err) {
        if (strokeCount > 40) revealCard();
      }
    }

    function revealCard() {
      if (canvas.isRevealed) return;
      canvas.isRevealed = true;
      canvas.classList.add('is-revealed');
      imgBox.classList.add('revealed-glow');

      const hint = card.querySelector('.polaroid-click-hint');
      if (hint) {
        hint.textContent = '✨ Sentuh untuk membaca cerita lengkap ✦';
        hint.style.color = 'var(--gold-antique)';
      }

      createSparkleBurst(imgBox);
    }

    // Unified pointer & touch handling
    function startDraw(e) {
      if (canvas.isRevealed) return;
      isDrawing = true;
      const coords = getCoords(e);
      lastX = coords.x;
      lastY = coords.y;
      scratch(lastX, lastY);
      if (e.pointerId) {
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      }
    }

    function moveDraw(e) {
      if (!isDrawing || canvas.isRevealed) return;
      if (e.cancelable) e.preventDefault();
      const coords = getCoords(e);
      scratch(coords.x, coords.y);
    }

    function endDraw(e) {
      if (isDrawing) {
        isDrawing = false;
        checkProgress();
        if (e.pointerId) {
          try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      }
    }

    // Pointer events (Desktop Mouse + Stylus)
    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', moveDraw);
    canvas.addEventListener('pointerup', endDraw);
    canvas.addEventListener('pointercancel', endDraw);

    // Touch events fallback for 100% reliable mobile touch scratching
    canvas.addEventListener('touchstart', (e) => {
      if (e.cancelable) e.preventDefault();
      startDraw(e);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();
      moveDraw(e);
    }, { passive: false });

    canvas.addEventListener('touchend', endDraw);
    canvas.addEventListener('touchcancel', endDraw);

    // Expose revealCard on canvas for bulk action button
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

  // --- Botanical Scroll Parallax Engine (Fluid Momentum Lerp & Flowerisblooming Dynamics) ---
  let updateParallaxFn = null;

  function initScrollParallax() {
    const parallaxItems = document.querySelectorAll('.parallax-flower');
    if (!parallaxItems.length) return;

    const itemsData = Array.from(parallaxItems).map((el, index) => {
      const speedY = parseFloat(el.getAttribute('data-speed-y')) || (0.35 + (index % 4) * 0.08);
      const driftX = parseFloat(el.getAttribute('data-drift-x')) || ((index % 2 === 0 ? 1 : -1) * (28 + (index % 3) * 10));
      const swayAmp = parseFloat(el.getAttribute('data-sway-amp')) || (18 + (index % 3) * 8);
      const swayFreq = parseFloat(el.getAttribute('data-sway-freq')) || (0.0028 + (index % 3) * 0.001);
      const baseRot = parseFloat(el.getAttribute('data-base-rot')) || 0;
      const rotAmp = parseFloat(el.getAttribute('data-rot-amp')) || (18 + (index % 3) * 5);
      const baseScale = parseFloat(el.getAttribute('data-base-scale')) || 1.0;
      const phase = index * 1.57;
      const initialTop = parseFloat(el.style.top) || 0;
      const height = el.offsetHeight || 220;

      return {
        el,
        speedY,
        driftX,
        swayAmp,
        swayFreq,
        baseRot,
        rotAmp,
        baseScale,
        phase,
        initialTop,
        height
      };
    });

    let targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    let smoothScrollY = targetScrollY;
    let isRunning = true;

    function renderParallaxFrame() {
      // Fluid Momentum Lerp (Scrub physics identical to flowerisblooming GSAP scrub)
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.085;

      const vh = window.innerHeight;
      const stageEl = document.getElementById('gift-stage');
      
      if (stageEl && !stageEl.classList.contains('hidden')) {
        const stageRect = stageEl.getBoundingClientRect();
        const stageTop = targetScrollY + stageRect.top;

        itemsData.forEach(item => {
          const elementDocY = stageTop + item.initialTop;
          // Offset relative to screen center
          const centerOffset = (smoothScrollY + vh * 0.5) - (elementDocY + item.height * 0.5);
          const normalizedProgress = centerOffset / (vh * 0.75); // -1.0 to +1.0

          // 1. Organic Vertical Depth Lag (Independent speed per layer)
          const curY = -centerOffset * item.speedY;

          // 2. Pronounced Lateral Drift + Harmonic Breeze Sway (Gliding along side margins)
          const waveSway = Math.sin(smoothScrollY * item.swayFreq + item.phase) * item.swayAmp;
          const curX = (normalizedProgress * item.driftX) + waveSway;

          // 3. Dynamic Inertial Tilt & Wobble
          const rotWobble = Math.cos(smoothScrollY * (item.swayFreq * 0.75) + item.phase) * (item.rotAmp * 0.4);
          const curRot = item.baseRot + (normalizedProgress * item.rotAmp) + rotWobble;

          // 4. Subtle Scale Breathing
          const depthScale = item.baseScale * (1 + (1 - Math.min(1, Math.abs(normalizedProgress))) * 0.05);

          // 5. Smooth Viewport Opacity Easing
          const viewTop = elementDocY + curY - smoothScrollY;
          const viewBottom = viewTop + item.height;
          let opacity = 0;

          if (viewBottom > -100 && viewTop < vh + 100) {
            const distFromTop = viewBottom + 100;
            const distFromBottom = vh + 100 - viewTop;
            const edgeDist = Math.min(distFromTop, distFromBottom);
            opacity = Math.min(1, Math.max(0, edgeDist / 140)) * 0.98;
          }

          item.el.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${curRot.toFixed(1)}deg) scale(${depthScale.toFixed(3)})`;
          item.el.style.opacity = opacity.toFixed(2);
        });
      }

      if (isRunning) {
        requestAnimationFrame(renderParallaxFrame);
      }
    }

    function onScroll() {
      targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    updateParallaxFn = () => {
      targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      smoothScrollY = targetScrollY;
    };

    // Start continuous momentum render loop
    requestAnimationFrame(renderParallaxFrame);
  }

  // Apply Configuration & Start Parallax
  applyConfig();
  initScrollParallax();
});
