const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // 2D drawing context

const CAT_SIZE = 80;
const CAT_X = 160;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 550;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const scoreElement = document.getElementById("gameScore");
const nameInput = document.getElementById("playerNameInput");
const startBtn = document.getElementById("startGameBtn");


const gravity = 0.18;
const jumpStrength = -9;
const maxJumpsBeforeReset = 2;
const INITIAL_SPEED = 4;
const MAX_SPEED = 10;
const SPEED_INCREMENT = 0.1;
const OBSTACLE_TYPES = ["🌲", "🏠", "🏀", "🚗", "🌵", "📦", "🧱", "🦄", "🛸", "🦖", "🍕", "🍍", "🗿", "🤡", "🍄", "👻", "👽", "🐙", "🌈", "🍦", "🍩", "🍔", "🌮", "🍣", "🥨", "🥑", "🍉", "🦁", "🐵", "🐧", "🐘", "🦒", "🐢", "🐍", "🐝", "🦋", "🚀", "🚁", "🚂", "🚢", "🚲", "🛵", "🚜", "🚐", "🚠", "🎸", "🎹", "🎻", "🎺", "🥁", "🎨", "📚", "🧪", "🔬", "🔭", "🏰", "🎢", "🗼", "🗽", "⛩️"];
const COLLISION_HORIZONTAL_PADDING = 30; // increase to be more permissive
const COLLISION_VERTICAL_PADDING = 30;   // increase to be more permissive
const MIN_OBSTACLE_SIZE = 150;
const MAX_OBSTACLE_SIZE = 250;
const AUTOJUMP_VERTICAL_TOLERANCE = 40; // how far into the obstacle vertically to still auto-jump
const AUTOJUMP_HORIZONTAL_MARGIN = 30;  // how close horizontally before auto-jump

const GRASS_SIZE = Math.floor(CAT_SIZE / 1.5);
const GRASS_SPACING = 40;
const GROUND_HEIGHT = 0;          // adjust how tall the ground area is
let groundY = canvas.height - GROUND_HEIGHT;

const CELESTIAL_TYPES = ["⭐", "🌟", "✨", "💫", "🪐", "🛩️", "✈️", "🚀"];

let gameRunning = false;
let playerName = "";
let jumpCount = 0;
let celestialObjects = [];

function resetGame() {
  score = 0;
  CAT_Y = canvas.height - CAT_SIZE / 2; // center of cat is at half the size of cat, initially
  velocityY = 0;
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




// build cache once, for faster rendering
//const GRASS_EMOJIS = ["🌱","🌿","☘️","🍀","🍃","🌾","🎍","🪴","🌴","🌲","🌳","🌼","🌻","🌺","🌷","🥀","🍂","🍁","🍄","🐝","🦋","🐞","🪲","💐","🎋","🌸","🌹","🪻","🪨","🪵"];
const GRASS_EMOJIS = ["🌱","🌿","☘️","🍀","🌾","🎍","🪴", "🌼","🌻","🌷","🥀","🍂","🍁","🌹","🪻"];
const sizeList = [28, 32, 36, 40, 44]; // limited set
// cache per emoji+size to speed drawing
const emojiCache = new Map();
for (const emoji of GRASS_EMOJIS) {
  for (const s of sizeList) {
    const key = `${emoji}_${s}`;
    const oc = document.createElement('canvas');
    oc.width = oc.height = s * 2;
    const cctx = oc.getContext('2d');
    cctx.font = `${s}px serif`;
    cctx.textAlign = 'center';
    cctx.textBaseline = 'bottom';
    cctx.clearRect(0,0,oc.width,oc.height);
    cctx.fillText(emoji, oc.width / 2, oc.height - 1);
    emojiCache.set(key, oc);
  }
}

function initGrass() {
  grassItems = [];
  for (let x = -GRASS_SIZE; x <= canvas.width + GRASS_SIZE; x += GRASS_SPACING) {
    const emoji = GRASS_EMOJIS[Math.floor(Math.random() * GRASS_EMOJIS.length)];
    const size = sizeList[Math.floor(Math.random() * sizeList.length)];
    grassItems.push({ x, emoji, size });
  }
}
function initCelestial() {
  celestialObjects = [];
  const count = Math.floor(Math.random() * 30) + 11;
  for (let i = 0; i < count; i++) {
    celestialObjects.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height - 150) + 50,
      size: Math.floor(Math.random() * 20) + 7,
      emoji: CELESTIAL_TYPES[Math.floor(Math.random() * CELESTIAL_TYPES.length)]
    });
  }
}

function spawnObstacle() {
  const OBSTACLE_VERTICAL_OFFSET = 25; // tweak until it looks flush
  const size = Math.floor(Math.random() * (MAX_OBSTACLE_SIZE - MIN_OBSTACLE_SIZE + 1)) + MIN_OBSTACLE_SIZE;
  const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size + OBSTACLE_VERTICAL_OFFSET, // move visually down
    width: size,
    height: size,
    type
  });
}

