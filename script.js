class TicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        this.statusDisplay = document.getElementById('status');
        this.cells = document.querySelectorAll('.cell');
        this.restartButton = document.getElementById('restartButton');
        this.backToMenuButton = document.getElementById('backToMenu');
        this.menu = document.getElementById('menu');
        this.gameContainer = document.getElementById('gameContainer');
        this.playVsPersonButton = document.getElementById('playVsPerson');
        this.playVsComputerButton = document.getElementById('playVsComputer');

        this.isVsComputer = false;
        this.initializeMenu();
    }

    initializeMenu() {
        this.playVsPersonButton.addEventListener('click', () => this.startGame(false));
        this.playVsComputerButton.addEventListener('click', () => this.startGame(true));
        this.backToMenuButton.addEventListener('click', () => this.showMenu());
    }

    startGame(vsComputer) {
        this.isVsComputer = vsComputer;
        this.menu.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');
        this.initializeGame();
    }

    showMenu() {
        this.menu.classList.remove('hidden');
        this.gameContainer.classList.add('hidden');
        this.resetGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.restartButton.addEventListener('click', () => this.handleRestartGame());
        this.resetGame();
    }

    resetGame() {
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    handleCellClick(cell) {
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

        if (this.gameState[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        this.updateCell(cell, cellIndex);
        this.handleResultValidation();

        if (this.gameActive && this.isVsComputer && this.currentPlayer === 'O') {
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    makeComputerMove() {
        if (!this.gameActive) return;

        // Simple AI: Find the best available move
        const bestMove = this.findBestMove();
        const cell = this.cells[bestMove];
        
        this.updateCell(cell, bestMove);
        this.handleResultValidation();
    }

    findBestMove() {
        // First, try to win
        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            const positions = [this.gameState[a], this.gameState[b], this.gameState[c]];
            
            // Check if computer can win
            if (positions.filter(pos => pos === 'O').length === 2 && positions.includes('')) {
                return [a, b, c].find(index => this.gameState[index] === '');
            }
            
            // Block player from winning
            if (positions.filter(pos => pos === 'X').length === 2 && positions.includes('')) {
                return [a, b, c].find(index => this.gameState[index] === '');
            }
        }

        // Take center if available
        if (this.gameState[4] === '') return 4;

        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => this.gameState[corner] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available space
        const availableSpaces = this.gameState
            .map((space, index) => space === '' ? index : null)
            .filter(space => space !== null);
        
        return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    }

    updateCell(cell, cellIndex) {
        this.gameState[cellIndex] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
    }

    triggerConfetti(winner) {
        const colors = winner === 'X' ? ['#e74c3c'] : ['#3498db'];
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: colors
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: colors
            });
        }, 250);
    }

    handleResultValidation() {
        let roundWon = false;

        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            const position1 = this.gameState[a];
            const position2 = this.gameState[b];
            const position3 = this.gameState[c];

            if (position1 === '' || position2 === '' || position3 === '') {
                continue;
            }

            if (position1 === position2 && position2 === position3) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            this.statusDisplay.textContent = `Player ${this.currentPlayer} has won!`;
            this.gameActive = false;
            this.triggerConfetti(this.currentPlayer);
            return;
        }

        const roundDraw = !this.gameState.includes('');
        if (roundDraw) {
            this.statusDisplay.textContent = 'Game ended in a draw!';
            this.gameActive = false;
            return;
        }

        this.handlePlayerChange();
    }

    handlePlayerChange() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    handleRestartGame() {
        this.resetGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 