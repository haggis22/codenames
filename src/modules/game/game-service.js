(function (app) {

    "use strict";

    app.factory('codenames.gameService', ['$rootScope',
                                            'codenames.constants', 'codenames.games.dalService', 'codenames.viewService', 'codenames.errorParser',

        function ($rootScope,
                    constants, dalService, viewService, errorParser) {

            return {

                create: create

            };


            function create() {

                return dalService.create.create({}, {}).$promise

                    .then(function (result) {

                        // TODO: auto-join game you created?

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Game creation failure', error));

                    });

            }  // create




        }  // outer function

    ]);

})(angular.module('codenames.app'));