function spawnCollectible() {
  const size = 60;
  // Collectibles spawn within cat's double-jump range (roughly 280-650px from bottom)
  collectibles.push({
    x: canvas.width,
    y: canvas.height - 350 + Math.random() * 180,
    width: size,
    height: size,
  });
}

function update() {
  if (!gameRunning) return;

  currentSpeed = Math.min(
    MAX_SPEED,
    INITIAL_SPEED + Math.floor(score / 5) * SPEED_INCREMENT,
  );

  // Gravity
  velocityY += gravity;
  CAT_Y += velocityY;

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
    obstacles[i].x -= currentSpeed;

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
      jumpCount++;
    }

    // Collision with sides or bottom of obstacle triggers game over
    else if (
  catBottom > obsTop + COLLISION_VERTICAL_PADDING &&
  catTop < obsBottom - COLLISION_VERTICAL_PADDING &&
  // require more horizontal overlap (ignore glancing side contacts)
  catLeft < obsRight - COLLISION_HORIZONTAL_PADDING &&
  catRight >= obsLeft + 20 + COLLISION_HORIZONTAL_PADDING
    ) {
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
    collectibles[i].x -= currentSpeed;

    if (
      catLeft <= collectibles[i].x + collectibles[i].width - 15 &&
      catRight >= collectibles[i].x - 40 &&
      catTop <= collectibles[i].y + collectibles[i].height - 15 &&
      catBottom >= collectibles[i].y - 40
    ) {
      score += 5;
      scoreElement.innerText = `Score: ${score}`;
      collectibles.splice(i, 1);
      continue;
    }

    if (collectibles[i].x + collectibles[i].width < 0) {
      collectibles.splice(i, 1);
    }
  }

//*
  // Grass scrolling
  for (const item of grassItems) {
    item.x -= currentSpeed;
    if (item.x < -GRASS_SIZE) {
      item.x += grassItems.length * GRASS_SPACING;
    }
  }
//*/

  // Spawn obstacles and collectibles
  frameCount++;
  if (frameCount >= nextObstacleFrame && nextObstacleFrame > 0) {
    spawnObstacle();
    const minGap = Math.max(680, 180 - score);
    nextObstacleFrame =
      frameCount + minGap + Math.floor(Math.random() * (240 - minGap + 1));
  }
  if (frameCount % 150 === 0) {
    spawnCollectible();
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  // Night sky gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0a0a2e");
  gradient.addColorStop(0.5, "#1a1a4e");
  gradient.addColorStop(1, "#2d1b69");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw moon (top right, below speed text)
  ctx.font = "80px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🌖", canvas.width - 150, 120);

  // Draw celestial objects (back layer)
  ctx.save();
  ctx.globalAlpha = 0.1;
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

//
/*
  // Draw grass ground texture
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  grassItems.forEach((item) => {
    ctx.font = `${item.size}px Arial`;
    ctx.fillText(item.emoji, item.x, canvas.height);
  });
  //*/
  // in draw loop use drawImage (fast)
ctx.textAlign = "center";
ctx.textBaseline = "bottom";
for (const item of grassItems) {
  const key = `${item.emoji}_${item.size}`;
  const img = emojiCache.get(key);
  if (!img) continue;
  const y = canvas.height; // bottom of canvas (or use groundY + GROUND_HEIGHT)
  ctx.drawImage(img, item.x - img.width/2, y - img.height);
}

  // Draw Obstacles (centered on collision box center)
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  obstacles.forEach((obs) => {
    ctx.font = `${obs.height}px Arial`;
    ctx.fillText(obs.type, obs.x + obs.width / 2 - 30, obs.y + obs.height);
  });

  // Draw Collectibles (Fish Emoji)
  ctx.font = "60px Arial";
  collectibles.forEach((coll) => {
    ctx.fillText("🐟", coll.x, coll.y + 50);
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
    const defaultScores = [{ name: "Negruta", score: 500, date: new Date().toLocaleDateString() }];
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
    const text = document.createTextNode(`${medal} ${s.name}: ${s.score} (${s.date})`);
    li.appendChild(text);
    scoreList.appendChild(li);
  });
}

function startGame() {
  if (nameInput.value.trim() === "") {
    alert("Please enter your name first!");
    return;
  }
  playerName = nameInput.value.trim();
  gameRunning = true;
  startBtn.disabled = true;
  nameInput.disabled = true;
  resetGame();
  update();
}

startBtn.addEventListener("click", startGame);

nameInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    startGame();
  }
});

window.addEventListener("keydown", (e) => {
  if (jumpCount >= maxJumpsBeforeReset) return;
  if (e.code === "Space" && gameRunning) {
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

// Initialize scores display on load
ensureDefaultHighScore();
displayScores();
