"use strict";

var express = require('express');
var router = express.Router();

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var constants = require(__dirname + '/../../js/Constants');

var GameManager = require(__dirname + '/../managers/games/GameManager');



function validateCommand(command)
{
    // we must check that cellID is not null specifically, since it could be 0, and that is falsey
    return command && command.gameID && (command.cellID != null);
}


// post a move to the server. It will either be rejected, or 
// processed successfully and a new version of the game will be returned
router.post('/', function (req, res) {

    if (!req.user)
    {
        return res.status(401).send('Not logged in');
    }

    // for a POST the parameters come in req.body
    var command = req.body;

    console.log('Heard the command: ' + JSON.stringify(command));

    if (!validateCommand(command))
    {
        return res.status(400).send('Invalid command');
    }

    GameManager.fetchGame(req.user, command.gameID)

        .then(function (result) {

            if (result.data)
            {
                logger.info('Fetched game');
                
                var game = result.data;

                game.board.cells[command.cellID].revealed = true;

                // clean the game before sending it back to the client
                GameManager.sanitizeForClient(game);

                // return the games
                return res.send(game).end();
            }

            return res.status(404).send(result.error);

        })
        .catch(function(err) {
            logger.warn('Could not make move ' + JSON.stringify(command) + ': ' + err.stack);
            return res.status(500).send('Could not make move').end();
        });

});




module.exports = router;