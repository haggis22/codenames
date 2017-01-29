"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var q = require('q');

var User = require(__dirname + '/../../../js/users/User');

var cryptographer = require(__dirname + '/../../crypto/cryptographer');
var SessionManager = require(__dirname + '/SessionManager');


var UserManager = function () { };


UserManager.fetch = function (query) {

    var deferred = q.defer();

    var collection = db.get('users');

    collection.find(query, {}, function (err, result) {

        if (err) {
            logger.error('Could not load user from database for query ' + JSON.stringify(query) + ': ' + err);
            return deferred.reject(err);
        }

        if (result.length === 0) {
            // did not find a user with that username, but we don't want 
            // to tell them whether it is a wrong user or password
            return deferred.resolve(null);
        }

        return deferred.resolve(new User(result[0]));

    });

    return deferred.promise;

};

UserManager.fetchByEmail = function (email) {

    // null email will mean NULL user
    if (email === null) {
        return q.resolve(null);
    }

    return UserManager.fetch({ email: email });

};


UserManager.fetchByID = function (id) {

    // null ID will mean NULL user
    if (id === null) {
        return q.resolve(null);
    }

    return UserManager.fetch({ _id: id });

};


UserManager.fetchBySession = function (sessionHash) {

    // null hash will mean NULL user
    if (sessionHash === null) {
        return q.resolve(null);
    }

    return SessionManager.fetchByHash(sessionHash)

        .then(function (session) {

            if (session == null) {
                return null;
            }

            return UserManager.fetch({ _id: session.userID });

        });

};

// Success: returns a Session object
UserManager.login = function (email, password) {

    // pull by email address
    return UserManager.fetchByEmail(email)

        .then(function (user) {

            if (user == null) {

                return { error: 'Unknown user or incorrect password' };

            }

            return cryptographer.compare(password, user.password)
                .then(function (isPasswordMatch) {

                    if (!isPasswordMatch) {

                        return { error: 'Unknown user or incorrect password' };

                    }

                    return SessionManager.createSession(user);

                });

        });

};

module.exports = UserManager;


