(function (app) {

    "use strict";

    app.controller('codenames.gameCtrl', ['$scope', '$state',
                                            'codenames.viewService', 'codenames.gameService', 'codenames.Constants',
                                            'codenames.Game',

        function ($scope, $state,
                    viewService, gameService, constants,
                    Game) {

            $scope.viewService = viewService;

            gameService.pullGame(viewService.gameID);

            $scope.$watch('viewService.game', function (game) {

                if (!game || !game.state) {
                    return;
                }

                if (game.isSettingUp())
                {
                    return $state.go('main.game.setup');
                }

                if (game.isActive() || game.isComplete())
                {
                    return $state.go('main.game.play');
                }

            });   // watch game.state


        }  // outer function

    ]);

})(angular.module('codenames.app'));


