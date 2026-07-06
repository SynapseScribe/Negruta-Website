/* GET ELEMENTS */
const nameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startGameBtn");
const gameOverDialog = document.getElementById("gameOverDialog");
const playAgainBtn = document.getElementById("playAgainBtn");
const gameOverCloseBtn = document.getElementById("gameOverCloseBtn");
const canvas = document.getElementById("gameCanvas");
const canvasWrapper = canvas.parentElement;
const fullscreenBtn = document.getElementById("fullscreenBtn");

/* CANVAS */
const ctx = canvas.getContext("2d"); // 2D drawing context
const baseWidth = 800;
const baseHeight = 550;

let frameCount = 0;

/* CANVAS-DRAWN PRE-GAME UI */
let nameFieldY, startBtnY, startBtnH;
let currentName = "";

/* MOVEMENT */
const gravity = 1;
const jumpStrength = -20;
const maxJumpsBeforeReset = 2;
const initialSpeed = 10;
const maxSpeed = 50;
const speedIncrement = 0.1;

let currentSpeed = initialSpeed;
let velocityY = 0;
let jumpCount = 0;

/* CAT */
let catSize = 80;
let catX = 150;
let catY = 0;

/* GAME */
let playerName = "";
let gameRunning = false;
let animationFrameId = null;
let score = 0;

// ----------------------------- //
/* CACHING */
// ----------------------------- //

// Unified render cache for all emoji objects (obstacles, collectibles, grass, etc.)
const renderCache = {
  map: new Map(),
  get(emoji, size) {
    const key = `${emoji}_${size}`;
    return this.map.get(key);
  },
  ensure(emoji, size, baseline = "bottom") {
    const key = `${emoji}_${size}`;
    if (this.map.has(key)) return this.map.get(key);
    const oc = document.createElement("canvas");
    oc.width = oc.height = size * 2;
    const cctx = oc.getContext("2d");
    cctx.font = `${size}px serif`;
    cctx.textAlign = "center";
    cctx.textBaseline = baseline;
    cctx.clearRect(0, 0, oc.width, oc.height);
    cctx.fillText(emoji, oc.width / 2, oc.height - 1);
    this.map.set(key, oc);
    return oc;
  },
  clear() {
    this.map.clear();
  }
};

// ----------------------------- //
/* PARALLAX BACKGROUND */
// ----------------------------- //

const groundHeightRatio = 0.25;
const horizonWaveAplitude = 12;

// Draw undulating ground with green transition zone (distant foliage)
function drawUndulatingGround() {
  const baseY = canvas.height * (1 - groundHeightRatio);
  const stripHeight = 1;
  const segments = 8;
  const segWidth = canvas.width / segments;

  function getHorizonY(x) {
    return (
      baseY +
      Math.sin((x / canvas.width) * Math.PI * segments) * horizonWaveAplitude
    );
  }

  // Draw green transition strip (distant foliage)
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, getHorizonY(0));
  for (let i = 1; i <= segments; i++) {
    const x = i * segWidth;
    const prevX = (i - 1) * segWidth;
    ctx.quadraticCurveTo(
      (prevX + x) / 2,
      getHorizonY((prevX + x) / 2),
      x,
      getHorizonY(x)
    );
  }
  for (let i = segments; i >= 1; i--) {
    const x = i * segWidth;
    const prevX = (i - 1) * segWidth;
    ctx.quadraticCurveTo(
      (prevX + x) / 2,
      getHorizonY((prevX + x) / 2) + stripHeight,
      x,
      getHorizonY(x) + stripHeight
    );
  }
  ctx.lineTo(0, getHorizonY(0) + stripHeight);
  ctx.closePath();
  const greenGrad = ctx.createLinearGradient(
    0,
    baseY - horizonWaveAplitude,
    0,
    baseY + stripHeight + horizonWaveAplitude
  );
  greenGrad.addColorStop(0, "#1a4d1a");
  greenGrad.addColorStop(0.3, "#2e6b2e");
  greenGrad.addColorStop(0.7, "#3d7a3d");
  greenGrad.addColorStop(1, "#5c3a21");
  ctx.fillStyle = greenGrad;
  ctx.fill();
  ctx.restore();

  // Draw dirt ground fill (below horizon)
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(0, getHorizonY(0));
  for (let i = 1; i <= segments; i++) {
    const x = i * segWidth;
    const prevX = (i - 1) * segWidth;
    ctx.quadraticCurveTo(
      (prevX + x) / 2,
      getHorizonY((prevX + x) / 2),
      x,
      getHorizonY(x)
    );
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  const dirtGrad = ctx.createLinearGradient(
    0,
    baseY + stripHeight,
    0,
    canvas.height
  );
  dirtGrad.addColorStop(0, "#5c3a21");
  dirtGrad.addColorStop(0.4, "#4a2e1b");
  dirtGrad.addColorStop(1, "#3a2215");
  ctx.fillStyle = dirtGrad;
  ctx.fill();
}

// 1st layer - foreground grass
const grassEmojis = ["🌿", "🎍", "🪴", "🌾", "🌱"];
const grassBaseSizes = [30, 40];
let grassSizes;
const grassMinSpacing = 40;
const grassMaxSpacing = 70;
const grassSpeedRatio = 1.4;
let grassStripCanvas = null;
let grassOffset = 0;
let grassStripWidth = 0;

// 2nd layer - background grass
const bgGrassEmojis = ["🌼", "🌻", "🌷", "🌹", "🪻", "☘️", "🍀"];
//   "🍂",  "🍁",  "🥀",
const bgGrassBaseSizes = [20, 30];
let bgGrassSizes;
const bgGrassMinSpacing = 40;
const bgGrassMaxSpacing = 80;
const bgGrassSpeedRatio = 0.6;
let bgGrassStripCanvas = null;
let bgGrassOffset = 0;
let bgGrassStripWidth = 0;

// 3rd layer - trees
const treeEmojis = ["🌴"];
const treeBaseSizes = [70, 80, 90];
let treeSizes;
const treeSpeedRatio = 0.3;
let treeStripCanvas = null;
let treeOffset = 0;
let treeStripWidth = 0;

// 4th layer - background trees
const bgTreeEmojis = ["🌳", "🌲"];
const bgTreeBaseSizes = [50, 60, 70];
let bgTreeSizes;
const bgTreeSpeedRatio = 0.1;
let bgTreeStripCanvas = null;
let bgTreeOffset = 0;
let bgTreeStripWidth = 0;

