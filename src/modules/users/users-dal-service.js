(function (app) {

    "use strict";

    app.factory('codenames.users.dalService', ['$resource',

        function ($resource) {

            return {

                login: $resource('/api/users/login', {},
                    {
                        login: { method: 'POST' }
                    })


            };

        }  // outer function

    ]);

})(angular.module('codenames.app'));


