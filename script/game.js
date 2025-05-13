'use strict';
const PLAYER_SYMBOLS = {
    X: 'X',
    O: 'O',
    BLANK: ''
};

class GameState {
    constructor(gameEnd = false, winner = null, winningCells = null) {
        this.gameEnd = gameEnd;
        this.winner = winner;
        this.winningCells = winningCells;
    }
}

const GAME_CONTINUES = new GameState(), GAME_DRAW = new GameState(true);

/**
 * @class
 * @property {number} size
 * @property {Array<Array<string>>} field
 * @property {number} emptyCells
 * @property {string} currentPlayer
 * @property {string} idlePlayer
 */

class TicTacToe {
    size;
    field;
    emptyCells;
    currentPlayer;
    idlePlayer;
    
    constructor(fieldSize = 3) {
        if (!Number.isInteger(fieldSize) || fieldSize < 3) {
            throw new Error('Field size must be integer ≥ 3');
        }
        this.init(fieldSize);
    }
    init(fieldSize) {
        this.size = fieldSize;
        this.emptyCells = this.size * this.size
        this.field = Array.from({length: this.size}, () => Array(this.size).fill(PLAYER_SYMBOLS.BLANK));
        [this.currentPlayer, this.idlePlayer] = [PLAYER_SYMBOLS.X, PLAYER_SYMBOLS.O];
    }
    switchPlayers () {
        [this.currentPlayer, this.idlePlayer] = [this.idlePlayer, this.currentPlayer];
    }
    makeMove(row, col) {
        if (!this.isValidMove(row, col)) return null;
        this.field[row][col] = this.currentPlayer;
        this.emptyCells--;
        const result = this.checkGameEndCondition(row, col, this.currentPlayer);
        if (!result.gameEnd) this.switchPlayers();
        return result;
    }
    /**
     * Determines if the current move results in a game-ending condition (win or draw)
     * by checking all possible winning lines (row, column, both diagonals) and board fullness.
     * @param {number} rowId - 0-based row index of the current move
     * @param {number} colId - 0-based column index of the current move
     * @param {string} player - Current player's symbol ('X' or 'O')
     * @returns {Object} Result object with:
     *   - gameEnd: {boolean} Whether the game has concluded
     *   - winner: {string|null} Winning player symbol (null if draw)
     *   - winningCells: {Array|null} Coordinates of winning cells [row,col][]
     */
    checkGameEndCondition(rowId, colId, player) {
        const size = this.size, field = this.field;
        const hasRowWin = field[rowId].every(cell => cell === player);
        const hasColWin = !hasRowWin && field.every(row => row[colId] === player);
        const hasMainDiagWin = !hasColWin && rowId === colId &&
            field.every((row, i) => row[i] === player);
        const hasAntiDiagWin = !hasMainDiagWin && rowId + colId === size - 1 &&
            field.every((row, i) => row[size - 1 - i] === player);
        if (!(hasRowWin || hasColWin || hasMainDiagWin || hasAntiDiagWin)) {
            return (this.emptyCells > 0)?GAME_CONTINUES: GAME_DRAW;
        }
        return new GameState(true, player, this.getWinningCells(size, rowId, colId,
            hasRowWin, hasColWin, hasMainDiagWin, hasAntiDiagWin));
    }
    //Helper method to calculate coordinates of winning cells
    getWinningCells(size, rowId, colId, rowWin, colWin, mainDiagWin, antiDiagWin) {
        if (rowWin) return Array.from({length: size}, (_, col) => [rowId, col]);
        if (colWin) return Array.from({length: size}, (_, row) => [row, colId]);
        if (mainDiagWin) return Array.from({length: size}, (_, i) => [i, i]);
        if (antiDiagWin) return Array.from({length: size}, (_, i) => [i, size-1-i]);
        return null;
    }
    isValidMove(row, col) {
        return row >= 0 && row < this.size &&
            col >= 0 && col < this.size &&
            this.field[row][col] === PLAYER_SYMBOLS.BLANK;
    }
}