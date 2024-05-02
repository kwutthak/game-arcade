"use strict";

const dino = document.querySelector('.dino')
const background = document.querySelector('.background')
let isJumping = false;
let canJump = true;
let position = 0;
let gameOver = false;
let gameActive = false;
let cactusInterval = null;
let timeInterval;
let cactusArray = [];
let timer = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

function startGame() {
    if (!gameOver && !gameActive) {
        gameActive = true;
        document.getElementById('status').textContent = 'Game In Progress';
        timeInterval = setInterval(updateTimer, 1000);
        createCactus();
        document.addEventListener('keyup', handleKeyUp)
        disableButtons();
    }
}

function restartGame() {
    window.location.reload();
}

function updateTimer() {
    timer++;
    document.getElementById('timer').textContent = timer;
}

function handleKeyUp(event) {
    if (event.keyCode === 32 && !gameOver && canJump) {
        if ("isJumping") {
            canJump = false;
            setTimeout(() => { canJump = true;}, 500);
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
                if (position<= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 20;
                    dino.style.bottom = position + 'px';
                }
            }, 20)

        } else {
            position += 20;
            dino.style.bottom = position + 'px';
        }
    }, 20);
}

function createCactus() {

    if (!gameOver && !cactusInterval) {
        const cactus = document.createElement('div');
        let cactusPosition = 1020;
        let randomTime = Math.random() * 6000;
    
        cactus.classList.add('cactus');
        cactus.style.left = 1000 + 'px';
        background.appendChild(cactus);

        cactusInterval = setInterval(() => {
            cactusPosition -= 10;
            cactus.style.left = cactusPosition + 'px';

            if (cactusPosition < -60) {
                clearInterval(cactusInterval);
                background.removeChild(cactus);
                cactusInterval = null;
            } else if (cactusPosition > 0 && cactusPosition < 60 && position < 60) {
                clearInterval(cactusInterval);
                gameOver = true;
                removeCactus();
                clearInterval(timeInterval);
                document.getElementById('status').textContent = 'Game Over! Your Time: ' + timer;
                gameActive = false;
            } else {
                cactusPosition -= 10;
                cactus.style.left = cactusPosition + 'px';
            }
        }, 20)

        cactusArray.push(cactusInterval);
        setTimeout(createCactus, randomTime);
    }
}

function removeCactus() {
    cactusArray.forEach(cactus => clearInterval(cactus));
    cactusArray = [];
}


function disableButtons() {
    document.getElementById('playButton').classList.add('disabled');
    speeds.forEach(speed => speed.classList.add('disabled'));
}