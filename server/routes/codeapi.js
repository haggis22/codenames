"use strict";

var express = require('express');
var router = express.Router();

console.log('codeapi __dirname = ' + __dirname);

var config = require(__dirname + '/../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

// requests that come through /codeapi should have a cookie once logged in
// Exceptions: logging in
router.use(function (req, res, next) {

    var sessionHash = null;

    if (req.cookies && req.cookies[constants.cookies.SESSION]) {
        sessionHash = req.cookies[constants.cookies.SESSION];
    }

    return next();

});

module.exports = router;