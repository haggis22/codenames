(function(isNode, isAngular) {

    "use strict";

    var GameModule = function(Board, Player, Turn) {

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

                    this.turn = new Turn(game.turn);
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

            isInvited(username) {

                if (this.invitations)
                {
                    // game.invitations is an array of plain username strings
                    for (var invitee of this.invitations)
                    {
                        if (invitee == username)
                        {
                            return true;
                        }
                    }
                }

                return false;

            }  // isInvited

            isPlaying(username)
            {
                if (this.players)
                {

                    for (var player of this.players)
                    {
                        if (player.username == username)
                        {
                            return true;
                        }
                    }
                }

                return false;

            }  // isPlaying


            addPlayer(player) { 

                this.players.push(player);

            }


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
            .factory('codenames.Game', [ 'codenames.Board', 'codenames.Player', 'codenames.Turn', GameModule ]);
    }
    else if (isNode)
    {
        module.exports = GameModule(require(__dirname + '/Board'), require(__dirname + '/Player'), require(__dirname + '/Turn'));
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
