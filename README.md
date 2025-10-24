# Memory Match Game

A simple, browser-based memory matching game with a modern dark theme and multiple category options.

## Features

- Three categories: Fruits, Food, Animals
- 4x4 card grid (8 pairs) with flip animation
- 1 minute 30 second countdown timer
- Moves and matches tracking
- Win and Lose result pages with final statistics
- Welcome screen with category selection and animated background

## Files

- `index.html` - Main HTML page containing the welcome screen, game container and result overlays.
- `style.css` - Styling for welcome page, game board, cards and result pages (dark theme)
- `script.js` - Game logic: board creation, flip handling, timer, win/lose flows and category selection

## How to run

1. Open `index.html` in any modern browser (Chrome, Firefox, Safari).
2. On the welcome screen choose a category (Fruits/Food/Animals).
3. Click "Start Game" to begin. The 1 minute 30 second timer will start.
4. Flip cards to find matching pairs. If you find all matches before the timer runs out you win.

## Controls

- Click a card to flip it and reveal the symbol.
- Click the "Restart Game" button to reset at any time.
- Use the play again button on the Win/Lose pages to restart with the same UI.

## Customization

- To change the categories or emojis: edit `categoryEmojis` in `script.js`.
- To change the time limit: edit `timeLeft` initialization in `startTimer()` (default is 90 seconds).
- To tweak styles, open `style.css` and update the color variables or selectors. Section comments are added to help find the Welcome, Game Play and Result page styles.

## License

This project is provided as-is for learning and demo purposes.

---

If you'd like, I can:
- Add instructions inside the UI (small help icon)
- Export game results to localStorage
- Add sound effects for flips/match/win/lose

Enjoy!
