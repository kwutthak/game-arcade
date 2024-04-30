"use strict";

const holes = document.querySelectorAll('.hole');
let gameActive = false;
let countdown = 10;
let score = 0;
let timeInterval;
let moleInterval;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

function startGame() {
    if (!gameActive) {
        gameActive = true;
        startCountdown();
        moleInterval = setInterval(generateMoles, 1000);
        holes.forEach(hole => hole.addEventListener('click', whack));
    }
}

function restartGame() {
    window.location.reload();
}

function startCountdown() {
    timeInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    countdown--;
    document.getElementById('countdown').textContent = countdown;
    if (countdown  === 0) {
        resetCountdown();
        removeMoles();
        gameActive = false;
    }
}

function resetCountdown() {
    clearInterval(timeInterval);
}

function generateMoles() {
    let randomHole = Math.floor(Math.random() * holes.length);
    let hole = holes[randomHole];
    if (!hole.classList.contains('mole')) {
        hole.classList.add('mole');
        setTimeout(() => hole.classList.remove('mole'), 1000);
    }
}

function removeMoles() {
    holes.forEach(hole => {
        hole.classList.remove('mole');
    });
    clearInterval(moleInterval);
}

function whack() {
    if (this.classList.contains('mole')) {
        score += 100;
        this.classList.remove('mole');
        document.getElementById('score').textContent = score;
        this.classList.add('whacked');
        setTimeout(() => this.classList.remove('whacked'), 1000);
    }
}