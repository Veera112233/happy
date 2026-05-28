/* ================================================================
   BIRTHDAY WEBSITE — script.js  (v2 — Full Rewrite)
   Jahnavi Yarramsetti  |  Made with 🩶 by Veera
================================================================ */
"use strict";

/* ── CONFIG ── */
const SECRET_KEY  = "8125735773";
const DOB         = new Date(2005, 4, 28, 0, 0, 0); // May = 4 (0-indexed)

/* ── DOM ── */
const unlockPage    = document.getElementById("unlockPage");
const mainPage      = document.getElementById("mainPage");
const keyInput      = document.getElementById("keyInput");
const unlockBtn     = document.getElementById("unlockBtn");
const unlockError   = document.getElementById("unlockError");
const inputWrap     = document.getElementById("inputWrap");
const eyeBtn        = document.getElementById("eyeBtn");
const eyeOpen       = document.getElementById("eyeOpen");
const eyeClosed     = document.getElementById("eyeClosed");
const terminalBody  = document.getElementById("terminalBody");
const termCursor    = document.getElementById("termCursor");
const videoModal    = document.getElementById("videoModal");
const specialOverlay= document.getElementById("specialOverlay");
const specialBtn    = document.getElementById("specialBtn");
const spcNum        = document.getElementById("spcNum");
const spcRing       = document.getElementById("spcRing");
const spcCountdown  = document.getElementById("spcCountdown");
const backBtn       = document.getElementById("backBtn");
const downloadBtn   = document.getElementById("downloadBtn");
const vmPlayBtn     = document.getElementById("vmPlayBtn");
const birthdayVideo = document.getElementById("birthdayVideo");
const bgMusic       = document.getElementById("bgMusic");
const musicBtn      = document.getElementById("musicBtn");
const musicIcon     = document.getElementById("musicIcon");
const starsCanvas   = document.getElementById("starsCanvas");
const sparkCanvas   = document.getElementById("sparkCanvas");
const floatingEmojis= document.getElementById("floatingEmojis");
const heartCanvas   = document.getElementById("heartCanvas");
const daysAliveEl   = document.getElementById("daysAlive");
const vmPlaceholder = document.getElementById("vmPlaceholder");

/* ================================================================
   EYE TOGGLE (password show/hide)
================================================================ */
let eyeVisible = false;
eyeBtn.addEventListener("click", () => {
  eyeVisible = !eyeVisible;
  keyInput.type = eyeVisible ? "text" : "password";
  eyeOpen.style.display   = eyeVisible ? "none"  : "block";
  eyeClosed.style.display = eyeVisible ? "block" : "none";
  keyInput.focus();
});

/* ================================================================
   MUSIC CONTROL
================================================================ */
let musicPlaying = false;
let musicStarted = false;

function startMusic() {
  bgMusic.volume = 0.42;
  bgMusic.play().then(() => {
    musicPlaying = true;
    musicIcon.textContent = "🔊";
  }).catch(() => { /* autoplay blocked */ });
  musicStarted = true;
}

function pauseMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    musicIcon.textContent = "🔇";
  }
}

function resumeMusic() {
  if (musicStarted && !musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicIcon.textContent = "🔊";
    }).catch(() => {});
  }
}

musicBtn.addEventListener("click", () => {
  if (!musicStarted) { startMusic(); return; }
  musicPlaying ? pauseMusic() : resumeMusic();
});

/* ================================================================
   SPARK CURSOR CANVAS
================================================================ */
const sparkCtx = sparkCanvas.getContext("2d");
let sparks = [];
let mouse  = { x: -300, y: -300 };

function resizeSpark() {
  sparkCanvas.width  = window.innerWidth;
  sparkCanvas.height = window.innerHeight;
}
resizeSpark();
window.addEventListener("resize", resizeSpark);

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  // Emit sparks on move
  for (let i = 0; i < 4; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    sparks.push({
      x: e.clientX, y: e.clientY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 1,
      decay: .03 + Math.random() * .04,
      r: Math.random() * 3 + 1,
      hue: 300 + Math.random() * 60,     // pink-purple range
      gravity: .12
    });
  }
});

