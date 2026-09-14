/* ═══════════════════════════════════════════════════════════
   LDR LOVE STORY — main.js
   Semua interaksi, animasi, canvas, dan alur cerita
   (Edisi ikon PNG lokal dari assets/icon)
═══════════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════════════════════════════
   ✏️ PANEL KUSTOMISASI. Semua pengaturan ada di sini.
══════════════════════════════════════════════════════════ */
const CONFIG = {
  couple: {
    namaKamu: 'Nama Kamu',        // nama kamu (penerima)
    namaPasangan: 'Sayang',       // nama panggilan pasangan (penampil di video call)
  },
  kota: {
    asal: 'Indonesia',              // kotamu
    tujuan: 'Taiwan',           // kota pasangan
    jarakKm: 1000,                 // jarak antar kota
  },
  introText: 'Untuk Kamu yang Jauh',
  chatConversation: [
    { who: 'them', text: 'Kamu sudah lihat pesannya?' },
    { who: 'me',   text: 'Sudah. Aku baca sampai habis' },
    { who: 'them', text: 'Jarak boleh jauh, tapi kamu selalu dekat di sini' },
    { who: 'me',   text: 'Aku juga merindukanmu, setiap hari' },
    { who: 'them', text: 'Tunggu aku ya. Tidak lama lagi kita bertemu' },
  ],
  gallery: [
    { src: 'assets/images/foto1.jpg', caption: 'Pertama bertemu',    rotate: -4 },
    { src: 'assets/images/foto2.jpg', caption: 'Tawa pertama kita',  rotate: 3 },
    { src: 'assets/images/foto3.jpg', caption: 'Janji kecil kita',   rotate: -2 },
    { src: 'assets/images/foto4.jpg', caption: 'Kota yang kita rindu', rotate: 4 },
    { src: 'assets/images/foto5.jpg', caption: 'Kabar tengah malam', rotate: -3 },
    { src: 'assets/images/foto6.jpg', caption: 'Sampai bertemu lagi', rotate: 2 },
  ],
  micBlow: false,   // ubah jadi true untuk meniup lilin dengan mikrofon
};

/* ── STATE ───────────────────────────────────────────────── */
const state = {
  currentScene: 'scene-intro',
  candlesBlown: false,
  giftOpened: false,
  vcallStarted: false,
  vcallTimer: null,
  planeAnimated: false,
};

const SCENE_ORDER = [
  'scene-intro', 'scene-journey', 'scene-letters', 'scene-candle',
  'scene-vcall', 'scene-gallery', 'scene-package', 'scene-finale',
];

/* ── HELPERS ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectNames();
  initIconFallback();
  initAvatars();
  initTypewriter();
  initSceneNav();
  initButtons();
  initJourney();
  initCandles();
  initVCall();
  initGallery();
  initGiftBox();
  initInteractiveStars();
  initCursorSparkle();
  initKeyboard();
  initMusic();
  updateProgress();
});

/* ── FALLBACK IKON (aman kalau ada file yang kurang) ───── */
function initIconFallback() {
  document.querySelectorAll('img.ico').forEach(im => {
    im.addEventListener('error', () => { im.style.display = 'none'; });
  });
}

/* ── AVATAR VIDEO CALL (foto, fallback inisial) ────────── */
function initAvatars() {
  const mainImg = $('avatar-img'), miniImg = $('avatar-mini-img');
  if (mainImg) mainImg.addEventListener('error', () => mainImg.remove());
  if (miniImg) miniImg.addEventListener('error', () => miniImg.remove());
}

/* ── INJECT NAMA & KOTA ──────────────────────────────────── */
function injectNames() {
  const c = CONFIG.couple, k = CONFIG.kota;
  const txt = (id, v) => { const el = $(id); if (el && v) el.textContent = v; };

  txt('msg-name', c.namaKamu);
  txt('call-name', c.namaPasangan);
  txt('journey-city-a', k.asal);
  txt('journey-city-b', k.tujuan);
  txt('journey-distance', k.jarakKm);
  txt('city-a-label', k.asal);
  txt('city-b-label', k.tujuan);
  txt('plate-city-a', k.asal);
  txt('plate-city-b', k.tujuan);
  txt('ticket-route', `${k.asal} → ${k.tujuan}`);

  const ai = $('avatar-initial');
  if (ai) ai.textContent = (c.namaPasangan.charAt(0) || 'S').toUpperCase();
  const mi = $('avatar-mini-initial');
  if (mi) mi.textContent = (c.namaKamu.charAt(0) || 'A').toUpperCase();
}

