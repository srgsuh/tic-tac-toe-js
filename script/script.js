'use strict';

// Generation of the board
let boardSize = +document.getElementById("board-size").value;
console.log(`boardSize = ${boardSize}`);
const board = document.getElementById("field");

const cells = [];
function generateField(size = 3) {
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
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
generateField(boardSize);
const game = new TicTacToe(boardSize);
console.log(game);

cells.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
        cell.addEventListener("click", () => {
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
                }
                else {
                    for (let i = 0; i < gameState.winningCells.length; i++) {
                        cells[gameState.winningCells[i][0]][gameState.winningCells[i][1]].style.backgroundColor = "green";
                        cells[gameState.winningCells[i][0]][gameState.winningCells[i][1]].style.color = "white";
                    }
                    alert(`Player ${gameState.winner} has won!`);
                }
            }
        });
    });
});


// document.getElementById("new-game").addEventListener("click", () => {
//     game.init(boardSize);
// });

// const cells = document.querySelectorAll(".cell");
// const cellMatrix = [];
// cells.forEach((cell, index) => {
//     let rowIndex = Math.floor(index / boardSize);
//     let colIndex = index % boardSize;
//     if (colIndex == 0) {
//         cellMatrix.push([]);
//     }
//     cellMatrix[cellMatrix.length - 1].push(cell);
//     cell.addEventListener("click", () => {
//         if (cell.disabled) {
//             return;
//         }
//         game.move(
//             rowIndex,
//             colIndex,
//             (current, idle) => {
//                 cell.textContent = current;
//                 cell.disabled = true;
//                 sendMessages(`Player ${current} chose row ${rowIndex}, column ${colIndex}`,
//                     `Player ${idle}'s move`);
//         }, (winner) => {
//                 if (winner === null) {
//                     sendMessages('Game ended in a draw!');
//                 }
//                 else {
//                     sendMessages(`Player ${winner} has won!`);
//                     cells.forEach(c => c.disabled = true);
//                 }
//             }
//             );
//     });
// });
