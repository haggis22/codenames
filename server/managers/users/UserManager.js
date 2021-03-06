﻿/*jslint node: true */
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
var uuid = require('uuid');

var User = require(__dirname + '/../../../js/users/User');

var cryptographer = require(__dirname + '/../../crypto/cryptographer');
var SessionManager = require(__dirname + '/SessionManager');

const MIN_PASSWORD_LENGTH = 8;


class UserManager 
{

    constructor(repo)
    {
        this.repo = repo;
    }

    fetchByID(id) {

        return this.repo.fetchByID(id);

    }

    // Success: returns a Session object
    login(username, password) {

        let repo = this.repo;

        // pull by email address
        return repo.fetchByEmail(username)

            .then(function(userResult) {

                if (userResult.error)
                {
                    return q(userResult);
                }

                if (userResult.data)
                {
                    // we found the user, so jump to the next step
                    return q(userResult.data);
                }

                // We did not find the user by email, so check by username instead
                return repo.fetchByUsername(username);

            })
            .then(function(userResult) {

                if (userResult.error)
                {
                    throw new Error("Could not fetch user from database");
                }

                // we don't want to throw an exception, but we do want to indicate that the login failed
                if (userResult.data === null) {

                    return { error: 'Unknown user or incorrect password' };

                }

                let user = userResult.data;

                return cryptographer.compare(password, user.password)

                    .then(function (isPasswordMatch) {

                        if (!isPasswordMatch) {

                            return { error: 'Unknown user or incorrect password' };

                        }

                        return { data: user };

                    });

            });

    }  // login


    // Success: returns a Session object
    loginAsGuest() {

        let password = uuid.v4();

        // first, create a new guest user
        let guest = 
        {
            username: 'Guest-' + uuid.v4(),
            password: password,
            confirmPassword: password,          // so that they match
            email: null,                        // guest users have no email set up, so there is nothing to dupe out against
            first: 'Guest',
            last: 'User'
        };

        // returns a new { data: User } object
        return this.register(guest);

    }  // loginAsGuest


    validateRegistration(user) {

        if (!user)
        {
            return { error: 'User is null' };
        }

        if (!user.username || user.username.trim().length === 0)
        {
            return { error: 'Invalid username' };
        }

/*
    email is no longer required

        if (!user.email || user.email.trim().length === 0)
        {
            return { error: 'Invalid email' };
        }
*/
        if (!user.first || user.first.trim().length === 0)
        {
            return { error: 'Missing first name' };
        }

        if (!user.last || user.last.trim().length === 0)
        {
            return { error: 'Missing last name' };
        }

        if (!user.password || user.password.trim().length === 0)
        {
            return { error: 'Missing password' };
        }

        if (user.password.length < MIN_PASSWORD_LENGTH)
        {
            return { error: 'Password too short' };
        }

        if (!user.confirmPassword || user.confirmPassword.trim().length === 0)
        {
            return { error: 'Missing password confirmation' };
        }

        if (user.password != user.confirmPassword)
        {
            return { error: 'Password values do not match' };
        }

        return { data: true };

    }  // validateRegistration


    fetchByUsername(username) {

        return this.repo.fetchByUsername(username);

    }


    // Success: returns a Session object
    register(newUser) {

        var validationResult = this.validateRegistration(newUser);

        if (validationResult.error)
        {
            return q(validationResult);
        }

        // pull by email address
        return this.repo.fetchByEmail(newUser.email)

            .then((function (emailUserResult) {

                if (emailUserResult.error)
                {
                    return emailUserResult;
                }

                if (emailUserResult.data != null) {

                    return { error: 'Email is already in use' };

                }

                return this.repo.fetchByUsername(newUser.username)

                    .then((function(usernameUserResult) {

                        if (usernameUserResult.error)
                        {
                            return usernameUserResult;
                        }

                        if (usernameUserResult.data)
                        {
                            return { error: 'Username is already in use' };
                        }

                        // hash the password via a promise
                        return cryptographer.encrypt(newUser.password)

                            .then((function(hashedPassword) { 

                                newUser.password = hashedPassword;

                                // run the user through the User constructor to weed out any extra fields we don't need
                                newUser = new User(newUser);

                                return this.repo.insert(newUser);
                                    
                            }).bind(this));  // password hashing

                    }).bind(this));  // fetchByUsername

            }).bind(this));  // fetchByEmail

    }   // register


}   // class declaration

module.exports = UserManager;


