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

            $scope.$watch('viewService.game.state', function (newValue) {

                switch (newValue) {

                    case Game.STATES.SETUP:
                        return $state.go('main.game.setup');

                    case Game.STATES.PLAY:
                        return $state.go('main.game.play');

                    case Game.STATES.COMPLETE:
                        return $state.go('main.game.complete');

                }  // state switch

            });   // watch game.state


        }  // outer function

    ]);

})(angular.module('codenames.app'));


