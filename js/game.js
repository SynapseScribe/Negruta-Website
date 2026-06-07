const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CAT_X = 40;
const CAT_SIZE = 30;
const scoreElement = document.getElementById('gameScore');
const nameInput = document.getElementById('playerNameInput');
const startBtn = document.getElementById('startGameBtn');

const gravity = 0.18;
const jumpStrength = -8;
const INITIAL_SPEED = 1.3;
const MAX_SPEED = 8;
const SPEED_INCREMENT = 0.5;
const COLLISION_PADDING = 5;
const OBSTACLE_TYPES = ["🌲", "🏠", "🏀", "🚗", "🌵", "📦", "🧱", "🦄", "🛸", "🦖", "🍕", "🍍", "🗿", "🤡", "🍄", "👻", "👽", "🐙", "🌈", "🍦", "🍩", "🍔", "🌮", "🍣", "🥨", "🥑", "🍉", "🐉", "🦁", "🐵", "🐧", "🐘", "🦒", "🐢", "🐍", "🐝", "🦋", "🚀", "🚁", "🚂", "🚢", "🚲", "🛵", "🏎️", "🚜", "🚐", "🚠", "🎸", "🎹", "🎻", "🎺", "🥁", "🎨", "📚", "🧪", "🔬", "🔭", "🏰", "🎡", "🎢", "🗼", "🗽", "⛩️"];

let gameRunning = false;
let score = 0;
let playerName = "";
let catY = 150;
let velocityY = 0;
let obstacles = [];
let collectibles = [];
let frameCount = 0;
let nextObstacleFrame = 100;

function resetGame() {
    score = 0;
    catY = 150;
    velocityY = 0;
    obstacles = [];
    collectibles = [];
    frameCount = 0;
    nextObstacleFrame = 100;
    scoreElement.innerText = "Score: 0";
}

function spawnObstacle() {
    const size = Math.floor(Math.random() * 51) + 25; // Size between 25 and 76 (up to ~2x current max)
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    obstacles.push({
        x: canvas.width,
        y: canvas.height - size,
        width: 30,
        height: size,
        type: type
    });

    // Initial spacing is wider for better start experience
    const minGap = 140;
    const maxGap = 260;
    nextObstacleFrame = frameCount + Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
}

function spawnCollectible() {
    const size = 30;
    collectibles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - size),
        width: size,
        height: size
    });
}

function update() {
    if (!gameRunning) return;

    const currentSpeed = Math.min(MAX_SPEED, INITIAL_SPEED + Math.floor(score / 10) * SPEED_INCREMENT);

    // Gravity
    velocityY += gravity;
    catY += velocityY;

    const catLeft = CAT_X - CAT_SIZE;
    const catRight = CAT_X;
    const catTop = catY;
    const catBottom = catY + CAT_SIZE;

    // Floor collision
    if (catBottom > canvas.height) {
        catY = canvas.height - CAT_SIZE;
        velocityY = 0;
    }

    // Obstacle movement
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= currentSpeed;

        // Collision detection
        if (
            catLeft + COLLISION_PADDING < obstacles[i].x + obstacles[i].width - COLLISION_PADDING &&
            catRight - COLLISION_PADDING > obstacles[i].x + COLLISION_PADDING &&
            catTop + COLLISION_PADDING < obstacles[i].y + obstacles[i].height - COLLISION_PADDING &&
            catBottom - COLLISION_PADDING > obstacles[i].y + COLLISION_PADDING
        ) {
            gameOver();
        }

        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            scoreElement.innerText = `Score: ${score}`;
        }
    }

    // Collectibles movement and collision
    for (let i = collectibles.length - 1; i >= 0; i--) {
        collectibles[i].x -= currentSpeed;

        if (
            catLeft + COLLISION_PADDING < collectibles[i].x + collectibles[i].width - COLLISION_PADDING &&
            catRight - COLLISION_PADDING > collectibles[i].x + COLLISION_PADDING &&
            catTop + COLLISION_PADDING < collectibles[i].y + collectibles[i].height - COLLISION_PADDING &&
            catBottom - COLLISION_PADDING > collectibles[i].y + COLLISION_PADDING
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

    // Spawn obstacles and collectibles
    frameCount++;
    if (frameCount >= nextObstacleFrame) {
        spawnObstacle();
        frameCount = 0;
        // More spacing initially, then tighten over time: min gap = max(60, 180 - score)
        const minGap = Math.max(60, 180 - score);
        frameCount = 0;
        nextObstacleFrame = minGap + Math.floor(Math.random() * (240 - minGap + 1)) + minGap;
    }
    if (frameCount % 150 === 0) {
        spawnCollectible();
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Cat (Black Cat Emoji) - Flipped Horizontally
    ctx.save();
    ctx.translate(CAT_X, catY + CAT_SIZE / 2);
    ctx.scale(-1, 1);
    ctx.font = `${CAT_SIZE}px Arial`;
    ctx.fillText("🐈‍⬛", 0, 0);
    ctx.restore();

    // Draw Obstacles
    obstacles.forEach(obs => {
        ctx.font = `${obs.height}px Arial`;
        ctx.fillText(obs.type, obs.x, obs.y + obs.height);
    });

    // Draw Collectibles (Fish Emoji)
    ctx.font = "30px Arial";
    collectibles.forEach(coll => {
        ctx.fillText("🐟", coll.x, coll.y + 25);
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
    const newScore = { name, score: finalScore, date: new Date().toLocaleDateString() };
    let scores = JSON.parse(localStorage.getItem('catGameScores') || '[]');
    scores.push(newScore);
    localStorage.setItem('catGameScores', JSON.stringify(scores));
    displayScores();
}

function displayScores() {
    const scoreList = document.getElementById('scoreList');
    if (!scoreList) return;
    const scores = JSON.parse(localStorage.getItem('catGameScores') || '[]');
    const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 10);
    scoreList.innerHTML = topScores.map(s => `<li>${s.name}: ${s.score} (${s.date})</li>`).join('');
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

startBtn.addEventListener('click', startGame);

nameInput.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        startGame();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        velocityY = jumpStrength;
    }
});

canvas.addEventListener('mousedown', () => {
    if (gameRunning) {
        velocityY = jumpStrength;
    }
});

// Initialize scores display on load
displayScores();