/* ── MUSIK ───────────────────────────────────────────────── */
const audio = new Audio('assets/music/song.mp3');
audio.loop = true;
audio.volume = 0.7;

function initMusic() { on($('music-btn'), 'click', toggleMusic); }

function toggleMusic() {
  const btn = $('music-btn');
  if (!btn) return;
  if (btn.classList.contains('muted')) {
    audio.currentTime = 0; audio.play();
    btn.classList.remove('muted');
  } else {
    audio.pause();
    btn.classList.add('muted');
  }
}

function showMusicButton() {
  const btn = $('music-btn');
  if (!btn) return;
  btn.classList.add('show');
  audio.play().catch(() => {});
}

/* ── TYPEWRITER ──────────────────────────────────────────── */
function initTypewriter() {
  const el = $('typewriter-text');
  const text = CONFIG.introText;
  let i = 0;

  const cursor = document.createElement('span');
  cursor.style.cssText = 'display:inline-block;width:3px;height:.9em;background:currentColor;margin-left:3px;vertical-align:middle;animation:blink 1s step-end infinite';
  const style = document.createElement('style');
  style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
  document.head.appendChild(style);

  function type() {
    if (i <= text.length) {
      if (el) el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 600 : 85);
    } else if (el) {
      el.appendChild(cursor);
    }
  }
  setTimeout(type, 1200);
}

/* ── NAVIGASI SCENE ──────────────────────────────────────── */
function goToScene(targetId) {
  const current = document.querySelector('.scene.active');
  const target = $(targetId);
  if (!target || state.currentScene === targetId) return;

  document.querySelectorAll('.nav-dot').forEach(dot =>
    dot.classList.toggle('active', dot.dataset.scene === targetId));

  if (current) {
    current.classList.add('exit');
    setTimeout(() => current.classList.remove('active', 'exit'), 600);
  }
  setTimeout(() => {
    target.classList.add('active');
    state.currentScene = targetId;
    updateProgress();
    onSceneEnter(targetId);
  }, 280);
}

function updateProgress() {
  const idx = SCENE_ORDER.indexOf(state.currentScene);
  const pct = ((idx + 1) / SCENE_ORDER.length) * 100;
  const bar = $('progress-fill');
  if (bar) bar.style.width = pct + '%';
}

function initSceneNav() {
  document.querySelectorAll('.nav-dot').forEach(dot =>
    on(dot, 'click', () => goToScene(dot.dataset.scene)));
}

function onSceneEnter(sceneId) {
  if (sceneId === 'scene-journey' && !state.planeAnimated) {
    state.planeAnimated = true;
    setTimeout(startPlane, 600);
  }
  if (sceneId === 'scene-vcall' && !state.vcallStarted) startVCall();
  if (sceneId === 'scene-finale') {
    startFireworks(); startConfetti();
    setTimeout(stopFireworks, 6000);
    setTimeout(stopConfetti, 7000);
  }
}

