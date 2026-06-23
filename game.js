const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let lives = 3;
let gameOver = false;

// Check if mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Player (Pepo with axe)
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 45,
    speed: 5,
    isSwinging: false,
    swingCooldown: 0,
    moveX: 0,
    moveY: 0
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

// Mobile Controls
if (isMobile) {
    // Show mobile controls
    document.getElementById('mobileControls').classList.add('show');
    document.getElementById('controlsInfo').innerHTML = '<p>Use joystick to move | Tap 🔪 to attack</p>';

    const joystickArea = document.getElementById('joystickArea');
    const joystickThumb = document.getElementById('joystickThumb');
    const attackBtn = document.getElementById('attackBtn');

    let joystickActive = false;
    let joystickX = 0;
    let joystickY = 0;

    joystickArea.addEventListener('touchstart', (e) => {
        joystickActive = true;
        updateJoystick(e);
    });

    joystickArea.addEventListener('touchmove', (e) => {
        if (joystickActive) {
            e.preventDefault();
            updateJoystick(e);
        }
    });

    joystickArea.addEventListener('touchend', () => {
        joystickActive = false;
        joystickThumb.style.transform = 'translate(-50%, -50%)';
        player.moveX = 0;
        player.moveY = 0;
    });

    function updateJoystick(e) {
        const touch = e.touches[0];
        const rect = joystickArea.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = rect.width / 2 - 25;

        if (distance > maxDistance) {
            dx = (dx / distance) * maxDistance;
            dy = (dy / distance) * maxDistance;
        }

        joystickThumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

        // Normalize movement
        player.moveX = dx / maxDistance;
        player.moveY = dy / maxDistance;
    }

    attackBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        swingAxe();
    });

    attackBtn.addEventListener('click', () => {
        swingAxe();
    });
}

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
    
    // Smile (sad pepo inspired)
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
fun};
