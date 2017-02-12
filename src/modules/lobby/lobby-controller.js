(function (app) {

    "use strict";

    app.controller('codenames.lobbyCtrl', ['$scope', '$q',
                                                'codenames.viewService', 'codenames.gameService',

        function ($scope, $q,
                    viewService, gameService) {

            $scope.viewService = viewService;


            gameService.pullGames();

            $scope.createGame = function () {


                gameService.create()

                    .then(function () {

                        console.debug('created game');
                        gameService.pullGames();

                    });

            };   // createGame


        }  // outer function

    ]);

})(angular.module('codenames.app'));


