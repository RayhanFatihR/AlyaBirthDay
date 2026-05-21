/* =====================================================
   ROMANTIC BIRTHDAY GIFT — script.js
   =====================================================
   PASSWORD : ganti nilai PASSWORD di bawah ini
   FOTO     : ganti img: "" dengan path foto kamu,
              misal img: "foto1.jpg" atau URL online.
              Biarkan "" agar muncul tombol upload.
   NAMA     : ganti teks di LOVE_MSG, pw-from (HTML),
              closing-sign (HTML) sesuai nama kamu.
===================================================== */

const PASSWORD = "220505";   // ← ganti PIN di sini

/* --------------------------------------------------
   SCRATCH CARDS — isi img dengan path / URL foto
   Contoh lokal  : img: "foto1.jpg"
   Contoh online : img: "https://i.ibb.co/xxx/foto.jpg"
   Biarkan ""    : muncul tombol 📷 untuk upload langsung
-------------------------------------------------- */
const SCRATCH_CARDS = [
  { img: "fotobioskop.jpeg", cap: "our first date"  },
  { img: "makan-makan.jpeg", cap: "Makan Makan"     },
  { img: "favphoto.jpeg", cap: "my fav photo"      },
  { img: "usphoto.jpeg", cap: "us, always"      },
];

/* ── helpers ── */
const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const rand = (a, b) => Math.random() * (b - a) + a;

function showScreen(id) {
  $$(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function spawnParticles(container, { chars, count = 14, size = [16,26], dur = [6,12] }) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = chars[Math.floor(Math.random() * chars.length)];
    p.style.left = rand(0,100) + "%";
    p.style.fontSize = rand(size[0], size[1]) + "px";
    container.appendChild(p);
    gsap.fromTo(p,
      { y:-50, x:0, rotation:rand(0,360), opacity:0 },
      {
        y: window.innerHeight + 80,
        x: rand(-80,80),
        rotation: rand(180,540),
        opacity: 1,
        duration: rand(dur[0], dur[1]),
        delay: rand(0, dur[1]),
        repeat: -1,
        ease: "none",
        onRepeat() { p.style.left = rand(0,100) + "%"; }
      });
  }
}

/* =====================================================
   1. LOADING
===================================================== */
gsap.to(".loading-bar-fill", { width:"100%", duration:2.6, ease:"power1.inOut" });
setTimeout(() => {
  gsap.to("#loading", {
    opacity:0, duration:.8, onComplete() {
      showScreen("password");
      startPassword();
    }
  });
}, 3000);

/* =====================================================
   2. PASSWORD
===================================================== */
let pin = "";

function startPassword() {
  spawnParticles($("#pwHearts"), { chars:["💕","💗","🤍"], count:12, size:[14,22] });
}

function renderPin() {
  $$("#pinDots span").forEach((d,i) => d.classList.toggle("filled", i < pin.length));
}

$$(".key").forEach(btn => {
  btn.addEventListener("click", () => {
    const k = btn.dataset.k;
    if (!k) return;
    if (k === "del") { pin = pin.slice(0,-1); renderPin(); return; }
    if (pin.length >= 6) return;
    pin += k;
    renderPin();
    if (pin.length === 6) setTimeout(checkPin, 200);
  });
});

function checkPin() {
  if (pin === PASSWORD) {
    successBloom();
  } else {
    const card = $("#pwCard");
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 600);
    pin = "";
    setTimeout(renderPin, 300);
  }
}

function successBloom() {
  const overlay = $("#bloomOverlay");
  const flowers = ["🌹","🌸","🌺","🌷","💐","🌼"];
  for (let i = 0; i < 60; i++) {
    const f = document.createElement("span");
    f.className = "bloom";
    f.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    f.style.left = rand(0,100) + "%";
    f.style.top  = rand(0,100) + "%";
    f.style.fontSize = rand(26,60) + "px";
    overlay.appendChild(f);
    gsap.to(f, {
      scale: rand(.8,1.6), rotation: rand(-60,60), opacity:1,
      duration: rand(.5,1.1), delay: rand(0,.8), ease:"back.out(2)"
    });
  }
  gsap.to("#password", {
    opacity:0, duration:1, delay:1.4, onComplete() { showScreen("letter"); }
  });
}

