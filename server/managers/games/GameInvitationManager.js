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

    static isTheOwner(game, user)
    {
        debugger;

        if (game && user)
        {
            for (var player of game.players)
            {
                // we have to convert the IDs to strings before comparing. Comparing
                // objects checks their object reference, not their "value"
                if (player._id.equals(user._id))
                {
                    return player.isOwner;
                }

            }  // for each player

        }

        return false;

    }

    static isAlreadyPlaying(game, username)
    {
        if (!game.players)
        {
            return false;
        }

        for (var player of game.players)
        {
            if (player.username == username)
            {
                return true;
            }
        }

        return false;
    }

    static isAlreadyInvited(game, username)
    {
        
        if (!game.invitations)
        {
            return false;
        }

        for (var invitee of game.invitations) 
        {
            if (invitee == username)
            {
                return true;
            }
        }

        return false;

    }

    static invite(user, game, username) {

        if (!GameInvitationManager.isTheOwner(game, user))
        {
            return q.resolve({ error: 'Only the game creator can invite other players' });
        }

        if (user.username == username)
        {
            return q.resolve({ error: 'You cannot invite yourself' });
        }

        // look for the invitee already being in the game
        if (GameInvitationManager.isAlreadyPlaying(game, username)) {
            return q.resolve({ error: username + ' is already in the game' });
        }

        // ...or already invited
        if (GameInvitationManager.isAlreadyInvited(game, username)) {
            return q.resolve({ error: username + ' is already invited to the game' });
        }

        // TODO - verify current state, user is owner of the game
        
        return UserManager.fetchByUsername(username)

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


}  // end class declaration


module.exports = GameInvitationManager;


