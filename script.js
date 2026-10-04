/**
 * Traditional Kerala Hindu Engagement Invitation
 * Couple: Rahul Krishna R & Shyama
 * Date: 24 October 2026
 * Venue: Cherpu Panchayat Community Hall, Cherpu, Thrissur, Kerala
 * Maps: https://maps.app.goo.gl/Rez7Ggz4M6VoMRLx5
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  const music = initMusicPlayer();
  initPetalsCanvas();
  initCalendarAndSharing();
  initPhotoModal();
  initScrollAnimations();
  initEnvelope(music ? music.play : null);
});

/* ==========================================================================
   1. LIVE COUNTDOWN TIMER
   Target: 24 October 2026, 11:45:00 AM IST (UTC+5:30)
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date('2026-10-24T11:45:00+05:30').getTime();
  
  const daysEl = document.getElementById('days-num');
  const hoursEl = document.getElementById('hours-num');
  const minsEl = document.getElementById('mins-num');
  const secsEl = document.getElementById('secs-num');
  const timerTitle = document.getElementById('timer-title');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      if (timerTitle) timerTitle.textContent = 'മംഗള മുഹൂർത്തം ഇപ്പോൾ നടക്കുന്നു (Auspicious Moment Arrived)';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. TRADITIONAL INSTRUMENTAL MUSIC ENGINE
   Authentic Indian Classical Raga Mohanam Synthesis (Bansuri + Tanpura)
   + HTML5 Audio fallback for external MP3
   ========================================================================== */
