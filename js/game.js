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
const INITIAL_SPEED = 1.3;
const MAX_SPEED = 15;
const SPEED_INCREMENT = 0.3;
const OBSTACLE_TYPES = ["🌲", "🏠", "🏀", "🚗", "🌵", "📦", "🧱", "🦄", "🛸", "🦖", "🍕", "🍍", "🗿", "🤡", "🍄", "👻", "👽", "🐙", "🌈", "🍦", "🍩", "🍔", "🌮", "🍣", "🥨", "🥑", "🍉", "🐉", "🦁", "🐵", "🐧", "🐘", "🦒", "🐢", "🐍", "🐝", "🦋", "🚀", "🚁", "🚂", "🚢", "🚲", "🛵", "🏎️", "🚜", "🚐", "🚠", "🎸", "🎹", "🎻", "🎺", "🥁", "🎨", "📚", "🧪", "🔬", "🔭", "🏰", "🎡", "🎢", "🗼", "🗽", "⛩️"];


const GRASS_EMOJIS = ["🌱", "🌿", "☘️", "🍀", "🍃", "🌾", "🪻", "🌷", "🌻", "🌺", "🥀", "🍄", "🍂"];
const GRASS_SIZE = Math.floor(CAT_SIZE / 3);
const GRASS_SPACING = 25;

let gameRunning = false;
let playerName = "";
let jumpCount = 0;

function resetGame() {
  score = 0;
  CAT_Y = canvas.height - CAT_SIZE / 2; // center of cat is at half the size of cat, initially
  velocityY = 0;
  obstacles = [];
  collectibles = [];
  frameCount = 0;
  nextObstacleFrame = 100;
  currentSpeed = INITIAL_SPEED;
  initGrass();
  scoreElement.innerText = "Score: 0";
}

function initGrass() {
  grassItems = [];
  for (let x = -GRASS_SIZE; x <= canvas.width + GRASS_SIZE; x += GRASS_SPACING) {
    grassItems.push({
      x: x,
      emoji: GRASS_EMOJIS[Math.floor(Math.random() * GRASS_EMOJIS.length)],
    });
  }
}

function spawnObstacle() {
  const size = Math.floor(Math.random() * 156) + 50;
  const type =
    OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size,
    width: size,
    height: size,
    type: type,
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
    INITIAL_SPEED + Math.floor(score / 10) * SPEED_INCREMENT,
  );

  // Gravity
  velocityY += gravity;
  CAT_Y += velocityY;

  const catLeft = CAT_X - CAT_SIZE/2;
  const catRight = CAT_X + CAT_SIZE/2;
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

    // Auto-jump when cat lands on top of obstacle
    if (
      catBottom >= obsTop &&
      catBottom <= obsTop + 20 &&
      velocityY >= 0 &&
      catLeft < obsRight &&
      catRight > obsLeft
    ) {
      velocityY = jumpStrength;
      jumpCount++;
    }

    // Collision with sides or bottom of obstacle triggers game over
    else if (
      catBottom > obsTop + 20 &&
      catTop < obsBottom &&
      catLeft < obsRight &&
      catRight > obsLeft
    ) {
      gameOver();
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

  // Grass scrolling
  for (const item of grassItems) {
    item.x -= currentSpeed;
    if (item.x < -GRASS_SIZE) {
      item.x += grassItems.length * GRASS_SPACING;
    }
  }

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Speed counter (top-right)
  ctx.save();
  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Speed: ${currentSpeed.toFixed(1)}`, canvas.width - 15, 25);
  ctx.restore();

  // Draw Cat (Black Cat Emoji) - Flipped Horizontally
  ctx.save();
  ctx.translate(CAT_X, CAT_Y);
  ctx.scale(-1, 1);
  ctx.font = `${CAT_SIZE}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🐈‍⬛", 0, 0);
  ctx.restore();

  // Draw grass ground texture
  ctx.font = `${GRASS_SIZE}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  grassItems.forEach((item) => {
    ctx.fillText(item.emoji, item.x, canvas.height);
  });

  // Draw Obstacles
  obstacles.forEach((obs) => {
    ctx.font = `${obs.height}px Arial`;
    ctx.fillText(obs.type, obs.x, obs.y + obs.height);
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
displayScores();