/* =====================================================
   3. LETTER SCREEN
===================================================== */
let letterOpened = false;
$("#envelopeWrap").addEventListener("click", () => {
  if (letterOpened) return;
  letterOpened = true;
  $("#tapOpen").style.display = "none";

  const tl = gsap.timeline();
  tl.to("#envSeal",   { scale:0, opacity:0, duration:.3, ease:"back.in(2)" })
    .to("#envFlap",   { rotationX:180, duration:.8, ease:"power2.inOut", transformOrigin:"top center" }, "-=.1")
    .to("#envLetter", { y:-150, scale:1.06, zIndex:10, duration:1, ease:"power2.out" }, "-=.2")
    .add(() => burstPetalsFromLetter())
    .to("#letter",    { opacity:0, duration:1, delay:1.8, onComplete: enterMain });
});

function burstPetalsFromLetter() {
  const c = $("#letterPetals");
  const chars = ["🌹","🌷","🌸","💗"];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = chars[Math.floor(Math.random() * chars.length)];
    p.style.left = "50%"; p.style.top = "45%";
    p.style.fontSize = rand(18,34) + "px";
    c.appendChild(p);
    gsap.to(p, {
      x: rand(-260,260), y: rand(-300,120),
      rotation: rand(-360,360),
      opacity:0, scale: rand(.6,1.4),
      duration: rand(1.4,2.6), delay: rand(0,.4), ease:"power2.out"
    });
  }
}

/* =====================================================
   4. MAIN / SCRAPBOOK
===================================================== */
function enterMain() {
  showScreen("main");
  initScratchCards();
  initScrollReveals();
  startTyping();
  spawnParticles($("#globalPetals"), { chars:["🌹","🌸","💗","✨","🤍"], count:18, dur:[9,16] });
  tryAutoplay();
}

/* ── scroll reveals ── */
function initScrollReveals() {
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  $$(".reveal").forEach(el => {
    gsap.to(el, {
      opacity:1, y:0, duration:1, ease:"power2.out",
      scrollTrigger:{ trigger:el, start:"top 85%", scroller:"#main" }
    });
  });
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}

/* ── typing effect ── */
const LOVE_MSG =
  "Sometimes I catch myself smiling at my phone just because of you. " +
  "You make ordinary days feel softer and happier, and honestly, " +
  "having you in my life is one of my favorite things.";

function startTyping() {
  const target = $("#typeTarget");
  let i = 0;
  target.innerHTML = '<span class="caret"></span>';
  const caret = target.querySelector(".caret");
  const tick = () => {
    if (i < LOVE_MSG.length) {
      caret.insertAdjacentText("beforebegin", LOVE_MSG[i]);
      i++;
      setTimeout(tick, LOVE_MSG[i-1] === "." ? 240 : rand(28,70));
    } else {
      setTimeout(() => caret.remove(), 1200);
    }
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { tick(); obs.disconnect(); } });
  }, { root: $("#main"), threshold: .4 });
  obs.observe(target);
}

/* =====================================================
   SCRATCH CARDS
   ─────────────────────────────────────────────────
   Cara ganti foto:
   A) Edit array SCRATCH_CARDS di atas:
      - img: "namafile.jpg"  → foto lokal (1 folder)
      - img: "https://..."   → URL online
   B) Klik tombol 📷 di tiap polaroid saat website jalan
===================================================== */
function initScratchCards() {
  const grid = $("#polaroidGrid");
  grid.innerHTML = "";

  SCRATCH_CARDS.forEach((card, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "polaroid";

    /* Isi img: di SCRATCH_CARDS dengan path/URL foto untuk ditampilkan */
    const photoContent = card.img
      ? `<img src="${card.img}" alt="foto ${idx + 1}" />`
      : `<div class="ph-inner"><span>${card.emoji || "📸"}</span></div>`;

    wrap.innerHTML = `
      <div class="scratch-stage">
        <div class="scratch-photo">${photoContent}</div>
        <canvas class="scratch-canvas"></canvas>
      </div>
      <div class="polaroid-cap">${card.cap}</div>`;

    grid.appendChild(wrap);

    setupScratch(wrap.querySelector(".scratch-canvas"), wrap.querySelector(".scratch-stage"));
  });
}