/* ── TOMBOL-TOMBOL ───────────────────────────────────────── */
function initButtons() {
  on($('btn-open-envelope'), 'click', () => { goToScene('scene-journey'); });
  on($('btn-to-letters'),   'click', () => goToScene('scene-letters'));
  on($('btn-to-candle'),    'click', () => { showMusicButton(); goToScene('scene-candle'); });
  on($('btn-to-gallery'),   'click', () => goToScene('scene-gallery'));
  on($('btn-to-package'),   'click', () => goToScene('scene-package'));
  on($('btn-to-finale'),    'click', () => goToScene('scene-finale'));

  on($('btn-restart'), 'click', () => {
    stopFireworks();
    state.candlesBlown = false;
    state.giftOpened = false;
    state.planeAnimated = false;

    // kembalikan lilin
    document.querySelectorAll('.candle-flame').forEach(f => {
      f.style.display = ''; f.style.opacity = '';
      f.style.transform = ''; f.style.transition = '';
    });
    document.querySelectorAll('.smoke-group').forEach(g => {
      g.classList.remove('running');
      g.style.opacity = '0';
    });
    const warm = $('warm-glow');
    if (warm) warm.style.opacity = '0';

    // kembalikan kado
    const giftSvg = $('gift-svg'), giftReveal = $('gift-reveal'), giftLid = $('gift-lid');
    if (giftSvg) { giftSvg.style.display = ''; giftSvg.style.transform = ''; giftSvg.getAnimations().forEach(a => a.cancel()); }
    if (giftReveal) giftReveal.style.display = 'none';
    if (giftLid) giftLid.style.cssText = '';

    // reset peta
    const planeG = $('plane-group');
    if (planeG) planeG.style.opacity = '0';

    // reset tombol mikrofon
    const mute = $('cb-mute');
    if (mute) mute.classList.remove('off');

    // reset video call
    resetVCall();

    goToScene('scene-intro');
  });
}

/* ── PETA PERJALANAN ─────────────────────────────────────── */
function initJourney() {
  const planeG = $('plane-group');
  if (planeG) planeG.style.opacity = '0';
}

function startPlane() {
  const path = $('flight-path');
  const plane = $('plane');
  const group = $('plane-group');
  if (!path || !plane || !group) return;

  const len = path.getTotalLength();
  let start = null;
  const DUR = 3600;
  group.style.opacity = '1';

  function step(ts) {
    if (!start) start = ts;
    const p = Math.min(1, (ts - start) / DUR);
    const ease = p < .5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    const pt = path.getPointAtLength(ease * len);
    const pt2 = path.getPointAtLength(Math.min(len, ease * len + 1));
    const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
    // image 30x30 → geser setengah ukuran agar pusatnya pas di jalur
    plane.setAttribute('transform', `translate(${pt.x - 15},${pt.y - 15}) rotate(${angle} 15 15)`);
    if (p < 1) requestAnimationFrame(step);
    else {
      spawnClickBurstFromEl(plane, 18);
      startConfetti();
      setTimeout(stopConfetti, 3500);
    }
  }
  requestAnimationFrame(step);
}

function spawnClickBurstFromEl(el, count = 14) {
  const r = el.getBoundingClientRect();
  spawnClickBurst(r.left + r.width / 2, r.top + r.height / 2, count);
}

/* ── LILIN (TIUP BERSAMA) ────────────────────────────────── */
function initCandles() {
  on($('candle-stage'), 'click', () => { if (!state.candlesBlown) blowCandles(); });
  on($('btn-blow'), 'click', e => {
    e.stopPropagation();
    if (!state.candlesBlown) blowCandles();
  });
  if (CONFIG.micBlow) { enableMicBlow(); }
}

function blowCandles() {
  state.candlesBlown = true;
  const flames = document.querySelectorAll('.candle-flame');

  flames.forEach((f, i) => {
    setTimeout(() => {
      f.style.transition = 'all .35s ease';
      f.style.transform = 'scaleX(2.5) scaleY(0) translateY(6px)';
      f.style.opacity = '0';
      spawnClickBurstFromEl(f, 8);
      setTimeout(() => { f.style.display = 'none'; }, 360);

      const smoke = $('sg' + (i + 1));
      if (smoke) { smoke.style.opacity = '1'; smoke.classList.add('running'); }
    }, i * 220);
  });

  const delay = flames.length * 220 + 400;
  setTimeout(() => {
    const warm = $('warm-glow');
    if (warm) { warm.style.transition = 'opacity 1.2s ease'; warm.style.opacity = '1'; }

    const svg = $('candle-svg');
    if (svg) {
      svg.animate([
        { transform: 'rotate(-3deg) scale(1.05)' },
        { transform: 'rotate(3deg) scale(.97)' },
        { transform: 'rotate(-1deg) scale(1.03)' },
        { transform: 'rotate(0deg) scale(1)' },
      ], { duration: 500, fill: 'forwards' });
    }

    startFireworks(); startConfetti();
    setTimeout(() => {
      goToScene('scene-vcall');
      setTimeout(stopFireworks, 7000);
      setTimeout(stopConfetti, 8000);
    }, 1600);
  }, delay);
}

