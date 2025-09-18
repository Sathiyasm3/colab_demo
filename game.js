// --- Game settings ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hudKills = document.getElementById('kills');
const hudTimer = document.getElementById('timer');
const hudMode = document.getElementById('mode');
const overlay = document.getElementById('overlay');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Bots
const BOT_RADIUS = 18;
const BOT_COLOR = "#ff6f00";
const BOT_COUNT = 100;
const BOT_SPEED = 2.5;

// Game state variables
let bots = [];
let kills = 0;
let gameMode = "timed"; // "timed" or "killall"
let timer = 0;
let gameActive = false;
let startTime = 0;
let timedModeDuration = 5 * 60; // 5 minutes in seconds

// --- GAME OBJECTS ---
function spawnBots() {
    bots = [];
    for (let i = 0; i < BOT_COUNT; i++) {
        let bx = Math.random() * (CANVAS_WIDTH - 2 * BOT_RADIUS) + BOT_RADIUS;
        let by = Math.random() * (CANVAS_HEIGHT - 2 * BOT_RADIUS) + BOT_RADIUS;
        bots.push({
            x: bx,
            y: by,
            dir: Math.random() * 2 * Math.PI, // Random direction
            alive: true,
            changeDirTime: Math.random() * 1.5 + 0.5 // seconds until next direction change
        });
    }
}

// --- GAME LOOP ---
function gameLoop() {
    if (!gameActive) return;

    // Update timer
    let elapsed = (Date.now() - startTime) / 1000;
    if (gameMode === "timed") {
        timer = Math.max(0, timedModeDuration - elapsed);
        if (timer <= 0) {
            endGame(`Time's up!<br>Kills: ${kills}`);
            return;
        }
    } else if (gameMode === "killall") {
        timer = elapsed;
    }

    // Move bots
    updateBots();

    // Draw everything
    draw();

    // HUD update
    hudKills.textContent = `Kills: ${kills}`;
    hudTimer.textContent = gameMode === 'timed'
        ? `Time: ${formatTime(timer)}`
        : `Time: ${formatTime(timer)}`;
    hudMode.textContent = `Mode: ${gameMode === 'timed' ? 'Timed' : 'Kill-All'}`;

    // Win check
    if (gameMode === "killall" && bots.every(bot => !bot.alive)) {
        endGame(`Victory!<br>Time: ${formatTime(timer)}<br>Kills: ${kills}`);
        return;
    }

    requestAnimationFrame(gameLoop);
}

// --- BOTS MOVEMENT ---
function updateBots() {
    for (let bot of bots) {
        if (!bot.alive) continue;

        // Change direction randomly every X seconds
        bot.changeDirTime -= 1 / 60;
        if (bot.changeDirTime <= 0) {
            bot.dir = Math.random() * 2 * Math.PI;
            bot.changeDirTime = Math.random() * 1.5 + 0.5;
        }

        // Move
        bot.x += Math.cos(bot.dir) * BOT_SPEED;
        bot.y += Math.sin(bot.dir) * BOT_SPEED;

        // Bounce off walls
        if (bot.x < BOT_RADIUS) {
            bot.x = BOT_RADIUS;
            bot.dir = Math.PI - bot.dir;
        }
        if (bot.x > CANVAS_WIDTH - BOT_RADIUS) {
            bot.x = CANVAS_WIDTH - BOT_RADIUS;
            bot.dir = Math.PI - bot.dir;
        }
        if (bot.y < BOT_RADIUS) {
            bot.y = BOT_RADIUS;
            bot.dir = -bot.dir;
        }
        if (bot.y > CANVAS_HEIGHT - BOT_RADIUS) {
            bot.y = CANVAS_HEIGHT - BOT_RADIUS;
            bot.dir = -bot.dir;
        }
    }
}

// --- DRAWING ---
function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bots
    for (let bot of bots) {
        if (!bot.alive) continue;
        ctx.beginPath();
        ctx.arc(bot.x, bot.y, BOT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = BOT_COLOR;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    }
}

// --- CLICK TO SHOOT ---
canvas.addEventListener('mousedown', (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Find the topmost bot clicked (if overlapping)
    for (let bot of bots) {
        if (!bot.alive) continue;
        let dist = Math.hypot(mx - bot.x, my - bot.y);
        if (dist <= BOT_RADIUS) {
            bot.alive = false;
            kills++;
            break; // Only one bot per click
        }
    }
});

// --- GAME CONTROL ---
function startGame(mode) {
    gameMode = mode;
    kills = 0;
    spawnBots();
    timer = (gameMode === "timed") ? timedModeDuration : 0;
    startTime = Date.now();
    gameActive = true;
    overlay.style.display = "none";
    gameLoop();
}

// --- END GAME ---
function endGame(message) {
    gameActive = false;
    overlay.innerHTML = `<div>${message}</div>
    <button onclick="startGame('${gameMode}')">Restart</button>
    <button onclick="showMenu()">Main Menu</button>`;
    overlay.style.display = "flex";
}

// --- MENU ---
function showMenu() {
    overlay.style.display = "none";
}

// --- UTILS ---
function formatTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s.toString().padStart(2, '0')}`;
}

// --- INITIAL STATE ---
showMenu();
