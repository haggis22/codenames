"use strict";

class Game {

    constructor(game) {

        if (game)
        {
            this._id = game._id;
            this.board = game.board;
            this.redMaster = game.redMaster;
            this.redTeam = game.redTeam;
            this.blueMaster = game.blueMaster;
            this.blueTeam = game.blueTeam;
            this.turn = game.turn;
            this.state = game.state;
            this.winner = game.winner;
            this.moves = game.moves;
        }

        this.redTeam = this.redTeam || [];
        this.blueTeam = this.blueTeam || [];
        this.moves = this.moves || [];

    }

}  // end class declaration


Game.STATE_SETUP = 'setup';
Game.STATE_PLAY = 'play';
Game.STATE_COMPLETE = 'complete';

module.exports = Game;
