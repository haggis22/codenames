/*jslint node: true */
(function (isNode, isAngular) {

    "use strict";

    // This wrapper function returns the contents of the module, with dependencies (if any)
    var ConstantsModule = function () {

        var Constants = function () {
        };

        Constants.cookies =
        {
            SESSION: 'session'
        };

        Constants.events =
        {
            SESSION_CHANGE: 'session-change'
        };

        return Constants;

    };

    if (isAngular) {
        // AngularJS module definition
        angular.module('codenames.app').factory('codenames.constants', [ConstantsModule]);
    }
    else if (isNode) {
        // NodeJS module definition
        module.exports = ConstantsModule();
    }

})(typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
