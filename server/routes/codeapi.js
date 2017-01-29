"use strict";

var express = require('express');
var router = express.Router();

console.log('codeapi __dirname = ' + __dirname);

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var constants = require(__dirname + '/../../js/Constants');
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

    SessionManager.fetchByHash(sessionHash)

        .then(function (session) {

            if (!session)
            {
                // could not find the session, so move on
                return next();
            }

            req.session = session;

            UserManager.fetchByID(session.userID)
                
                .then(function(user) {

                    // the user could be returned as NULL for someone not logged in
                    if (logger.isDebugEnabled) { logger.debug('User in request = ' + user); }

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

module.exports = router;