// First strip (grass)
function randomGrassGap() {
  return Math.floor(
    grassMinSpacingScaled + Math.random() * (grassMaxSpacingScaled - grassMinSpacingScaled)
  );
}

// calls: randomGrassGap()
function initGrassStrips() {
  const stripW = Math.round(3200 * scale);
  grassStripWidth = stripW;
  grassStripCanvas = document.createElement("canvas");
  grassStripCanvas.width = stripW;
  grassStripCanvas.height = canvas.height;
  const sctx = grassStripCanvas.getContext("2d");
  sctx.clearRect(0, 0, stripW, canvas.height);
  sctx.textAlign = "center";
  sctx.textBaseline = "bottom";
  const margin = Math.max(...grassSizes);
  let x = margin;
  while (x < stripW - margin) {
    const emoji = grassEmojis[Math.floor(Math.random() * grassEmojis.length)];
    const size = grassSizes[Math.floor(Math.random() * grassSizes.length)];
    const img = renderCache.get(emoji, Math.round(size));
    if (img) {
      sctx.drawImage(img, x - img.width / 2, canvas.height - img.height);
    }
    x += randomGrassGap();
  }
}

// Bg Grass
// calls: renderCache.get()
function initBgGrassStrips() {
  const stripW = Math.round(3200 * scale);
  bgGrassStripWidth = stripW;
  bgGrassStripCanvas = document.createElement("canvas");
  bgGrassStripCanvas.width = stripW;
  bgGrassStripCanvas.height = canvas.height;
  const sctx = bgGrassStripCanvas.getContext("2d");
  sctx.clearRect(0, 0, stripW, canvas.height);
  sctx.textAlign = "center";
  sctx.textBaseline = "bottom";
  const margin = Math.max(...bgGrassSizes);
  let x = margin;
  while (x < stripW - margin) {
    const emoji =
      bgGrassEmojis[Math.floor(Math.random() * bgGrassEmojis.length)];
    const size = bgGrassSizes[Math.floor(Math.random() * bgGrassSizes.length)];
    const img = renderCache.get(emoji, Math.round(size));
    if (img) {
      sctx.drawImage(img, x - img.width / 2, canvas.height - img.height * 1.3);
    }
    x += Math.floor(
      bgGrassMinSpacing +
        Math.random() * (bgGrassMaxSpacing - bgGrassMinSpacing)
    );
  }
}

// First trees
// calls: renderCache.get()
function initTreeStrips(heightFactor) {
  const stripW = Math.round(3200 * scale);
  treeStripWidth = stripW;
  treeStripCanvas = document.createElement("canvas");
  treeStripCanvas.width = stripW;
  treeStripCanvas.height = canvas.height;
  const sctx = treeStripCanvas.getContext("2d");
  sctx.clearRect(0, 0, stripW, canvas.height);
  sctx.textAlign = "center";
  sctx.textBaseline = "bottom";
  const margin = Math.max(...treeSizes);
  let x = margin;
  while (x < stripW - margin) {
    const emoji = treeEmojis[Math.floor(Math.random() * treeEmojis.length)];
    const size = treeSizes[Math.floor(Math.random() * treeSizes.length)];
    const img = renderCache.get(emoji, Math.round(size));
    if (img) {
      sctx.drawImage(
        img,
        x - img.width / 2,
        canvas.height - img.height * heightFactor
      );
    }
    x += Math.floor(stripW * Math.random() * 0.05);
  }
}

// Bg trees
// calls: renderCache.get()
function initBgTreeStrips(heightFactor) {
  const stripW = Math.round(3200 * scale);
  bgTreeStripWidth = stripW;
  bgTreeStripCanvas = document.createElement("canvas");
  bgTreeStripCanvas.width = stripW;
  bgTreeStripCanvas.height = canvas.height;
  const sctx = bgTreeStripCanvas.getContext("2d");
  sctx.clearRect(0, 0, stripW, canvas.height);
  sctx.textAlign = "center";
  sctx.textBaseline = "bottom";
  const margin = Math.max(...bgTreeSizes);
  let x = margin;
  while (x < stripW - margin) {
    const emoji =
      bgTreeEmojis[Math.floor(Math.random() * bgTreeEmojis.length)];
    const size = bgTreeSizes[Math.floor(Math.random() * bgTreeSizes.length)];
    const img = renderCache.get(emoji, Math.round(size));
    if (img) {
      sctx.drawImage(
        img,
        x - img.width / 2,
        canvas.height - img.height * heightFactor
      );
    }
    x += Math.floor(stripW * Math.random() * 0.02);
  }
}

