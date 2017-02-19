(function (app) {

    "use strict";

    app.factory('codenames.users.dalService', ['$resource',

        function ($resource) {

            return {

                register: $resource('/api/users/register'),

                login: $resource('/api/users/login', {},
                    {
                        login: { method: 'POST' }
                    }),

                session: $resource('/api/users/session'),
                
                logout: $resource('/api/users/logout', {},
                    {
                        logout: { method: 'POST' }
                    })


            };

        }  // outer function

    ]);

})(angular.module('codenames.app'));


