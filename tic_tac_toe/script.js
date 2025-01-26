const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');
const gameArea = document.getElementById('game-area');
const setupArea = document.getElementById('setup-area'); // Setup area for game options

let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerSymbol = 'X'; // Keep track of player symbol
let aiSymbol = 'O'; // Keep track of AI symbol

// Define winning conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Start the game
function startGame() {
    const symbolSelect = document.getElementById('symbol');
    playerSymbol = symbolSelect.value; // Get player's symbol
    aiSymbol = playerSymbol === 'X' ? 'O' : 'X'; // AI gets the opposite symbol

    currentPlayer = playerSymbol; // Set current player to player's symbol

    const firstPlayer = document.getElementById('first').checked;

    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.innerText = '';
    cells.forEach(cell => {
        cell.innerText = '';
    });

    setupArea.style.display = 'none'; // Hide setup area
    gameArea.style.display = 'block'; // Show game area

    // If AI goes first
    if (!firstPlayer) {
        currentPlayer = aiSymbol; // AI moves first if user chose to go second
        aiMove();
    }
}

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (boardState[cellIndex] !== '' || !gameActive || currentPlayer !== playerSymbol) {
        return;
    }

    boardState[cellIndex] = currentPlayer;
    cell.innerText = currentPlayer;

    checkWinner();

    // If game is still active, it's AI's turn
    if (gameActive) {
        currentPlayer = aiSymbol;
        aiMove();
    }
}

// Minimax algorithm for AI to make optimal moves
function aiMove() {
    const bestMove = minimax(boardState, aiSymbol);
    boardState[bestMove.index] = aiSymbol;
    cells[bestMove.index].innerText = aiSymbol;
    checkWinner();

    // Switch back to the player's turn if game is still active
    if (gameActive) {
        currentPlayer = playerSymbol;
    }
}

// Minimax function to evaluate the board
function minimax(newBoard, player) {
    const availableSpots = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    
    // Check for a terminal state
    const winner = checkWin(newBoard);
    if (winner === aiSymbol) return { score: 1 };
    if (winner === playerSymbol) return { score: -1 };
    if (availableSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        // Call minimax recursively
        if (player === aiSymbol) {
            const result = minimax(newBoard, playerSymbol);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, aiSymbol);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = ''; // Undo the move
        moves.push(move);
    }

    let bestMove;
    if (player === aiSymbol) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

// Check for a winner
function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === '' || boardState[b] === '' || boardState[c] === '') {
            continue;
        }
        if (boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.innerText = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!boardState.includes('')) {
        message.innerText = 'It\'s a draw!';
        gameActive = false;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
}

// Restart game
function restartGame() {
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = playerSymbol; // Reset current player to player's choice
    message.innerText = '';
    cells.forEach(cell => {
        cell.innerText = '';
    });
}

// Check for win condition
function checkWin(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner
        }
    }
    return null; // No winner yet
}

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
restartButton.addEventListener('click', restartGame);
startButton.addEventListener('click', startGame);
