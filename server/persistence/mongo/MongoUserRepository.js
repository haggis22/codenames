/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db.users);
var COLLECTION_NAME = 'users';

var q = require('q');

var User = require(__dirname + '/../../../js/users/User');


class MongoUserRepository
{

    constructor(repo)
    {
        this.repo = repo;
    }


    fetch(query) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.find(query, {}, function (err, result) {

            if (err) {
                logger.error('Could not load user from database for query ' + JSON.stringify(query) + ': ' + err);
                return deferred.reject(err);
            }

            if (result.length === 0) {
                // did not find a user with that username, but we don't want 
                // to tell them whether it is a wrong user or password
                return deferred.resolve({ data: null });
            }

            return deferred.resolve({ data: new User(result[0]) });

        });

        return deferred.promise;

    }  // fetch

    fetchByEmail(email) {

        // null email will mean NULL user
        if (email === null) {
            return q({ data: null });
        }

        return this.fetch({ email: email });

    }  // fetchByEmail

    fetchByUsername(username) {

        // null username will mean NULL user
        if (username === null) {
            return q({ data: null });
        }

        return this.fetch({ username: username });

    }  // fetchByUsername


    fetchByID(id) {

        // null ID will mean NULL user
        if (id === null) {
            return q({ data: null });
        }

        return this.fetch({ _id: id });

    }  // fetchByID


    insert(user) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.insert(user, function (err, doc) {

            if (err) {
                logger.error('Could not insert user into database ' + err);
                return deferred.reject(err);
            }

            var newUser = new User(doc);

            return deferred.resolve({ data: newUser });

        });

        return deferred.promise;

    }  // insert


}   // class declaration

module.exports = MongoUserRepository;


