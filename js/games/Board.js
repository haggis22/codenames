(function(isNode, isAngular) {

    "use strict";

    var BoardModule = function(Cell) { 

        class Board {

            constructor(board) {

                if (board)
                {
                    if (board.cells)
                    {
                        this.cells = board.cells.map(function(cell) { return new Cell(cell); });
                    }

                    this.first = board.first;
                    this.remaining = board.remaining;

                }

                this.cells = this.cells || [];

            }   // constructor

        }  // end class declaration

        Board.NUM_AGENTS = 8;
        Board.NUM_CELLS = 25;

        return Board;

    };  // BoardModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Board', [ 'codenames.Cell', BoardModule ]);

    } else if (isNode)
    {

        module.exports = BoardModule(require(__dirname + '/Cell'));

    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');