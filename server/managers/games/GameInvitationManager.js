/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var q = require('q');

var Player = require(__dirname + '/../../../js/games/Player');



class GameInvitationManager
{

    constructor(userManager) {

        this.userManager = userManager;

    }


    invite(user, game, username) {

        if (!game.isOwner(user._id))
        {
            return q({ error: 'Only the game creator can invite other players' });
        }

        if (user.username == username)
        {
            return q({ error: 'You cannot invite yourself' });
        }

        // look for the invitee already being in the game
        if (game.isPlaying(username)) {
            return q({ error: username + ' is already in the game' });
        }

        // ...or already invited
        if (game.isInvited(username)) {
            return q({ error: username + ' is already invited to the game' });
        }

        if (!game.isSettingUp())
        {
            return q({ error: 'The game has already started' });
        }

        return this.userManager.fetchByUsername(username)

            .then(function(invitee) {

                if (invitee == null)
                {
                    return { error: 'User ' + username + ' is unknown' };
                }

                // this will create a new player, identified as NOT the owner of the game
                game.invitations.push(username);

                return { data: game };

            });

    }   // invite


    accept(user, game) {

        // Check to see whether the user has an invitation
        if (!game.isInvited(user.username)) {
            return q({ error: ' You do not have an invitation to this game' });
        }

        if (!game.isSettingUp())
        {
            return q({ error: 'The game has already started' });
        }

        // remove this user from the invitations
        game.invitations = game.invitations.filter(i => i != user.username);

        game.addPlayer(Player.fromUser(user));

        return q({ data: game });

    }   // accept


}  // end class declaration


module.exports = GameInvitationManager;