/* meniup dengan mikrofon (opsional) */
function enableMicBlow() {
  if (!navigator.mediaDevices || !window.AudioContext) return;
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let cool = false;
      (function listen() {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const vol = sum / data.length;
        if (vol > 60 && !cool && state.currentScene === 'scene-candle' && !state.candlesBlown) {
          cool = true;
          blowCandles();
          setTimeout(() => { cool = false; }, 4000);
        }
        requestAnimationFrame(listen);
      })();
    })
    .catch(() => {});
}

/* ── VIDEO CALL ──────────────────────────────────────────── */
function initVCall() {
  on($('cb-heart'), 'click', () => { spawnCallHeart(); spawnCallHeart(); spawnCallHeart(); });
  on($('cb-end'), 'click', () => goToScene('scene-gallery'));
  on($('cb-mute'), 'click', e => e.currentTarget.classList.toggle('off'));
}

function startVCall() {
  state.vcallStarted = true;
  const status = $('call-status');
  const wave = $('sound-wave');
  const avatarImg = $('avatar-img');

  setTimeout(() => {
    if (status) status.textContent = 'tersambung';
    if (wave) wave.classList.add('on');
    if (avatarImg) avatarImg.classList.add('connected');
    startCallTimer();
    playChatSequence();
  }, 2600);
}

function resetVCall() {
  if (state.vcallTimer) { clearInterval(state.vcallTimer); state.vcallTimer = null; }
  state.vcallStarted = false;

  const cta = $('btn-to-gallery');
  const feed = $('chat-feed');

  // kembalikan tombol ke posisi semula (setelah chat-feed) sebelum feed dikosongkan
  if (cta && feed && feed.contains(cta)) {
    feed.parentNode.insertBefore(cta, feed.nextSibling);
  }
  if (cta) cta.classList.remove('show');

  const timer = $('call-timer');
  if (timer) timer.textContent = '00:00';
  const status = $('call-status');
  if (status) status.textContent = 'memanggil…';
  const wave = $('sound-wave');
  if (wave) wave.classList.remove('on');
  const avatarImg = $('avatar-img');
  if (avatarImg) avatarImg.classList.remove('connected');
  if (feed) feed.innerHTML = '';
  const hearts = $('call-hearts');
  if (hearts) hearts.innerHTML = '';
}

function startCallTimer() {
  let sec = 0;
  const timer = $('call-timer');
  if (!timer) return;
  state.vcallTimer = setInterval(() => {
    sec++;
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    timer.textContent = `${m}:${s}`;
  }, 1000);
}

function spawnCallHeart() {
  const layer = $('call-hearts');
  if (!layer) return;
  const h = document.createElement('img');
  h.className = 'fly-heart';
  h.alt = '';
  h.src = Math.random() > .5 ? 'assets/icon/hati-pink.png' : 'assets/icon/hati.png';
  h.addEventListener('error', () => {
    if (h.dataset.fb !== '1') { h.dataset.fb = '1'; h.src = 'assets/icon/hati.png'; }
    else h.remove();
  });
  h.style.left = (40 + Math.random() * 30) + '%';
  h.style.setProperty('--fx', ((Math.random() - .5) * 60) + 'px');
  h.style.animationDelay = (Math.random() * .3) + 's';
  layer.appendChild(h);
  setTimeout(() => h.remove(), 2600);
}

