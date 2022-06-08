const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

let score = 0;
let gravity = 17.5;

canvas.width = innerWidth;
canvas.height = innerHeight;

let jumpVar;
let downVar;
let playerJumping = false;

class Player {
    constructor(x, y, sizeX, sizeY, color) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
    }
}
class Obstacle {
    constructor(x, y, sizeX, sizeY, color, vel) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.color = color;
        this.vel = vel;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
    }

    update() {
        this.x -= this.vel;
    }
};

let x = 100;
let y = canvas.height - 120;
const player = new Player(x, y, 75, 150, 'red');
const obstacle = new Obstacle(canvas.width + 10, canvas.height - 120, 90, 100, 'blue', 15);


function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ground();
    player.draw();
    obstacle.draw();
    obstacle.update();
    if (obstacle.x + obstacle.sizeX < 0) {
        obstacle.x = canvas.width + 10;
    }
    if (player.y > canvas.height - 20 - player.sizeY) {
        player.y = canvas.height - 20 - player.sizeY;
        playerJumping = false;
        clearInterval(jumpVar);
        clearInterval(downVar);
    }
    checkIfHit();
    requestAnimationFrame(animate);
};

function restart() {
    score = 0;
    scoreEl.innerText = score;
    location.reload();
};

function checkIfHit() {
    if (obstacle.x + obstacle.sizeX == player.x + player.sizeX || obstacle.x + obstacle.sizeX <= player.x + player.sizeX + 84.75 && obstacle.x + obstacle.sizeX + 90 >= player.x + player.sizeX) {
        if (obstacle.y - 4 <= player.y + player.sizeY - 5) {
            alert("Przegrales/as!");
            restart();
        } else {
            score += 0.1;
            scoreEl.innerText = Math.round(score);
        }
    }
}


function ground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 50);
    ctx.fill();
}

function jump() {
    clearInterval(jumpVar);
    jumpVar = setInterval(function() {
        playerJumping = true;
        if (player.y + player.sizeY < canvas.height - 245) {
            goDown();
        }
        player.y -= gravity;
    }, 10);
}

function goDown() {
    clearInterval(jumpVar);
    playerJumping = true;
    downVar = setInterval(function() {
        player.y += gravity;
    }, 10)
}
addEventListener('click', (e) => {
    if (playerJumping == false) {
        jump();
    }
});
addEventListener('keydown', (e) => {
    if (e.key == 'ArrowUp' && playerJumping == false) {
        jump();
    } else if (e.key == 'w' && playerJumping == false) {
        jump();
    } else if (e.keyCode == 32 && playerJumping == false) {
        e.preventDefault();
        jump();
    }
});

document.addEventListener("visibilitychange", () => {
    alert(`Kliknij "Ok" zeby kontynuowac`)
});

animate();