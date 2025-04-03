# Tic Tac Toe Game

A modern, interactive Tic Tac Toe game built with HTML, CSS, and JavaScript. Play against a friend or challenge the computer!

## Features

- 🎮 Two game modes:
  - Play against a friend
  - Play against the computer (AI)
- 🎨 Modern and clean UI design
- 🎉 Celebratory confetti animation when someone wins
- 🔄 Easy game restart and menu navigation
- 📱 Responsive design that works on all devices

## How to Play

1. Open `index.html` in your web browser
2. Choose your game mode:
   - "Play vs Person" to play with a friend
   - "Play vs Computer" to play against the AI
3. When playing against the computer:
   - You'll play as X (first player)
   - The computer will play as O (second player)
   - The computer will automatically make its move after you play
4. Use the buttons at the bottom to:
   - "Restart Game" to start a new game
   - "Back to Menu" to return to the main menu

## Computer AI Strategy

The computer player uses a simple but effective strategy:
1. First tries to win if possible
2. Then blocks the player from winning
3. Takes the center if available
4. Takes corners if available
5. Takes any available space as a last resort

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas Confetti for animations

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tic-tac-toe.git
   ```
2. Navigate to the project directory:
   ```bash
   cd tic-tac-toe
   ```
3. Open `index.html` in your web browser

## License

This project is open source and available under the [MIT License](LICENSE). 