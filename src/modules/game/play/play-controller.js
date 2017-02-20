(function (app) {

    "use strict";

    app.controller('codenames.game.PlayCtrl', ['$scope',
                                            'codenames.viewService', 'codenames.gameService',
                                            'codenames.Game',

        function ($scope,
                    viewService, gameService,
                    Game) {

            $scope.viewService = viewService;

            $scope.selectCell = function (cell) {

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

        }  // outer function

    ]);

})(angular.module('codenames.app'));


