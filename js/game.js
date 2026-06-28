/* GET ELEMENTS */
const scoreElement = document.getElementById("gameScore");
const nameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startGameBtn");
const gameOverDialog = document.getElementById("gameOverDialog");
const playAgainBtn = document.getElementById("playAgainBtn");
const gameOverCloseBtn = document.getElementById("gameOverCloseBtn");
const canvas = document.getElementById("gameCanvas");

/* CANVAS */
const ctx = canvas.getContext("2d"); // 2D drawing context
const BASE_WIDTH = 800;
const BASE_HEIGHT = 550;

let frameCount = 0;

/* MOVEMENT */
const gravity = 1;
const jumpStrength = -20;
const maxJumpsBeforeReset = 2;
const INITIAL_SPEED = 10;
const MAX_SPEED = 50;
const SPEED_INCREMENT = 0.1;

let currentSpeed = INITIAL_SPEED;
let velocityY = 0;
let jumpCount = 0;

/* CAT */
let CAT_SIZE = 80;
let CAT_X = 150;
let CAT_Y = 0;

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
/* GRASS */
// ----------------------------- //

let grassStripCanvas = null;
let grassOffset = 0;
let grassStripWidth = 0;
const grassSizes = [30, 40, 50];
const GRASS_MIN_SPACING = 120;
const GRASS_MAX_SPACING = 200;

const GRASS_EMOJIS = [
  "🌱",
  "🌿",
  "☘️",
  "🍀",
  "🌾",
  "🎍",
  "🪴",
  "🌼",
  "🌻",
  "🌷",
  "🥀",
  "🍂",
  "🍁",
  "🌹",
  "🪻"
];

