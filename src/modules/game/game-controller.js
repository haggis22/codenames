(function (app) {

    "use strict";

    app.controller('codenames.gameCtrl', ['$scope', '$state', '$timeout',
                                            'codenames.viewService', 'codenames.gameService', 'codenames.Constants',
                                            'codenames.Game',

        function ($scope, $state, $timeout,
                    viewService, gameService, constants,
                    Game) {

            $scope.viewService = viewService;

            var gameTimerPromise = null;

            function pullGame()
            {
                
                gameService.pullGame(viewService.gameID)

                    .finally(function(value) { 

                        // this will cancel any timer that might be running. Won't throw an error if the promise is null
                        $timeout.cancel(gameTimerPromise);
                        
                        // don't restart the timer once the game is over
                        if (!viewService.game.isComplete())
                        {
                            gameTimerPromise = $timeout(pullGame, constants.timers.POLL_INTERVAL);
                        }

                    });

            }

            // pull the first time, then it will start re-loading itself
            pullGame();

            $scope.$on("$destroy", function(event) {
                $timeout.cancel(gameTimerPromise);
            });

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


