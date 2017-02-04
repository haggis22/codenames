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

                        console.debug('created game');

                        // convert the board from an array into cells
                        viewService.game.board.rows = getRows(viewService.game.board);

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

                for (var cell of viewService.game.board.cells) {
                    if (cell.role == role && !cell.selected) {
                        num++;
                    }
                }

                return num;

            };

            function getRows(board) {

                if (board == null)
                {
                    return null;
                }

                
                var rows = [];
                var row = [];
                
                // we are going to make a square out of the board, so 25 cells is 5 x 5 rows/columns
                var numRows = Math.ceil(Math.sqrt(board.cells.length));
                var numCols = Math.ceil(board.cells.length / numRows);

                for (var c=0; c < board.cells.length; c++)
                {
                    row.push(board.cells[c]);

                    if (((c + 1) % numCols) == 0)
                    {
                        rows.push(row);
                        row = [];
                    }

                }

                // see if we have any left over...
                if (row.length > 0)
                {
                    // ...and add the last row (might not be a complete row, but we'll take it)
                    rows.push(row);
                }

                return rows;

            };


        }  // outer function

    ]);

})(angular.module('codenames.app'));


