(function (app) {

    "use strict";

    app.controller('codenames.game.PlayCtrl', ['$scope',
                                            'codenames.viewService', 'codenames.gameService',
                                            'codenames.Game', 'codenames.Team', 'codenames.Action',

        function ($scope,
                    viewService, gameService,
                    Game, Team, Action) {

            $scope.viewService = viewService;
            $scope.Team = Team;
            $scope.Action = Action;

            // clear the clue the first time through this controller
            gameService.clearClue();

            $scope.getTurnDescription = function () {

                if (viewService.game && viewService.game.turn) {

                    switch (viewService.game.turn.action) {
                        case Action.CLUE:
                            return "give clue";

                        case Action.GUESS:
                            return "guess " + viewService.game.turn.numGuesses;

                    }

                }

                return "";

            };


            $scope.selectCell = function (cell) {

                if (!gameService.isMyTurnToAct(Action.GUESS)) {
                    return;
                }

                if (!cell.revealed) {
                    gameService.selectCell(cell);
                }

            };  // selectCell


            $scope.getTurnClass = function (team) {

                return team ? team : '';

            };  // getTurnClass


            $scope.isSpymaster = function () {

                if (viewService.game && viewService.session) {
                    return viewService.game.isSpymaster(viewService.session.userID);
                }

                return false;

            };  // isSpymaster


            $scope.giveClue = function () {

                if (!gameService.isMyTurnToAct(Action.CLUE)) {
                    return;
                }

                viewService.clue.submitted = true;

                if ($scope.clueForm.$invalid) {
                    return;
                }

                gameService.giveClue();

            };   // giveClue


        }  // outer function

    ]);

})(angular.module('codenames.app'));


