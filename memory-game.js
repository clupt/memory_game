"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  //used a for loop here to store card's data-id attribute as its index in colors
  //so I can later compare the data-ids to confirm that the same card wasn't
  //clicked twice to create the match
  for (let i = 0; i < colors.length; i++) {
    //create each card and add classes (card, face-down, and color) to it
    //add attributes (data-id and data-color) to the card
    //add eventListener for handling the click event to each card
    //then append it to the gameboard

    const card = document.createElement('div');
    const front = document.createElement('div');

    card.classList.add('face-down', 'card');
    front.classList.add('front');

    front.style.backgroundColor = colors[i];

    card.setAttribute('data-color', colors[i]);
    card.setAttribute('data-id', i);
    card.addEventListener('click', handleCardClick);

    gameBoard.appendChild(card);
    card.appendChild(front);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.classList.remove('face-down');
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.classList.add('face-down');
}

/** Handle clicking on a card: this could be first-card or second-card.
 *
 *  Create a counter to store click count that stops at two
 *  push two click events into a clickedArr
 *  compare the values of those two click event targets
 *  if they have the same data-color (and different data-ids)
 *  push them into the matchedArr and reset the clickCount and clickedArr
 *  once the matchedArr length equals the colors array length --> Game Over
*/

let clickedArr = [];
let matchedArr = [];
let clickCount = 0;

function handleCardClick(e) {
  /**
   * flip target of click event
   * increment click counter
   * push target into clickedArr
   */

  flipCard(e.target);
  clickCount += 1;
  clickedArr.push(e.target);

  //case for too many clicks too quickly (REVISIT)
  if (clickCount > 2) {
    alert('TOO MANY CLICKS IN THE CLICKTCHEN');
    unFlipCard(e.target);
  }
  //once two click events have been made
  //compare the values that were pushed into the clickedArr
  if (clickCount === 2) {
    let firstClick = clickedArr[0];
    let secondClick = clickedArr[1];

    //case for not match
    if (!isMatch(firstClick, secondClick)) {
      setTimeout(() => {
        unFlipCard(firstClick);
        unFlipCard(secondClick);
        resetClickCount();
        resetClickedArr();
      }, FOUND_MATCH_WAIT_MSECS);
    }

    //case for match
    if (isMatch(firstClick, secondClick)) {
      firstClick.classList.add('matched');
      secondClick.classList.add('matched');
      matchedArr.push(firstClick);
      matchedArr.push(secondClick);
      resetClickCount();
      resetClickedArr();
    }

    //case for final match
    if ((clickCount === 0) && (matchedArr.length === colors.length)) {
      setTimeout(() => {
        alert('VICTORY!');
        resetGame();
      }, FOUND_MATCH_WAIT_MSECS);
    }
  }
}


//function to determine if the two clicks are a match
function isMatch(clickOne, clickTwo) {
  return (
    (clickOne.dataset.color === clickTwo.dataset.color)
    && (clickOne.dataset.id !== clickTwo.dataset.id)
  );
}

//reset functions
function resetClickCount() {
  clickCount = 0;
}

function resetClickedArr() {
  clickedArr = [];
}

function resetMatchedArr() {
  matchedArr = [];
}

//(need to refactor this so a win can store the score before reset game occurs)
function resetGame() {
  location.reload();
}

/** TODOS
 * add button to start the game
 * learn css grid
 * revisit color and number of card hardcoding
 * (allow for variable number of cards and randomized colors or images)
 * improve too many clicks reaction (non-alert)
 * create a timer
 * create a number of guesses display to keep score
 * store best lowest time / fewest guesses score in local storage
 * fix card flip animation and styling (refactor flip/unflip functions)
 * need to improve case for last match (victory condition)
 * -- reach thought: add shuffle animation at the beginning that deals out cards
*/
