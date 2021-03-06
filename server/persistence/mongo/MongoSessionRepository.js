﻿/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db.users);
var COLLECTION_NAME = 'sessions';

var q = require('q');

var Session = require(__dirname + '/../../../js/users/Session');

class MongoSessionRepository
{

    fetch(query) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.find(query, {}, function (err, result) {

            if (err) {
                logger.error('Could not load session from database for query ' + JSON.stringify(query) + ': ' + err);
                return deferred.reject(err);
            }

            if (result.length === 0) {
                // did not find a user with that username, but we don't want 
                // to tell them whether it is a wrong user or password
                return deferred.resolve(null);
            }

            return deferred.resolve(new Session(result[0]));

        });

        return deferred.promise;

    }

    insert(session) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.insert(session, function (err, doc) {

            if (err) {
                logger.error('Could not insert session into database ' + err);
                return deferred.reject(err);
            }

            return deferred.resolve(new Session(doc));

        });

        return deferred.promise;

    }   // insert


    fetchByHash(hash) {

        // null hash will mean NULL user
        if (hash === null) {
            return q(null);
        }

        return this.fetch({ hash: hash });

    }   // fetchByHash

    fetchByUser(user) {

        // null user will mean NULL session
        if (user === null) {
            return q(null);
        }

        return this.fetch({ userID: user._id });

    }   // fetchByUser


    remove(session) {

        if (!session) {
            return q({ data: true });
        }

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.remove({ hash: session.hash }, function (err, doc) {

            if (err) {
                logger.error('Could not delete session from database ' + err);
                return deferred.reject(err);
            }

            return deferred.resolve({ data: true });

        });

        return deferred.promise;


    }  // remove

}  // class declaration


module.exports = MongoSessionRepository;


