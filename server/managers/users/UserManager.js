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

var cryptographer = require(__dirname + '/../../crypto/cryptographer');
var SessionManager = require(__dirname + '/SessionManager');

const MIN_PASSWORD_LENGTH = 8;


class UserManager 
{


    static fetch(query) {

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
                return deferred.resolve(null);
            }

            return deferred.resolve(new User(result[0]));

        });

        return deferred.promise;

    }  // fetch

    static fetchByEmail(email) {

        // null email will mean NULL user
        if (email === null) {
            return q.resolve(null);
        }

        return UserManager.fetch({ email: email });

    }  // fetchByEmail

    static fetchByUsername(username) {

        // null username will mean NULL user
        if (username === null) {
            return q.resolve(null);
        }

        return UserManager.fetch({ username: username });

    }  // fetchByUsername


    static fetchByID(id) {

        // null ID will mean NULL user
        if (id === null) {
            return q.resolve(null);
        }

        return UserManager.fetch({ _id: id });

    }  // fetchByID


    static fetchBySession(sessionHash) {

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

    }  // fetchBySession

    // Success: returns a Session object
    static login(email, password) {

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

    }  // login


    static validateRegistration(user) {

        if (!user)
        {
            return { error: 'User is null' };
        }

        if (!user.username || user.username.trim().length == 0)
        {
            return { error: 'Invalid username' };
        }

        if (!user.email || user.email.trim().length == 0)
        {
            return { error: 'Invalid email' };
        }

        if (!user.first || user.first.trim().length == 0)
        {
            return { error: 'Missing first name' };
        }

        if (!user.last || user.last.trim().length == 0)
        {
            return { error: 'Missing last name' };
        }

        if (!user.password || user.password.trim().length == 0)
        {
            return { error: 'Missing password' };
        }

        if (user.password.length < MIN_PASSWORD_LENGTH)
        {
            return { error: 'Password too short' };
        }

        if (!user.confirmPassword || user.confirmPassword.trim().length == 0)
        {
            return { error: 'Missing password confirmation' };
        }

        if (user.password != user.confirmPassword)
        {
            return { error: 'Password values do not match' };
        }

        return { data: true };

    }  // validateRegistration


    // Success: returns a Session object
    static register(newUser) {

        var validationResult = UserManager.validateRegistration(newUser);

        if (validationResult.error)
        {
            return q.resolve(validationResult);
        }

        // pull by email address
        return UserManager.fetchByEmail(newUser.email)

            .then(function (emailUser) {

                if (emailUser != null) {

                    return { error: 'Email is already in use' };

                }

                return UserManager.fetchByUsername(newUser.username)

                    .then(function(usernameUser) {

                        if (usernameUser)
                        {
                            return { error: 'Username is already in use' };
                        }

                        // hash the password via a promise
                        return cryptographer.encrypt(newUser.password)

                            .then(function(hashedPassword) { 

                                newUser.password = hashedPassword;

                                // run the user through the User constructor to weed out any extra fields we don't need
                                newUser = new User(newUser);

                                return UserManager.insert(newUser)

                                    .then(function(insertedUser) {

                                        return SessionManager.createSession(insertedUser);

                                    });  // UserManager.insert
                                     

                            });  // password hashing


                    });  // fetchByUsername

            });  // fetchByEmail

    }   // register


    static insert(user) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.insert(user, function (err, doc) {

            if (err) {
                logger.error('Could not insert user into database ' + err);
                return deferred.reject(err);
            }

            return deferred.resolve(new User(doc));

        });

        return deferred.promise;

    }


}   // class declaration

module.exports = UserManager;


