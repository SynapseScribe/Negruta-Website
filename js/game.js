const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // 2D drawing context

const CAT_SIZE = 80;
const CAT_X = 160;

canvas.width = 800;
canvas.height = 550;

const scoreElement = document.getElementById("gameScore");
const nameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startGameBtn");

const gravity = 1;
const jumpStrength = -20;
const maxJumpsBeforeReset = 2;
const INITIAL_SPEED = 10;
const MAX_SPEED = 50;
const SPEED_INCREMENT = 0.1;
const OBSTACLE_TYPES = [
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
  "🎹",
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
  "🩸",
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
  "🏳️‍🌈",
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
  "👜",
];
const COLLISION_HORIZONTAL_PADDING = 30; // increase to be more permissive
const OBSTACLE_HITBOX_INSET = 20; // ignore glancing side contacts
const COLLISION_VERTICAL_PADDING = 30; // increase to be more permissive
const OBSTACLE_SIZES = [160, 200, 240, 270, 300];
const AUTOJUMP_VERTICAL_TOLERANCE = 40; // how far into the obstacle vertically to still auto-jump
const AUTOJUMP_HORIZONTAL_MARGIN = 30; // how close horizontally before auto-jump

const GRASS_SIZE = Math.floor(CAT_SIZE / 1.5);
const GRASS_SPACING = 50;
const GROUND_HEIGHT = 0; // adjust how tall the ground area is
let groundY = canvas.height - GROUND_HEIGHT;

const CELESTIAL_TYPES = ["⭐", "🌟", "✨", "💫", "🪐", "🛩️", "✈️", "🚀"];

let gameRunning = false;
let playerName = "";
let jumpCount = 0;
let celestialObjects = [];
let score = 0;
let CAT_Y = 0;
let velocityY = 0;
let obstacles = [];
let collectibles = [];
let frameCount = 0;
let nextObstacleFrame = 100;
let currentSpeed = INITIAL_SPEED;
let grassItems = [];
let rightmostX = 0;

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
  "assets/audio/meow_sounds/dragon-studio-cat-meow-401729.mp3",
];

// preload
const meowAudioPool = meowSounds.map((src) => {
  const a = new Audio(src);
  a.preload = "auto";
  return a;
});
function meow() {
  const idx = Math.floor(Math.random() * meowAudioPool.length);
  const audio = meowAudioPool[idx].cloneNode(); // clone to allow overlapping plays
  audio.volume = 0.1;
  audio.play().catch((e) => console.log("Audio play failed:", e));
}

function resetGame() {
  score = 0;
  CAT_Y = canvas.height - CAT_SIZE / 2; // center of cat is at half the size of cat, initially
  velocityY = 0;
  jumpCount = 0;
  obstacles = [];
  collectibles = [];
  frameCount = 0;
  nextObstacleFrame = 100;
  currentSpeed = INITIAL_SPEED;
  groundY = canvas.height - GROUND_HEIGHT;
  initGrass();
  initCelestial();
  scoreElement.innerText = "Score: 0";
}

// # GRASS #

// build cache once, for faster rendering
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
  "🪻",
];
const sizeList = [28, 36, 44, 48]; // limited set

const GRASS_MIN_SPACING = 40;
const GRASS_MAX_SPACING = 80;
function randomGrassGap() {
  return (
    GRASS_MIN_SPACING + Math.random() * (GRASS_MAX_SPACING - GRASS_MIN_SPACING)
  );
}

// cache per emoji+size to speed drawing - for GROUND GRASS
const emojiCache = new Map();
for (const emoji of GRASS_EMOJIS) {
  for (const s of sizeList) {
    const key = `${emoji}_${s}`;
    const oc = document.createElement("canvas");
    oc.width = oc.height = s * 2;
    const cctx = oc.getContext("2d");
    cctx.font = `${s}px serif`;
    cctx.textAlign = "center";
    cctx.textBaseline = "bottom";
    cctx.clearRect(0, 0, oc.width, oc.height);
    cctx.fillText(emoji, oc.width / 2, oc.height - 1);
    emojiCache.set(key, oc);
  }
}

function initGrass() {
  grassItems = [];
  let x = -GRASS_SIZE;
  while (x <= canvas.width + GRASS_SIZE) {
    const emoji = GRASS_EMOJIS[Math.floor(Math.random() * GRASS_EMOJIS.length)];
    const size = sizeList[Math.floor(Math.random() * sizeList.length)];
    grassItems.push({ x, emoji, size });
    x += randomGrassGap();
  }
  rightmostX = grassItems[grassItems.length - 1].x;
}

