"use strict";

var Player = require(__dirname + '/Player');

class GameDesc {

    constructor(game) {

        if (game)
        {
            this._id = game._id;
            
            if (game.players)
            {
                this.players = game.players.map(function(player) { return new Player(player); });
            }

            this.board = new Board(game.board);

            this.turn = game.turn;
            this.state = game.state;
            this.winner = game.winner;
            this.moves = game.moves;
        }

        this.players = this.players || [];
        this.moves = this.moves || [];

    }

}  // end class declaration


Game.STATE_SETUP = 'setup';
Game.STATE_PLAY = 'play';
Game.STATE_COMPLETE = 'complete';

module.exports = Game;
