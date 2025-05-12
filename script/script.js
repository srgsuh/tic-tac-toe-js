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

function TicTacToe(fieldSize = 3, winSize = fieldSize, blank = '') {
    this.blank = blank;
    this.size = fieldSize;
    this.winSize = winSize;
    this.emptyCells = this.size * this.size
    this.field = Array.from({length: this.size}, () => Array(this.size).fill(this.blank));
    this.currentPlayer = 'X';
    this.idlePlayer = 'O';
    this.changePlayer = function() {
        [this.currentPlayer, this.idlePlayer] = [this.idlePlayer, this.currentPlayer];
    };
    // Returns true if the move ends the game (win or draw)
    this.move = function(row, col, onMove, onGameEnd) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size || this.field[row][col] !== this.blank) {
            return false;
        }
        onMove(this.currentPlayer, this.idlePlayer);
        this.field[row][col] = this.currentPlayer;
        --this.emptyCells;
        if (this.checkWinner(row, col, this.currentPlayer)) {
            onGameEnd(this.currentPlayer);
            return true;
        }
        if (this.emptyCells === 0) {
            onGameEnd(null);
            return true;
        }
        this.changePlayer();
        return false;
    };

    this.checkWinner = function(rowIndex, colIndex, player) {
        //Counts the maximum consecutive occurrences of a value in an array.
        function countMax(vector, value) {
            let max = 0, current = 0;
            for (let i = 0; i < vector.length; i++) {
                current = (vector[i] === value)? current + 1 : 0;
                max = Math.max(max, current);
            }
            return max;
        }
        let vector;
        vector = this.field[rowIndex];
        if (countMax(vector, player) >= this.winSize) return true;
        vector = this.field.flatMap((row) => row[colIndex]);
        if (countMax(vector, player) >= this.winSize) return true;
        if (rowIndex === colIndex) {
            vector = this.field.flatMap( (row, idx) => row[idx]);
            if (countMax(vector, player) >= this.winSize) return true;
        }
        if (rowIndex + colIndex === this.size - 1) {
            vector = this.field.flatMap( (row, idx) => row[this.size - 1 -idx]);
            if (countMax(vector, player) >= this.winSize) return true;
        }
        return false;
    }
}
const game = new TicTacToe(gameSize);

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
