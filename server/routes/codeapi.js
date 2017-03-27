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

var SessionManager = require(__dirname + '/../managers/users/SessionManager');
var UserManager = require(__dirname + '/../managers/users/UserManager');

// requests that come through /codeapi should have a cookie once logged in
// Exceptions: logging in
router.use(function (req, res, next) {

    var sessionHash = null;

    if (req.cookies && req.cookies[constants.cookies.SESSION]) {
        sessionHash = req.cookies[constants.cookies.SESSION];
    }

    if (!sessionHash)
    {
        // nothing else to do, so move on
        return next();
    }

    let sessionManager = new SessionManager(new MongoSessionRepository());

    sessionManager.fetchByHash(sessionHash)

        .then(function (session) {

            if (!session)
            {
                // could not find the session, so move on
                return next();
            }

            req.session = session;

            let userManager = new UserManager(new MongoUserRepository());

            userManager.fetchByID(session.userID)
                
                .then(function(userResult) {

                    // the user could be returned as NULL for someone not logged in
                    let user = userResult.data;

                    // if (logger.isDebugEnabled && user) { logger.debug('User in request = ' + user.username); }

                    req.user = user;
                    return next();

                });

        })
        .catch(function(err) {
            logger.error('Could not validate user session: ' + err);
            return res.status(500).json({ error: 'Session error' });
        });


});

router.use('/users', require(__dirname + '/users'));
router.use('/games', require(__dirname + '/games'));
router.use('/play', require(__dirname + '/play'));

module.exports = router;