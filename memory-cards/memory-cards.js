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
        setDifficulty();
        generateCards();
        setCards();
        cards.forEach(card => card.addEventListener('click', match));
        disableButtons();
    }
}

/* the restart button just reloads the page */
function restartGame() {
    window.location.reload();
}

/* set the number of cards depending on the difficulty level given */
function setDifficulty() {
    document.getElementById('playArea').innerHTML = '';

    if (difficulties[0].checked) {
        numCards = 6;
        document.getElementById('playArea').style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else if (difficulties[1].checked) {
        numCards = 10;
    } else if (difficulties[2].checked) {
        numCards = 20;
    }
}

/* generate pairs of matching cards and store them in an array */
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

/* store the matching pairs and keep track of all the cards that are already paired up */
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

/* arrange the cards in the gameplay area and set up front/back images accordingly */
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

/* handle the creation of the image in front of the card (the same for all cards) */
function createFrontImage(container) {
    let front = document.createElement('img');
    front.className = 'front';
    front.src = 'images/front.jpeg';
    front.alt = 'Hidden';
    container.appendChild(front);
}

/* handle the creation of the image behind the card (the actual face of the cards) */
function createBackImage(container, i) {
    const imageIndex = resultCards.findIndex(pair => containPairs(pair, i));
    let back = document.createElement('img');
    back.className = 'back hidden';
    back.src = 'images/' + imageIndex + '.jpeg'
    back.alt = 'Backside of a Game Card';
    container.appendChild(back);
}

/* helper function to determine if two cards belong to a matching pair */
function arePairs(pair, card1, card2) {
    return (pair.first === card1 && pair.second === card2) || (pair.first === card2 && pair.second === card1);
}

/* helper function to determine if a card exists in a pair */
function containPairs(pair, value) {
    return pair.first === value || pair.second === value;
}

/* handle all the operations when a card is clicked */
function match() {
    const clickedIndex = Array.from(cards).indexOf(this);
    const backImage = this.querySelector('.back');
    const frontImage = this.querySelector('.front');

    // switch from front image to back image
    if (backImage.classList.contains('hidden')) {
        backImage.classList.toggle('hidden');
        frontImage.classList.toggle('hidden');
    }

    // only one card has been selected
    if (!matchingMode) {
        matchingMode = true;
        lastCard = this;
        lastCardIndex = clickedIndex;
        this.removeEventListener('click', match);

    // two cards have been selected
    } else {
        matchingMode = false;
        const pairExists = resultCards.some(pair => arePairs(pair, clickedIndex, lastCardIndex));
        // succesful matching
        if (pairExists) {
            successfulMatch(backImage);
        // failure matching, try again
        } else {
            let currentCard = this;
            lastCard.addEventListener('click', match);
            failureMatch(backImage, frontImage, currentCard);
        }
    }
    checkGameOver();
}

/* handle all operations when there's a succesful match */
/* (disabling the cards, changing the image to indicate successful match, and updating the score) */
function successfulMatch(backImage) {
    cards.forEach(card => card.classList.add('unclickable'));
    setTimeout(() => {
        backImage.src = 'images/matched.png';
        lastCard.querySelector('.back').src = 'images/matched.png'
        cards.forEach(card => card.classList.remove('unclickable'));
        lastCard.removeEventListener('click', match);
        this.removeEventListener('click', match);
    }, 1000);
    
    correctMatches++;
    score += 100;
    document.getElementById('score').textContent = score;
}

/* handle all operations when there's a failure match */
/* (flip the cards back to the front, and updating the score) */
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

/* the game is over when all the cards have been successfully matched */
function checkGameOver() {
    if (correctMatches === (numCards / 2)) {
        gameActive = false;
        document.getElementById('status').textContent = 'Game Over! Your Score: ' + score;
    }
}

/* disable the play and radio buttons to prevent unexpected behavior */
function disableButtons() {
    document.getElementById('playButton').disabled = true;
    difficulties.forEach(difficulty => difficulty.classList.add('disabled'));
}