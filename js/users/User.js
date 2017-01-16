(function (isNode, isAngular) {

    "use strict";

    var UserModule = function () {

        var User = function (user) {

            this._id = user._id;
            this.username = user.username;
            this.password = user.password;
            this.updated = user.updated;
            this.sessionHash = user.sessionHash;

        };

        return User;

    };

    if (isAngular) {
        // AngularJS module definition
        angular.module('codenames.app')
            .factory('User', [UserModule]);

    }
    else if (isNode) {
        // NodeJS module definition
        module.exports = UserModule();

    }

})(typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');