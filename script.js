/**
 * @fileoverview MindMatch - Memory Challenge Game
 * @version 1.0.0
 * @author Your Name
 * @description A memory matching game with multiple categories, animations,
 * and a countdown timer. Features include category selection, move tracking,
 * and win/lose states.
 * 
 * Game Structure:
 * - Welcome Page: Category selection and game start
 * - Game Play: Card matching with timer and move tracking
 * - Results: Win/lose screens with stats
 */

/* ------------------ Welcome & Page Elements ------------------ */
const welcomePage = document.getElementById("welcome-page");
const gameContainer = document.getElementById("game-container");
const winPage = document.getElementById("win-page");
const losePage = document.getElementById("lose-page");
const startBtn = document.getElementById("start-btn");
const playAgainWinBtn = document.getElementById("play-again-win");
const playAgainLoseBtn = document.getElementById("play-again-lose");

/* ------------------ Game Play Elements ------------------ */
const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const resetBtn = document.getElementById("reset-btn");
const timerEl = document.getElementById("timer");

/* ------------------ Result Elements ------------------ */
const timeRemainingEl = document.getElementById("time-remaining");
const finalMovesEl = document.getElementById("final-moves");
const finalMovesLoseEl = document.getElementById("final-moves-lose");
const finalMatchesEl = document.getElementById("final-matches");

let timer;
let timeLeft;

// Category selection handlers
const fruitsBtn = document.getElementById("fruits-btn");
const foodBtn = document.getElementById("food-btn");
const animalsBtn = document.getElementById("animals-btn");

/**
 * Updates the selected category and prepares the game with new emojis
 * @param {string} category - The category to switch to ('fruits', 'food', or 'animals')
 */
function selectCategory(category) {
    // Remove selected class from all buttons
    [fruitsBtn, foodBtn, animalsBtn].forEach(btn => 
        btn.classList.remove("selected")
    );
    
    // Add selected class to clicked button
    document.getElementById(`${category}-btn`).classList.add("selected");
    
    // Update current category
    currentCategory = category;
    emojis = categoryEmojis[category];
    cards = [...emojis, ...emojis];
    
    // Show start button with animation
    startBtn.style.display = "block";
}

// Add click handlers for category buttons
fruitsBtn.addEventListener("click", () => selectCategory("fruits"));
foodBtn.addEventListener("click", () => selectCategory("food"));
animalsBtn.addEventListener("click", () => selectCategory("animals"));

// Start button click handler
startBtn.addEventListener("click", () => {
    welcomePage.style.display = "none";
    gameContainer.style.display = "block";
    resetGame();
});

const categoryEmojis = {
  fruits: ["🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍓"],
  food: ["🍕", "🌮", "🍔", "🍜", "🍣", "🥪", "🌭", "🍪"],
  animals: ["🦁", "🐘", "🦒", "🦊", "🐼", "🐸", "🦄", "🦋"]
};

let currentCategory = "fruits";
let emojis = categoryEmojis[currentCategory];
let cards = [...emojis, ...emojis];
let flippedCards = [];
let lockBoard = false;
let moves = 0;
let matches = 0;

/**
 * Randomly shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Creates the game board with shuffled cards and starts the timer
 * Creates card elements, adds event listeners, and initializes the game state
 */
