/*jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var Command = require(__dirname + '/../../js/games/Command');

var MongoGameRepository = require(__dirname + '/../persistence/mongo/MongoGameRepository');
var MongoUserRepository = require(__dirname + '/../persistence/mongo/MongoUserRepository');

var GameManager = require(__dirname + '/../managers/games/GameManager');
var Sanitizer = require(__dirname + '/../managers/games/Sanitizer');



// post a move to the server. It will either be rejected, or 
// processed successfully and a new version of the game will be returned
router.post('/', function (req, res) {

    if (!req.user)
    {
        return res.status(401).send('Not logged in');
    }

    // for a POST the parameters come in req.body
    var command = new Command(req.body);

    console.log('Heard the command: ' + JSON.stringify(command));

    let manager = new GameManager(new MongoGameRepository(), new MongoUserRepository());
    
    return manager.applyCommand(req.user, command)

        .then(function (result) {

            let game = result.data;

            if (game)
            {
                // return the updated game
                // for non-Spymasters, clean the game before sending it back to the client
                if (!game.isSpymaster(req.user._id))
                {
                    Sanitizer.sanitizeGame(game);
                }

                return res.send(game).end();
            }

            // there was a validation error while processing the command
            return res.status(400).send(result.error);

        })
        .catch(function(err) {
            logger.warn('Could not make move ' + JSON.stringify(command) + ': ' + err.stack);
            return res.status(500).send('Could not make move').end();
        });




});




module.exports = router;