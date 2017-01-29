"use strict";

var express = require('express');
var router = express.Router();

console.log('users __dirname = ' + __dirname);

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var constants = require(__dirname + '/../../js/Constants');
var UserManager = require(__dirname + '/../managers/users/UserManager');
var SessionManager = require(__dirname + '/../managers/users/SessionManager');


// Returns a Session object if the login is successful
router.post('/login', function (req, res) {

    if (logger.isDebugEnabled) { logger.debug('Login attempt for ' + req.body.email); }

    // for a POST the parameters come in req.body
    UserManager.login(req.body.email, req.body.password)

        .then(function (result) {

            if (result.data)
            {
                // put the session in the cookies
                res.cookie(constants.cookies.SESSION, result.data.hash);

                logger.info('session = ' + JSON.stringify(result.data));

                // return the newly-created user session data
                return res.send(result.data).end();
            }

            // the login failed because of the input, not because of a system error
            return res.status(401).send(result.error);

        })
        .catch(function(err) {
            logger.warn('Could not log in for user ' + req.body.email + ': ' + err.stack);
            return res.status(500).send('Could not log in').end();
        });

});



router.get('/session', function (req, res) {

    // session could be null if not found, but it's still not an error
    return res.status(200).send(req.session).end();

});


// Returns a Session object if the login is successful
router.post('/logout', function (req, res) {

    SessionManager.logout(req.session)
            
        .then(function(result) { 
            
            // put the session in the cookies
            res.clearCookie(constants.cookies.SESSION);

            return res.send(result).end();

        })
        .catch(function(err) {
            logger.warn('Could not log out for session ' + req.session.hash + ': ' + err.stack);
            return res.status(500).send('Could not log out').end();
        });

});



module.exports = router;