async function initGrassCache(progressCallback) {
  const total = grassEmojis.length * grassSizes.length;
  let count = 0;
  for (const emoji of grassEmojis) {
    for (const size of grassSizes) {
      renderCache.ensure(emoji, size);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}
async function initBgGrassCache(progressCallback) {
  const total = bgGrassEmojis.length * bgGrassSizes.length;
  let count = 0;
  for (const emoji of bgGrassEmojis) {
    for (const size of bgGrassSizes) {
      renderCache.ensure(emoji, size);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}
async function initTreeCache(progressCallback) {
  const total = treeEmojis.length * treeSizes.length;
  let count = 0;
  for (const emoji of treeEmojis) {
    for (const size of treeSizes) {
      renderCache.ensure(emoji, size);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}

async function initBgTreeCache(progressCallback) {
  const total = bgTreeEmojis.length * bgTreeSizes.length;
  let count = 0;
  for (const emoji of bgTreeEmojis) {
    for (const size of bgTreeSizes) {
      renderCache.ensure(emoji, size);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}

let moonX = 0;
const moonSpeedRatio = 0.03;
// calls: renderCache.get()
function initMoon() {
  moonX = canvas.width * 0.75;
}

// ----------------------------- //
/* OBSTACLES */
// ----------------------------- //

/* OBSTACLES */
let obstacles = [];
let nextObstacleFrame = 100;
const obstacleSizes = [250, 300];
const obstacleTypesFullSet = [
  "🌲",
  "🏠",
  "🏀",
  "🚗",
  "🌵",
  "📦",
  "🧱",
  "🦄",
  "🛸",
  "🦖",
  "🍕",
  "🍍",
  "🗿",
  "🤡",
  "🍄",
  "👻",
  "👽",
  "🐙",
  "🌈",
  "🍦",
  "🍩",
  "🍔",
  "🌮",
  "🍣",
  "🥨",
  "🥑",
  "🍉",
  "🦁",
  "🐵",
  "🐧",
  "🐘",
  "🦒",
  "🐢",
  "🐍",
  "🐝",
  "🦋",
  "🚀",
  "🚁",
  "🚂",
  "🚢",
  "🚲",
  "🛵",
  "🚜",
  "🚐",
  "🚠",
  "🎸",
  "🎻",
  "🎺",
  "🥁",
  "🎨",
  "📚",
  "🧪",
  "🔬",
  "🔭",
  "🏰",
  "🎢",
  "🗼",
  "🗽",
  "⛩️",
  "🪨",
  "🧯",
  "🛑",
  "⚠️",
  "🪵",
  "🪺",
  "🌋",
  "⛰️",
  "🏔️",
  "🏝️",
  "🏜️",
  "🏟️",
  "🏗️",
  "🪂",
  "🧭",
  "🪄",
  "🕳️",
  "🪓",
  "🔒",
  "🧨",
  "💣",
  "🪤",
  "🧫",
  "🧬",
  "🪀",
  "🪁",
  "🧿",
  "🔮",
  "🧸",
  "🎯",
  "🏹",
  "🪃",
  "🛡️",
  "⚔️",
  "🗡️",
  "🔧",
  "🪛",
  "🔩",
  "⚙️",
  "🦺",
  "🏳️",
  "🌈",
  "🎈",
  "🕹️",
  "🧳",
  "🗝️",
  "🦽",
  "🛏️",
  "🛋️",
  "🦊",
  "🐺",
  "🐻",
  "🐼",
  "🐨",
  "🦝",
  "🦌",
  "🦅",
  "🦉",
  "🦇",
  "🐿️",
  "🦜",
  "🐇",
  "🐁",
  "🐀",
  "🦨",
  "🦡",
  "🦔",
  "🐗",
  "🦃",
  "🦚",
  "🥕",
  "🍓",
  "🍒",
  "🍇",
  "🥝",
  "🥥",
  "🍪",
  "🍫",
  "🥞",
  "🍯",
  "🛶",
  "🛰️",
  "🛎️",
  "⚽",
  "🥎",
  "🏐",
  "🏉",
  "🥏",
  "🏓",
  "🏸",
  "🥊",
  "🥋",
  "🧗",
  "🏃",
  "🏄",
  "🏊",
  "🚣",
  "🤺",
  "🤸",
  "🛼",
  "🛻",
  "🪕",
  "🪗",
  "🧩",
  "🪬",
  "🪚",
  "🧰",
  "🛠️",
  "🔨",
  "⚒️",
  "🧴",
  "🧷",
  "🧹",
  "🧺",
  "🪣",
  "🩺",
  "💡",
  "🔦",
  "🔌",
  "💻",
  "🖥️",
  "🖨️",
  "🖱️",
  "🎛️",
  "📻",
  "📺",
  "📷",
  "🎥",
  "📽️",
  "📡",
  "🗺️",
  "🪧",
  "🏳️",
  "🏴",
  "🎌",
  "🎭",
  "🎪",
  "🎟️",
  "🎫",
  "🔔",
  "🚨",
  "🚧",
  "⛏️",
  "🛟",
  "🪸",
  "🪜",
  "🪝",
  "🪞",
  "🪟",
  "🪦",
  "🧻",
  "🧼",
  "🧽",
  "🪙",
  "🪼",
  "🧲",
  "🎤",
  "🎧",
  "🎷",
  "🪇",
  "🪆",
  "🪪",
  "🦈",
  "🫷",
  "👈",
  "🤚",
  "🔫",
  "👝",
  "🤾",
  "👜"
];
// shuffle Fisher–Yates
function shuffleArray(array) {
  const arr = [...array]; // copy, so original isn't changed
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// for fast performance during startGame() loadingscreen - cache just a subset of 50 shuffled obstacles (initEmojiCache->drawLoadingScreen)
const obstacleTypes = shuffleArray(obstacleTypesFullSet).slice(0, 50);

const obstacleHitboxInset = 20; // ignore glancing side contacts

const collisionHorizontalPadding = 30; // increase to be more permissive
const collisionVerticalPadding = 30; // increase to be more permissive

const autojumpVerticalTolerance = 40; // how far into the obstacle vertically to still auto-jump
const autojumpHorizontalMargin = 30; // how close horizontally before auto-jump

async function initObstacleCache(progressCallback) {
  if (renderCache.map.size > 0) return;
  const total = obstacleTypes.length * obstacleSizesScaled.length;
  let count = 0;
  for (const emoji of obstacleTypes) {
    for (const size of obstacleSizesScaled) {
      renderCache.ensure(emoji, size);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}
function spawnObstacle() {
  const obstacleVerticalOffset = Math.floor(60 * scale);

  const size = obstacleSizesScaled[Math.floor(Math.random() * obstacleSizesScaled.length)];
  const type =
    obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  const img = renderCache.get(type, size); // cheap if cached
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size + obstacleVerticalOffset,
    width: size,
    height: size,
    type,
    img // store the offscreen canvas
  });
}

// ----------------------------- //
/* COLLECTIBLES */
// ----------------------------- //

/* COLLECTIBLES */
let collectibles = [];

const collectibleSizes = [40, 50, 60];
const collectibleTypes = [
  "🐟",
  "🐠",
  "💎",
  "🍪",
  "🍩",
  "🎁",
  "🪙",
  "⭐",
  "🌟",
  "🎵",
  "🦐",
  "🐡",
  "🕊️",
  "🐦‍⬛",
  "🦆",
  "🐓",
  "🐥",
  "🦜",
  "🦢",
  "🪿",
  "🦃"
];
const collectibleScores = {
  "🐟": 5,
  "🐠": 6,
  "🦐": 7,
  "🐡": 8,
  "💎": 25,
  "🍪": 10,
  "🍩": 10,
  "🎁": 15,
  "🪙": 12,
  "⭐": 20,
  "🌟": 20,
  "🎵": 5,
  "🕊️": 8,
  "🐦‍⬛": 9,
  "🦆": 8,
  "🐓": 7,
  "🐥": 6,
  "🦜": 9,
  "🦢": 10,
  "🪿": 10,
  "🦃": 12
};
const defaultCollectibleScore = 5;

async function initCollectibleCache(progressCallback) {
  const total = collectibleTypes.length * collectibleSizesScaled.length;
  let count = 0;
  for (const emoji of collectibleTypes) {
    for (const size of collectibleSizesScaled) {
      renderCache.ensure(emoji, size);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}

function spawnCollectible() {
  const size =
    collectibleSizesScaled[Math.floor(Math.random() * collectibleSizesScaled.length)];
  const type =
    collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
  const y =
    canvas.height -
    Math.floor(350 * scale) +
    Math.random() * Math.floor(180 * scale);
  const img = renderCache.get(type, size);
  collectibles.push({
    x: canvas.width,
    y,
    width: size,
    height: size,
    type,
    img
  });
}

// ----------------------------- //
/* AUDIO */
// ----------------------------- //

/* MEOWS */
const meowSounds = [
  "assets/audio/meow_sounds/soundzee-cat-meow-361882.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-13-fx-306192.mp3",
  "assets/audio/meow_sounds/ribhavagrawal-cat-meowing-type-02-293290.mp3",
  "assets/audio/meow_sounds/freesound_community-cat-meow-99835.mp3",
  "assets/audio/meow_sounds/freesound_community-meow-39411.mp3",
  "assets/audio/meow_sounds/soulfuljamtracks-cat-meow-2-fx-323466.mp3",
  "assets/audio/meow_sounds/dragon-studio-kitten-sfx-405457.mp3",
  "assets/audio/meow_sounds/freesound_community-cat-purring-and-meow-5928.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-15-fx-306190.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-4-fx-306180.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-12-fx-306191.mp3",
  "assets/audio/meow_sounds/soulfuljamtracks-cat-meow-1-fx-323465.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-3-fx-306179.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-14-fx-306189.mp3",
  "assets/audio/meow_sounds/freesound_community-angry-cat-meow-82091.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-9-fx-306185.mp3",
  "assets/audio/meow_sounds/freesound_community-cat-meow-81626.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-1-fx-306178.mp3",
  "assets/audio/meow_sounds/scottishperson-sound-effect-cat-meow-279336.mp3",
  "assets/audio/meow_sounds/dragon-studio-cartoon-cat-meow-487661.mp3",
  "assets/audio/meow_sounds/sound_garage-cat-meow-7-fx-306186.mp3",
  "assets/audio/meow_sounds/u_6ekfl947a2-cat-meow-297927.mp3",
  "assets/audio/meow_sounds/dragon-studio-cartoon-kitten-meow-487668.mp3",
  "assets/audio/meow_sounds/freesound_community-cat-meow-85175.mp3",
  "assets/audio/meow_sounds/dragon-studio-meow-sfx-405456.mp3",
  "assets/audio/meow_sounds/dragon-studio-cute-cat-meow-472372.mp3",
  "assets/audio/meow_sounds/dragon-studio-cat-meow-401729.mp3"
];
// preload MEOWS
const meowAudioPool = meowSounds.map((src) => {
  const a = new Audio(src);
  a.preload = "auto";
  return a;
});
// MEOW
function meow() {
  const idx = Math.floor(Math.random() * meowAudioPool.length);
  const audio = meowAudioPool[idx].cloneNode(); // clone to allow overlapping plays
  audio.volume = 0.1;
  audio.play().catch((e) => console.log("Audio play failed:", e));
}

// ----------------------------- //
/* GAME START */
// ----------------------------- //

/* HOW TO START */

// On 2 attempts to enter empty name, autocomplete to "Anon"
let emptyNameAttempts = 0;

// Focus/blur handling for hidden input -> canvas display sync
nameInput.addEventListener("focus", () => {});
nameInput.addEventListener("blur", () => {
  currentName = nameInput.value.trim();
});
nameInput.addEventListener("input", () => {
  emptyNameAttempts = 0;
  currentName = nameInput.value;
});

// Canvas click handler for pre-game UI (no longer needed with HTML elements)
canvas.addEventListener("mousedown", () => {
  if (gameRunning) return;
});

// Enter key starts game from hidden input (still captures keyboard focus)
nameInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    startGame();
  }
});

// Touch support for pre-game HTML elements on mobile
nameInput.addEventListener("touchstart", () => nameInput.focus(), {
  passive: true
});

// Start/Restart button click handler
startBtn.addEventListener("click", () => {
  if (gameRunning) restartGame();
  else startGame();
});

startBtn.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    if (gameRunning) restartGame();
    else startGame();
  },
  { passive: false }
);

// Scale sizes for different display sizes
let scaleComputed = false;
let cachesBuilt = false;
let scale,
  catSizeScaled,
  catXScaled,
  gravityScaled,
  jumpStrengthScaled,
  initialSpeedScaled,
  maxSpeedScaled,
  speedIncrementScaled,
  collisionHorizontalPaddingScaled,
  obstacleHitboxInsetScaled,
  collisionVerticalPaddingScaled,
  obstacleSizesScaled,
  autojumpVerticalToleranceScaled,
  autojumpHorizontalMarginScaled,
  grassMinSpacingScaled,
  grassMaxSpacingScaled,
  collectibleSizesScaled;
function computeScale() {
  const renderedW = canvas.clientWidth || baseWidth;
  const renderedH = canvas.clientHeight || baseHeight;
  scale = Math.min(renderedW / baseWidth, renderedH / baseHeight);

  canvas.width = Math.round(baseWidth * scale);
  canvas.height = Math.round(baseHeight * scale);

  catSizeScaled = Math.round(catSize * scale);
  catXScaled = Math.round(catX * scale);
  catYScaled = Math.round(catY * scale);
  gravityScaled = Math.round(gravity * scale * 10) / 10;
  jumpStrengthScaled = Math.round(jumpStrength * scale * 10) / 10;
  initialSpeedScaled = Math.round(initialSpeed * scale * 10) / 10;
  maxSpeedScaled = Math.round(maxSpeed * scale * 10) / 10;
  speedIncrementScaled = Math.round(speedIncrement * scale * 100) / 100;
  collisionHorizontalPaddingScaled = Math.round(collisionHorizontalPadding * scale);
  obstacleHitboxInsetScaled = Math.round(obstacleHitboxInset * scale);
  collisionVerticalPaddingScaled = Math.round(collisionVerticalPadding * scale);
  obstacleSizesScaled = obstacleSizes.map((s) => Math.round(s * scale));
  autojumpVerticalToleranceScaled = Math.round(autojumpVerticalTolerance * scale);
  autojumpHorizontalMarginScaled = Math.round(autojumpHorizontalMargin * scale);
  grassMinSpacingScaled = Math.round(grassMinSpacing * scale);
  grassMaxSpacingScaled = Math.round(grassMaxSpacing * scale);
  collectibleSizesScaled = collectibleSizes.map((s) => Math.round(s * scale));
  grassSizes = grassBaseSizes.map((s) => Math.round(s * scale));
  bgGrassSizes = bgGrassBaseSizes.map((s) => Math.round(s * scale));
  treeSizes = treeBaseSizes.map((s) => Math.round(s * scale));
  bgTreeSizes = bgTreeBaseSizes.map((s) => Math.round(s * scale));

  // Compute canvas-drawn pre-game UI geometry
  nameFieldY = Math.round(150 * scale);

  startBtnH = Math.round(45 * scale);
  startBtnY = Math.round(210 * scale);

  scaleComputed = true;
}

/* DRAW PRE-GAME UI */
function drawPreGameUI() {
  canvasWrapper.classList.remove("game-active");
  if (!scaleComputed) computeScale();

  // Clear and draw static background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStaticBackground();

  // Draw title "Negruta's Adventures" (below HTML input + button)
  ctx.save();
  const titleFontSize = Math.round(32 * scale);
  ctx.font = `bold ${titleFontSize}px "Orbitron", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#d4af37";
  ctx.fillText(
    "Negruta's Adventures",
    canvas.width / 2,
    startBtnY + startBtnH + 15 * scale
  );

  // Draw subtitle below title
  const subtitleFontSize = Math.round(16 * scale);
  ctx.font = `${subtitleFontSize}px 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#b8972e";
  ctx.fillText(
    "Jump over obstacles and collect treats!",
    canvas.width / 2,
    startBtnY + startBtnH + 45 * scale
  );

  // Draw instructions below subtitle
  const instrFontSize = Math.round(14 * scale);
  ctx.font = `${instrFontSize}px 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#888";
  ctx.fillText(
    "Click or tap to jump • Spacebar to jump",
    canvas.width / 2,
    startBtnY + startBtnH + 75 * scale
  );

  ctx.restore();
}

/* START GAME */

// RESET GAME
let celestialObjects = [];
function initCelestial() {
  const CELESTIAL_TYPES = ["⭐", "🌟", "✨", "💫", "🪐", "🛩️", "✈️", "🚀"];
  const count = Math.floor(Math.random() * 20) + 11;
  const skyHeight = canvas.height * (1 - groundHeightRatio);
  for (let i = 0; i < count; i++) {
    celestialObjects.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (skyHeight - 150 * scale) + 50 * scale,
      size: Math.floor((Math.random() * 20 + 7) * scale),
      emoji: CELESTIAL_TYPES[Math.floor(Math.random() * CELESTIAL_TYPES.length)]
    });
  }
}
// Calls: initGrassStrips(), initBgGrassStrips(), initTreeStrips(), initBgTreeStrips(), initMoon(), initCelestial()
function resetGame() {
  score = 0;
  catYScaled = canvas.height - catSizeScaled / 2; // center of cat is at half the size of cat, initially
  velocityY = 0;
  jumpCount = 0;
  obstacles = [];
  collectibles = [];
  frameCount = 0;
  nextObstacleFrame = 100;
  currentSpeed = initialSpeedScaled;

  grassOffset = 0;
  initGrassStrips();

  bgGrassOffset = 0;
  initBgGrassStrips();

  treeOffset = 0;
  initTreeStrips(1.2);

  bgTreeOffset = 0;
  initBgTreeStrips(1.8);

  initMoon();
  moonX = canvas.width * 0.75;

  celestialObjects = [];
  initCelestial();
}

function restartGame() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  resetGame();
  gameRunning = true;
  lastTime = performance.now();
  update(performance.now());
}

// calls: computeScale(), drawLoadingScreen(), initEmojiCache(), initCollectibleCache(), resetGame(), update()
async function startGame() {
  currentName = nameInput.value.trim();

  if (currentName === "") {
    emptyNameAttempts++;
    if (emptyNameAttempts >= 2) {
      nameInput.value = "Anon";
      currentName = "Anon";
      emptyNameAttempts = 0;
    } else {
      nameInput.focus();
      nameInput.classList.add("shake");
      setTimeout(() => nameInput.classList.remove("shake"), 300);
      return;
    }
  }
  playerName = currentName;

  startBtn.disabled = true;
  nameInput.disabled = true;

  if (!scaleComputed) computeScale();
  if (!cachesBuilt || !scaleComputed) {
    renderCache.clear();
    cachesBuilt = false;
  }

  if (!cachesBuilt) {
    const totalObstacles = obstacleTypes.length * obstacleSizesScaled.length;
    const totalCollectibles =
      collectibleTypes.length * collectibleSizesScaled.length;
    const totalGrass = grassEmojis.length * grassSizes.length;
    const totalBgGrass = bgGrassEmojis.length * bgGrassSizes.length;
    const totalTrees = treeEmojis.length * treeSizes.length;
    const totalBgTrees = bgTreeEmojis.length * bgTreeSizes.length;
    const grandTotal =
      totalObstacles +
      totalCollectibles +
      totalGrass +
      totalBgGrass +
      totalTrees +
      totalBgTrees;
    const progressObstacles = (count) => {
      drawLoadingScreen(count, grandTotal);
    };
    const progressCollectibles = (count) => {
      drawLoadingScreen(totalObstacles + count, grandTotal);
    };
    const progressGrass = (count) => {
      drawLoadingScreen(totalObstacles + totalCollectibles + count, grandTotal);
    };
    const progressBgGrass = (count) => {
      drawLoadingScreen(
        totalObstacles + totalCollectibles + totalGrass + count,
        grandTotal
      );
    };
    const progressTrees = (count) => {
      drawLoadingScreen(
        totalObstacles + totalCollectibles + totalGrass + totalBgGrass + count,
        grandTotal
      );
    };
    const progressBgTrees = (count) => {
      drawLoadingScreen(
        totalObstacles +
          totalCollectibles +
          totalGrass +
          totalBgGrass +
          totalTrees +
          count,
        grandTotal
      );
    };
    drawLoadingScreen(0, grandTotal);
    await initObstacleCache(progressObstacles);
    await initCollectibleCache(progressCollectibles);
    await initGrassCache(progressGrass);
    await initBgGrassCache(progressBgGrass);
    await initTreeCache(progressTrees);
    await initBgTreeCache(progressBgTrees);
  }
  cachesBuilt = true;
  startBtn.disabled = false;
  startBtn.textContent = "Restart";

  gameRunning = true;
  canvasWrapper.classList.add("game-active");
  resetGame();
  lastTime = performance.now();
  update(performance.now());
}

/* HOW TO PLAY */
// allow click
canvas.addEventListener("mousedown", () => {
  if (gameRunning && jumpCount < maxJumpsBeforeReset) {
    velocityY = jumpStrengthScaled;
    jumpCount++;
  }
});

// allow touch - support for mobile devices
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();

    if (gameRunning && jumpCount < maxJumpsBeforeReset) {
      velocityY = jumpStrengthScaled;
      jumpCount++;
    }
  },
  { passive: false }
);

// allow double-clicks - to perform an extra jump (helps automation/double-click input)
canvas.addEventListener("dblclick", () => {
  if (!gameRunning) return; // if there's room for another jump, do it
  if (jumpCount < maxJumpsBeforeReset) {
    velocityY = jumpStrengthScaled;
    jumpCount++;
  }
});

// prevent spacebar from scrolling the page while the game is running, but allow normal typing in inputs/textareas and content editable elements.
window.addEventListener("keydown", (e) => {
  const isSpace =
    e.code === "Space" ||
    e.key === " " ||
    e.key === "Spacebar" ||
    e.keyCode === 32;
  if (!isSpace) return;

  const target = e.target;
  const tag = target && target.tagName;
  const isEditable =
    target &&
    (target.isContentEditable || tag === "INPUT" || tag === "TEXTAREA");
  if (isEditable) return;

  if (gameRunning) {
    e.preventDefault(); // stop page from scrolling
    if (jumpCount >= maxJumpsBeforeReset) return;
    velocityY = jumpStrengthScaled;
    jumpCount++;
  }
});

// ----------------------------- //
/* DURING GAME PLAY */
// ----------------------------- //

/* DRAW */

/* LOADING SCREEN */
// Used by startGame()
function drawLoadingScreen(current, total) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = '36px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2 - 40 * scale);
  const barWidth = 400 * scale;
  const barHeight = 24 * scale;
  const barX = (canvas.width - barWidth) / 2;
  const barY = canvas.height / 2 + 20 * scale;
  ctx.fillStyle = "#333";
  ctx.fillRect(barX, barY, barWidth, barHeight);
  const pct = current / total;
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(barX, barY, barWidth * pct, barHeight);
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);
  ctx.fillStyle = "#ccc";
  ctx.font = '18px "Segoe UI", Arial, sans-serif';
  ctx.fillText(
    `${Math.round(pct * 100)}%`,
    canvas.width / 2,
    barY + barHeight + 30 * scale
  );
}

// Draw static background: sky gradient + undulating ground (no animated elements)
function drawStaticBackground() {
  ctx.fillStyle = createSkyGradient();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawUndulatingGround();
}

// Generate Night Sky background gradient (full canvas, ground drawn on top)
function createSkyGradient() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0a0a2e");
  gradient.addColorStop(0.5, "#1a1a4e");
  gradient.addColorStop(1, "#2d1b69");
  return gradient;
}

// Draw: createSkyGradient(), drawUndulatingGround(), celestial, moon, trees, bg-grass, obstacles, fg-grass, collectibles, cat [renderCache]
function draw() {
  // Draw sky gradient across full canvas (ground drawn on top)
  ctx.fillStyle = createSkyGradient();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw undulating ground with green transition zone
  drawUndulatingGround();

  // Draw parallax layers back to front: celestial -> moon -> trees -> bg-grass -> obstacles -> cat -> collectibles -> fg-grass
  // Draw celestial objects (back layer)
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  celestialObjects.forEach((obj) => {
    ctx.font = `${obj.size}px Arial`;
    ctx.fillText(obj.emoji, obj.x, obj.y);
  });
  ctx.restore();

  // Draw Moon
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const moonSize = Math.round(80 * scale);
  ctx.font = `${moonSize}px serif`;
  ctx.fillText("🌖", moonX, canvas.height * 0.25);

  // Draw Background Trees - pre-rendered scrolling strips (2 draw calls)
  if (bgTreeStripCanvas) {
    ctx.drawImage(bgTreeStripCanvas, -bgTreeOffset, 0);
    ctx.drawImage(bgTreeStripCanvas, bgTreeStripWidth - bgTreeOffset, 0);
  }

  // Draw Trees - pre-rendered scrolling strips (2 draw calls)
  if (treeStripCanvas) {
    ctx.drawImage(treeStripCanvas, -treeOffset, 0);
    ctx.drawImage(treeStripCanvas, treeStripWidth - treeOffset, 0);
  }

  // Draw Background Grass - pre-rendered scrolling strips (2 draw calls)
  if (bgGrassStripCanvas) {
    ctx.drawImage(bgGrassStripCanvas, -bgGrassOffset, 0);
    ctx.drawImage(bgGrassStripCanvas, bgGrassStripWidth - bgGrassOffset, 0);
  }

  // Draw Collectibles
  collectibles.forEach((coll) => {
    const img = coll.img || renderCache.get(coll.type, coll.height);
    if (!img) return;
    const dx = coll.x - img.width / 2 + coll.width / 2; // center horizontally
    const dy = coll.y + coll.height - img.height; // align bottom
    ctx.drawImage(img, dx, dy, img.width, img.height);
  });

  // Draw Cat (Black Cat Emoji) - Flipped Horizontally
  ctx.save();
  ctx.translate(catXScaled, catYScaled);
  ctx.scale(-1, 1);
  ctx.font = `${catSizeScaled}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🐈‍⬛", 0, 0);
  ctx.restore();

  // Draw Obstacles (centered on collision box center)
  obstacles.forEach((obs) => {
    const img = obs.img || renderCache.get(obs.type, obs.height);
    if (!img) return;
    // center/position as you want (example aligns bottom center like before)
    ctx.drawImage(
      img,
      obs.x + obs.width / 2 - img.width / 2,
      obs.y + obs.height - img.height,
      img.width,
      img.height
    );
  });

  // Draw Foreground Grass - pre-rendered scrolling strips (2 draw calls)
  if (grassStripCanvas) {
    ctx.drawImage(grassStripCanvas, -grassOffset, 0);
    ctx.drawImage(grassStripCanvas, grassStripWidth - grassOffset, 0);
  }

  // Draw Score + Speed counter (top-left)
  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 15, 25);
  ctx.fillText(`Speed: ${currentSpeed.toFixed(1)}`, 15, 48);
}

/* UPDATE FRAME MOVEMENT */
// gravity, floor collision, obstacle movement + collsion + meow(), Collectibles movement + collision, grass scrolling + randomGrassGap, spawnObstacle(), spawnCollectible(), draw(),
let lastTime = 0;
function update(timestamp) {
  if (!gameRunning) {
    drawPreGameUI();
    requestAnimationFrame(update);
    return;
  }

  const dt = timestamp ? (timestamp - lastTime) / 16.67 : 1; // normalize to ~60fps
  lastTime = timestamp || 0;

  currentSpeed = Math.min(
    maxSpeedScaled,
    initialSpeedScaled + Math.floor(score / 5) * speedIncrementScaled
  );

  // Gravity
  velocityY += gravityScaled * dt;
  catYScaled += velocityY * dt;

  const catLeft = catXScaled - catSizeScaled / 2;
  const catRight = catXScaled + catSizeScaled / 2;
  const catTop = catYScaled - catSizeScaled / 2;
  const catBottom = catYScaled + catSizeScaled / 2;

  // Floor collision
  if (catBottom > canvas.height) {
    catYScaled = canvas.height - catSizeScaled / 2;
    velocityY = 0;
    jumpCount = 0;
  }

  // Obstacle movement
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= currentSpeed * dt;

    const obsTop = obstacles[i].y;
    const obsBottom = obstacles[i].y + obstacles[i].height;
    const obsLeft = obstacles[i].x + Math.floor(10 * scale);
    const obsRight =
      obstacles[i].x + obstacles[i].width - Math.floor(10 * scale);

    // Auto-jump when cat is about to land on top of obstacle
    if (
      // cat bottom is at or below the top, or slightly into it (tolerance)
      catBottom >= obsTop - autojumpVerticalToleranceScaled &&
      catBottom <= obsTop + autojumpVerticalToleranceScaled &&
      // only auto-jump when falling or near landing
      velocityY >= 0 &&
      // horizontal overlap: cat is overlapping or very close to obstacle horizontally
      catLeft < obsRight + autojumpHorizontalMarginScaled &&
      catRight > obsLeft - autojumpHorizontalMarginScaled
    ) {
      velocityY = jumpStrengthScaled;
      jumpCount = 1;
      meow();
    }

    // Collision with sides or bottom of obstacle triggers game over
    else if (
      catBottom > obsTop + collisionVerticalPaddingScaled &&
      catTop < obsBottom - collisionVerticalPaddingScaled &&
      // require more horizontal overlap (ignore glancing side contacts)
      catLeft < obsRight - collisionHorizontalPaddingScaled &&
      catRight >= obsLeft + obstacleHitboxInsetScaled + collisionHorizontalPaddingScaled
    ) {
      meow();
      gameOver();
      return;
    }
    if (obstacles[i].x + obstacles[i].width < 0) {
      const lastObs = obstacles.length - 1;
      if (i < lastObs) obstacles[i] = obstacles[lastObs];
      obstacles.pop();
      i--;
      score++;
    }
  }

  // Collectibles movement and collision (larger hitbox for easier collection)
  for (let i = collectibles.length - 1; i >= 0; i--) {
    collectibles[i].x -= currentSpeed * dt;

    if (
      catLeft <=
        collectibles[i].x + collectibles[i].width - Math.floor(15 * scale) &&
      catRight >= collectibles[i].x - Math.floor(40 * scale) &&
      catTop <=
        collectibles[i].y + collectibles[i].height - Math.floor(15 * scale) &&
      catBottom >= collectibles[i].y - Math.floor(40 * scale)
    ) {
      const collType = collectibles[i].type;
      const lastColl = collectibles.length - 1;
      if (i < lastColl) collectibles[i] = collectibles[lastColl];
      collectibles.pop();
      i--;
      score += collectibleScores[collType] ?? defaultCollectibleScore;
      continue;
    }

    if (collectibles[i].x + collectibles[i].width < 0) {
      const lastColl = collectibles.length - 1;
      if (i < lastColl) collectibles[i] = collectibles[lastColl];
      collectibles.pop();
      i--;
    }
  }

  // Grass scrolling - update offset for pre-rendered strips
  grassOffset += currentSpeed * grassSpeedRatio * dt;
  if (grassOffset >= grassStripWidth) {
    grassOffset -= grassStripWidth;
  }

  // Background grass scrolling (slower parallax)
  bgGrassOffset += currentSpeed * bgGrassSpeedRatio * dt;
  if (bgGrassOffset >= bgGrassStripWidth) {
    bgGrassOffset -= bgGrassStripWidth;
  }

  // Tree scrolling (even slower parallax)
  treeOffset += currentSpeed * treeSpeedRatio * dt;
  if (treeOffset >= treeStripWidth) {
    treeOffset -= treeStripWidth;
  }

  // Background Tree scrolling (far even slower parallax)
  bgTreeOffset += currentSpeed * bgTreeSpeedRatio * dt;
  if (bgTreeOffset >= bgTreeStripWidth) {
    bgTreeOffset -= bgTreeStripWidth;
  }

  // Moon scrolling (slowest parallax)
  moonX -= currentSpeed * moonSpeedRatio * dt;
  if (moonX < -80 * scale) {
    moonX = canvas.width + 80 * scale;
  }

  // Spawn obstacles and collectibles
  frameCount++;
  if (frameCount >= nextObstacleFrame) {
    spawnObstacle();
    const minGap = Math.max(
      Math.floor(60 * scale),
      Math.floor(680 * scale) - score
    );
    nextObstacleFrame =
      frameCount + minGap + Math.floor(Math.random() * Math.floor(120 * scale));
  }
  if (frameCount % Math.floor(150 * scale) === 0) {
    spawnCollectible();
  }

  draw();
  animationFrameId = requestAnimationFrame(update);
}

// ----------------------------- //
/* GAME OVER */
// ----------------------------- //

function saveScore(name, finalScore) {
  const newScore = {
    name,
    score: finalScore,
    date: new Date().toLocaleDateString()
  };
  let scores = JSON.parse(localStorage.getItem("catGameScores") || "[]");
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score);
  if (scores.length > 50) scores = scores.slice(0, 50);
  localStorage.setItem("catGameScores", JSON.stringify(scores));
  displayScores();
  drawPreGameUI();

  // Start animation loop for pre-game UI
  requestAnimationFrame(update);
}

// saveScore(), gameOverDialog [playAgainBtn + gameOverCloseBtn]
function gameOver() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  gameRunning = false;
  saveScore(playerName, score);

  document.getElementById("gameOverName").textContent = playerName;
  document.getElementById("gameOverScore").textContent = `Score: ${score}`;
  document.getElementById("gameOverDate").textContent =
    new Date().toLocaleDateString();

  const scores = JSON.parse(localStorage.getItem("catGameScores") || "[]");
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  const gameOverScoresList = document.getElementById("gameOverScores");
  gameOverScoresList.innerHTML = "";
  const medals = ["🥇", "🥈", "🥉"];
  topScores.forEach((s, i) => {
    const li = document.createElement("li");
    const medal = i < 3 ? medals[i] : `${i + 1}.`;
    li.textContent = `${medal} ${s.name}: ${s.score} (${s.date})`;
    gameOverScoresList.appendChild(li);
  });

  gameOverDialog.showModal();
}
playAgainBtn.addEventListener("click", () => {
  gameOverDialog.close();
  startGame();
});
gameOverCloseBtn.addEventListener("click", () => {
  gameOverDialog.close();
  startBtn.textContent = "Start Game";
  startBtn.disabled = false;
  nameInput.disabled = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  drawPreGameUI();
});

// ----------------------------- //
/* ON LOAD */
// ----------------------------- //

// create a default high score if none exist
function ensureDefaultHighScore() {
  const key = "catGameScores";
  const existing = JSON.parse(localStorage.getItem(key) || "null");
  if (!existing) {
    const defaultScores = [
      {
        name: "Negruta",
        score: 500,
        date: new Date().toLocaleDateString()
      }
    ];
    localStorage.setItem(key, JSON.stringify(defaultScores));
  }
}
ensureDefaultHighScore();

// Initialize scores display on load
function displayScores() {
  const scoreList = document.getElementById("scoreList");
  if (!scoreList) return;
  const scores = JSON.parse(localStorage.getItem("catGameScores") || "[]");
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  scoreList.innerHTML = "";
  const medals = ["🥇", "🥈", "🥉"];
  topScores.forEach((s, i) => {
    const li = document.createElement("li");
    const medal = i < 3 ? medals[i] : `${i + 1}.`;
    const text = document.createTextNode(
      `${medal} ${s.name}: ${s.score} (${s.date})`
    );
    li.appendChild(text);
    scoreList.appendChild(li);
  });
}

// Handle window resize: mark scale as stale so next startGame recomputes
window.addEventListener("resize", () => {
  if (scaleComputed && !gameRunning) {
    scaleComputed = false;
    cachesBuilt = false;
    renderCache.clear();
    obstacles = [];
    collectibles = [];
    grassStripCanvas = null;
    drawPreGameUI();
  }
});

function isPortrait() {
  return screen.height > screen.width;
}

function enableLandscapeRotation() {
  if (!isPortrait()) return;
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape-primary').catch(() => {
      canvasWrapper.classList.add('landscape-rotate');
    });
  } else {
    canvasWrapper.classList.add('landscape-rotate');
  }
}