function randomGrassGap() {
  return Math.floor(
    grassMinSpacing + Math.random() * (grassMaxSpacing - grassMinSpacing)
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
  const margin = Math.max(...grassSizes) * scale;
  let x = margin;
  while (x < stripW - margin) {
    const emoji = GRASS_EMOJIS[Math.floor(Math.random() * GRASS_EMOJIS.length)];
    const size =
      grassSizes[Math.floor(Math.random() * grassSizes.length)] * scale;
    const img = renderCache.get(emoji, Math.round(size));
    if (img) {
      sctx.drawImage(img, x - img.width / 2, canvas.height - img.height);
    }
    x += randomGrassGap();
  }
}

// ----------------------------- //
/* OBSTACLES */
// ----------------------------- //

/* OBSTACLES */
let obstacles = [];
let nextObstacleFrame = 100;
const OBSTACLE_SIZES = [200, 250, 300];
const OBSTACLE_TYPES_FULL_SET = [
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
const OBSTACLE_TYPES = shuffleArray(OBSTACLE_TYPES_FULL_SET).slice(0, 50);

const OBSTACLE_HITBOX_INSET = 20; // ignore glancing side contacts

const COLLISION_HORIZONTAL_PADDING = 30; // increase to be more permissive
const COLLISION_VERTICAL_PADDING = 30; // increase to be more permissive

const AUTOJUMP_VERTICAL_TOLERANCE = 40; // how far into the obstacle vertically to still auto-jump
const AUTOJUMP_HORIZONTAL_MARGIN = 30; // how close horizontally before auto-jump

async function initObstacleCache(progressCallback) {
  if (renderCache.map.size > 0) return;
  const total = OBSTACLE_TYPES.length * obstacleSizes.length;
  let count = 0;
  for (const emoji of OBSTACLE_TYPES) {
    for (const size of obstacleSizes) {
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
  const OBSTACLE_VERTICAL_OFFSET = Math.floor(60 * scale);

  const size = obstacleSizes[Math.floor(Math.random() * obstacleSizes.length)];
  const type =
    OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  const img = renderCache.get(type, size); // cheap if cached
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size + OBSTACLE_VERTICAL_OFFSET,
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

const COLLECTIBLE_SIZES = [40, 50, 60];
const COLLECTIBLE_TYPES = [
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
const COLLECTIBLE_SCORES = {
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
const DEFAULT_COLLECTIBLE_SCORE = 5;

async function initCollectibleCache(progressCallback) {
  const total = COLLECTIBLE_TYPES.length * collectibleSizes.length;
  let count = 0;
  for (const emoji of COLLECTIBLE_TYPES) {
    for (const size of collectibleSizes) {
      renderCache.ensure(emoji, size);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}
async function initGrassCache(progressCallback) {
  const total = GRASS_EMOJIS.length * grassSizes.length;
  let count = 0;
  for (const emoji of GRASS_EMOJIS) {
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
function spawnCollectible() {
  const size =
    collectibleSizes[Math.floor(Math.random() * collectibleSizes.length)];
  const type =
    COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
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
/* RENDERING */
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

// Generate Night Sky background gradient
function createBackgroundGradient() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0a0a2e");
  gradient.addColorStop(0.5, "#1a1a4e");
  gradient.addColorStop(1, "#2d1b69");
  return gradient;
}
// Draw: createBackgroundGradient(), moon, celestial, speed counter, cat, grass [renderCache], obstacles [renderCache], collectibles [renderCache]
function draw() {
  // Draw Night sky gradient background
  ctx.fillStyle = createBackgroundGradient();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw moon (top right, below speed text)
  ctx.font = "80px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🌖", canvas.width - 150, 120);

  // Draw celestial objects (back layer)
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.filter = "blur(0.5px)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  celestialObjects.forEach((obj) => {
    ctx.font = `${obj.size}px Arial`;
    ctx.fillText(obj.emoji, obj.x, obj.y);
  });
  ctx.restore();

  // Draw Speed counter (top-right)
  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Speed: ${currentSpeed.toFixed(1)}`, canvas.width - 15, 25);

  // Draw Cat (Black Cat Emoji) - Flipped Horizontally
  ctx.save();
  ctx.translate(CAT_X, CAT_Y);
  ctx.scale(-1, 1);
  ctx.font = `${CAT_SIZE}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🐈‍⬛", 0, 0);
  ctx.restore();

  // Draw Grass - pre-rendered scrolling strips (2 draw calls instead of 15-20)
  if (grassStripCanvas) {
    ctx.drawImage(grassStripCanvas, -grassOffset, 0);
    ctx.drawImage(grassStripCanvas, grassStripWidth - grassOffset, 0);
  }

  // Draw Obstacles (centered on collision box center)
  obstacles.forEach((obs) => {
    const img = obs.img || renderCache.get(obs.type, obs.height);
    // center/position as you want (example aligns bottom center like before)
    ctx.drawImage(
      img,
      obs.x + obs.width / 2 - img.width / 2,
      obs.y + obs.height - img.height,
      img.width,
      img.height
    );
  });

  // Draw Collectibles
  collectibles.forEach((coll) => {
    const img = coll.img || renderCache.get(coll.type, coll.height);
    const dx = coll.x - img.width / 2 + coll.width / 2; // center horizontally
    const dy = coll.y + coll.height - img.height; // align bottom
    ctx.drawImage(img, dx, dy, img.width, img.height);
  });
}

/* UPDATE FRAME MOVEMENT */
// gravity, floor collision, obstacle movement + collsion + meow(), Collectibles movement + collision, grass scrolling + randomGrassGap, spawnObstacle(), spawnCollectible(), draw(),
let lastTime = 0;
function update(timestamp) {
  if (!gameRunning) return;

  const dt = timestamp ? (timestamp - lastTime) / 16.67 : 1; // normalize to ~60fps
  lastTime = timestamp || 0;

  currentSpeed = Math.min(
    maxSpeed,
    initialSpeed + Math.floor(score / 5) * speedIncrement
  );

  // Gravity
  velocityY += gravityVal * dt;
  CAT_Y += velocityY * dt;

  const catLeft = catX - catSize / 2;
  const catRight = catX + catSize / 2;
  const catTop = CAT_Y - catSize / 2;
  const catBottom = CAT_Y + catSize / 2;

  // Floor collision
  if (catBottom > canvas.height) {
    CAT_Y = canvas.height - catSize / 2;
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
      catBottom >= obsTop - autojumpVTolerance &&
      catBottom <= obsTop + autojumpVTolerance &&
      // only auto-jump when falling or near landing
      velocityY >= 0 &&
      // horizontal overlap: cat is overlapping or very close to obstacle horizontally
      catLeft < obsRight + autojumpHMargin &&
      catRight > obsLeft - autojumpHMargin
    ) {
      velocityY = jumpStrengthVal;
      jumpCount = 1;
      meow();
    }

    // Collision with sides or bottom of obstacle triggers game over
    else if (
      catBottom > obsTop + collisionVPadding &&
      catTop < obsBottom - collisionVPadding &&
      // require more horizontal overlap (ignore glancing side contacts)
      catLeft < obsRight - collisionHPadding &&
      catRight >= obsLeft + obstacleHitboxInset + collisionHPadding
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
      scoreElement.innerText = `Score: ${score}`;
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
      score += COLLECTIBLE_SCORES[collType] ?? DEFAULT_COLLECTIBLE_SCORE;
      scoreElement.innerText = `Score: ${score}`;
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
  grassOffset += currentSpeed * dt;
  if (grassOffset >= grassStripWidth) {
    grassOffset -= grassStripWidth;
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
/* GAME START */
// ----------------------------- //

// On 2 attempts to enter empty name, autocomplete to "Anon"
let emptyNameAttempts = 0;
nameInput.addEventListener("input", () => {
  emptyNameAttempts = 0;
});

/* RESET GAME */
// Initialize celestials
let celestialObjects = [];
function initCelestial() {
  const CELESTIAL_TYPES = ["⭐", "🌟", "✨", "💫", "🪐", "🛩️", "✈️", "🚀"];
  const count = Math.floor(Math.random() * 20) + 11;
  for (let i = 0; i < count; i++) {
    celestialObjects.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height - 150 * scale) + 50 * scale,
      size: Math.floor((Math.random() * 20 + 7) * scale),
      emoji: CELESTIAL_TYPES[Math.floor(Math.random() * CELESTIAL_TYPES.length)]
    });
  }
}
// Calls: initGrassStrips(), initCelestial()
function resetGame() {
  score = 0;
  CAT_Y = canvas.height - catSize / 2; // center of cat is at half the size of cat, initially
  velocityY = 0;
  jumpCount = 0;
  obstacles = [];
  collectibles = [];
  celestialObjects = [];
  celestialObjects = [];
  frameCount = 0;
  nextObstacleFrame = 100;
  currentSpeed = initialSpeed;
  initGrassStrips();
  grassOffset = 0;
  initCelestial();
  scoreElement.innerText = "Score: 0";
}

/* HOW TO START */
// Button starts game
startBtn.addEventListener("click", startGame);
// Enter starts game
nameInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    startGame();
  }
});

// Scale sizes for different display sizes
let scaleComputed = false;
let scale,
  catSize,
  catX,
  gravityVal,
  jumpStrengthVal,
  initialSpeed,
  maxSpeed,
  speedIncrement,
  collisionHPadding,
  obstacleHitboxInset,
  collisionVPadding,
  obstacleSizes,
  autojumpVTolerance,
  autojumpHMargin,
  grassMinSpacing,
  grassMaxSpacing,
  collectibleSizes;
function computeScale() {
  const renderedW = canvas.clientWidth || BASE_WIDTH;
  const renderedH = canvas.clientHeight || BASE_HEIGHT;
  scale = Math.min(renderedW / BASE_WIDTH, renderedH / BASE_HEIGHT);

  canvas.width = Math.round(BASE_WIDTH * scale);
  canvas.height = Math.round(BASE_HEIGHT * scale);

  catSize = Math.round(CAT_SIZE * scale);
  catX = Math.round(CAT_X * scale);
  gravityVal = Math.round(gravity * scale * 10) / 10;
  jumpStrengthVal = Math.round(jumpStrength * scale * 10) / 10;
  initialSpeed = Math.round(INITIAL_SPEED * scale * 10) / 10;
  maxSpeed = Math.round(MAX_SPEED * scale * 10) / 10;
  speedIncrement = Math.round(SPEED_INCREMENT * scale * 100) / 100;
  collisionHPadding = Math.round(COLLISION_HORIZONTAL_PADDING * scale);
  obstacleHitboxInset = Math.round(OBSTACLE_HITBOX_INSET * scale);
  collisionVPadding = Math.round(COLLISION_VERTICAL_PADDING * scale);
  obstacleSizes = OBSTACLE_SIZES.map((s) => Math.round(s * scale));
  autojumpVTolerance = Math.round(AUTOJUMP_VERTICAL_TOLERANCE * scale);
  autojumpHMargin = Math.round(AUTOJUMP_HORIZONTAL_MARGIN * scale);
  grassMinSpacing = Math.round(GRASS_MIN_SPACING * scale);
  grassMaxSpacing = Math.round(GRASS_MAX_SPACING * scale);
  collectibleSizes = COLLECTIBLE_SIZES.map((s) => Math.round(s * scale));
  scaleComputed = true;
}

/* START GAME */
// calls: computeScale(), drawLoadingScreen(), initEmojiCache(), initCollectibleCache(), resetGame(), update()
async function startGame() {
  if (nameInput.value.trim() === "") {
    emptyNameAttempts++;
    if (emptyNameAttempts >= 2) {
      nameInput.value = "Anon";
      emptyNameAttempts = 0;
    } else {
      nameInput.focus();
      nameInput.offsetHeight;
      nameInput.style.animation = "inputShake 0.4s ease";
      return;
    }
  }
  playerName = nameInput.value.trim();
  startBtn.disabled = true;
  nameInput.disabled = true;

  const needsReload = !scaleComputed;
  if (needsReload) computeScale();
  if (needsReload) {
    renderCache.clear();
  }

  if (needsReload) {
    const totalObstacles = OBSTACLE_TYPES.length * obstacleSizes.length;
    const totalCollectibles =
      COLLECTIBLE_TYPES.length * collectibleSizes.length;
    const totalGrass = GRASS_EMOJIS.length * grassSizes.length;
    const grandTotal = totalObstacles + totalCollectibles + totalGrass;
    const progressObstacles = (count) => {
      drawLoadingScreen(count, grandTotal);
    };
    const progressCollectibles = (count) => {
      drawLoadingScreen(totalObstacles + count, grandTotal);
    };
    const progressGrass = (count) => {
      drawLoadingScreen(totalObstacles + totalCollectibles + count, grandTotal);
    };
    drawLoadingScreen(0, grandTotal);
    await initObstacleCache(progressObstacles);
    await initCollectibleCache(progressCollectibles);
    await initGrassCache(progressGrass);
  }

  gameRunning = true;
  resetGame();
  lastTime = performance.now();
  update(performance.now());
}

/* HOW TO PLAY */
// allow click
canvas.addEventListener("mousedown", () => {
  if (gameRunning && jumpCount < maxJumpsBeforeReset) {
    velocityY = jumpStrengthVal;
    jumpCount++;
  }
});

// allow touch - support for mobile devices
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    if (gameRunning && jumpCount < maxJumpsBeforeReset) {
      velocityY = jumpStrengthVal;
      jumpCount++;
    }
  },
  { passive: false }
);

// allow double-clicks - to perform an extra jump (helps automation/double-click input)
canvas.addEventListener("dblclick", () => {
  if (!gameRunning) return; // if there's room for another jump, do it
  if (jumpCount < maxJumpsBeforeReset) {
    velocityY = jumpStrengthVal;
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
    velocityY = jumpStrengthVal;
    jumpCount++;
  }
});

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
  startBtn.disabled = false;
  nameInput.disabled = false;
  startGame();
});
gameOverCloseBtn.addEventListener("click", () => {
  gameOverDialog.close();
  startBtn.disabled = false;
  nameInput.disabled = false;
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
    renderCache.clear();
    obstacles = [];
    collectibles = [];
    grassStripCanvas = null;
  }
});
displayScores();
