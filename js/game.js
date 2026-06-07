const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CAT_X = 80;
const CAT_SIZE = 60;
const scoreElement = document.getElementById('gameScore');
const nameInput = document.getElementById('playerNameInput');
const startBtn = document.getElementById('startGameBtn');

const gravity = 0.18;
const jumpStrength = -9;
const INITIAL_SPEED = 1.3;
const MAX_SPEED = 100;
const SPEED_INCREMENT = 0.3;
const COLLISION_PADDING = 0;
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
let jumpCount = 0;
const maxJumpsBeforeReset = 2;

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
    const size = Math.floor(Math.random() * 156) + 50; // Size between 50 and 206 (up to ~4x current max)
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    obstacles.push({
        x: canvas.width,
        y: canvas.height - size,
        width: 30,
        height: size,
        type: type
    });

    // Adaptive spacing: wider initially, tightens as score increases
    const minGap = Math.max(60, 180 - score);
    nextObstacleFrame = frameCount + Math.floor(Math.random() * (240 - minGap + 1)) + minGap;
}

function spawnCollectible() {
    // Fish size: slightly larger than cat but still manageable
    const size = 60;
    // Collectibles spawn within cat's double-jump range (roughly 280-650px from bottom)
    collectibles.push({
        x: canvas.width,
        y: canvas.height - 350 + Math.random() * 180,
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
        jumpCount = 0;
    }

    // Obstacle movement
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= currentSpeed;

        const obsTop = obstacles[i].y + obstacles[i].height;  // Top of hitbox at draw baseline
        const obsBottom = obstacles[i].y + obstacles[i].height + 60;   // Bottom with collision padding
        const obsLeft = obstacles[i].x + 40;
        const obsRight = obstacles[i].x + obstacles[i].width - 40;

        // Auto-jump when cat bottom touches obstacle top (within horizontal range)
        if (catTop < obsBottom && catBottom >= obsTop && catLeft <= obsRight && catRight >= obsLeft) {
            velocityY = jumpStrength;
            jumpCount++;
        }

        // Collision with side/bottom of obstacle triggers game over (not hitting top edge)
        if (catBottom > obsTop && catTop < obsBottom - 50 && catLeft <= obsRight && catRight >= obsLeft) {
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

    // Spawn obstacles and collectibles
    frameCount++;
    if (frameCount >= nextObstacleFrame && nextObstacleFrame > 0) {
        spawnObstacle();
        frameCount = 0; // Reset for next obstacle gap
        const minGap = Math.max(60, 180 - score);
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
    ctx.font = "60px Arial";
    collectibles.forEach(coll => {
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
    if (jumpCount >= maxJumpsBeforeReset) return;
    if (e.code === 'Space' && gameRunning) {
        velocityY = jumpStrength;
        jumpCount++;
    }
});

canvas.addEventListener('mousedown', () => {
    if (gameRunning && jumpCount < maxJumpsBeforeReset) {
        velocityY = jumpStrength;
        jumpCount++;
    }
});

// Initialize scores display on load
displayScores();