function initMusicPlayer() {
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicBanner = document.getElementById('music-banner');
  const audioEl = document.getElementById('bg-audio');

  let isPlaying = false;
  let audioCtx = null;
  let synthRunning = false;
  let synthInterval = null;
  let masterGain = null;
  let activeNodes = [];

  // Traditional Raga Mohanam Frequencies (Key of C = Sa)
  const SWARAS = {
    'S3': 130.81, 'P3': 196.00, 'D3': 220.00,
    'S4': 261.63, 'R4': 293.66, 'G4': 329.63, 'P4': 392.00, 'D4': 440.00,
    'S5': 523.25, 'R5': 587.33, 'G5': 659.25, 'P5': 783.99,
    'rest': 0
  };

  // Serene Kerala Temple Flute Melody in Raga Mohanam
  const MELODY_SEQUENCE = [
    // Phrase 1: Gentle prayer opening
    { swara: 'G4', dur: 1.2 }, { swara: 'P4', dur: 0.8 }, { swara: 'D4', dur: 0.8 }, { swara: 'S5', dur: 2.0 },
    { swara: 'D4', dur: 0.8 }, { swara: 'P4', dur: 1.0 }, { swara: 'G4', dur: 1.4 }, { swara: 'R4', dur: 0.8 }, { swara: 'S4', dur: 2.4 },
    { swara: 'rest', dur: 0.6 },
    // Phrase 2: Joyful ascent
    { swara: 'S4', dur: 0.6 }, { swara: 'R4', dur: 0.6 }, { swara: 'G4', dur: 0.8 }, { swara: 'P4', dur: 1.2 },
    { swara: 'G4', dur: 0.6 }, { swara: 'R4', dur: 0.6 }, { swara: 'S4', dur: 1.6 }, { swara: 'D3', dur: 0.8 }, { swara: 'S4', dur: 2.2 },
    { swara: 'rest', dur: 0.6 },
    // Phrase 3: Auspicious high registers (Tara Sthayi)
    { swara: 'P4', dur: 0.8 }, { swara: 'D4', dur: 0.8 }, { swara: 'S5', dur: 1.0 }, { swara: 'R5', dur: 1.0 },
    { swara: 'G5', dur: 1.8 }, { swara: 'R5', dur: 0.8 }, { swara: 'S5', dur: 1.6 }, { swara: 'D4', dur: 0.8 }, { swara: 'P4', dur: 2.2 },
    { swara: 'rest', dur: 0.6 },
    // Phrase 4: Soothing resolution
    { swara: 'G4', dur: 0.8 }, { swara: 'P4', dur: 0.8 }, { swara: 'D4', dur: 0.8 }, { swara: 'P4', dur: 0.8 },
    { swara: 'G4', dur: 1.0 }, { swara: 'R4', dur: 1.0 }, { swara: 'S4', dur: 3.0 },
    { swara: 'rest', dur: 1.2 }
  ];

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Tanpura Drone (Sa - Pa - Sa' - Sa)
  function startTanpura(ctx, destination) {
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.09, ctx.currentTime);
    droneGain.connect(destination);

    // Warm Tanpura filter (soft resonant acoustic gourd sound)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(2.0, ctx.currentTime);
    filter.connect(droneGain);

    const freqs = [130.81, 131.1, 196.00, 261.63, 262.1];
    const oscs = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle LFO shimmer on drone
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.05, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.8, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();

      oscs.push(osc, lfo);
      activeNodes.push(osc, lfo, oscGain, lfoGain);
    });

    activeNodes.push(droneGain, filter);
  }

  // Soft Temple Bell / Manjira Chime
  function playTempleBell(ctx, destination) {
    if (!ctx) return;
    const now = ctx.currentTime;
    const bellOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();
    
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(1480, now);
    bellOsc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.8);

    bellGain.gain.setValueAtTime(0.05, now);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    bellOsc.connect(bellGain);
    bellGain.connect(destination);

    bellOsc.start(now);
    bellOsc.stop(now + 2.6);
  }

  // Bamboo Flute Note Player with natural breath envelope & vibrato
  function playFluteNote(ctx, destination, freq, startTime, duration) {
    if (freq <= 0) return;

    // Dual oscillator for rich woodwind body
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const fluteFilter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 2, startTime); // 1st harmonic (flute overtone)

    // Warm Lowpass Filter
    fluteFilter.type = 'lowpass';
    fluteFilter.frequency.setValueAtTime(freq * 3.5, startTime);
    fluteFilter.Q.setValueAtTime(1.5, startTime);

    // Natural Vibrato (delayed onset)
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(4.8, startTime); // ~5Hz vibrato
    vibratoGain.gain.setValueAtTime(0, startTime);
    vibratoGain.gain.setValueAtTime(0, startTime + duration * 0.25);
    vibratoGain.gain.linearRampToValueAtTime(freq * 0.015, startTime + duration * 0.6); // subtle glide
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibrato.start(startTime);
    vibrato.stop(startTime + duration);

    // Gentle Bamboo Breath Envelope
    const attack = Math.min(0.25, duration * 0.3);
    const release = Math.min(0.35, duration * 0.35);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.18, startTime + attack);
    noteGain.gain.setValueAtTime(0.16, startTime + duration - release);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Routing
    osc1.connect(fluteFilter);
    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(0.04, startTime);
    osc2.connect(harmGain);
    harmGain.connect(fluteFilter);

    fluteFilter.connect(noteGain);
    noteGain.connect(destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }

  // Schedule Flute Melody Loop
  function scheduleMelodyLoop(ctx, destination) {
    let noteIndex = 0;

    function playNextPhrase() {
      if (!synthRunning || !ctx) return;

      const now = ctx.currentTime;
      let scheduledTime = now + 0.05;

      // Play 4 notes per phrase schedule
      for (let i = 0; i < 4; i++) {
        const item = MELODY_SEQUENCE[noteIndex];
        const freq = SWARAS[item.swara] || 0;
        
        // Ring temple bell at phrase start
        if (noteIndex === 0 || noteIndex === 10 || noteIndex === 20) {
          playTempleBell(ctx, destination);
        }

        playFluteNote(ctx, destination, freq, scheduledTime, item.dur);
        scheduledTime += item.dur;

        noteIndex = (noteIndex + 1) % MELODY_SEQUENCE.length;
      }

      const phraseDuration = (scheduledTime - now) * 1000;
      synthInterval = setTimeout(playNextPhrase, phraseDuration - 100);
    }

    playNextPhrase();
  }

  function startSynthMusic() {
    const ctx = getAudioContext();
    if (!ctx) return;

    synthRunning = true;
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 1.5); // Smooth fade in

    startTanpura(ctx, masterGain);
    scheduleMelodyLoop(ctx, masterGain);
  }

  function stopSynthMusic() {
    synthRunning = false;
    if (synthInterval) clearTimeout(synthInterval);

    if (audioCtx && masterGain) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        activeNodes.forEach(node => {
          try {
            if (node.stop) node.stop();
            if (node.disconnect) node.disconnect();
          } catch (e) {}
        });
        activeNodes = [];
      }, 900);
    }
  }

  // Toggle Function
  function togglePlay() {
    if (!isPlaying) {
      let playedViaElement = false;
      if (audioEl) {
        audioEl.volume = 0.6;
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playedViaElement = true;
          playPromise.then(() => {
            isPlaying = true;
            updateMusicUI(true);
          }).catch((err) => {
            console.log('HTML5 Audio play failed, falling back to Web Audio synthesizer:', err);
            startSynthMusic();
            isPlaying = true;
            updateMusicUI(true);
          });
        }
      }

      if (!playedViaElement) {
        startSynthMusic();
        isPlaying = true;
        updateMusicUI(true);
      }
    } else {
      if (audioEl) {
        try { audioEl.pause(); } catch(e) {}
      }
      stopSynthMusic();
      isPlaying = false;
      updateMusicUI(false);
    }
  }

  function updateMusicUI(active) {
    if (active) {
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('title', 'സംഗീതം നിർത്തുക (Mute Music)');
      musicBtn.setAttribute('aria-label', 'Mute Music');
      if (musicBanner) {
        musicBanner.classList.add('hidden');
      }
    } else {
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('title', 'സംഗീതം കേൾക്കുക (Play Music)');
      musicBtn.setAttribute('aria-label', 'Play Music');
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  if (musicBanner) {
    musicBanner.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isPlaying) togglePlay();
    });
  }

  // Optional: Auto-trigger audio on first interaction if user clicks invitation anywhere
  const autoPlayTrigger = () => {
    if (!isPlaying) {
      // Don't disturb if user explicitly hasn't clicked music yet, but prime audio context
      getAudioContext();
    }
    window.removeEventListener('click', autoPlayTrigger);
    window.removeEventListener('touchstart', autoPlayTrigger);
  };
  window.addEventListener('click', autoPlayTrigger, { once: true });
  window.addEventListener('touchstart', autoPlayTrigger, { once: true });

  return {
    play: () => { if (!isPlaying) togglePlay(); },
    togglePlay: togglePlay,
    isPlaying: () => isPlaying
  };
}

