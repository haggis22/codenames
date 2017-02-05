"use strict";

var Cell = require(__dirname + '/Cell');

class Board {

    constructor(board) {

        if (board)
        {
            if (board.cells)
            {
                this.cells = board.cells.map(function(cell) { return new Cell(cell); });
            }

            this.first = board.first;
        }

        this.cells = this.cells || [];

    }   // constructor


    static sanitizeForClient(board) {

        if (board)
        {
            for (var cell of board.cells)
            {
                Cell.sanitizeForClient(cell);
            }

        }

    }   // getClientBoard

}  // end class declaration


Board.NUM_AGENTS = 8;
Board.NUM_CELLS = 25;

module.exports = Board;
