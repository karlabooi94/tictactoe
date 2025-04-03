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
        this.commentaryDisplay = document.getElementById('commentary');
        this.cells = document.querySelectorAll('.cell');
        this.restartButton = document.getElementById('restartButton');
        this.backToMenuButton = document.getElementById('backToMenu');
        this.menu = document.getElementById('menu');
        this.gameContainer = document.getElementById('gameContainer');
        this.playVsPersonButton = document.getElementById('playVsPerson');
        this.playVsComputerButton = document.getElementById('playVsComputer');

        this.isVsComputer = false;
        this.initializeMenu();

        // Add payment modal elements
        this.paymentModal = document.getElementById('paymentModal');
        this.paymentMessage = document.getElementById('paymentMessage');
        this.customAmountInput = document.getElementById('customAmountInput');
        this.paymentForm = document.getElementById('paymentForm');
        this.cardForm = document.getElementById('cardForm');
        this.amountInput = document.getElementById('amountInput');
        this.selectedAmount = 0;

        this.initializePaymentHandlers();
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
        this.updateCommentary('A new game begins! Let\'s see what our players have in store for us!');
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    getPositionDescription(index) {
        const positions = [
            'top left corner', 'top center', 'top right corner',
            'middle left', 'center', 'middle right',
            'bottom left corner', 'bottom center', 'bottom right corner'
        ];
        return positions[index];
    }

    analyzeMove(move) {
        const analysis = {
            isCenter: move === 4,
            isCorner: [0, 2, 6, 8].includes(move),
            threatensWin: false,
            blocksWin: false,
            createsFork: false,
            blocksFork: false
        };

        // Check if move threatens a win
        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            if ([a, b, c].includes(move)) {
                const otherPositions = [a, b, c].filter(pos => pos !== move);
                const playerMarks = otherPositions.filter(pos => this.gameState[pos] === this.currentPlayer);
                if (playerMarks.length === 1) {
                    analysis.threatensWin = true;
                }
            }
        }

        // Check if move blocks opponent's win
        const opponent = this.currentPlayer === 'X' ? 'O' : 'X';
        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            if ([a, b, c].includes(move)) {
                const otherPositions = [a, b, c].filter(pos => pos !== move);
                const opponentMarks = otherPositions.filter(pos => this.gameState[pos] === opponent);
                if (opponentMarks.length === 2) {
                    analysis.blocksWin = true;
                }
            }
        }

        return analysis;
    }

    generateCommentary(move, isComputer = false) {
        const position = this.getPositionDescription(move);
        const player = isComputer ? 'Computer' : `Player ${this.currentPlayer}`;
        const analysis = this.analyzeMove(move);
        
        let commentary = '';
        
        if (analysis.threatensWin) {
            commentary = `${player} places their mark in the ${position}! This move threatens a win! The pressure is on!`;
        } else if (analysis.blocksWin) {
            commentary = `${player} blocks a potential win by taking the ${position}! What a crucial defensive move!`;
        } else if (analysis.isCenter) {
            commentary = `${player} takes control of the center! This is a strong strategic position that opens up multiple winning possibilities!`;
        } else if (analysis.isCorner) {
            commentary = `${player} secures a corner position! Corners are valuable in Tic Tac Toe as they're part of multiple winning combinations!`;
        } else {
            const commentaries = [
                `${player} places their mark in the ${position}! The game is heating up!`,
                `${player} takes the ${position}! This move adds pressure to the opponent's strategy!`,
                `${player} selects the ${position}! The battle for control continues!`,
                `${player} goes for the ${position}! What will the opponent do next?`,
                `${player} marks the ${position}! The tension is building in this strategic battle!`
            ];
            commentary = commentaries[Math.floor(Math.random() * commentaries.length)];
        }

        return commentary;
    }

    updateCommentary(text, isExciting = false, isVictory = false) {
        this.commentaryDisplay.textContent = text;
        this.commentaryDisplay.className = 'commentary';
        if (isExciting) this.commentaryDisplay.classList.add('exciting');
        if (isVictory) this.commentaryDisplay.classList.add('victory');
    }

    handleCellClick(cell) {
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

        if (this.gameState[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        this.updateCell(cell, cellIndex);
        this.updateCommentary(this.generateCommentary(cellIndex), true);
        this.handleResultValidation();

        if (this.gameActive && this.isVsComputer && this.currentPlayer === 'O') {
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    makeComputerMove() {
        if (!this.gameActive) return;

        const bestMove = this.findBestMove();
        const cell = this.cells[bestMove];
        
        this.updateCell(cell, bestMove);
        this.updateCommentary(this.generateCommentary(bestMove, true), true);
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

    initializePaymentHandlers() {
        // Payment amount buttons
        document.querySelectorAll('.payment-amount').forEach(button => {
            if (button.id !== 'customAmount') {
                button.addEventListener('click', () => {
                    this.selectedAmount = parseInt(button.dataset.amount);
                    this.showPaymentForm();
                });
            }
        });

        // Custom amount button
        document.getElementById('customAmount').addEventListener('click', () => {
            this.customAmountInput.classList.remove('hidden');
        });

        // Confirm custom amount
        document.getElementById('confirmCustomAmount').addEventListener('click', () => {
            const amount = parseInt(this.amountInput.value);
            if (amount > 0) {
                this.selectedAmount = amount;
                this.showPaymentForm();
            }
        });

        // Close modal button
        document.getElementById('closePaymentModal').addEventListener('click', () => {
            this.hidePaymentModal();
        });

        // Payment form submit
        this.cardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });
    }

    showPaymentModal(winner) {
        this.paymentMessage.textContent = `Player ${winner} has won! Time to pay up!`;
        this.paymentModal.classList.remove('hidden');
        this.customAmountInput.classList.add('hidden');
        this.paymentForm.classList.add('hidden');
    }

    hidePaymentModal() {
        this.paymentModal.classList.add('hidden');
        this.cardForm.reset();
        this.selectedAmount = 0;
    }

    showPaymentForm() {
        this.customAmountInput.classList.add('hidden');
        this.paymentForm.classList.remove('hidden');
    }

    processPayment() {
        // Here you would typically integrate with a real payment processor
        // For demo purposes, we'll just show a success message
        alert(`Payment of $${this.selectedAmount} processed successfully!`);
        this.hidePaymentModal();
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
            this.updateCommentary(`🎉 INCREDIBLE! Player ${this.currentPlayer} has emerged victorious! What a spectacular game! 🎉`, true, true);
            this.showPaymentModal(this.currentPlayer);
            return;
        }

        const roundDraw = !this.gameState.includes('');
        if (roundDraw) {
            this.statusDisplay.textContent = 'Game ended in a draw!';
            this.gameActive = false;
            this.updateCommentary('A hard-fought battle ends in a draw! Both players showed incredible skill!', false, true);
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