/* ── gambar overlay scratch ── */
function drawScratchOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "source-over";

  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, "#caa9ac");
  g.addColorStop(.5, "#9c7e82");
  g.addColorStop(1, "#b8969a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* noise texture */
  for (let px = 0; px < canvas.width; px += 3) {
    for (let py = 0; py < canvas.height; py += 3) {
      const v = Math.random() * 30;
      ctx.fillStyle = `rgba(${100+v},${80+v},${82+v},0.18)`;
      ctx.fillRect(px, py, 2, 2);
    }
  }

  /* teks */
  ctx.fillStyle = "rgba(255,255,255,.65)";
  ctx.font = "italic 18px 'Playfair Display',serif";
  ctx.textAlign = "center";
  ctx.fillText("Scratch me", canvas.width/2, canvas.height/2 - 6);
  ctx.font = "13px 'Poppins',sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.45)";
  ctx.fillText("🌸 gosok untuk membuka", canvas.width/2, canvas.height/2 + 16);
}

/* ── setup scratch interaction ── */
function setupScratch(canvas, stage) {
  canvas.width  = stage.clientWidth  || 200;
  canvas.height = stage.clientHeight || 200;
  drawScratchOverlay(canvas);

  const ctx = canvas.getContext("2d");
  let drawing = false, cleared = false;

  const getPos = e => {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return {
      x: (t.clientX - r.left) * (canvas.width  / r.width),
      y: (t.clientY - r.top)  * (canvas.height / r.height)
    };
  };

  const scratch = e => {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
    checkCleared();
  };

  /* auto-clear jika > 55% tergores */
  const checkCleared = () => {
    if (cleared) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 80) if (data[i] === 0) clear++;
    if (clear / (data.length / 80) > 0.55) {
      cleared = true;
      gsap.to(canvas, { opacity:0, duration:.6, onComplete:() => canvas.remove() });
    }
  };

  canvas.addEventListener("mousedown",  ()  => drawing = true);
  canvas.addEventListener("mousemove",  scratch);
  window.addEventListener("mouseup",    ()  => drawing = false);
  canvas.addEventListener("touchstart", ()  => drawing = true, { passive:true });
  canvas.addEventListener("touchmove",  scratch, { passive:false });
  canvas.addEventListener("touchend",   ()  => drawing = false);
}

/* ── video upload ── */
const videoInput = $("#videoInput");
if (videoInput) {
  videoInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const v = $("#memVideo");
    v.src = url;
    v.classList.add("show");
    const lbl = $("#videoUploadLabel");
    if (lbl) lbl.style.display = "none";
  });
}

/* =====================================================
   MUSIC PLAYER
===================================================== */
const bgm   = $("#bgm");
const mpBtn = $("#mpBtn");
const mpEq  = $("#mpEq");
let playing = false;

function setPlaying(state) {
  playing = state;
  mpBtn.textContent = state ? "❚❚" : "▶";
  mpEq.classList.toggle("playing", state);
}
mpBtn.addEventListener("click", () => {
  if (playing) { bgm.pause(); setPlaying(false); }
  else { bgm.play().then(()=>setPlaying(true)).catch(()=>{}); }
});
bgm.addEventListener("play",  () => setPlaying(true));
bgm.addEventListener("pause", () => setPlaying(false));

function tryAutoplay() {
  bgm.volume = .6;
  bgm.play().then(() => setPlaying(true)).catch(() => {
    const once = () => {
      bgm.play().then(()=>setPlaying(true)).catch(()=>{});
      document.removeEventListener("click", once);
    };
    document.addEventListener("click", once);
  });
}