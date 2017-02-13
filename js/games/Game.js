(function(isNode, isAngular) {

    "use strict";

    var GameModule = function(Board, Player) {

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

            }  // constructor

            isSettingUp() {

                return this.state == this.STATE_SETUP;

            }

            isActive() { 

                return this.state == this.STATE_PLAY;

            }

            isComplete() { 

                return this.state == this.STATE_COMPLETE;

            }


        }  // end class declaration

        Game.STATE_SETUP = 'setup';
        Game.STATE_PLAY = 'play';
        Game.STATE_COMPLETE = 'complete';

        return Game;

    };   // GameModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Game', [ 'codenames.Board', 'codenames.Player', GameModule ]);
    }
    else if (isNode)
    {
        module.exports = GameModule(require(__dirname + '/Board'), require(__dirname + '/Player'));
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