function initCelestial() {
  celestialObjects = [];
  const count = Math.floor(Math.random() * 20) + 11;
  for (let i = 0; i < count; i++) {
    celestialObjects.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height - 150) + 50,
      size: Math.floor(Math.random() * 20) + 7,
      emoji:
        CELESTIAL_TYPES[Math.floor(Math.random() * CELESTIAL_TYPES.length)],
    });
  }
}

// # LOADING SCREEN

function drawLoadingScreen(current, total) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = '36px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2 - 40);
  const barWidth = 400;
  const barHeight = 24;
  const barX = (canvas.width - barWidth) / 2;
  const barY = canvas.height / 2 + 20;
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
  ctx.fillText(`${Math.round(pct * 100)}%`, canvas.width / 2, barY + barHeight + 30);
}

// # OBSTACLES

const emojiRenderCache = new Map();
async function initEmojiCache(progressCallback) {
  if (emojiRenderCache.size > 0) return;
  const total = OBSTACLE_TYPES.length * OBSTACLE_SIZES.length;
  let count = 0;
  for (const emoji of OBSTACLE_TYPES) {
    for (const size of OBSTACLE_SIZES) {
      const key = `${emoji}_${size}`;
      const padding = Math.ceil(size * 0.25);
      const w = size + padding * 2;
      const oc = document.createElement("canvas");
      oc.width = oc.height = w;
      const c = oc.getContext("2d");
      c.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji", Arial`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.clearRect(0, 0, w, w);
      c.fillText(emoji, w / 2, w / 2);
      emojiRenderCache.set(key, oc);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}
function prerenderEmoji(emoji, size) {
  return emojiRenderCache.get(`${emoji}_${size}`);
}
function spawnObstacle() {
  const OBSTACLE_VERTICAL_OFFSET = 60;
  const size =
    OBSTACLE_SIZES[Math.floor(Math.random() * OBSTACLE_SIZES.length)];
  const type =
    OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  const img = prerenderEmoji(type, size); // cheap if cached
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size + OBSTACLE_VERTICAL_OFFSET,
    width: size,
    height: size,
    type,
    img, // store the offscreen canvas
  });
}

// 						# COLLECTIBLES

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
  "🦃",
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
  "🦃": 12,
};
const DEFAULT_COLLECTIBLE_SCORE = 5;
const COLLECTIBLE_SIZES = [48, 60, 72, 83];