function playChatSequence() {
const feed = $('chat-feed');
if (!feed) return;
feed.innerHTML = '';

const cta = $('btn-to-gallery');
if (cta) cta.classList.remove('show');

let delay = 600;
CONFIG.chatConversation.forEach((msg, index) => {
  delay += 900;
  setTimeout(() => {
    if (state.currentScene !== 'scene-vcall') return;
    const row = document.createElement('div');
    row.className = 'chat-row ' + msg.who;
    row.innerHTML = '<div class="chat-bubble"><span class="typing-dots"><i></i><i></i><i></i></span></div>';
    feed.appendChild(row);
    feed.scrollTop = feed.scrollHeight;

    setTimeout(() => {
      row.querySelector('.chat-bubble').textContent = msg.text;
      if (msg.who === 'them') spawnCallHeart();
      feed.scrollTop = feed.scrollHeight;

      // mulai dari chat ke-4 sampai terakhir yang di-scroll dengan benar
      if (index >= 3) {
        scrollCallToBottom();
      }
    }, 750);
  }, delay);
  delay += 800;
});

// semua chat selesai -> pindahkan tombol ke dalam chat-feed (supaya di bawah chat terakhir) lalu tampilkan
setTimeout(() => {
  if (state.currentScene !== 'scene-vcall') return;
  if (cta) {
    feed.appendChild(cta);          // pindah ke dalam feed → otomatis di bawah pesan terakhir
    cta.classList.add('show');
  }
  scrollCallToBottom();
}, delay + 900);
}

function scrollCallToBottom() {
  const calon = [document.querySelector('.vcall-scene'), $('scene-vcall')];
  for (const el of calon) {
    if (el && el.scrollHeight > el.clientHeight) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      return;
    }
  }
}

/* ── GALERI ──────────────────────────────────────────────── */
function initGallery() {
  const grid = $('polaroid-grid');
  if (!grid) return;

  CONFIG.gallery.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    card.style.setProperty('--rotate', item.rotate + 'deg');
    card.style.animationDelay = (i * .12) + 's';

    const img = document.createElement('img');
    img.className = 'polaroid-img';
    img.src = item.src;
    img.alt = item.caption;
    img.loading = 'lazy';
    img.onerror = () => {
      const ph = document.createElement('div');
      ph.className = 'polaroid-ph';
      const ic = document.createElement('img');
      ic.src = 'assets/icon/surat-cinta.png';
      ic.alt = '';
      ic.addEventListener('error', () => ic.remove());
      ph.appendChild(ic);
      img.replaceWith(ph);
    };
    card.appendChild(img);

    const cap = document.createElement('div');
    cap.className = 'polaroid-caption';
    cap.textContent = item.caption;
    card.appendChild(cap);

    let zoomed = false;
    on(card, 'click', () => {
      zoomed = !zoomed;
      card.style.transform = zoomed
        ? 'rotate(0deg) scale(1.9) translateY(-20px)'
        : `rotate(${item.rotate}deg) scale(1)`;
      card.style.zIndex = zoomed ? '100' : '';
    });

    grid.appendChild(card);
  });
}

/* ── PAKET RINDU ─────────────────────────────────────────── */
function initGiftBox() {
  on($('gift-svg'), 'click', () => { if (!state.giftOpened) openGift(); });
}

function openGift() {
  state.giftOpened = true;
  const giftSvg = $('gift-svg');
  const giftReveal = $('gift-reveal');
  const giftLid = $('gift-lid');

  if (giftLid) {
    giftLid.style.transition = 'all .75s cubic-bezier(.34,1.56,.64,1)';
    giftLid.style.transform = 'rotate(-35deg) translateY(-160px) translateX(60px)';
    giftLid.style.opacity = '0';
  }
  if (giftSvg) {
    giftSvg.animate([
      { transform: 'rotate(-6deg) scale(1.08)' },
      { transform: 'rotate(6deg) scale(.96)' },
      { transform: 'rotate(-3deg) scale(1.04)' },
      { transform: 'rotate(0deg) scale(1)' },
    ], { duration: 600, delay: 150, fill: 'forwards' });
  }
  setTimeout(() => {
    if (giftSvg) giftSvg.style.display = 'none';
    if (giftReveal) giftReveal.style.display = 'flex';
    startConfetti();
    setTimeout(stopConfetti, 5000);
  }, 700);
}

