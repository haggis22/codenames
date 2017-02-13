﻿"use strict";

var express = require('express');
var router = express.Router();

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var constants = require(__dirname + '/../../js/Constants');

var Command = require(__dirname + '/../../js/games/Command');

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

    GameManager.applyCommand(req.user, command)

        .then(function (result) {

            if (result.data)
            {
                // return the updated game
                // clean the game before sending it back to the client
                Sanitizer.sanitizeGame(result.data);

                return res.send(result.data).end();
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