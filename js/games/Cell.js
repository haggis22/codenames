"use strict";

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

    static sanitizeForClient(cell)
    {
        if (cell && !cell.revealed)
        {
            // don't tell what it is if it hasn't been revealed
            delete cell.role;
        }

    }


}  // end class declaration

Cell.ASSASSIN = 'assassin';
Cell.BYSTANDER_1 = 'bystander1';
Cell.BYSTANDER_2 = 'bystander2';

module.exports = Cell;
