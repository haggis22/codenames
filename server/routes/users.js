"use strict";

var express = require('express');
var router = express.Router();

console.log('codeapi __dirname = ' + __dirname);

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var constants = require(__dirname + '/../../js/Constants');
var UserManager = require(__dirname + '/../managers/users/UserManager');


router.post('/login', function (req, res) {

    if (logger.isDebugEnabled) { logger.debug('Login attempt for ' + req.body.email); }

    // for a POST the parameters come in req.body
    UserManager.login(req.body.email, req.body.password)

        .then(function (session) {

            if (session)
            {
                // put the session in the cookies
                res.cookie(constants.cookies.SESSION, session.hash);

                // return the newly-created user session data
                return res.send(session).end();
            }

            // the login failed because of the input, not because of a system error
            return res.status(401).send('Invalid username or password');

        })
        .catch(function(err) {
            logger.warn('Could not log in for user ' + req.body.email + ': ' + err.stack);
            return res.status(500).send('Could not log in').end();
        });

});


/*
router.get('/session', function (req, res) {

    if (req.user) {

        var session = new Session(req.user);
        return res.status(200).send(session).end();

    }

    return res.status(200).send(null).end();

});
*/

router.get('/me', function (req, res) {

    UserManager.fetchByEmail('dshell@gmail.com')
        .then(function(user) {

            return res.send(user).end();

        })
        .catch(function(err) {
            return res.status(500).send('Could not find user').end();
        });

});


module.exports = router;