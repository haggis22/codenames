(function (app) {

    "use strict";

    app.factory('codenames.games.dalService', ['$resource',

        function ($resource) {

            return {

                create: $resource('/api/games/create', {},
                    {
                        create: { method: 'POST' }
                    })

            };

        }  // outer function

    ]);

})(angular.module('codenames.app'));