function createBoard() {
  grid.innerHTML = "";
  cards = shuffle(cards);
  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${emoji}</div>
        <div class="card-back"></div>
      </div>
    `;
    card.addEventListener("click", () => flipCard(card, emoji));
    grid.appendChild(card);
  });
  startTimer();
}

/**
 * Starts the game timer with 90 seconds countdown
 * Updates display every second and ends game if time runs out
 */
function startTimer() {
  timeLeft = 90; // 1 minute 30 seconds in seconds
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

/**
 * Updates the timer display in MM:SS format
 * Converts seconds to minutes and seconds, pads with zeros
 */
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Displays the win screen with final stats
 * Shows remaining time and number of moves taken
 */
function showWinPage() {
  gameContainer.style.display = 'none';
  winPage.style.display = 'flex';
  // populate new win UI
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('win-time').textContent = timeText;
  document.getElementById('win-moves').textContent = moves;
  document.getElementById('win-matches').textContent = matches;
  const accuracy = Math.round((matches / emojis.length) * 100);
  document.getElementById('win-accuracy').textContent = `${accuracy}%`;
  const score = computeScore(true);
  document.getElementById('win-score').textContent = score;
  // celebratory confetti
  createConfetti();
  // stop confetti after a while
  setTimeout(clearConfetti, 4500);
}

/**
 * Displays the lose screen with final stats
 * Shows total moves and matches achieved
 */
function showLosePage() {
  gameContainer.style.display = 'none';
  losePage.style.display = 'flex';
  // populate new lose UI
  document.getElementById('lose-moves').textContent = moves;
  document.getElementById('lose-matches').textContent = matches;
  const accuracy = Math.round((matches / emojis.length) * 100);
  document.getElementById('lose-accuracy').textContent = `${accuracy}%`;
  document.getElementById('lose-score').textContent = computeScore(false);
}

function endGame(won) {
  clearInterval(timer);
  if (won) {
    showWinPage();
  } else {
    showLosePage();
  }
}

/**
 * Compute a simple score based on matches, moves and time left
 * @param {boolean} won
 * @returns {number}
 */
function computeScore(won) {
  // base points per match, bonus for time left, penalty for moves
  const base = matches * 150;
  const timeBonus = Math.max(0, timeLeft) * 3;
  const movePenalty = Math.max(0, moves) * 2;
  let total = base + timeBonus - movePenalty;
  if (!won) total = Math.max(0, Math.floor(total / 3));
  return Math.max(0, Math.round(total));
}

/* ---------------- Confetti helpers ---------------- */
const confettiContainer = document.getElementById('confetti-container');

function randomBetween(min, max) { return Math.random() * (max - min) + min; }

function createConfetti() {
  if (!confettiContainer) return;
  const colors = ['#ff6b6b', '#ffd166', '#21e6c1', '#e94560', '#c3f3ff'];
  const count = 90;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti');
    el.style.background = colors[i % colors.length];
    el.style.left = `${randomBetween(0, 100)}%`;
    el.style.top = `${randomBetween(-10, -1)}%`;
    el.style.width = `${randomBetween(6, 12)}px`;
    el.style.height = `${randomBetween(8, 16)}px`;
    // random fall duration and delay
    const duration = randomBetween(3.5, 6.5);
    const delay = randomBetween(0, 0.8);
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.transform = `rotate(${randomBetween(0,360)}deg)`;
    confettiContainer.appendChild(el);
  }
}

function clearConfetti() {
  if (!confettiContainer) return;
  while (confettiContainer.firstChild) confettiContainer.removeChild(confettiContainer.firstChild);
}

/* ---------------- Result action wiring ---------------- */
// Back to menu handlers
const backToMenuWin = document.getElementById('back-to-menu-win');
const backToMenuLose = document.getElementById('back-to-menu-lose');
if (backToMenuWin) backToMenuWin.addEventListener('click', () => {
  winPage.style.display = 'none';
  welcomePage.style.display = 'flex';
  clearConfetti();
});
if (backToMenuLose) backToMenuLose.addEventListener('click', () => {
  losePage.style.display = 'none';
  welcomePage.style.display = 'flex';
});

// Share score handlers (copy a simple score text to clipboard)
// Share score removed — share buttons/handlers were deleted per design

/**
 * Handles card flip animation and game logic
 * @param {HTMLElement} card - The card element being flipped
 * @param {string} emoji - The emoji on the card
 */
function flipCard(card, emoji) {
  if (lockBoard || card.classList.contains("flip")) return;
  card.classList.add("flip");
  flippedCards.push({ card, emoji });

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkForMatch();
  }
}

/**
 * Checks if two flipped cards match and handles the result
 * If cards match, updates score and checks for win condition
 * If cards don't match, flips them back after a delay
 */
function checkForMatch() {
  const [first, second] = flippedCards;
  if (first.emoji === second.emoji) {
    matches++;
    matchesEl.textContent = matches;
    flippedCards = [];

    if (matches === emojis.length) {
      setTimeout(() => {
        endGame(true);
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      first.card.classList.remove("flip");
      second.card.classList.remove("flip");
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function resetGame() {
  clearInterval(timer);
  moves = 0;
  matches = 0;
  movesEl.textContent = 0;
  matchesEl.textContent = 0;
  flippedCards = [];
  lockBoard = false;
  winPage.style.display = 'none';
  losePage.style.display = 'none';
  gameContainer.style.display = 'block';
  createBoard();
}

resetBtn.addEventListener("click", resetGame);
playAgainWinBtn.addEventListener("click", resetGame);
playAgainLoseBtn.addEventListener("click", resetGame);

// Don't create board immediately, wait for start button
if (gameContainer.style.display !== "none") {
  createBoard();
}
