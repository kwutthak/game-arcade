"use strict";

let cards;
let numCards = 6;
let resultCards = [];
let matchingMode = false;
let correctMatches = 0;
let lastCard;
let lastCardIndex;
const difficulties = document.getElementsByName('difficulty');
let gameActive = false;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

function startGame() {
    if (!gameActive) {
        gameActive = true;
        document.getElementById('status').textContent = 'Game In Progress';
        setDifficulty();
        generateCards();
        setCards();
        cards.forEach(card => card.addEventListener('click', match));
        disableButtons();
    }
}

function restartGame() {
    window.location.reload();
}

function setDifficulty() {
    document.getElementById('playArea').innerHTML = '';

    if (difficulties[0].checked) {
        numCards = 6;
    } else if (difficulties[1].checked) {
        numCards = 10;
    } else if (difficulties[2].checked) {
        numCards = 20;
    }
}

function setCards() {

    for (let i = 0; i < numCards; i++) {
        const container = document.createElement('div');
        container.className = 'card';

        createFrontImage(container);
        createBackImage(container, i);

        document.getElementById('playArea').appendChild(container);
    }
    cards = document.querySelectorAll('.card');
}

function createFrontImage(container) {
    let front = document.createElement('img');
    front.className = 'front';
    front.src = 'images/front.png';
    front.alt = 'Hidden';
    container.appendChild(front);
}

function createBackImage(container, i) {
    const imageIndex = resultCards.findIndex(pair => containPairs(pair, i));
    let back = document.createElement('img');
    back.className = 'back hidden';
    back.src = 'images/' + imageIndex + '.png'
    back.alt = 'Pic';
    container.appendChild(back);
}

function generateCards() {
    let newCards = [];
    for (let i = 0; i < numCards; i++) {
        newCards.push(i);
    }
    let usedCards = [];
    while (newCards.length > 0) {
        let firstCard = Math.floor(Math.random() * numCards);
        let secondCard = Math.floor(Math.random() * numCards);
        if ((firstCard !== secondCard) && (!usedCards.includes(firstCard)) && (!usedCards.includes(secondCard))) {
            storeCards(usedCards, newCards, firstCard, secondCard);
        }
    }
}

function storeCards(usedCards, newCards, firstCard, secondCard) {
    const pair = {first: firstCard, second: secondCard};
    resultCards.push(pair);
    let index = newCards.indexOf(secondCard);
    newCards.splice(index, 1);
    index = newCards.indexOf(firstCard);
    newCards.splice(index, 1);
    usedCards.push(secondCard);
    usedCards.push(firstCard);
}

function arePairs(pair, card1, card2) {
    return (pair.first === card1 && pair.second === card2) || (pair.first === card2 && pair.second === card1);
}

function containPairs(pair, value) {
    return pair.first === value || pair.second === value;
}


function match() {
    const clickedIndex = Array.from(cards).indexOf(this);
    const backImage = this.querySelector('.back');
    const frontImage = this.querySelector('.front');

    if (backImage.classList.contains('hidden')) {
        backImage.classList.toggle('hidden');
        frontImage.classList.toggle('hidden');
    }
    this.classList.add('disabled');

    if (!matchingMode) {
        matchingMode = true;
        lastCard = this;
        lastCardIndex = clickedIndex;
    } else {
        matchingMode = false;
        const pairExists = resultCards.some(pair => arePairs(pair, clickedIndex, lastCardIndex));
        if (pairExists) {
            successfulMatch(backImage);
        } else {
            let currentCard = this;
            failureMatch(backImage, frontImage, currentCard);
        }
    }
    checkGameOver();
}

function successfulMatch(backImage) {
    
    setTimeout(() => {
        backImage.src = 'images/matched.png';
        lastCard.querySelector('.back').src = 'images/matched.png'
    }, 1000);
    
    correctMatches++;
    score += 100;
    document.getElementById('score').textContent = score;
}

function failureMatch(backImage, frontImage, currentCard) {
    cards.forEach(card => card.classList.add('unclickable'));
    setTimeout(() => {
        backImage.classList.toggle('hidden');
        frontImage.classList.toggle('hidden');
        lastCard.querySelector('.back').classList.toggle('hidden');
        lastCard.querySelector('.front').classList.toggle('hidden');
        currentCard.classList.remove('disabled');
        lastCard.classList.remove('disabled');
        cards.forEach(card => card.classList.remove('unclickable'));
    }, 1000);

    if (score > 0) {
        score -= 10;
        document.getElementById('score').textContent = score;
    }
}

function checkGameOver() {
    if (correctMatches === (numCards / 2)) {
        gameActive = false;
        document.getElementById('status').textContent = 'Game Over! Your Score: ' + score;
    }
}

function disableButtons() {
    document.getElementById('playButton').classList.add('disabled');
    difficulties.forEach(difficulty => difficulty.classList.add('disabled'));
}