function animateSparks() {
  sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);

  // Draw cursor dot
  const grad = sparkCtx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 12);
  grad.addColorStop(0, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.4, "rgba(255,110,180,0.6)");
  grad.addColorStop(1, "rgba(177,79,255,0)");
  sparkCtx.beginPath();
  sparkCtx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
  sparkCtx.fillStyle = "rgba(255,255,255,0.95)";
  sparkCtx.shadowBlur = 18;
  sparkCtx.shadowColor = "#ff2d78";
  sparkCtx.fill();
  sparkCtx.shadowBlur = 0;

  // Update & draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x  += s.vx;
    s.y  += s.vy;
    s.vy += s.gravity;
    s.vx *= 0.96;
    s.life -= s.decay;

    if (s.life <= 0) { sparks.splice(i, 1); continue; }

    sparkCtx.beginPath();
    // Draw as a small elongated spark
    sparkCtx.save();
    sparkCtx.translate(s.x, s.y);
    sparkCtx.rotate(Math.atan2(s.vy, s.vx));
    const len = s.r * 3;
    const grd = sparkCtx.createLinearGradient(-len, 0, len, 0);
    grd.addColorStop(0, `hsla(${s.hue},100%,70%,0)`);
    grd.addColorStop(0.5, `hsla(${s.hue},100%,80%,${s.life})`);
    grd.addColorStop(1, `hsla(${s.hue},100%,70%,0)`);
    sparkCtx.fillStyle = grd;
    sparkCtx.beginPath();
    sparkCtx.ellipse(0, 0, len, s.r * .5, 0, 0, Math.PI * 2);
    sparkCtx.fill();
    sparkCtx.restore();

    // Glow dot at head
    sparkCtx.beginPath();
    sparkCtx.arc(s.x, s.y, s.r * .6, 0, Math.PI * 2);
    sparkCtx.fillStyle = `hsla(${s.hue},100%,85%,${s.life * .8})`;
    sparkCtx.fill();
  }

  requestAnimationFrame(animateSparks);
}
animateSparks();

/* ================================================================
   BACKGROUND STARS
================================================================ */
const starsCtx = starsCanvas.getContext("2d");
let stars = [];

function resizeStars() {
  starsCanvas.width  = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}
function initStars(n = 220) {
  stars = [];
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      r: Math.random() * 1.7 + .3,
      a: Math.random(),
      spd: .004 + Math.random() * .008,
      dir: Math.random() > .5 ? 1 : -1
    });
  }
}

function drawStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  for (const s of stars) {
    s.a += s.spd * s.dir;
    if (s.a > 1) { s.a = 1; s.dir = -1; }
    if (s.a < .08) { s.a = .08; s.dir = 1; }
    starsCtx.beginPath();
    starsCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(255,255,255,${s.a})`;
    starsCtx.fill();
  }
  requestAnimationFrame(drawStars);
}

resizeStars(); initStars(); drawStars();
window.addEventListener("resize", () => { resizeStars(); initStars(); });

/* ================================================================
   RANDOM STAR FLASHES
================================================================ */
(function injectFlashStyle() {
  const s = document.createElement("style");
  s.textContent = `
    @keyframes flashDot {
      0%  { opacity:0; transform:scale(.4); }
      40% { opacity:1; transform:scale(2.5); }
      100%{ opacity:0; transform:scale(.4); }
    }
    .flash-dot {
      position:fixed;border-radius:50%;pointer-events:none;z-index:3;
      background:#fff;
      box-shadow:0 0 10px 4px rgba(255,255,255,.8);
      animation:flashDot .55s ease forwards;
    }
  `;
  document.head.appendChild(s);
})();

function flashStar() {
  const el = document.createElement("div");
  el.className = "flash-dot";
  el.style.left   = Math.random() * 98 + "vw";
  el.style.top    = Math.random() * 98 + "vh";
  el.style.width  = (2 + Math.random() * 3) + "px";
  el.style.height = el.style.width;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 600);
}
setInterval(flashStar, 550);

/* ================================================================
   FLOATING EMOJIS
================================================================ */
const EMOJIS = ["✨", "🩶", "✨", "🩶", "💫", "🌟", "✨"];
function spawnEmoji() {
  const el = document.createElement("div");
  el.className = "float-emoji";
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left      = Math.random() * 97 + "vw";
  el.style.bottom    = "-30px";
  el.style.fontSize  = (.9 + Math.random() * 1.4) + "rem";
  const dur = 8 + Math.random() * 9;
  el.style.animationDuration = dur + "s";
  floatingEmojis.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 200);
}
setInterval(spawnEmoji, 950);

/* ================================================================
   UNLOCK PAGE PARTICLES
================================================================ */
const ulCanvas = document.getElementById("unlockParticles");
const ulCtx    = ulCanvas.getContext("2d");
let ulParts    = [];

function resizeUL() {
  ulCanvas.width  = window.innerWidth;
  ulCanvas.height = window.innerHeight;
}
resizeUL();
window.addEventListener("resize", resizeUL);

function initULParts(n = 55) {
  ulParts = [];
  for (let i = 0; i < n; i++) {
    ulParts.push({
      x: Math.random() * ulCanvas.width,
      y: Math.random() * ulCanvas.height,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 2.4 + .4,
      a: Math.random() * .5 + .15,
      hue: Math.random() > .5 ? 300 : 200
    });
  }
}
initULParts();

let ulActive = true;
function animateUL() {
  ulCtx.clearRect(0, 0, ulCanvas.width, ulCanvas.height);
  for (const p of ulParts) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = ulCanvas.width;
    if (p.x > ulCanvas.width) p.x = 0;
    if (p.y < 0) p.y = ulCanvas.height;
    if (p.y > ulCanvas.height) p.y = 0;
    ulCtx.beginPath();
    ulCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ulCtx.fillStyle = `hsla(${p.hue},100%,70%,${p.a})`;
    ulCtx.fill();
  }
  if (ulActive) requestAnimationFrame(animateUL);
}
animateUL();

/* ================================================================
   UNLOCK LOGIC
================================================================ */
function tryUnlock() {
  const val = keyInput.value.trim();
  if (val === SECRET_KEY) {
    unlockError.classList.remove("visible");
    inputWrap.classList.remove("error");
    startMusic();
    ulActive = false;
    unlockPage.classList.add("exit");
    setTimeout(() => {
      unlockPage.style.display = "none";
      mainPage.classList.add("active");
      initMain();
    }, 750);
  } else {
    inputWrap.classList.add("error");
    unlockError.classList.add("visible");
    inputWrap.classList.add("shake");
    setTimeout(() => inputWrap.classList.remove("shake"), 550);
    keyInput.value = "";
    keyInput.focus();
  }
}

unlockBtn.addEventListener("click", tryUnlock);
keyInput.addEventListener("keydown", e => {
  if (e.key === "Enter") { tryUnlock(); return; }
  inputWrap.classList.remove("error");
  unlockError.classList.remove("visible");
});

/* ================================================================
   MAIN PAGE INIT
================================================================ */
function initMain() {
  initHeartCanvas();
  startTerminalTyping();
  updateCountdown();
  updateDaysAlive();
  setInterval(updateCountdown, 1000);
  setInterval(updateDaysAlive, 60000);
  startSpecialCountdown();
  sparkBurst();
}

/* ================================================================
   DAYS ALIVE COUNTER
================================================================ */
function updateDaysAlive() {
  const now   = new Date();
  const ms    = now - DOB;
  const days  = Math.floor(ms / (1000 * 60 * 60 * 24));
  // Animate number counting up from current displayed value
  const current = parseInt(daysAliveEl.textContent.replace(/,/g, "")) || 0;
  if (current === days) return;
  animateCount(daysAliveEl, current, days, 1200);
}

function animateCount(el, from, to, duration) {
  const start = performance.now();
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(from + (to - from) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ================================================================
   LIVE COUNTDOWN TIMER (age breakdown)
================================================================ */
function updateCountdown() {
  const now = new Date();
  let years   = now.getFullYear() - DOB.getFullYear();
  let months  = now.getMonth()    - DOB.getMonth();
  let days    = now.getDate()     - DOB.getDate();
  let hours   = now.getHours()    - DOB.getHours();
  let minutes = now.getMinutes()  - DOB.getMinutes();
  let seconds = now.getSeconds()  - DOB.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--;   }
  if (hours   < 0) { hours   += 24; days--;    }
  if (days    < 0) {
    const pm = new Date(now.getFullYear(), now.getMonth(), 0);
    days  += pm.getDate(); months--;
  }
  if (months  < 0) { months += 12; years--;    }

  const pad = n => String(n).padStart(2, "0");
  document.getElementById("cdYears").textContent  = pad(years);
  document.getElementById("cdMonths").textContent = pad(months);
  document.getElementById("cdDays").textContent   = pad(days);
  document.getElementById("cdHours").textContent  = pad(hours);
  document.getElementById("cdMins").textContent   = pad(minutes);
  document.getElementById("cdSecs").textContent   = pad(seconds);
}

/* ================================================================
   HEART CANVAS (glowing particle heart)
================================================================ */
const hCtx = heartCanvas.getContext("2d");
let hp = [], hFrame = 0;

function heartXY(t) {
  const x =  16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return { x, y };
}

function resizeHeart() {
  heartCanvas.width  = heartCanvas.parentElement.offsetWidth;
  heartCanvas.height = heartCanvas.parentElement.offsetHeight;
}

function buildHeartParticles() {
  hp = [];
  const cx    = heartCanvas.width / 2;
  const cy    = heartCanvas.height / 2;
  const scale = Math.min(heartCanvas.width, heartCanvas.height) * 0.027;

  // Outline particles
  const outline = 360;
  for (let i = 0; i < outline; i++) {
    const t = (i / outline) * Math.PI * 2;
    const h = heartXY(t);
    hp.push(makeParticle(cx + h.x * scale, cy + h.y * scale, cx, cy, 1.5, 2.8));
  }
  // Fill particles
  const fill = 300;
  for (let i = 0; i < fill; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.random();
    const h = heartXY(t);
    const s2 = scale * (0.5 + r * 0.5);
    hp.push(makeParticle(cx + h.x * s2 * r, cy + h.y * s2 * r, cx, cy, .6, 1.6));
  }
}

function makeParticle(tx, ty, cx, cy, rMin, rMax) {
  return {
    tx, ty,
    x:  cx + (Math.random() - .5) * heartCanvas.width  * 1.2,
    y:  cy + (Math.random() - .5) * heartCanvas.height * 1.2,
    vx: 0, vy: 0,
    r:  rMin + Math.random() * (rMax - rMin),
    hue: 305 + Math.random() * 50,
    phase: Math.random() * Math.PI * 2,
    spd:  .018 + Math.random() * .035
  };
}

function initHeartCanvas() {
  resizeHeart();
  buildHeartParticles();
  window.addEventListener("resize", () => { resizeHeart(); buildHeartParticles(); });
  animateHeart();
}

function animateHeart() {
  hFrame++;
  hCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

  // Ambient glow
  const cx = heartCanvas.width / 2, cy = heartCanvas.height / 2;
  const grd = hCtx.createRadialGradient(cx, cy, 0, cx, cy, heartCanvas.height * .48);
  grd.addColorStop(0,   "rgba(255,45,120,.07)");
  grd.addColorStop(.55, "rgba(177,79,255,.03)");
  grd.addColorStop(1,   "rgba(0,0,0,0)");
  hCtx.fillStyle = grd;
  hCtx.fillRect(0, 0, heartCanvas.width, heartCanvas.height);

  for (const p of hp) {
    // Spring physics
    const dx = p.tx - p.x, dy = p.ty - p.y;
    p.vx += dx * .055; p.vy += dy * .055;
    p.vx *= .80;       p.vy *= .80;
    p.x  += p.vx;      p.y  += p.vy;

    // Alive pulsation
    p.phase += p.spd;
    const pulse = .65 + .38 * Math.sin(p.phase + hFrame * .025);
    const r = p.r * pulse;
    const a = .45 + .5  * Math.sin(p.phase);

    hCtx.shadowBlur  = 10;
    hCtx.shadowColor = `hsl(${p.hue},100%,60%)`;
    hCtx.beginPath();
    hCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
    hCtx.fillStyle = `hsla(${p.hue},100%,68%,${a})`;
    hCtx.fill();
  }
  hCtx.shadowBlur = 0;
  requestAnimationFrame(animateHeart);
}

/* ================================================================
   TERMINAL TYPING  — line-based engine (reliable)
================================================================ */
/*
  Each LINES entry is one visual line in the terminal.
  A line is an array of segments: { text, cls }
  An empty array [] = blank line.
  The engine types each segment char-by-char, then moves to the next line.
*/
const LINES = [
  [{ t:"// HAPPY BIRTHDAY Jahnavi Yarramsetti ✨", c:"tc-cmt" }],
  [{ t:"// Compiled Bday Gurl 🩶",                c:"tc-cmt" }],
  [],
  [{ t:"const", c:"tc-kw" }, { t:" us ", c:"tc-w" }, { t:"=", c:"tc-w" }, { t:" {", c:"tc-w" }],
  [{ t:"    her",    c:"tc-key" }, { t:": ",    c:"tc-w" }, { t:'"Jaanu"',     c:"tc-str" }, { t:",", c:"tc-w" }],
  [{ t:"    me",     c:"tc-key" }, { t:": ",    c:"tc-w" }, { t:'"Veera"',     c:"tc-str" }, { t:",", c:"tc-w" }],
  [{ t:"    status", c:"tc-key" }, { t:": ",    c:"tc-w" }, { t:'"Forever ✨"', c:"tc-str" }],
  [{ t:"};", c:"tc-w" }],
  [],
  [{ t:"// System Configuration", c:"tc-cmt" }],
  [{ t:"her", c:"tc-key" }, { t:".", c:"tc-w" }, { t:"birthday", c:"tc-fn" }, { t:" = {", c:"tc-w" }],
  [{ t:"    date",           c:"tc-key" }, { t:": ", c:"tc-w" }, { t:'"28.05.2005"', c:"tc-str" }, { t:",", c:"tc-w" }],
  [{ t:"    happinessLevel", c:"tc-key" }, { t:": ", c:"tc-w" }, { t:"MAX_INT",      c:"tc-num" }],
  [{ t:"};", c:"tc-w" }],
  [],
  [{ t:"// Core Functions", c:"tc-cmt" }],
  [{ t:"function", c:"tc-kw" }, { t:" celebrate", c:"tc-fn" }, { t:"() {", c:"tc-w" }],
  [{ t:"    while", c:"tc-kw" }, { t:"(true) {", c:"tc-w" }],
  [{ t:"        sendWishes", c:"tc-fn" }, { t:"();", c:"tc-w" }],
  [{ t:"        createMemories", c:"tc-fn" }, { t:"();", c:"tc-w" }],
  [{ t:"    }", c:"tc-w" }],
  [{ t:"}", c:"tc-w" }],
  [],
  [{ t:"// Execute", c:"tc-cmt" }],
  [{ t:"try", c:"tc-kw" }, { t:" {", c:"tc-w" }],
  [{ t:"    celebrate", c:"tc-fn" }, { t:"();", c:"tc-w" }],
  [{ t:"} ", c:"tc-w" }, { t:"catch", c:"tc-kw" }, { t:"(Friendship) {", c:"tc-w" }],
  [{ t:"    console", c:"tc-fn" }, { t:".error(", c:"tc-w" }, { t:'"Impossible to stop our Friendship 🩶"', c:"tc-str" }, { t:");", c:"tc-w" }],
  [{ t:"}", c:"tc-w" }],
  [],
  [{ t:"/* OUTPUT:", c:"tc-cmt" }],
  [{ t:"✨ You're Amazing",              c:"tc-out" }],
  [{ t:"🩶 My Junior",                  c:"tc-out" }],
  [{ t:"✨ Forever Friend",              c:"tc-out" }],
  [{ t:"✨ Extrovert and Daring",        c:"tc-out" }],
  [{ t:"🩶 Happy Birthday Beautiful Girl", c:"tc-out" }],
  [{ t:"*/", c:"tc-cmt" }],
];

/* State */
let tLineIdx = 0;   // current line index
let tSegIdx  = 0;   // current segment index within line
let tCharIdx = 0;   // current char index within segment
let tCurrentSpan = null; // the <span> we're writing into right now

function typeStep() {
  if (tLineIdx >= LINES.length) return; // done

  const line = LINES[tLineIdx];

  /* ── BLANK LINE ── */
  if (line.length === 0) {
    terminalBody.insertBefore(document.createElement("br"), termCursor);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    tLineIdx++; tSegIdx = 0; tCharIdx = 0; tCurrentSpan = null;
    setTimeout(typeStep, 80);
    return;
  }

  const seg = line[tSegIdx];

  /* ── START OF NEW SEGMENT ── need to create a span ── */
  if (tCharIdx === 0) {
    tCurrentSpan = document.createElement("span");
    tCurrentSpan.className = seg.c || "tc-w";
    terminalBody.insertBefore(tCurrentSpan, termCursor);
  }

  /* ── TYPE ONE CHARACTER ── */
  tCurrentSpan.textContent += seg.t[tCharIdx];
  tCharIdx++;
  terminalBody.scrollTop = terminalBody.scrollHeight;

  /* ── FINISHED THIS CHARACTER? ── */
  if (tCharIdx < seg.t.length) {
    // More chars in this segment
    const ch = seg.t[tCharIdx - 1];
    const delay = (ch === " " || ch === "    ") ? 18 : 18 + Math.random() * 34;
    setTimeout(typeStep, delay);
    return;
  }

  /* ── FINISHED THIS SEGMENT ── move to next ── */
  tCharIdx = 0;
  tSegIdx++;

  if (tSegIdx < line.length) {
    // More segments on the same line — no delay between segments
    setTimeout(typeStep, 0);
    return;
  }

  /* ── FINISHED THIS LINE ── insert <br> and move to next line ── */
  terminalBody.insertBefore(document.createElement("br"), termCursor);
  tLineIdx++; tSegIdx = 0; tCharIdx = 0; tCurrentSpan = null;
  const lineDelay = 90 + Math.random() * 80;
  setTimeout(typeStep, lineDelay);
}

function startTerminalTyping() {
  terminalBody.innerHTML = "";
  terminalBody.appendChild(termCursor);
  tLineIdx = 0; tSegIdx = 0; tCharIdx = 0; tCurrentSpan = null;
  setTimeout(typeStep, 900);
}

/* ================================================================
   SPECIAL COUNTDOWN (20s → video button)
================================================================ */
const RING_C = 301.6; // 2π×48

function startSpecialCountdown() {
  let left = 20;
  spcRing.style.strokeDasharray  = RING_C;
  spcRing.style.strokeDashoffset = "0";
  specialOverlay.style.pointerEvents = "none";

  const iv = setInterval(() => {
    left--;
    spcNum.textContent = left;
    spcRing.style.strokeDashoffset = RING_C * (1 - left / 20);
    if (left <= 0) {
      clearInterval(iv);
      spcCountdown.style.display = "none";
      specialBtn.classList.remove("hidden");
      specialOverlay.style.pointerEvents = "all";
    }
  }, 1000);
}

specialBtn.addEventListener("click", openVideo);

/* ================================================================
   VIDEO MODAL
================================================================ */
function openVideo() {
  videoModal.classList.add("open");
  pauseMusic(); // ★ pause birthday music while video plays

  // Try playing video
  birthdayVideo.load();
  birthdayVideo.play().catch(() => {
    birthdayVideo.style.display = "none";
    vmPlaceholder.style.display = "flex";
  });

  downloadBtn.href = "birthday-video.mp4";
  vmPlayBtn.textContent = "⏸ Pause";
}

function closeVideo() {
  videoModal.classList.remove("open");
  birthdayVideo.pause();
  birthdayVideo.currentTime = 0;
  vmPlayBtn.textContent = "▶ Play";
  resumeMusic(); // ★ resume birthday music when modal closes
}

backBtn.addEventListener("click", closeVideo);

vmPlayBtn.addEventListener("click", () => {
  if (birthdayVideo.paused) {
    birthdayVideo.play();
    vmPlayBtn.textContent = "⏸ Pause";
  } else {
    birthdayVideo.pause();
    vmPlayBtn.textContent = "▶ Play";
  }
});

birthdayVideo.addEventListener("ended", () => {
  vmPlayBtn.textContent = "▶ Play";
  resumeMusic(); // Resume music when video ends naturally
});

// Close on backdrop
videoModal.addEventListener("click", e => {
  if (e.target === videoModal || e.target.classList.contains("vm-backdrop")) closeVideo();
});

/* ================================================================
   SPARK BURST on main page entry
================================================================ */
function sparkBurst() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.style.cssText = `
        position:fixed;
        left:${10 + Math.random()*80}vw;
        top:${10 + Math.random()*80}vh;
        font-size:${1 + Math.random()*1.6}rem;
        pointer-events:none;z-index:9998;
        opacity:0;
        animation:floatUp ${1.5 + Math.random()*1.5}s ease forwards;
      `;
      el.textContent = Math.random() > .5 ? "✨" : "🩶";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 80);
  }
}

/* ================================================================
   KEYBOARD SHORTCUTS
================================================================ */
document.addEventListener("keydown", e => {
  if (mainPage.classList.contains("active")) {
    if (e.key === "Escape" && videoModal.classList.contains("open")) closeVideo();
  }
});

/* ================================================================
   CONSOLE EASTER EGG
================================================================ */
console.log("%c🩶 Happy Birthday Jahnavi Yarramsetti! 🩶", "font-size:22px;color:#ff2d78;font-family:serif;font-style:italic;");
console.log("%c✨ Made with love by Veera ✨",              "font-size:14px;color:#b14fff;font-family:monospace;");
console.log("%cAge in days: " + Math.floor((Date.now() - new Date(2005,4,28).getTime()) / 86400000), "font-size:12px;color:#00d4ff;");