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

                viewService.game.state = Game.STATE_PLAY;

            };

        }  // outer function

    ]);

})(angular.module('codenames.app'));