const collectibleRenderCache = new Map();
async function initCollectibleCache(progressCallback) {
  if (collectibleRenderCache.size > 0) return;
  const total = COLLECTIBLE_TYPES.length * COLLECTIBLE_SIZES.length;
  let count = 0;
  for (const emoji of COLLECTIBLE_TYPES) {
    for (const size of COLLECTIBLE_SIZES) {
      const key = `${emoji}_${size}`;
      const padding = Math.ceil(size * 0.25);
      const w = size + padding * 2;
      const oc = document.createElement("canvas");
      oc.width = oc.height = w;
      const c = oc.getContext("2d");
      c.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji", Arial`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.clearRect(0, 0, w, w);
      c.fillText(emoji, w / 2, w / 2);
      collectibleRenderCache.set(key, oc);
      count++;
      if (count % 10 === 0) {
        progressCallback(count, total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }
}
function prerenderCollectible(emoji, size) {
  return collectibleRenderCache.get(`${emoji}_${size}`);
}

function spawnCollectible() {
  const size = COLLECTIBLE_SIZES[Math.floor(Math.random() * COLLECTIBLE_SIZES.length)];
  const type =
    COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
  const y = canvas.height - 350 + Math.random() * 180;
  const img = prerenderCollectible(type, size);
  collectibles.push({
    x: canvas.width,
    y,
    width: size,
    height: size,
    type,
    img,
  });
}

let lastTime = 0;
function update(timestamp) {
  if (!gameRunning) return;

  const dt = timestamp ? (timestamp - lastTime) / 16.67 : 1; // normalize to ~60fps
  lastTime = timestamp || 0;

  currentSpeed = Math.min(
    MAX_SPEED,
    INITIAL_SPEED + Math.floor(score / 5) * SPEED_INCREMENT,
  );

  // Gravity
  velocityY += gravity * dt;
  CAT_Y += velocityY * dt;

  const catLeft = CAT_X - CAT_SIZE / 2;
  const catRight = CAT_X + CAT_SIZE / 2;
  const catTop = CAT_Y - CAT_SIZE / 2;
  const catBottom = CAT_Y + CAT_SIZE / 2;

  // Floor collision
  if (catBottom > canvas.height) {
    CAT_Y = canvas.height - CAT_SIZE / 2;
    velocityY = 0;
    jumpCount = 0;
  }

  // Obstacle movement
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= currentSpeed * dt;

    const obsTop = obstacles[i].y;
    const obsBottom = obstacles[i].y + obstacles[i].height;
    const obsLeft = obstacles[i].x + 10;
    const obsRight = obstacles[i].x + obstacles[i].width - 10;

    // Auto-jump when cat is about to land on top of obstacle
    if (
      // cat bottom is at or below the top, or slightly into it (tolerance)
      catBottom >= obsTop - AUTOJUMP_VERTICAL_TOLERANCE &&
      catBottom <= obsTop + AUTOJUMP_VERTICAL_TOLERANCE &&
      // only auto-jump when falling or near landing
      velocityY >= 0 &&
      // horizontal overlap: cat is overlapping or very close to obstacle horizontally
      catLeft < obsRight + AUTOJUMP_HORIZONTAL_MARGIN &&
      catRight > obsLeft - AUTOJUMP_HORIZONTAL_MARGIN
    ) {
      velocityY = jumpStrength;
      jumpCount = 1;
      meow();
    }

    // Collision with sides or bottom of obstacle triggers game over
    else if (
      catBottom > obsTop + COLLISION_VERTICAL_PADDING &&
      catTop < obsBottom - COLLISION_VERTICAL_PADDING &&
      // require more horizontal overlap (ignore glancing side contacts)
      catLeft < obsRight - COLLISION_HORIZONTAL_PADDING &&
      catRight >= obsLeft + OBSTACLE_HITBOX_INSET + COLLISION_HORIZONTAL_PADDING
    ) {
      meow();
      gameOver();
      return;
    }
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
      scoreElement.innerText = `Score: ${score}`;
    }
  }

  // Collectibles movement and collision (fish has larger hitbox for easier collection)
  for (let i = collectibles.length - 1; i >= 0; i--) {
    collectibles[i].x -= currentSpeed * dt;

    if (
      catLeft <= collectibles[i].x + collectibles[i].width - 15 &&
      catRight >= collectibles[i].x - 40 &&
      catTop <= collectibles[i].y + collectibles[i].height - 15 &&
      catBottom >= collectibles[i].y - 40
    ) {
      score +=
        COLLECTIBLE_SCORES[collectibles[i].type] ?? DEFAULT_COLLECTIBLE_SCORE;
      //meow(); // too much meows lel
      scoreElement.innerText = `Score: ${score}`;
      collectibles.splice(i, 1);
      continue;
    }

    if (collectibles[i].x + collectibles[i].width < 0) {
      collectibles.splice(i, 1);
    }
  }

  // Grass scrolling
  rightmostX -= currentSpeed * dt;
  for (const item of grassItems) {
    item.x -= currentSpeed * dt;
    if (item.x < -GRASS_SIZE) {
      item.x = rightmostX + randomGrassGap();
      rightmostX = item.x;
      item.emoji =
        GRASS_EMOJIS[Math.floor(Math.random() * GRASS_EMOJIS.length)];
      item.size = sizeList[Math.floor(Math.random() * sizeList.length)];
    }
  }

  // Spawn obstacles and collectibles
  frameCount++;
  if (frameCount >= nextObstacleFrame) {
    spawnObstacle();
    const minGap = Math.max(60, 680 - score);
    nextObstacleFrame = frameCount + minGap + Math.floor(Math.random() * 120);
  }
  if (frameCount % 150 === 0) {
    spawnCollectible();
  }

  draw();
  requestAnimationFrame(update);
}

let bgGradient = createBackgroundGradient();
function createBackgroundGradient() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0a0a2e");
  gradient.addColorStop(0.5, "#1a1a4e");
  gradient.addColorStop(1, "#2d1b69");
  return gradient;
}
function draw() {
  // Night sky gradient background
  ctx.fillStyle = bgGradient;
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

  // in draw loop use drawImage (fast)
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  for (const item of grassItems) {
    const key = `${item.emoji}_${item.size}`;
    const img = emojiCache.get(key);
    if (!img) continue;
    const y = canvas.height; // bottom of canvas (or use groundY + GROUND_HEIGHT)
    ctx.drawImage(img, item.x - img.width / 2, y - img.height);
  }

  // Draw Obstacles (centered on collision box center)
  obstacles.forEach((obs) => {
    const img = obs.img || prerenderEmoji(obs.type, obs.height);
    // center/position as you want (example aligns bottom center like before)
    ctx.drawImage(
      img,
      obs.x + obs.width / 2 - img.width / 2 - 30,
      obs.y + obs.height - img.height,
      img.width,
      img.height,
    );
  });

  // Draw Collectibles
  collectibles.forEach((coll) => {
    const img = coll.img || prerenderCollectible(coll.type, coll.height);
    const dx = coll.x - img.width / 2 + coll.width / 2; // center horizontally
    const dy = coll.y + coll.height - img.height; // align bottom
    ctx.drawImage(img, dx, dy, img.width, img.height);
  });
}

