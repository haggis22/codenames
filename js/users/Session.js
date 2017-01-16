(function (isNode, isAngular) {

    "use strict";

    var SessionModule = function () {

        var Session = function (session) {

            this.hash = session.hash;
            this.username = session.username;

        };

        return Session;

    };

    if (isAngular) {
        // AngularJS module definition
        angular.module('codenames.app')
            .factory('Session', [SessionModule]);

    }
    else if (isNode) {
        // NodeJS module definition
        module.exports = SessionModule();

    }

})(typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');