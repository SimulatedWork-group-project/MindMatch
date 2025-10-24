/* ======================================================
  Script: Section headers and brief guide
  - Welcome Page: selection UI, category buttons, start flow
  - Game Play: board creation, flip logic, timer, scoreboard
  - Results: win/lose pages and restart handlers
  Key DOM references are grouped below for clarity.
  ====================================================== */

/* ------------------ Welcome & Page Elements ------------------ */
const welcomePage = document.getElementById("welcome-page");
const gameContainer = document.getElementById("game-container");
const winPage = document.getElementById("win-page");
const losePage = document.getElementById("lose-page");
const startBtn = document.getElementById("start-btn");
const playAgainWinBtn = document.getElementById("play-again-win");
const playAgainLoseBtn = document.getElementById("play-again-lose");




// Category selection handlers
const fruitsBtn = document.getElementById("fruits-btn");
const foodBtn = document.getElementById("food-btn");
const animalsBtn = document.getElementById("animals-btn");

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

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

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

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function showWinPage() {
  gameContainer.style.display = 'none';
  winPage.style.display = 'flex';
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeRemainingEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  finalMovesEl.textContent = moves;
}

function showLosePage() {
  gameContainer.style.display = 'none';
  losePage.style.display = 'flex';
  finalMovesLoseEl.textContent = moves;
  finalMatchesEl.textContent = matches;
}

function endGame(won) {
  clearInterval(timer);
  if (won) {
    showWinPage();
  } else {
    showLosePage();
  }
}

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
