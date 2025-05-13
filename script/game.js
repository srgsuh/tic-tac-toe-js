const BLANK = '';
class TicTacToe {
    constructor(fieldSize = 3) {
        this.winSize = fieldSize;
        this.init(fieldSize);
    }

    init(fieldSize) {
        this.size = fieldSize;
        this.emptyCells = this.size * this.size
        this.field = Array.from({length: this.size}, () => Array(this.size).fill(BLANK));
        this.currentPlayer = 'X';
        this.idlePlayer = 'O';
    }

    changePlayer () {
        [this.currentPlayer, this.idlePlayer] = [this.idlePlayer, this.currentPlayer];
    }

    // Returns true if the move ends the game (win or draw)
    move(row, col, onMove, onGameEnd) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size || this.field[row][col] !== BLANK) {
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

    checkWinner(rowIndex, colIndex, player) {
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
