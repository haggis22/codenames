/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var WordManager = require(__dirname + '/WordManager');


class Sanitizer
{

    static sanitizeCell(cell)
    {
        if (cell && !cell.revealed)
        {
            // don't tell what it is if it hasn't been revealed
            delete cell.role;
        }

    }

    static sanitizeBoard(board) {

        if (board)
        {
            for (var cell of board.cells)
            {
                this.sanitizeCell(cell);
            }

        }

    }   // getClientBoard


    static sanitizeGame(game) {

        // we don't need to sanitize games once they have ended
        if (game && game.isActive())
        {
            this.sanitizeBoard(game.board);
        }

    }



}  // end class declaration


module.exports = Sanitizer;


