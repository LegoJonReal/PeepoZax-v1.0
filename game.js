const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let lives = 3;
let gameOver = false;

// Player (Pepo with axe)
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 45,
    speed: 5,
    isSwinging: false,
    swingCooldown: 0
};

// Enemy pepos
let enemies = [];
const maxEnemies = 5;

// Axe swing
const axe = {
    active: false,
    x: 0,
    y: 0,
    angle: 0,
    radius: 40,
    duration: 300,
    startTime: 0
};

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        e.preventDefault();
        swingAxe();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Draw Pepe character
function drawPepe(x, y, color = '#52B788') {
    const scale = 1;
    
    // Head/Body (green oval)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 18 * scale, 22 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Left eye white
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x - 8, y - 6, 6 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye white
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x + 8, y - 6, 6 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Left eye pupil
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(x - 8, y - 5, 3 * scale, 4 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye pupil
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(x + 8, y - 5, 3 * scale, 4 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile (sad pepe inspired)
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + 5, 8 * scale, 0, Math.PI, false);
    ctx.stroke();
    
    // Mouth fill
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 5);
    ctx.quadraticCurveTo(x, y + 10, x + 8, y + 5);
    ctx.lineTo(x + 7, y + 4);
    ctx.quadraticCurveTo(x, y + 8, x - 7, y + 4);
    ctx.fill();
}

// Spawn enemies
function spawnEnemy() {
    const side = Math.floor(Math.random() * 4);
    let x, y;

    switch(side) {
        case 0: x = Math.random() * canvas.width; y = -20; break;
        case 1: x = canvas.width + 20; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = canvas.height + 20; break;
        case 3: x = -20; y = Math.random() * canvas.height; break;
    }

    enemies.push({
        x: x,
        y: y,
        width: 35,
        height: 40,
        speed: 2 + Math.random() * 1,
        angle: Math.atan2(player.y - y, player.x - x)
    });
}

// Swing axe
function swingAxe() {
    if (!axe.active && player.swingCooldown <= 0) {
        axe.active = true;
        axe.x = player.x;
        axe.y = player.y;
        axe.startTime = Date.now();
        player.swingCooldown = 400;
    }
}

// Update player position
function updatePlayer() {
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.y = Math.max(0, player.y - player.speed);
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.y = Math.min(canvas.height - player.height, player.y + player.speed);
    }
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.x = Math.max(0, player.x - player.speed);
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }

    if (player.swingCooldown > 0) {
        player.swingCooldown--;
    }
}

// Update axe
function updateAxe() {
    if (axe.active) {
        const elapsed = Date.now() - axe.startTime;
        
        if (elapsed > axe.duration) {
            axe.active = false;
        } else {
            const progress = elapsed / axe.duration;
            axe.angle = progress * Math.PI * 2;
        }
    }
}

// Update enemies
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // Move towards player
        enemy.angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(enemy.angle) * enemy.speed;
        enemy.y += Math.sin(enemy.angle) * enemy.speed;

        // Check if hit by axe
        if (axe.active) {
            const axeX = axe.x + Math.cos(axe.angle) * axe.radius;
            const axeY = axe.y + Math.sin(axe.angle) * axe.radius;
            
            const distance = Math.sqrt(
                Math.pow(axeX - (enemy.x + enemy.width / 2), 2) +
                Math.pow(axeY - (enemy.y + enemy.height / 2), 2)
            );

            if (distance < 25) {
                enemies.splice(i, 1);
                score += 10;
                document.getElementById('score').textContent = score;
                c

