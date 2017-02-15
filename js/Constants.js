/*jslint node: true */
(function(isNode, isAngular) {

    "use strict";

    var ConstantsModule = function() {

        class Constants {

        }  // end class declaration

        Constants.cookies = 
        {
            SESSION: 'session'
        };

        Constants.events = 
        {
            SESSION_CHANGE: 'session-change',
            STATE_CHANGE: 'state-change',
            ERROR: 'raise-error'
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