/* ==========================================================================
   3. FALLING JASMINE PETALS (MULLAPPOO) CANVAS ANIMATION
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  const toggleBtn = document.getElementById('petals-toggle-btn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let petalsEnabled = true;
  const PETAL_COUNT = width < 600 ? 18 : 28;
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = 8 + Math.random() * 10;
      this.speedY = 0.6 + Math.random() * 0.9;
      this.speedX = -0.3 + Math.random() * 0.6;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.02;
      this.swingAmp = 20 + Math.random() * 30;
      this.swingFreq = 0.01 + Math.random() * 0.02;
      this.tick = Math.random() * 100;
      this.opacity = 0.5 + Math.random() * 0.45;
      this.isMarigold = Math.random() < 0.25; // occasional orange-gold marigold petal
    }

    update() {
      this.tick += this.swingFreq;
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.tick) * 0.5;
      this.angle += this.angularSpeed;

      if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;

      if (this.isMarigold) {
        // Warm Orange/Golden Petal
        const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
        grad.addColorStop(0, '#FFE066');
        grad.addColorStop(0.6, '#FF922B');
        grad.addColorStop(1, '#D9480F');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Kerala Mulla Poo (Jasmine Petal: Pure White with Ivory Edge)
        const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, this.size);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.75, '#FFFDF0');
        grad.addColorStop(1, '#F3EAC2');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.6, -this.size * 0.3, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.6, -this.size * 0.3, 0, -this.size);
        ctx.fill();

        // Tiny delicate vein
        ctx.strokeStyle = 'rgba(218, 195, 130, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.7);
        ctx.lineTo(0, this.size * 0.6);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  let animationId = null;

  function render() {
    if (!petalsEnabled) {
      ctx.clearRect(0, 0, width, height);
      return;
    }
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    animationId = requestAnimationFrame(render);
  }

  render();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      petalsEnabled = !petalsEnabled;
      toggleBtn.style.opacity = petalsEnabled ? '1' : '0.5';
      showToast(petalsEnabled ? 'പൂക്കളുടെ വർഷം ഓൺ ചെയ്തു (Petals On)' : 'പൂക്കളുടെ വർഷം ഓഫ് ചെയ്തു (Petals Off)');
      if (petalsEnabled && !animationId) {
        render();
      }
    });
  }
}

/* ==========================================================================
   4. CALENDAR (.ICS & GOOGLE) & SHARING (WHATSAPP, COPY LINK)
   ========================================================================== */
