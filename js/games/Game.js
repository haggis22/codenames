(function(isNode, isAngular) {

    "use strict";

    var GameModule = function(Board, Player) {

        class Game {

            constructor(game) {

                if (game)
                {
                    this._id = game._id;
            
                    this.ownerID = game.ownerID;

                    if (game.players)
                    {
                        this.players = game.players.map(function(player) { return new Player(player); });
                    }

                    this.invitations = game.invitations;

                    this.board = new Board(game.board);

                    this.turn = game.turn;
                    this.state = game.state;
                    this.winner = game.winner;
                    this.moves = game.moves;
                    this.created = game.created;
                }

                this.players = this.players || [];
                this.moves = this.moves || [];
                this.invitations = this.invitations || [];

            }  // constructor

            isSettingUp() {

                return this.state == Game.STATES.SETUP;

            }

            isActive() { 

                return this.state == Game.STATES.PLAY;

            }

            isComplete() { 

                return this.state == Game.STATES.COMPLETE;

            }

            isOwner(userID) {

                if (typeof this.ownerID === 'string' && typeof userID === 'string')
                {
                    return this.ownerID === userID;
                }

                if (typeof userID === 'string')
                {
                    return this.ownerID.toString() === userID;
                }

                return this.ownerID.equals(userID);
            
            }  // isOwner


        }  // end class declaration

        Game.STATES =
        {
            SETUP: 'setup',
            PLAY: 'play',
            COMPLETE: 'complete'
        };

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
