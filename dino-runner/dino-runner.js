const dino = document.querySelector('.dino');
const background = document.querySelector('.background');
let isJumping = false;
let gameOver = false;
let position = 0;
let timer  = 0;

/* the initial state of the game when the page finish loading */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

/* start all the operations of the game when the user click the play button */
function startGame() {
    document.getElementById('status').textContent = 'Game In Progress';
    document.addEventListener('keyup', handleKeyUp);
    timeInterval = setInterval(updateTimer, 1000);
    createCactus();
    disableButtons();
}

/* the restart button just reloads the page */
function restartGame() {
    window.location.reload();
}

/* update the timer every second (time represents the score for this game) */
function updateTimer() {
    timer++;
    document.getElementById('timer').textContent = timer;
}

/* handle the jumping operation */
function handleKeyUp(event) {
    if (event.keyCode === 32 && !isJumping && !gameOver) {
        if ("isJumping") {
            jump();
        }
    }
}

/* set up the jumping animation on the gameplay screen */
function jump() {
    isJumping = true;

    let upInterval = setInterval(() => {
        if (position >= 150) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 20;
                    dino.style.bottom = position + 'px';
                }
            }, 20);

        } else {
            position += 20;
            dino.style.bottom = position + 'px';
        }
    }, 20);
}

/* generates cactus based on a random interval and check for a collision */
function createCactus() {
    if (!gameOver) {
        const cactus = document.createElement('div');
        let cactusPosition = 1500;
        let randomTime = Math.random() * 6000;

        cactus.classList.add('cactus');
        cactus.style.left = 1500 + 'px';
        background.appendChild(cactus);

        let leftInterval = setInterval(() => {
            cactusPosition -= 10;
            cactus.style.left = cactusPosition + 'px';

            // a successful jump, cactus goes past the dinosaur
            if (cactusPosition < -60) {
                clearInterval(leftInterval);
                background.removeChild(cactus);

            // a collision occurs, clear all intervals and end the game
            } else if (cactusPosition > 520 && cactusPosition < 580 && position < 60) {
                clearInterval(leftInterval);
                clearInterval(timeInterval);
                document.getElementById('status').textContent = 'Game Over! Your Time: ' + timer;
                gameOver = true;
                background.style.animation = 'none';
            // move the cactus to the left
            } else {
                cactusPosition -= 10;
                cactus.style.left = cactusPosition + 'px';
            }
        }, 20);
        setTimeout(createCactus, randomTime);
    }
}

/* disable the play and radio buttons to prevent unexpected behavior */
function disableButtons() {
    document.getElementById('playButton').disabled = true;
}