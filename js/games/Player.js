﻿(function(isNode, isAngular) {

    "use strict";

    var PlayerModule = function() {

        class Player {

            constructor(player) {

                if (player)
                {
                    this._id = player._id;
                    this.username = player.username;
                    this.first = player.first;
                    this.last = player.last;
                    this.team = player.team;
                    this.role = player.role;
                }

            }

            static fromUser(user) {

                var player = new Player();
                player._id = user._id;
                player.username = user.username;
                player.first = user.first;
                player.last = user.last;
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

                // if the id supports the equals method then use that
                if (this._id.equals)
                {
                    return this._id.equals(userID);
                }

                return this._id == userID;
            
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



