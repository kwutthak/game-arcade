"use strict";

const holes = document.querySelectorAll('.hole');
const speeds = document.getElementsByName('speed');
let gameActive = false;
let countdown = 30;
let score = 0;
let gameSpeed = 1500;
let scoreMultiplier = 1.0;
let timeInterval;
let moleInterval;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

function startGame() {
    if (!gameActive) {
        gameActive = true;
        document.getElementById('status').textContent = 'Game In Progress';
        setSpeed();
        timeInterval = setInterval(updateCountdown, 1000);
        moleInterval = setInterval(generateMoles, gameSpeed);
        holes.forEach(hole => hole.addEventListener('click', whack));
        disableButtons();
    }
}

function restartGame() {
    window.location.reload();
}

function setSpeed() {
    if (speeds[0].checked) {
        gameSpeed = 1500;
        scoreMultiplier = 1.0;
    } else if (speeds[1].checked) {
        gameSpeed = 1000;
        scoreMultiplier = 1.5;
    } else if (speeds[2].checked) {
        gameSpeed = 750;
        scoreMultiplier = 2.0;
    }
}

function updateCountdown() {
    countdown--;
    document.getElementById('countdown').textContent = countdown;
    if (countdown  === 0) {
        clearInterval(timeInterval);
        clearInterval(moleInterval);
        removeMoles();
        gameActive = false;
        document.getElementById('status').textContent = 'Game Over! Your Score: ' + score;
    }
}

function generateMoles() {
    let randomHole = Math.floor(Math.random() * holes.length);
    let hole = holes[randomHole];
    if (!hole.classList.contains('mole')) {
        hole.classList.add('mole');
        setTimeout(() => hole.classList.remove('mole'), gameSpeed);
    }
}

function removeMoles() {
    holes.forEach(hole => {
        hole.classList.remove('mole');
    });
}

function whack() {
    if (this.classList.contains('mole')) {
        score += 100 * scoreMultiplier;
        document.getElementById('score').textContent = score;
        this.classList.remove('mole');
        this.classList.add('whacked');
        setTimeout(() => this.classList.remove('whacked'), 1000);
    }
}

function disableButtons() {
    document.getElementById('playButton').disabled = true;
    speeds.forEach(speed => speed.classList.add('disabled'));
}