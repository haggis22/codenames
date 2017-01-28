"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var q = require('q');
var uuid = require('uuid');

var Session = require(__dirname + '/../../../js/users/Session');

var SessionManager = function () { };

SessionManager.fetch = function (query) {

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

SessionManager.createSession = function (user) {

    // now generate their session id and save it
    logger.info('CreateSession for user ' + JSON.stringify(user));

    var session = Session.fromUser(user);
    session.hash = uuid.v4();

    return session;

};

SessionManager.fetchByHash = function (hash) {

    // null hash will mean NULL user
    if (hash === null) {
        return q.resolve(null);
    }

    return SessionManager.fetch({ hash: hash });

};


module.exports = SessionManager;


