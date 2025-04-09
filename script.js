const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const startMessage = document.getElementById("start-message");

let birdY;
let velocity;
let gravity = 0.5;
let isGameOver = false;
let gameStarted = false;
let score;
let pipes = [];
const pipeGap = 120;
const pipeWidth = 50;
const pipeSpeed = 3;

// Start the game when Space is pressed
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (!gameStarted) {
            startGame();
        } else if (!isGameOver) {
            velocity = -7; // Jump
        }
    }
});

function startGame() {
    gameStarted = true;
    isGameOver = false;
    birdY = 200;
    velocity = 0;
    score = 0;
    scoreDisplay.textContent = score;
    startMessage.style.display = "none"; // Hide start message

    // Clear old pipes
    pipes.forEach(pipe => {
        pipe.top.remove();
        pipe.bottom.remove();
    });
    pipes = [];

    gameLoop();
    createPipesPeriodically();
}

// Create pipes
function createPipe() {
    if (isGameOver) return;

    let minHeight = 100;
    let maxHeight = 300;
    let pipeTopHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
    let pipeBottomHeight = 500 - pipeTopHeight - pipeGap;

    let pipeTop = document.createElement("div");
    pipeTop.classList.add("pipe", "pipe-top");
    pipeTop.style.height = `${pipeTopHeight}px`;
    pipeTop.style.left = '400px';
    gameContainer.appendChild(pipeTop);

    let pipeBottom = document.createElement("div");
    pipeBottom.classList.add("pipe", "pipe-bottom");
    pipeBottom.style.height = `${pipeBottomHeight}px`;
    pipeBottom.style.left = '400px';
    gameContainer.appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom, passed: false });
}

// Move pipes and check collisions
function movePipes() {
    pipes.forEach(pipe => {
        let pipeLeft = parseInt(pipe.top.style.left);

        if (pipeLeft < -pipeWidth) {
            pipe.top.remove();
            pipe.bottom.remove();
            pipes = pipes.filter(p => p !== pipe);
        } else {
            pipe.top.style.left = `${pipeLeft - pipeSpeed}px`;
            pipe.bottom.style.left = `${pipeLeft - pipeSpeed}px`;

            // Score count
            if (!pipe.passed && pipeLeft < 50) {
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = score;
            }

            // Collision check
            if (
                (birdY < parseInt(pipe.top.style.height) || birdY > 500 - parseInt(pipe.bottom.style.height)) &&
                pipeLeft > 50 && pipeLeft < 100
            ) {
                gameOver();
            }
        }
    });
}

// Game loop
function gameLoop() {
    if (!isGameOver) {
        birdY += velocity;
        velocity += gravity;
        bird.style.top = `${birdY}px`;

        movePipes();
        requestAnimationFrame(gameLoop);
    }
}

// Game Over - Reset Position and Show Start Message
function gameOver() {
    isGameOver = true;
    gameStarted = false;

    // Reset bird position
    birdY = 200;
    bird.style.top = `${birdY}px`;

    // Remove all pipes
    pipes.forEach(pipe => {
        pipe.top.remove();
        pipe.bottom.remove();
    });
    pipes = [];

    startMessage.style.display = "block"; // Show start message again
}

// Generate pipes periodically
function createPipesPeriodically() {
    if (!isGameOver) {
        createPipe();
        setTimeout(createPipesPeriodically, 1500);
    }
}