function gameOver() {
  gameRunning = false;
  alert(`Game Over, ${playerName}! Your score: ${score}`);
  saveScore(playerName, score);
  startBtn.disabled = false;
  nameInput.disabled = false;
}

function saveScore(name, finalScore) {
  const newScore = {
    name,
    score: finalScore,
    date: new Date().toLocaleDateString(),
  };
  let scores = JSON.parse(localStorage.getItem("catGameScores") || "[]");
  scores.push(newScore);
  localStorage.setItem("catGameScores", JSON.stringify(scores));
  displayScores();
}

// create a default high score if none exist
function ensureDefaultHighScore() {
  const key = "catGameScores";
  const existing = JSON.parse(localStorage.getItem(key) || "null");
  if (!existing) {
    const defaultScores = [
      {
        name: "Negruta",
        score: 500,
        date: new Date().toLocaleDateString(),
      },
    ];
    localStorage.setItem(key, JSON.stringify(defaultScores));
  }
}
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
      `${medal} ${s.name}: ${s.score} (${s.date})`,
    );
    li.appendChild(text);
    scoreList.appendChild(li);
  });
}

async function startGame() {
  if (nameInput.value.trim() === "") {
    alert("Please enter your name first!");
    return;
  }
  playerName = nameInput.value.trim();
  startBtn.disabled = true;
  nameInput.disabled = true;
  const cachesReady = emojiRenderCache.size > 0 && collectibleRenderCache.size > 0;
  if (!cachesReady) {
    const totalObstacles =
      OBSTACLE_TYPES.length * OBSTACLE_SIZES.length;
    const totalCollectibles =
      COLLECTIBLE_TYPES.length * COLLECTIBLE_SIZES.length;
    const grandTotal = totalObstacles + totalCollectibles;
    const progressObstacles = (count) => {
      drawLoadingScreen(count, grandTotal);
    };
    const progressCollectibles = (count) => {
      drawLoadingScreen(totalObstacles + count, grandTotal);
    };
    drawLoadingScreen(0, grandTotal);
    await initEmojiCache(progressObstacles);
    await initCollectibleCache(progressCollectibles);
  }
  gameRunning = true;
  resetGame();
  lastTime = performance.now();
  update(performance.now());
}

startBtn.addEventListener("click", startGame);

nameInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    startGame();
  }
});

/*
window.addEventListener("keydown", (e) => {
    if (jumpCount >= maxJumpsBeforeReset)
        return;
    if (e.code === "Space" && gameRunning) {
        velocityY = jumpStrength;
        jumpCount++;
    }
});
*/

// prevent spacebar from scrolling the page while the game is running,
// but allow normal typing in inputs/textareas and contenteditable elements.
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
    velocityY = jumpStrength;
    jumpCount++;
  }
});

canvas.addEventListener("mousedown", () => {
  if (gameRunning && jumpCount < maxJumpsBeforeReset) {
    velocityY = jumpStrength;
    jumpCount++;
  }
});

// touch support for mobile devices
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (gameRunning && jumpCount < maxJumpsBeforeReset) {
    velocityY = jumpStrength;
    jumpCount++;
  }
}, { passive: false });

// allow double-clicks to perform an extra jump (helps automation/double-click input)
canvas.addEventListener("dblclick", () => {
  if (!gameRunning) return; // if there's room for another jump, do it
  if (jumpCount < maxJumpsBeforeReset) {
    velocityY = jumpStrength;
    jumpCount++;
  }
});

// Initialize scores display on load
ensureDefaultHighScore();
displayScores();
