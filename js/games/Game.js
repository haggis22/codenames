"use strict";

class Game {

    constructor(game) {

        if (game)
        {
            this._id = game._id;
            this.board = game.board;
        }


    }

}  // end class declaration

module.exports = Game;
