/*jslint node: true */
"use strict";

var bcrypt = require('bcrypt-nodejs');

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');


var q = require('q');


var Cryptographer = function () {
};

Cryptographer.encrypt = function (text) {

    var deferred = q.defer();
    var startTime = (new Date()).getTime();

    bcrypt.genSalt(10, function (err, salt) {

        if (err) {
            logger.error('Could not generate salt for encryption: ' + err);
            return deferred.reject(err);
        }

        bcrypt.hash(text, salt, null, function (err, hash) {

            if (err) {
                logger.error('Generated salt, but could not hash text: ' + err);
                return deferred.reject(err);
            }

            console.log('encrypt runtime: ' + ((new Date()).getTime() - startTime) + 'ms');

            return deferred.resolve(hash);

        });

    });

    return deferred.promise;

};

// compare knows how to pull the salt out of the resulting hash so 
// that it can be applied to the provided "text" parameter to check for a match
Cryptographer.compare = function (text, hash) {

    var deferred = q.defer();
    var startTime = (new Date()).getTime();

    // res will be true or false, assuming no err
    bcrypt.compare(text, hash, function (err, res) {

        if (err) {
            return deferred.reject(err);
        }

        console.log('compare runtime: ' + ((new Date()).getTime() - startTime) + 'ms');
        return deferred.resolve(res);

    });

    return deferred.promise;

};


module.exports = Cryptographer;