/* ── BINTANG INTERAKTIF ──────────────────────────────────── */
function initInteractiveStars() {
  const popup = $('wish-popup');
  let timer = null;

  document.querySelectorAll('.i-star').forEach(star => {
    on(star, 'click', () => {
      star.classList.remove('clicked');
      void star.offsetWidth;
      star.classList.add('clicked');

      if (popup) {
        popup.textContent = star.dataset.msg;
        popup.classList.add('show');
        clearTimeout(timer);
        timer = setTimeout(() => popup.classList.remove('show'), 2400);
      }
      spawnClickBurstFromEl(star, 20);
    });
  });
}

/* ── CURSOR SPARKLE ──────────────────────────────────────── */
function initCursorSparkle() {
  const canvas = $('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; });

  const sparkles = [];
  const COLORS = ['#FF6B9D', '#A78BFA', '#FFE66D', '#A8E6CF', '#FFB347', '#74B9FF'];

  document.addEventListener('mousemove', e => {
    if (Math.random() > .4) return;
    for (let i = 0; i < 2; i++) {
      sparkles.push({
        x: e.clientX + (Math.random() - .5) * 20,
        y: e.clientY + (Math.random() - .5) * 20,
        vx: (Math.random() - .5) * 2,
        vy: -1 - Math.random() * 2,
        alpha: 1,
        decay: .025 + Math.random() * .02,
        radius: 2 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  });

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.x += s.vx; s.y += s.vy; s.vy += .05; s.alpha -= s.decay;
      if (s.alpha <= 0) { sparkles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  })();
}

/* ── CLICK BURST ─────────────────────────────────────────── */
function spawnClickBurst(cx, cy, count = 15) {
  const layer = $('confetti-layer');
  if (!layer) return;
  const COLORS = ['#FF6B9D', '#A78BFA', '#FFE66D', '#A8E6CF', '#FFB347'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${5 + Math.random() * 8}px;height:${5 + Math.random() * 8}px;border-radius:${Math.random() > .5 ? '50%' : '3px'};background:${COLORS[Math.floor(Math.random() * COLORS.length)]};pointer-events:none;animation:burst-fly .8s ease-out forwards;--dx:${(Math.random() - .5) * 150}px;--dy:${(Math.random() - 1.2) * 150}px;`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 900);
  }

  if (!document.getElementById('burst-style')) {
    const s = document.createElement('style');
    s.id = 'burst-style';
    s.textContent = '@keyframes burst-fly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}';
    document.head.appendChild(s);
  }
}

document.addEventListener('click', e => {
  if (['BUTTON', 'INPUT', 'LABEL'].includes(e.target.tagName)) return;
  if (e.target.closest && e.target.closest('button')) return;
  spawnClickBurst(e.clientX, e.clientY, 8);
});

/* ── CONFETTI ────────────────────────────────────────────── */
const CONF_COLORS = ['#FF6B9D', '#A78BFA', '#FFE66D', '#A8E6CF', '#FFB347', '#74B9FF', '#FF8C94', '#C4B5FD'];
let confInterval = null;

function startConfetti() {
  const layer = $('confetti-layer');
  if (!layer || confInterval) return;
  confInterval = setInterval(() => {
    for (let i = 0; i < 7; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.width = `${6 + Math.random() * 10}px`;
      piece.style.height = `${6 + Math.random() * 10}px`;
      piece.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
      piece.style.background = CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)];
      piece.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
      piece.style.animationDelay = `${Math.random() * .4}s`;
      layer.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
    }
  }, 100);
}

function stopConfetti() {
  if (confInterval) { clearInterval(confInterval); confInterval = null; }
}

/* ── FIREWORKS ───────────────────────────────────────────── */
const fwCanvas = $('fireworks-canvas');
const fwCtx = fwCanvas ? fwCanvas.getContext('2d') : null;
let fwFrame = null, fwList = [], ptList = [];
const FW_COLORS = ['#FF6B9D', '#FFE66D', '#A78BFA', '#A8E6CF', '#FFB347', '#74B9FF', '#FF8C94', '#fff'];

function resizeFireworks() {
  if (!fwCanvas) return;
  fwCanvas.width = innerWidth;
  fwCanvas.height = innerHeight;
}
addEventListener('resize', resizeFireworks);

class FWRocket {
  constructor() {
    this.x = Math.random() * fwCanvas.width;
    this.y = fwCanvas.height + 10;
    this.tx = 80 + Math.random() * (fwCanvas.width - 160);
    this.ty = 50 + Math.random() * (fwCanvas.height * .55);
    const speed = 9 + Math.random() * 7;
    const ang = Math.atan2(this.ty - this.y, this.tx - this.x);
    this.vx = Math.cos(ang) * speed;
    this.vy = Math.sin(ang) * speed;
    this.color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
    this.trail = [];
    this.done = false;
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 14) this.trail.shift();
    this.x += this.vx; this.y += this.vy;
    if (Math.abs(this.x - this.tx) < 8 && Math.abs(this.y - this.ty) < 8) {
      this.explode();
      this.done = true;
    }
  }
  explode() {
    const n = 90 + Math.floor(Math.random() * 60);
    for (let i = 0; i < n; i++) ptList.push(new FWParticle(this.tx, this.ty, this.color));
  }
  draw() {
    this.trail.forEach((p, i) => {
      fwCtx.save();
      fwCtx.globalAlpha = (i / this.trail.length) * .6;
      fwCtx.fillStyle = this.color;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      fwCtx.fill();
      fwCtx.restore();
    });
    fwCtx.save();
    fwCtx.fillStyle = '#fff';
    fwCtx.beginPath();
    fwCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }
}

class FWParticle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const a = Math.random() * Math.PI * 2;
    const spd = 1.5 + Math.random() * 8;
    this.vx = Math.cos(a) * spd;
    this.vy = Math.sin(a) * spd;
    this.alpha = 1;
    this.decay = .013 + Math.random() * .018;
    this.grav = .13;
    this.radius = 1.5 + Math.random() * 2.5;
  }
  update() {
    this.vy += this.grav;
    this.x += this.vx; this.y += this.vy;
    this.vx *= .97; this.vy *= .97;
    this.alpha -= this.decay;
  }
  draw() {
    fwCtx.save();
    fwCtx.globalAlpha = Math.max(0, this.alpha);
    fwCtx.fillStyle = this.color;
    fwCtx.shadowColor = this.color;
    fwCtx.shadowBlur = 5;
    fwCtx.beginPath();
    fwCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }
}

function fireworksLoop() {
  if (!fwCtx) return;
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  if (Math.random() < .07) fwList.push(new FWRocket());
  fwList = fwList.filter(r => { r.update(); r.draw(); return !r.done; });
  ptList = ptList.filter(p => { p.update(); p.draw(); return p.alpha > 0; });
  fwFrame = requestAnimationFrame(fireworksLoop);
}

function startFireworks() {
  if (!fwCanvas || !fwCtx) return;
  resizeFireworks();
  fwCanvas.style.display = 'block';
  for (let i = 0; i < 10; i++) setTimeout(() => fwList.push(new FWRocket()), i * 180);
  if (!fwFrame) fireworksLoop();
}

function stopFireworks() {
  if (fwFrame) { cancelAnimationFrame(fwFrame); fwFrame = null; }
  if (fwCanvas) fwCanvas.style.display = 'none';
  if (fwCtx) fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwList = []; ptList = [];
}

/* ── KEYBOARD ────────────────────────────────────────────── */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    const idx = SCENE_ORDER.indexOf(state.currentScene);
    if (['ArrowRight', 'ArrowDown'].includes(e.key) && idx < SCENE_ORDER.length - 1) {
      e.preventDefault(); goToScene(SCENE_ORDER[idx + 1]);
    }
    if (['ArrowLeft', 'ArrowUp'].includes(e.key) && idx > 0) {
      e.preventDefault(); goToScene(SCENE_ORDER[idx - 1]);
    }
  });
}