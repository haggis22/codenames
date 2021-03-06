﻿/*jslint node: true */
(function(isNode, isAngular) {

    "use strict";

    var ConstantsModule = function() {

        class Constants {

        }  // end class declaration

        Constants.STORAGE_KEY = 'codenames.options';

        Constants.cookies = 
        {
            SESSION: 'session',
            EXPIRES_LENGTH: 1000 * 60 * 60 * 24 * 365
        };

        Constants.events = 
        {
            SESSION_CHANGE: 'session-change',
            STATE_CHANGE: 'state-change',
            ERROR: 'raise-error'
        };

        Constants.timers = 
        {
            POLL_INTERVAL: 2000
        };

        return Constants;

    };

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Constants', [ ConstantsModule ]);

    } 
    else if (isNode)
    {
        module.exports = ConstantsModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');

