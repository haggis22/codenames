(function(isNode, isAngular) {

    "use strict";

    var PlayerModule = function() {

        class Player {

            constructor(player) {

                if (player)
                {
                    this._id = player._id;
                    this.isOwner = player.isOwner;
                    this.username = player.username;
                    this.team = player.team;
                    this.role = player.role;
                }

            }

            static fromUser(user, isOwner) {

                var player = new Player();
                player._id = user._id;
                player.username = user.username;

                return player;

            }

        }  // class declaration

        return Player;
    
    };  // PlayerModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Player', [ PlayerModule ]);
    }
    else if (isNode)
    {
        module.exports = PlayerModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');



