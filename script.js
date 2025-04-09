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
const pipeGap = 140; // Space between top and bottom pipes
const pipeWidth = 60;
const pipeSpeed = 4; // Speed at which pipes move
const pipeSpacing = 300; // Reduced spacing for quicker next pipe spawn
const screenWidth = 400; // Set the screen width to 400px
const maxPipesOnScreen = 2; // Limit to only 2 pipes on screen at once

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
    startMessage.style.display = "none";

    pipes.forEach(pipe => {
        pipe.top.remove();
        pipe.bottom.remove();
    });
    pipes = [];

    gameLoop();
    createPipesPeriodically();
}

// Creates a single pipe with a gap, ensuring only 2 pipes appear on screen at once
function createPipe() {
    if (isGameOver) return;

    let pipeTopHeight = Math.floor(Math.random() * 200) + 100;
    let pipeBottomHeight = 500 - pipeTopHeight - pipeGap;

    let pipeTop = document.createElement("div");
    pipeTop.classList.add("pipe", "pipe-top");
    pipeTop.style.height = `${pipeTopHeight}px`;
    pipeTop.style.left = `${screenWidth}px`; // Start at the right edge of the screen
    gameContainer.appendChild(pipeTop);

    let pipeBottom = document.createElement("div");
    pipeBottom.classList.add("pipe", "pipe-bottom");
    pipeBottom.style.height = `${pipeBottomHeight}px`;
    pipeBottom.style.left = `${screenWidth}px`;
    gameContainer.appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom, passed: false });
}

// Moves pipes and removes old ones
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

            if (!pipe.passed && pipeLeft < 50) {
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = score;
            }

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

    birdY = 200;
    bird.style.top = `${birdY}px`;

    pipes.forEach(pipe => {
        pipe.top.remove();
        pipe.bottom.remove();
    });
    pipes = [];

    startMessage.style.display = "block"; 
}

// Ensures only 2 pipes are visible on the screen at a time, with closer gaps between sets
function createPipesPeriodically() {
    if (!isGameOver) {
        if (pipes.length < maxPipesOnScreen) { // Only create pipes if less than 2 pipes are on screen
            createPipe();
        }
        setTimeout(createPipesPeriodically, pipeSpacing); // Reduced pipe spawn interval for quicker pipes
    }
}
