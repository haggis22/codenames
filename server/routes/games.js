﻿"use strict";

var express = require('express');
var router = express.Router();

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var constants = require(__dirname + '/../../js/Constants');

var GameManager = require(__dirname + '/../managers/games/GameManager');


// Returns a list of Game objects
router.get('/', function (req, res) {

    GameManager.fetch()

        .then(function (result) {

            if (result.data)
            {
                logger.info('Fetched games!');

                // return the games
                return res.send(result.data).end();
            }

            // the shouldn't really get here....
            return res.status(400).send(result.error);

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