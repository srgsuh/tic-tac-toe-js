'use strict';

const CELL_STYLES = {
    DEFAULT: {
        background: 'white',
        color: 'black'
    },
    WINNING: {
        background: 'green',
        color: 'white'
    }
};

class GameBoard {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.board = null;
        this.cells = null;
        this.size = -1;
    }

    initialize(size) {
        this.size = size;
        this.createBoard();
        this.createCells();
        this.setupBoardLayout();
    }

    createBoard() {
        if (this.board) {
            this.board.remove();
        }
        this.board = document.createElement("div");
        this.board.className = "field";
        this.container.appendChild(this.board);
    }

    createCells() {
        this.cells = Array.from({ length: this.size }, (_, row) =>
            Array.from({ length: this.size }, (_, col) => {
                const cell = document.createElement("button");
                cell.className = "cell";
                this.board.appendChild(cell);
                return cell;
            })
        );
    }

    setupBoardLayout() {
        this.board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.board.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    }

    setupCellsClickHandlers(clickHandler) {
        this.cells.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                cell.currentClickHandler = clickHandler(cell, rowIndex, colIndex);
                cell.addEventListener("click", cell.currentClickHandler);
            });
        })
    }

    deleteCellsClickHandlers() {
        if (this.cells) {
            this.cells.forEach((row) => row.forEach(
                cell => {
                    cell.removeEventListener("click", cell.currentClickHandler);
                    cell.currentClickHandler = null;
                }
            ));
        }
    }

    refreshAllCells() {
        this.cells.forEach((row) => row.forEach(
            cell => {
                cell.disabled = false;
                cell.textContent = GAME_SYMBOLS.BLANK;
                this.applyCellStyle(cell, CELL_STYLES.DEFAULT);
            }
        ));
    }

    disableAllCells() {
        this.cells.forEach((row) => row.forEach(
            cell => cell.disabled = true
        ));
    }

    highlightWinningCells(winningCells) {
        winningCells.forEach(([row, column]) => {
            const cell = this.cells[row][column];
            this.applyCellStyle(cell, CELL_STYLES.WINNING);
        });
    }

    applyCellStyle(cell, style) {
        cell.style.backgroundColor = style.background;
        cell.style.color = style.color;
    }
}

function createCellClickHandler(cell, rowIndex, colIndex) {
    return function() {
        console.log(rowIndex, colIndex, cell);
        cell.textContent = game.currentPlayer;
        cell.disabled = true;
        const gameState = game.makeMove(rowIndex, colIndex);
        if (gameState.gameEnd) {
            gameBoard.disableAllCells();
            if (gameState.winner === null) {
                alert("Draw!");
            } else {
                gameBoard.highlightWinningCells(gameState.winningCells);
                alert(`Player ${gameState.winner} has won!`);
            }
        }
    }
}

function resetGame() {
    const boardSize = +document.getElementById("board-size").value;
    console.log(boardSize);
    game.init(boardSize);
    console.log(game);
    if (boardSize === gameBoard.size) {
        gameBoard.refreshAllCells()
    }
    else {
        gameBoard.deleteCellsClickHandlers();
        gameBoard.initialize(boardSize);
        gameBoard.setupCellsClickHandlers(createCellClickHandler);
    }
    console.log(gameBoard);
}

const gameBoard = new GameBoard(".container");
const game = new TicTacToe();
document.getElementById("new-game").addEventListener("click", resetGame);
resetGame();