function disableLandscapeRotation() {
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
  canvasWrapper.classList.remove('landscape-rotate');
}

// Fullscreen toggle for game canvas
if (canvasWrapper.requestFullscreen || canvasWrapper.webkitRequestFullscreen) {
  function toggleFullscreen() {
    if (document.fullscreenElement === canvasWrapper) {
      document.exitFullscreen();
    } else {
      if (canvasWrapper.requestFullscreen) canvasWrapper.requestFullscreen();
      else if (canvasWrapper.webkitRequestFullscreen) canvasWrapper.webkitRequestFullscreen();
    }
  }

  fullscreenBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFullscreen();
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === canvasWrapper) {
      fullscreenBtn.textContent = "⛶";
      enableLandscapeRotation();
      if (gameRunning) {
        cancelAnimationFrame(animationFrameId);
        scaleComputed = false;
        cachesBuilt = false;
        renderCache.clear();
        obstacles = [];
        collectibles = [];
        grassStripCanvas = null;
        bgGrassStripCanvas = null;
        treeStripCanvas = null;
        bgTreeStripCanvas = null;
        startGame();
      } else {
        computeScale();
        cachesBuilt = false;
        renderCache.clear();
        obstacles = [];
        collectibles = [];
        grassStripCanvas = null;
        bgGrassStripCanvas = null;
        treeStripCanvas = null;
        bgTreeStripCanvas = null;
        drawPreGameUI();
      }
    } else {
      fullscreenBtn.textContent = "⤢";
      disableLandscapeRotation();
      if (gameRunning) {
        cancelAnimationFrame(animationFrameId);
        scaleComputed = false;
        cachesBuilt = false;
        renderCache.clear();
        obstacles = [];
        collectibles = [];
        grassStripCanvas = null;
        bgGrassStripCanvas = null;
        treeStripCanvas = null;
        bgTreeStripCanvas = null;
        startGame();
      } else {
        scaleComputed = false;
        cachesBuilt = false;
        renderCache.clear();
        obstacles = [];
        collectibles = [];
        grassStripCanvas = null;
        drawPreGameUI();
      }
    }
  });

  if (canvasWrapper.webkitRequestFullscreen) {
    document.addEventListener("webkitfullscreenchange", () => {
      if (document.webkitFullscreenElement === canvasWrapper) {
        fullscreenBtn.textContent = "⛶";
        enableLandscapeRotation();
        if (gameRunning) {
          cancelAnimationFrame(animationFrameId);
          scaleComputed = false;
          cachesBuilt = false;
          renderCache.clear();
          obstacles = [];
          collectibles = [];
          grassStripCanvas = null;
          bgGrassStripCanvas = null;
          treeStripCanvas = null;
          bgTreeStripCanvas = null;
          startGame();
        } else {
          computeScale();
          cachesBuilt = false;
          renderCache.clear();
          obstacles = [];
          collectibles = [];
          grassStripCanvas = null;
          bgGrassStripCanvas = null;
          treeStripCanvas = null;
          bgTreeStripCanvas = null;
          drawPreGameUI();
        }
      } else {
        fullscreenBtn.textContent = "⤢";
        disableLandscapeRotation();
        if (gameRunning) {
          cancelAnimationFrame(animationFrameId);
          scaleComputed = false;
          cachesBuilt = false;
          renderCache.clear();
          obstacles = [];
          collectibles = [];
          grassStripCanvas = null;
          bgGrassStripCanvas = null;
          treeStripCanvas = null;
          bgTreeStripCanvas = null;
          startGame();
        } else {
          scaleComputed = false;
          cachesBuilt = false;
          renderCache.clear();
          obstacles = [];
          collectibles = [];
          grassStripCanvas = null;
          drawPreGameUI();
        }
      }
    });
  }
} else {
  fullscreenBtn.style.display = "none";
}

displayScores();

// Draw pre-game UI on page load (static, no animation loop)
computeScale();
drawPreGameUI();
