(function (app) {

    "use strict";

    app.controller('codenames.game.PlayCtrl', ['$scope',
                                            'codenames.viewService', 'codenames.gameService',
                                            'codenames.Game', 'codenames.Team', 'codenames.Turn',

        function ($scope,
                    viewService, gameService,
                    Game, Team, Turn) {

            $scope.viewService = viewService;
            $scope.Team = Team;
            $scope.Turn = Turn;

            $scope.selectCell = function (cell) {

                if (!gameService.isMyTurnToAct(Turn.ACTIONS.GUESS))
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


        }  // outer function

    ]);

})(angular.module('codenames.app'));