function initCalendarAndSharing() {
  const googleCalBtn = document.getElementById('btn-google-cal');
  const icsCalBtn = document.getElementById('btn-ics-cal');
  const whatsappBtn = document.getElementById('btn-whatsapp');
  const copyLinkBtn = document.getElementById('btn-copy-link');

  const eventData = {
    title: 'രാഹുൽ കൃഷ്ണ & ശ്യാമ വിവാഹനിശ്ചയം | Engagement Ceremony: Rahul Krishna & Shyama',
    description: 'We cordially invite you with family to grace the auspicious engagement ceremony of Rahul Krishna R & Shyama.\n\nDate: Saturday, 24 October 2026\nMuhurtham: 11:45 AM - 12:30 PM IST\nVenue: Cherpu Panchayat Community Hall, Cherpu, Thrissur, Kerala.\nLocation: https://maps.app.goo.gl/Rez7Ggz4M6VoMRLx5',
    location: 'Cherpu Panchayat Community Hall, Cherpu, Thrissur, Kerala',
    startISO: '20261024T061500Z', // 11:45 AM IST is 06:15 UTC
    endISO: '20261024T070000Z'    // 12:30 PM IST is 07:00 UTC
  };

  // 1. Google Calendar URL
  if (googleCalBtn) {
    googleCalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventData.startISO}/${eventData.endISO}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
      window.open(url, '_blank');
    });
  }

  // 2. Download .ICS File for Apple / Outlook / Mobile
  if (icsCalBtn) {
    icsCalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Rahul and Shyama//Engagement Invitation//ML_EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:${eventData.title}`,
        `DESCRIPTION:${eventData.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${eventData.location}`,
        `DTSTART:${eventData.startISO}`,
        `DTEND:${eventData.endISO}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Rahul_Krishna_Shyama_Engagement.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('കലണ്ടർ ഫയൽ ഡൗൺലോഡ് ചെയ്തു (.ics downloaded!)');
    });
  }

  // 3. WhatsApp Share Button
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const pageUrl = window.location.href;
      const shareMsg = `✨ *വിവാഹനിശ്ചയ ക്ഷണക്കത്ത് | Engagement Invitation* ✨\n\n` +
        `*രാഹുൽ കൃഷ്ണ ആർ & ശ്യാമ*\n` +
        `(Rahul Krishna R & Shyama)\n\n` +
        `ദൈവാനുഗ്രഹത്തോടും കുടുംബാംഗങ്ങളുടെ സ്നേഹാശിസ്സുകളോടും കൂടി നടക്കുന്ന ഞങ്ങളുടെ വിവാഹനിശ്ചയ മംഗളവേളയിലേക്ക് താങ്കളെയും കുടുംബത്തെയും സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു.\n\n` +
        `📅 *തീയതി:* 24 October 2026 (ശനിയാഴ്ച)\n` +
        `⏰ *മുഹൂർത്തം:* 11:45 AM – 12:30 PM\n` +
        `📍 *വേദി:* ചേർപ്പ് പഞ്ചായത്ത് കമ്മ്യൂണിറ്റി ഹാൾ, തൃശ്ശൂർ\n` +
        `🗺️ *ലൊക്കേഷൻ മാപ്പ്:* https://maps.app.goo.gl/Rez7Ggz4M6VoMRLx5\n\n` +
        `ഡിജിറ്റൽ ക്ഷണക്കത്ത് കാണാൻ ഈ ലിങ്ക് സന്ദർശിക്കുക:\n${pageUrl}`;

      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // 4. Copy Link Button
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('ലിങ്ക് വിജയകരമായി കോപ്പി ചെയ്തു! (Link copied!)');
        }).catch(() => {
          fallbackCopyText(url);
        });
      } else {
        fallbackCopyText(url);
      }
    });
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('ലിങ്ക് കോപ്പി ചെയ്തു! (Link copied!)');
  } catch (err) {
    showToast('ലിങ്ക് കോപ്പി ചെയ്യാൻ കഴിഞ്ഞില്ല');
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   5. PHOTO LIGHTBOX MODAL
   ========================================================================== */
function initPhotoModal() {
  const photoTrigger = document.getElementById('photo-modal-trigger');
  const modal = document.getElementById('photo-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!photoTrigger || !modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  photoTrigger.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.fade-in-up');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. INTERACTIVE ROYAL KERALA FOLDING ENVELOPE CONTROLLER
   ========================================================================== */
function initEnvelope(startMusicFn) {
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeBox = document.getElementById('envelope-box');
  const openSealBtn = document.getElementById('open-envelope-btn');
  const envelopeToggleBtn = document.getElementById('envelope-toggle-btn');

  if (!envelopeScreen || !openSealBtn) return;

  function openEnvelope() {
    if (envelopeBox.classList.contains('unfolded')) return;

    // 1. Play music seamlessly on user gesture
    if (typeof startMusicFn === 'function') {
      try {
        startMusicFn();
      } catch (err) {
        console.log('Audio autoplay error:', err);
      }
    }

    // 2. 3D Flap Unfolding Animation
    envelopeBox.classList.add('unfolded');

    // 3. Smooth transition to full invitation card
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      showToast('സ്വാഗതം! ക്ഷണക്കത്ത് തുറന്നു ✨ (Welcome!)');
    }, 750);
  }

  function refoldEnvelope() {
    envelopeScreen.classList.remove('opened');
    setTimeout(() => {
      envelopeBox.classList.remove('unfolded');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  }

  // Open on clicking the golden wax seal or the envelope itself
  openSealBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  envelopeBox.addEventListener('click', () => {
    openEnvelope();
  });

  // Re-fold envelope button in floating toolbar
  if (envelopeToggleBtn) {
    envelopeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      refoldEnvelope();
    });
  }
}
