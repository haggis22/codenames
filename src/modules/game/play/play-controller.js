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


            $scope.selectCell = function (cell) {

                if (!gameService.isMyTurnToAct(Action.GUESS))
                {
                    return;
                }

                if (!cell.revealed)
                {
                    gameService.selectCell(cell);
                }

            };  // selectCell

            $scope.countRemaining = function (role) {

                if (!viewService.game) {
                    return 0;
                }

                var num = 9;

                for (var cell of viewService.game.board.cells) {
                    if (cell.role == role) {
                        num--;
                    }
                }

                return num;

            };


            $scope.getTurnClass = function() {

                if (viewService.game && viewService.game.turn)
                {
                    switch (viewService.game.turn.team)
                    {
                        case 'blue': 
                            return 'team-blue';

                        case 'red':
                            return 'team-red';
                    }
                }

                return '';

            };  // getTurnClass

            $scope.isSpymaster = function() {

                if (viewService.game && viewService.session)
                {
                    var player = viewService.game.findPlayer(viewService.session.userID);
                    return player && player.role == Team.ROLES.SPYMASTER;
                }

                return false;
            
            };  // isSpymaster




            $scope.giveClue = function() {

                if (!gameService.isMyTurnToAct(Action.CLUE))
                {
                    return;
                }

                viewService.clue.submitted = true;

                if ($scope.clueForm.$invalid)
                {
                    return;
                }

                gameService.giveClue();

            };   // giveClue


        }  // outer function

    ]);

})(angular.module('codenames.app'));


