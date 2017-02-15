(function (app) {

    "use strict";

    app.controller('codenames.game.SetupCtrl', ['$scope',
                                            'codenames.viewService', 'codenames.gameService',
                                            'codenames.Game',

        function ($scope,
                    viewService, gameService,
                    Game) {

            $scope.viewService = viewService;

            $scope.startGame = function () {

                gameService.startGame();

            };

        }  // outer function

    ]);

})(angular.module('codenames.app'));


