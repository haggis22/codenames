"use strict";

class Board {

    constructor(board) {

        if (board)
        {
            this.cells = board.cells;
            this.first = board.first;
        }

        this.cells = this.cells || [];

    }

}  // end class declaration


Board.NUM_AGENTS = 8;
Board.NUM_CELLS = 25;

module.exports = Board;
