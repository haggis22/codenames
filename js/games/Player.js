(function(isNode, isAngular) {

    "use strict";

    var PlayerModule = function() {

        class Player {

            constructor(player) {

                if (player)
                {
                    this._id = player._id;
                    this.username = player.username;
                    this.team = player.team;
                    this.role = player.role;
                }

            }

            static fromUser(user) {

                var player = new Player();
                player._id = user._id;
                player.username = user.username;
                return player;

            }

            isUser(userID) {

                if (typeof this._id === 'string' && typeof userID === 'string')
                {
                    return this._id === userID;
                }

                if (typeof userID === 'string')
                {
                    return this._id.toString() === userID;
                }

                return this._id.equals(userID);
            
            }  // isUser


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



