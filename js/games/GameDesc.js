(function(isNode, isAngular) {

    "use strict";

    var GameDescModule = function(Player, Turn) {

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
                    this.turn = new Turn(game.turn);
                    this.winner = game.winner;

                }

                this.players = this.players || [];

            }

        }  // end class declaration

        return GameDesc;
    
    };

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.GameDesc', [ 'codenames.Player', 'codenames.Turn', GameDescModule ]);

    }
    else if (isNode)
    {
        module.exports = GameDescModule(require(__dirname + '/Player'), require(__dirname + '/Turn'));
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
