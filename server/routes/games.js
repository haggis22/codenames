"use strict";

var express = require('express');
var router = express.Router();

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var constants = require(__dirname + '/../../js/Constants');

var GameManager = require(__dirname + '/../managers/games/GameManager');
var Sanitizer = require(__dirname + '/../managers/games/Sanitizer');


// Returns a list of Game objects
router.get('/', function (req, res) {

    if (!req.user)
    {
        return res.status(401).send('Not logged in');
    }

    GameManager.fetchGamesForUser(req.user)

        .then(function (result) {

            if (result.data)
            {
                logger.info('Fetched games! (length ' + result.data.length + ')');

                // return the games
                return res.send(result.data).end();
            }

            // the shouldn't really get here - worst case scenario, we'd get an empty list
            return res.status(400).send(result.error);

        })
        .catch(function(err) {
            logger.warn('Could not fetch games ' + err.stack);
            return res.status(500).send('Could not fetch games').end();
        });

});

// Returns a specific game, if the user has acccess
router.get('/:gameID', function (req, res) {

    if (!req.user)
    {
        return res.status(401).send('Not logged in');
    }

    if (!req.params.gameID)
    {
        return res.status(404).send('Invalid game ID');
    }

    GameManager.fetchGame(req.user, req.params.gameID)

        .then(function (result) {

            if (result.data)
            {
                logger.info('Fetched game');

                var game = result.data;

                // for non-Spymasters, clean the game before sending it back to the client
                if (!game.isSpymaster(req.user._id))
                {
                    Sanitizer.sanitizeGame(game);
                }

                // return the game
                return res.send(game).end();
            }

            return res.status(404).send(result.error);

        })
        .catch(function(err) {
            logger.warn('Could not fetch games ' + err.stack);
            return res.status(500).send('Could not fetch games').end();
        });

});


// Returns a Game object if the login is successful
router.post('/', function (req, res) {

    // for a POST the parameters come in req.body
    GameManager.create(req.user)

        .then(function (result) {

            if (result.data)
            {
                logger.info('Created game!');

                // return the newly-created user session data
                return res.send(result.data).end();
            }

            // the login failed because of the input, not because of a system error
            return res.status(400).send(result.error);

        })
        .catch(function(err) {
            logger.warn('Could not create game ' + err.stack);
            return res.status(500).send('Could not create game').end();
        });

});


module.exports = router;