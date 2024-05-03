const dino = document.querySelector('.dino');
const background = document.querySelector('.background');
let isJumping = false;
let gameOver = false;
let position = 0;
let timer  = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

function startGame() {
    document.getElementById('status').textContent = 'Game In Progress';
    document.addEventListener('keyup', handleKeyUp);
    timeInterval = setInterval(updateTimer, 1000);
    createCactus();
    disableButtons();
}

function restartGame() {
    window.location.reload();
}

function updateTimer() {
    timer++;
    document.getElementById('timer').textContent = timer;
}

function handleKeyUp(event) {
    if (event.keyCode === 32 && !isJumping && !gameOver) {
        if ("isJumping") {
            jump();
        }
    }
}

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

function createCactus() {
    if (!gameOver) {
        const cactus = document.createElement('div');
        let cactusPosition = 1020;
        let randomTime = Math.random() * 6000;

        cactus.classList.add('cactus');
        cactus.style.left = 1000 + 'px';
        background.appendChild(cactus);

        let leftInterval = setInterval(() => {
            cactusPosition -= 10;
            cactus.style.left = cactusPosition + 'px';

            if (cactusPosition < -60) {
                clearInterval(leftInterval);
                background.removeChild(cactus);
            } else if (cactusPosition > 0 && cactusPosition < 60 && position < 60) {
                clearInterval(leftInterval);
                clearInterval(timeInterval);
                document.getElementById('status').textContent = 'Game Over! Your Time: ' + timer;
                gameOver = true;
            } else {
                cactusPosition -= 10;
                cactus.style.left = cactusPosition + 'px';
            }
        }, 20);
        setTimeout(createCactus, randomTime);
    }
}

function disableButtons() {
    document.getElementById('playButton').disabled = true;
}