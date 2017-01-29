(function (app) {

    "use strict";

    app.controller('codenames.lobbyCtrl', ['$scope', '$q',
                                                'codenames.viewService', 'codenames.gameService',

        function ($scope, $q,
                    viewService, gameService) {

            $scope.viewService = viewService;


            $scope.createGame = function () {


                gameService.create()

                    .then(function () {

                        // now what?
                        console.log('created game');

                    });

            };   // createGame

            $scope.selectCell = function (cell) {

                cell.selected = !cell.selected;

            };  // selectCell

            $scope.countRemaining = function (role) {

                if (!viewService.game) {
                    return 0;
                }

                var num = 0;

                for (var r = 0; r < 5; r++) {
                    for (var c = 0; c < 5; c++) {
                        if (viewService.game.board.rows[r][c].role == role && !viewService.game.board.rows[r][c].selected) {
                            num++;
                        }
                    }
                }

                return num;

            };


        }  // outer function

    ]);

})(angular.module('codenames.app'));


