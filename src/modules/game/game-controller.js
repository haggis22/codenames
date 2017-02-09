(function (app) {

    "use strict";

    app.controller('codenames.gameCtrl', ['$scope',
                                            'codenames.viewService', 'codenames.gameService',

        function ($scope,
                    viewService, gameService) {

            $scope.viewService = viewService;

            gameService.pullGame(viewService.gameID)
                .then(function(game) {

                });

            $scope.selectCell = function (cell) {

                gameService.selectCell(cell);

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

                if (viewService.game)
                {
                    switch (viewService.game.turn)
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


