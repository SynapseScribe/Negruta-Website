const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('gameScore');
const nameInput = document.getElementById('playerNameInput');
const startBtn = document.getElementById('startGameBtn');

let gameRunning = false;
let score = 0;
let playerName = "";
let catY = 150;
let velocityY = 0;
const gravity = 0.6;
const jumpStrength = -10;
const INITIAL_SPEED = 3;
const MAX_SPEED = 8;
const SPEED_INCREMENT = 0.5;
const OBSTACLE_TYPES = ["🌲", "🏠", "🏀", "🚗", "🌵", "📦", "🧱"];
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
    const size = Math.floor(Math.random() * 31) + 20; // Size between 20 and 50
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    obstacles.push({
        x: canvas.width,
        y: canvas.height - size,
        width: 30,
        height: size,
        type: type
    });

    const minGap = 80;
    const maxGap = 160;
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

    // Floor collision
    if (catY + 30 > canvas.height) {
        catY = canvas.height - 30;
        velocityY = 0;
    }

    // Obstacle movement
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= currentSpeed;

        // Collision detection
        if (
            40 < obstacles[i].x + obstacles[i].width &&
            40 + 30 > obstacles[i].x &&
            catY < obstacles[i].y + obstacles[i].height &&
            catY + 30 > obstacles[i].y
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
            40 < collectibles[i].x + collectibles[i].width &&
            40 + 30 > collectibles[i].x &&
            catY < collectibles[i].y + collectibles[i].height &&
            catY + 30 > collectibles[i].y
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

    // Spawn obstacles
    frameCount++;
    if (frameCount >= nextObstacleFrame) {
        spawnObstacle();
    }
    if (frameCount % 150 === 0) {
        spawnCollectible();
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Cat (Black Cat Emoji)
    ctx.font = "30px Arial";
    ctx.fillText("🐈‍⬛", 20, catY + 25);

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
    const newScore = { name, score: score, date: new Date().toLocaleDateString() };
    let scores = JSON.parse(localStorage.getItem('catGameScores') || '[]');
    scores.push(newScore);
    localStorage.setItem('catGameScores', JSON.stringify(scores));
    displayScores();
}

function displayScores() {
    const scoreList = document.getElementById('scoreList');
    if (!scoreList) return;
    const scores = JSON.parse(localStorage.getItem('catGameScores') || '[]');
    scoreList.innerHTML = scores.map(s => `<li>${s.name}: ${s.score} (${s.date})</li>`).join('');
}

startBtn.addEventListener('click', () => {
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
