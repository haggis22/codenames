(function (app) {

    "use strict";

    app.factory('codenames.games.dalService', ['$resource',

        function ($resource) {

            return {

                games: $resource('/api/games/', {}),

                game: $resource('/api/games/:gameID', { gameID: '@gameID' }),

                create: $resource('/api/games/', {},
                    {
                        create: { method: 'POST' }
                    }),

                play: $resource('/api/play/', {},
                    {
                        move: { method: 'POST' }
                    })


            };

        }  // outer function

    ]);

})(angular.module('codenames.app'));


