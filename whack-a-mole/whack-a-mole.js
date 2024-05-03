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

/* the initial state of the game when the page finish loading */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
});


/* start all the operations of the game when the user click the play button */
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

/* the restart button just reloads the page */
function restartGame() {
    window.location.reload();
}

/* set the speed of which the moles appear and the score multiplier depending on the difficulty */
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

/* update the countdown every second and ends the game after it runs out*/
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

/* generate a mole from a random hole (the interval depends on the difficulty) */
function generateMoles() {
    let randomHole = Math.floor(Math.random() * holes.length);
    let hole = holes[randomHole];

    if (!hole.classList.contains('mole')) {
        hole.classList.add('mole');
        setTimeout(() => hole.classList.remove('mole'), gameSpeed);
    }
}

/* handle the removal of any leftover moles after game is over */
function removeMoles() {
    holes.forEach(hole => {
        hole.classList.remove('mole');
    });
}

/* this function is called when the player successfully hit a mole */
function whack() {
    if (this.classList.contains('mole')) {
        score += 100 * scoreMultiplier;
        document.getElementById('score').textContent = score;
        this.classList.remove('mole');
        this.classList.add('whacked');
        setTimeout(() => this.classList.remove('whacked'), 1000);
    }
}

/* disable the play and radio buttons to prevent unexpected behavior */
function disableButtons() {
    document.getElementById('playButton').disabled = true;
    speeds.forEach(speed => speed.classList.add('disabled'));
}