// Generation of the board
const gameSize = 4;
function generateField(size = 3) {
    const field = document.getElementById("field");
    field.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    field.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("button");
        cell.className = "cell";
        field.appendChild(cell);
    }
}
generateField(gameSize);

const log = document.getElementById('log-text');
function sendMessages(...messages) {
    log.innerHTML = '';
    messages.forEach(
        x => {
            log.appendChild(document.createTextNode(x));
            log.appendChild(document.createElement('br'));
        }
    );
}

const game = new TicTacToe(gameSize);
console.log(game);

sendMessages(`Dear players! Welcome to this ${gameSize}×${gameSize} tic-tac-toe game!`
,`Player ${game.currentPlayer}'s move`);

const cells = document.querySelectorAll(".cell");
cells.forEach((cell, index) => {
    let rowIndex = Math.floor(index / gameSize);
    let colIndex = index % gameSize;
    cell.addEventListener("click", () => {
        if (cell.disabled) {
            return;
        }
        game.move(
            rowIndex,
            colIndex,
            (current, idle) => {
                cell.textContent = current;
                cell.disabled = true;
                sendMessages(`Player ${current} chose row ${rowIndex}, column ${colIndex}`,
                    `Player ${idle}'s move`);
        }, (winner) => {
                if (winner === null) {
                    sendMessages('Game ended in a draw!');
                }
                else {
                    sendMessages(`Player ${winner} has won!`);
                    cells.forEach(c => c.disabled = true);
                }
            }
            );
    });
});
