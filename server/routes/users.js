/*jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var constants = require(__dirname + '/../../js/Constants');

var MongoSessionRepository = require(__dirname + '/../persistence/mongo/MongoSessionRepository');
var MongoUserRepository = require(__dirname + '/../persistence/mongo/MongoUserRepository');

var User = require(__dirname + '/../../js/users/User');
var UserManager = require(__dirname + '/../managers/users/UserManager');
var SessionManager = require(__dirname + '/../managers/users/SessionManager');


// Returns a Session object if the registration is successful
router.post('/register', function (req, res) {

    // for a POST the parameters come in req.body
    // We are NOT going to run this through the User object, because that strips out some of the 
    // necessary extra information like confirmPassword
    var newUser = req.body;

    if (logger.isDebugEnabled) { logger.debug('Registration attempt for ' + newUser.email); }

    let userManager = new UserManager(new MongoUserRepository());

    return userManager.register(newUser)

        .then(function (result) {

            if (result.data)
            {
                // result.data = the newly registered user
                let sessionManager = new SessionManager(new MongoSessionRepository());

                return sessionManager.createSession(result.data)

                    .then(function(sessionResult) {

                        if (sessionResult.data)
                        {
                            // now result.data is the 

                            // put the session in the cookies
                            res.cookie(constants.cookies.SESSION, sessionResult.data.hash);

                            logger.info('session = ' + JSON.stringify(sessionResult.data));

                            // return the newly-created user session data
                            return res.send(sessionResult.data).end();
                        }
                        else
                        {
                            throw new Error(sessionResult.error);
                        }

                    });

            }

            // the login failed because of the input, not because of a system error
            return res.status(400).send(result.error);

        })
        .catch(function(err) {
            logger.warn('Could not register user ' + newUser.username + ': ' + err.stack);
            return res.status(500).send('System error during registration').end();
        });

});


// Returns a Session object if the login is successful
router.post('/login', function (req, res) {

    if (logger.isDebugEnabled) { logger.debug('Login attempt for ' + req.body.email); }

    let userManager = new UserManager(new MongoUserRepository());

    // for a POST the parameters come in req.body
    userManager.login(req.body.email, req.body.password)

        .then(function (result) {

            if (result.data)
            {
                // returns the user, so create a session
                let sessionManager = new SessionManager(new MongoSessionRepository());

                return sessionManager.createSession(result.data)

                    .then(function(result) {

                        if (result.data)
                        {
                            // put the session in the cookies
                            res.cookie(constants.cookies.SESSION, result.data.hash);

                            logger.info('session = ' + JSON.stringify(result.data));

                            // return the newly-created user session data
                            return res.send(result.data).end();
                        }

                        throw new Error(result.error);

                    });
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

    let sessionManager = new SessionManager(new MongoSessionRepository());

    sessionManager.logout(req.session)
            
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