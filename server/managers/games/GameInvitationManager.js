"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var q = require('q');

var Player = require(__dirname + '/../../../js/games/Player');

var UserManager = require(__dirname + '/../users/UserManager');



class GameInvitationManager
{


    static invite(user, game, username) {

        if (user.username == username)
        {
            return q.resolve({ error: 'You cannot invite yourself' });
        }

        // look for the invitee already being in the game
        for (var player of game.players)
        {
            if (player.username == username)
            {
                return q.resolve({ error: username + ' is already in the game' });
            }
        
        }

        // TODO - verify current state, user is owner of the game
        
        return UserManager.fetchByUsername(username)

            .then(function(invitee) {

                if (invitee == null)
                {
                    return { error: 'Invited user is unknown' };
                }

                // this will create a new player, identified as NOT the owner of the game
                game.players.push(Player.fromUser(invitee, false));

                return { data: game };

            });

    }   // invite


}  // end class declaration


module.exports = GameInvitationManager;


