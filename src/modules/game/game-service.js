(function (app) {

    "use strict";

    app.factory('codenames.gameService', ['$rootScope',
                                            'codenames.constants', 'codenames.games.dalService', 'codenames.viewService', 'codenames.errorParser',

        function ($rootScope,
                    constants, dalService, viewService, errorParser) {

            return {

                pullGames: pullGames,
                create: create

            };


            function pullGames()
            {
                return dalService.games.query({}).$promise

                    .then(function (result) {

                        viewService.games = result;

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Could not fetch games', error));

                    });

            }  // pullGames


            function create() {

                return dalService.create.create({}, {}).$promise

                    .then(function (result) {

                        viewService.game = result;

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Game creation failure', error));

                    });

            }  // create




        }  // outer function

    ]);

})(angular.module('codenames.app'));


