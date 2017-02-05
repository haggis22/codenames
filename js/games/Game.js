"use strict";

var Board = require(__dirname + '/Board');
var Player = require(__dirname + '/Player');

class Game {

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
            this.created = game.created;
        }

        this.players = this.players || [];
        this.moves = this.moves || [];

    }

    static sanitizeForClient(game) {

        if (game)
        {
            Board.sanitizeForClient(game.board);
        }

    }

}  // end class declaration


Game.STATE_SETUP = 'setup';
Game.STATE_PLAY = 'play';
Game.STATE_COMPLETE = 'complete';

module.exports = Game;
