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

            this.created = game.created;
            this.state = game.state;
            this.turn = game.turn;
            this.winner = game.winner;

        }

        this.players = this.players || [];

    }

}  // end class declaration


module.exports = GameDesc;
