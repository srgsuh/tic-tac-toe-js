'use strict';

let boardSize = -1;
let game = null;
let board = null;
let cells = null;

resetGame();
document.getElementById("new-game").addEventListener("click", resetGame);

// Generation of the board
function resetGame() {
    let newBoardSize = +document.getElementById("board-size").value;
    if (newBoardSize !== boardSize) {
        if (cells) {
            cells.forEach(row => {
                row.forEach(cell => {
                    cell.removeEventListener("click", cell.customClickHandler);
                });
            });
        }
        cells = null;
        console.log(board);
        if (board) {
            board.remove();
            board = document.createElement("div");
            board.className = "field";
            document.querySelector(".container").appendChild(board);
        }
        else {
            board =document.querySelector(".field");
        }
        console.log(board);
        boardSize = newBoardSize;
        generateField(boardSize);
        addEventListeners();
    } else {
        refreshCells();
    }
    game = new TicTacToe(boardSize);
}

function refreshCells() {
    cells.forEach((row) => row.forEach(
        cell => {
            cell.disabled = false;
            cell.textContent = GAME_SYMBOLS.BLANK;
            cell.style.backgroundColor = "white";
            cell.style.color = "black";
        }
    ));
}

function generateField(size = 3) {
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    cells = [];
    for (let r = 0; r < size; r++) {
        cells.push([]);
        for (let c = 0; c < size; c++) {
            const cell = document.createElement("button");
            cell.className = "cell";
            board.appendChild(cell);
            cells[r].push(cell);
        }
    }
}

function createCellClickHandler(rowIndex, colIndex) {
    return function() {
        const cell = cells[rowIndex][colIndex];
        if (cell.disabled) {
            return;
        }
        cell.textContent = game.currentPlayer;
        cell.disabled = true;
        const gameState = game.makeMove(rowIndex, colIndex);
        if (gameState.gameEnd) {
            cells.forEach((row) => row.forEach(c => c.disabled = true));
            if (gameState.winner === null) {
                alert("Draw!");
            } else {
                for (let i = 0; i < gameState.winningCells.length; i++) {
                    cells[gameState.winningCells[i][0]][gameState.winningCells[i][1]].style.backgroundColor = "green";
                    cells[gameState.winningCells[i][0]][gameState.winningCells[i][1]].style.color = "white";
                }
                alert(`Player ${gameState.winner} has won!`);
            }
        }
    };
}


function addEventListeners() {
    cells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            cell.customClickHandler = createCellClickHandler(rowIndex, colIndex);
            cell.addEventListener("click", cell.customClickHandler);
        });
    });
}