/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var q = require('q');
var uuid = require('uuid');

var Session = require(__dirname + '/../../../js/users/Session');

class SessionManager
{

    constructor(repo) {

        this.repo = repo;
    
    }

    fetchByHash(hash) {

        return this.repo.fetchByHash(hash);

    }

    createSession(user) {

        // first check and see whether the user already has a session going
        return this.repo.fetchByUser(user)

            .then((function (session) {

                if (session) {

                    // they already have a session, so just return that
                    return { data: session };
                }

                // otherwise, generate their session id and save it
                session = Session.fromUser(user);
                session.hash = uuid.v4();

                return this.repo.insert(session)

                    .then(function (insertedSession) {

                        return { data: insertedSession };

                    });

            }).bind(this));



    }


    logout(session) {

        return this.repo.remove(session);

    }  // logout

}  // class declaration


module.exports = SessionManager;


