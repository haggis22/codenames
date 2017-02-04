(function (app) {

    "use strict";

    app.factory('codenames.games.dalService', ['$resource',

        function ($resource) {

            return {

                games: $resource('/api/games/', {}),

                create: $resource('/api/games/', {},
                    {
                        create: { method: 'POST' }
                    })

            };

        }  // outer function

    ]);

})(angular.module('codenames.app'));


