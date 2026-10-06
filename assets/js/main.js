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
  function playPaperSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // 1. Paper rustling texture synthesis
      const bufferSize = Math.floor(ctx.sampleRate * 0.55);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.28));
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter to sculpt crisp paper friction
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2200, ctx.currentTime);
      bandpass.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.45);
      bandpass.Q.setValueAtTime(2.2, ctx.currentTime);

      // Highpass to eliminate low rumble
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(700, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.52);

      noiseSource.connect(bandpass);
      bandpass.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start();
      noiseSource.stop(ctx.currentTime + 0.55);

      // 2. Subtle wax seal unseal snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(320, ctx.currentTime);
      snapOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      snapGain.gain.setValueAtTime(0.22, ctx.currentTime);
      snapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start();
      snapOsc.stop(ctx.currentTime + 0.095);
    } catch (_) {}
  }

  function openEnvelope() {
    if (isOpeningEnvelope) return;
    isOpeningEnvelope = true;

    // 1. Play Background Music & Paper Unsealing SFX
    playAudio();
    playPaperSound();

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

    const aura = candleEl.querySelector('.flame-glow-aura');
    if (aura) {
      aura.style.opacity = '0';
      aura.style.animation = 'none';
      aura.style.display = 'none';
    }

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

      // Reset gift box
      isGiftBoxOpening = false;
      isGiftBoxOpened = false;
      if (giftboxWrapper) {
        giftboxWrapper.classList.remove('is-shaking', 'is-opened');
      }
      if (giftboxCloseImg) giftboxCloseImg.classList.remove('hidden');
      if (giftboxOpenImg) giftboxOpenImg.classList.add('hidden');

      const initialHeader = document.getElementById('giftbox-title-wrap');
      if (initialHeader) initialHeader.classList.remove('hidden');

      const floatingReveal = document.getElementById('gift-floating-reveal');
      if (floatingReveal) floatingReveal.classList.remove('hidden', 'is-revealed');

      const bottomActions = document.getElementById('giftbox-bottom-actions');
      if (bottomActions) bottomActions.classList.add('hidden');

      if (giftboxHint) {
        giftboxHint.textContent = "Sentuh kotak kado untuk membukanya";
        giftboxHint.style.opacity = "1";
        giftboxHint.style.color = "";
      }
    });
  }

  // --- Interactive Vintage Gift Box Logic ---
  const giftboxWrapper = document.getElementById('giftbox-wrapper');
  const giftboxCloseImg = document.getElementById('giftbox-close-img');
  const giftboxOpenImg = document.getElementById('giftbox-open-img');
  const giftboxTitleWrap = document.getElementById('giftbox-title-wrap');
  const giftFloatingReveal = document.getElementById('gift-floating-reveal');
  const giftboxBottomActions = document.getElementById('giftbox-bottom-actions');
  const giftboxHint = document.getElementById('giftbox-hint');

  let isGiftBoxOpening = false;
  let isGiftBoxOpened = false;

  function playBoxShakeSound(pitchMod = 1.0, volume = 0.25) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // 1. Wooden / Cardboard Low Resonance Wobble
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 * pitchMod, now);
      osc.frequency.exponentialRampToValueAtTime(65 * pitchMod, now + 0.16);

      oscGain.gain.setValueAtTime(volume * 0.9, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);

      // 2. Cardboard & String Rustle Noise Burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.18);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750 * pitchMod, now);
      filter.Q.setValueAtTime(4.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.85, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
    } catch (_) {}
  }

  function playBoxPopSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // 1. Pop whoosh
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(820, now + 0.14);

      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.21);

      // 2. Bright joyful sparkle chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.5, now + 0.05); // High C
      osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.28); // E

      gain2.gain.setValueAtTime(0.18, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.4);
    } catch (_) {}
  }

  if (giftboxWrapper) {
    giftboxWrapper.addEventListener('click', () => {
      if (isGiftBoxOpening || isGiftBoxOpened) return;
      isGiftBoxOpening = true;

      // Haptic feedback on mobile
      try {
        if (navigator && navigator.vibrate) {
          navigator.vibrate([35, 45, 35, 45, 80]);
        }
      } catch (_) {}

      // 1. Shaking vibration
      giftboxWrapper.classList.add('is-shaking');
      if (giftboxHint) {
        giftboxHint.textContent = "Membuka kado...";
        giftboxHint.style.color = "var(--gold-antique)";
      }

      // Escalating multi-pulse vibration SFX sequence
      playBoxShakeSound(0.9, 0.28);
      setTimeout(() => playBoxShakeSound(1.05, 0.32), 180);
      setTimeout(() => playBoxShakeSound(1.18, 0.36), 360);
      setTimeout(() => playBoxShakeSound(1.30, 0.40), 540);
      setTimeout(() => playBoxShakeSound(1.42, 0.45), 700);

      // 2. Open after shake finishes
      setTimeout(() => {
        giftboxWrapper.classList.remove('is-shaking');
        giftboxWrapper.classList.add('is-opened');
        isGiftBoxOpening = false;
        isGiftBoxOpened = true;

        if (giftboxCloseImg) giftboxCloseImg.classList.add('hidden');
        if (giftboxOpenImg) giftboxOpenImg.classList.remove('hidden');

        // Swap top header: hide initial, reveal floating mysterious gift title above the box
        if (giftboxTitleWrap) giftboxTitleWrap.classList.add('hidden');
        if (giftFloatingReveal) {
          giftFloatingReveal.classList.remove('hidden', 'is-revealed');
          void giftFloatingReveal.offsetWidth; // Force reflow
          giftFloatingReveal.classList.add('is-revealed');
        }

        playBoxPopSound();
        triggerBirthdayCelebration();

        // Smooth scroll to the center of the opened scene
        setTimeout(() => {
          if (giftFloatingReveal) {
            giftFloatingReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 250);
      }, 850);
    });

    giftboxWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        giftboxWrapper.click();
      }
    });
  }

  // --- Scratch-Off Polaroid Cards (Vintage Scrapbook Journal Collage) ---
  function renderPolaroids(configData) {
    const grid = document.getElementById('polaroid-grid');
    const cfg = configData || (typeof CONFIG !== 'undefined' ? CONFIG : window.CONFIG);
    if (!grid || !cfg || !cfg.polaroids) return;

    grid.innerHTML = '';

    const quotes = [
      "it's up to you how far you'll go.",
      "sometime ever, sometime never.",
      "every little moment with you.",
      "still cute tho. unfortunately :3"
    ];

    const memoNotes = [
      {
        quote: "Sometime ever, <br><em>sometime never.</em>",
        subquote: "Don't be afraid to be unique.",
        tapeColor: "washi-tape-dark"
      },
      {
        quote: "You are my favourite <br><em>chapter in every story.</em>",
        subquote: "Always cherish you, always. ♡",
        tapeColor: "washi-tape-sage"
      }
    ];

    const driedFlowers = [
      { primary: "assets/images/flowersfull/blossom-7.webp", secondary: "assets/images/flowersfull/toss-pansy.webp" },
      { primary: "assets/images/flowersfull/blossom-9.webp", secondary: "assets/images/flowersfull/toss-fern.webp" }
    ];

    const items = cfg.polaroids;
    for (let s = 0; s < items.length; s += 2) {
      const spreadIdx = Math.floor(s / 2);
      const spread = document.createElement('div');
      spread.className = `scrapbook-spread spread-${spreadIdx + 1}`;

      const memo = memoNotes[spreadIdx % memoNotes.length];
      const flower = driedFlowers[spreadIdx % driedFlowers.length];

      spread.innerHTML = `
        <!-- Vintage Scrapbook Background Card (torn parchment with stamps & flowers) -->
        <div class="scrapbook-card-backdrop" aria-hidden="true">
          <img src="assets/images/scratchbg.png" alt="Vintage Scrapbook Paper" class="scrapbook-backdrop-img">
        </div>

        <!-- Newspaper print clipping collage layer -->
        <div class="scrapbook-newsprint-clipping" aria-hidden="true">
          <div class="newsprint-inner">
            <div class="newsprint-headline">THE DAILY CHRONICLE</div>
            <div class="newsprint-subhead">SARDAR PATEL VISITS STATES TO ABSORB REF...</div>
            <div class="newsprint-columns">
              <p>Addressing a meeting of representatives today, Sardar Patel emphasized the importance of peace and unity across all territories...</p>
              <p>Special moments captured in vintage frames, preserving memories that never fade with time...</p>
            </div>
          </div>
        </div>

        <!-- Torn paper memo note -->
        <div class="scrapbook-memo-card" aria-hidden="true">
          <div class="scrapbook-washi-tape washi-tape-top ${memo.tapeColor}"></div>
          <div class="memo-handwriting-quote">${memo.quote}</div>
          <div class="memo-handwriting-sub">${memo.subquote}</div>
          <div class="memo-seal-stamp">
            <svg viewBox="0 0 40 40" width="24" height="24">
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
              <path d="M14,24 Q20,12 26,24 M20,14 L20,27" fill="none" stroke="currentColor" stroke-width="1.2"/>
            </svg>
          </div>
        </div>

        <!-- Pressed dried botanical bouquet -->
        <div class="scrapbook-dried-botanicals" aria-hidden="true">
          <img src="${flower.primary}" alt="Pressed Daisy" class="dried-flower-img flower-primary">
          <img src="${flower.secondary}" alt="Pressed Leaf" class="dried-flower-img flower-secondary">
        </div>

        <!-- Polaroid Cards Container in Spread -->
        <div class="scrapbook-polaroid-pair"></div>

        <!-- Torn paper bottom corner accent -->
        <div class="scrapbook-torn-corner" aria-hidden="true"></div>
      `;

      const pairContainer = spread.querySelector('.scrapbook-polaroid-pair');

      for (let i = s; i < Math.min(s + 2, items.length); i++) {
        const item = items[i];
        const isSecond = (i % 2 === 1);
        const card = document.createElement('div');
        card.className = `polaroid-item scrapbook-polaroid ${isSecond ? 'polaroid-front' : 'polaroid-back'}`;
        card.style.setProperty('--rot', item.rotation || (isSecond ? '3.5deg' : '-4.5deg'));

        const washiPos = isSecond ? 'washi-corner-bottom-left' : 'washi-corner-top-right';
        const washiColor = isSecond ? 'washi-sage' : 'washi-kraft';
        const quoteText = quotes[i % quotes.length];

        card.innerHTML = `
          <div class="scrapbook-washi-tape ${washiPos} ${washiColor}" aria-hidden="true"></div>
          <div class="polaroid-img-box" id="box-${item.id}">
            <img src="${item.image}" alt="${item.title}" class="polaroid-photo-img" loading="lazy">
            <canvas class="scratch-canvas" id="canvas-${item.id}"></canvas>
          </div>
          <div class="polaroid-handwritten-chin">
            <span class="chin-quote">${quoteText}</span>
          </div>
        `;

        pairContainer.appendChild(card);

        const canvas = card.querySelector('.scratch-canvas');
        const imgBox = card.querySelector('.polaroid-img-box');

        initScratchCard(canvas, imgBox, item, card);
      }

      grid.appendChild(spread);
    }
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

      // Vintage Antique Warm Rosy-Gold Matte Foil
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#d8bba7');
      grad.addColorStop(0.28, '#ebd6c7');
      grad.addColorStop(0.55, '#caad99');
      grad.addColorStop(0.82, '#e3cdbe');
      grad.addColorStop(1, '#bc9986');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Outer delicate vintage border
      ctx.strokeStyle = 'rgba(95, 60, 42, 0.42)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Inner dashed vintage border
      ctx.strokeStyle = 'rgba(95, 60, 42, 0.22)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(15, 15, width - 30, height - 30);
      ctx.setLineDash([]);

      // Corner ornamental brackets (Vintage album photo corners)
      const cSize = 10;
      ctx.strokeStyle = 'rgba(95, 60, 42, 0.5)';
      ctx.lineWidth = 1.4;
      
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(18, 18 + cSize); ctx.lineTo(18, 18); ctx.lineTo(18 + cSize, 18);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(width - 18 - cSize, 18); ctx.lineTo(width - 18, 18); ctx.lineTo(width - 18, 18 + cSize);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(18, height - 18 - cSize); ctx.lineTo(18, height - 18); ctx.lineTo(18 + cSize, height - 18);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(width - 18 - cSize, height - 18); ctx.lineTo(width - 18, height - 18); ctx.lineTo(width - 18, height - 18 - cSize);
      ctx.stroke();

      // Vintage Letterpress Typography & Filigree (No Emotes)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 1. Top Small-Caps Kicker
      ctx.fillStyle = '#6b4735';
      ctx.font = '600 8.5px "Playfair Display", Georgia, serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('UNTOLD MOMENT', width / 2, height / 2 - 28);

      // 2. Vintage Divider Lines & Diamond
      const lineY = height / 2 - 16;
      ctx.strokeStyle = 'rgba(107, 71, 53, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 36, lineY);
      ctx.lineTo(width / 2 - 8, lineY);
      ctx.moveTo(width / 2 + 8, lineY);
      ctx.lineTo(width / 2 + 36, lineY);
      ctx.stroke();

      ctx.fillStyle = '#8a5940';
      ctx.beginPath();
      ctx.moveTo(width / 2, lineY - 3);
      ctx.lineTo(width / 2 + 3, lineY);
      ctx.lineTo(width / 2, lineY + 3);
      ctx.lineTo(width / 2 - 3, lineY);
      ctx.fill();

      // 3. Main Calligraphic Script Title
      ctx.fillStyle = '#3a2013';
      ctx.font = 'italic 26px "Alex Brush", "Dancing Script", cursive';
      ctx.fillText('Usap Foto', width / 2, height / 2 + 6);

      // 4. Sub-caption in classic serif
      ctx.fillStyle = '#6b4735';
      ctx.font = 'italic 11.5px "Cormorant Garamond", Georgia, serif';
      ctx.letterSpacing = '0.5px';
      ctx.fillText('Sentuh untuk melihat cerita', width / 2, height / 2 + 28);

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

  // --- Botanical Scroll Parallax Engine (Fluid Momentum Lerp & Flowerisblooming Dynamics) ---
  let updateParallaxFn = null;

  function initScrollParallax() {
    const parallaxItems = document.querySelectorAll('.parallax-flower');
    const scrapbookSpreads = document.querySelectorAll('.scrapbook-spread');

    // 1. Intersection Observer for Parallax Reveal
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      scrapbookSpreads.forEach(spread => revealObserver.observe(spread));
    } else {
      scrapbookSpreads.forEach(spread => spread.classList.add('is-revealed'));
    }

    // 2. Interactive 3D Cursor Tilt for Scrapbook Spreads (Desktop)
    scrapbookSpreads.forEach(spread => {
      let bounds = null;

      spread.addEventListener('mouseenter', () => {
        bounds = spread.getBoundingClientRect();
      });

      spread.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = spread.getBoundingClientRect();
        const x = (e.clientX - bounds.left) / bounds.width - 0.5;
        const y = (e.clientY - bounds.top) / bounds.height - 0.5;

        const pFront = spread.querySelector('.polaroid-front');
        const pBack = spread.querySelector('.polaroid-back');
        const memo = spread.querySelector('.scrapbook-memo-card');

        if (pFront) pFront.style.transform = `rotate(calc(var(--rot, 3.5deg) + ${x * 4}deg)) translate3d(${x * 12}px, ${y * 12}px, 20px)`;
        if (pBack) pBack.style.transform = `rotate(calc(var(--rot, -4deg) + ${x * -3}deg)) translate3d(${x * -8}px, ${y * -8}px, 5px)`;
        if (memo) memo.style.transform = `rotate(calc(2.5deg + ${x * 2}deg)) translate3d(${x * 6}px, ${y * 6}px, 10px)`;
      });

      spread.addEventListener('mouseleave', () => {
        const pFront = spread.querySelector('.polaroid-front');
        const pBack = spread.querySelector('.polaroid-back');
        const memo = spread.querySelector('.scrapbook-memo-card');

        if (pFront) pFront.style.transform = `rotate(var(--rot, 3.5deg)) translate3d(0, 0, 0)`;
        if (pBack) pBack.style.transform = `rotate(var(--rot, -4deg)) translate3d(0, 0, 0)`;
        if (memo) memo.style.transform = `rotate(2.5deg) translate3d(0, 0, 0)`;
        bounds = null;
      });
    });

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
      // Fluid Momentum Lerp
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.085;

      const vh = window.innerHeight;
      const stageEl = document.getElementById('gift-stage');
      
      if (stageEl && !stageEl.classList.contains('hidden')) {
        const stageRect = stageEl.getBoundingClientRect();
        const stageTop = targetScrollY + stageRect.top;

        // 1. Botanical Margin Parallax
        itemsData.forEach(item => {
          const elementDocY = stageTop + item.initialTop;
          const centerOffset = (smoothScrollY + vh * 0.5) - (elementDocY + item.height * 0.5);
          const normalizedProgress = centerOffset / (vh * 0.75);

          const curY = -centerOffset * item.speedY;
          const waveSway = Math.sin(smoothScrollY * item.swayFreq + item.phase) * item.swayAmp;
          const curX = (normalizedProgress * item.driftX) + waveSway;
          const rotWobble = Math.cos(smoothScrollY * (item.swayFreq * 0.75) + item.phase) * (item.rotAmp * 0.4);
          const curRot = item.baseRot + (normalizedProgress * item.rotAmp) + rotWobble;
          const depthScale = item.baseScale * (1 + (1 - Math.min(1, Math.abs(normalizedProgress))) * 0.05);

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

        // 2. Scrapbook Multi-Plane Parallax Depth
        scrapbookSpreads.forEach(spread => {
          if (!spread.classList.contains('is-revealed')) return;
          const rect = spread.getBoundingClientRect();
          const spreadCenter = rect.top + rect.height * 0.5;
          const distFromCenter = (spreadCenter - vh * 0.5) / (vh * 0.6); // -1.0 to 1.0

          const pBack = spread.querySelector('.polaroid-back');
          const pFront = spread.querySelector('.polaroid-front');
          const memo = spread.querySelector('.scrapbook-memo-card');
          const flowers = spread.querySelector('.scrapbook-dried-botanicals');
          const news = spread.querySelector('.scrapbook-newsprint-clipping');

          if (pBack) {
            const y = distFromCenter * 18;
            const rot = distFromCenter * -1.5;
            pBack.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(calc(var(--rot, -4deg) + ${rot.toFixed(1)}deg))`;
          }
          if (pFront) {
            const y = distFromCenter * -22;
            const rot = distFromCenter * 2.0;
            pFront.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(calc(var(--rot, 3.5deg) + ${rot.toFixed(1)}deg))`;
          }
          if (memo) {
            const y = distFromCenter * 14;
            memo.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(2.5deg)`;
          }
          if (flowers) {
            const y = distFromCenter * -15;
            flowers.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
          }
          if (news) {
            const y = distFromCenter * 8;
            news.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(-3deg)`;
          }
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

    requestAnimationFrame(renderParallaxFrame);
  }

  // Apply Configuration & Start Parallax
  applyConfig();
  initScrollParallax();
});
