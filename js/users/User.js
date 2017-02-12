(function(isNode, isAngular) {

    "use strict";

    var UserModule = function() {

        class User {

            constructor(user) {

                this._id = user._id;
                this.username = user.username;
                this.email = user.email;
                this.password = user.password;
                this.updated = user.updated;
                this.first = user.first;
                this.last = user.last;
                this.sessionHash = user.sessionHash;

            }

            static safeUser(user) {

                var safe = new User();
                safe.username = user.username;
                safe.first = user.first;
                safe.last = user.last;

                return safe;

            }

        }  // end class declaration

        return User;

    };  // UserModule

    if (isAngular) 
    {
        angular.module('codenames.app')
            .factory('codenames.User', [ UserModule ]);
    }
    else if (isNode)
    {
        module.exports = UserModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');

