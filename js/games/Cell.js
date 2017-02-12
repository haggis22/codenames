(function(isNode, isAngular) { 

    "use strict";

    // This wrapper function returns the contens of the module, with dependencies
    var CellModule = function() { 

        class Cell {

            constructor(cell) {

                cell.revealed = false;

                if (cell)
                {
                    this.word = cell.word;
                    this.role = cell.role;
                    this.revealed = cell.revealed;
                }

            }  // constructor

        }  // end class declaration

        Cell.ASSASSIN = 'assassin';
        Cell.BYSTANDER_1 = 'bystander1';
        Cell.BYSTANDER_2 = 'bystander2';

        return Cell;

    };  // CellModule

    if (isAngular)
    {
        // AngularJS module definition
        angular.module('codenames.app')
            .factory('codenames.Cell', [ CellModule ]);
    }
    else if (isNode)
    {
        // NodeJS module definition
        module.exports = CellModule();
    }


}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
