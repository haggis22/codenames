(function (app) {

    "use strict";

    app.factory('codenames.gameService', ['$rootScope',
                                            'codenames.Constants', 'codenames.games.dalService', 'codenames.viewService', 'codenames.errorParser',
                                            'codenames.Game',

        function ($rootScope,
                    constants, dalService, viewService, errorParser,
                    Game) {

            return {

                pullGames: pullGames,
                pullGame: pullGame,
                create: create,
                selectCell: selectCell

            };


            function pullGames()
            {
                return dalService.games.query({}).$promise

                    .then(function (result) {

                        viewService.games = result;

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Could not fetch games', error));

                    });

            }  // pullGames


            function convertGame(game) {

                if (game == null || !game.board)
                {
                    return game;
                }

                
                game = new Game(game);

                var rows = [];
                var row = [];
                
                // we are going to make a square out of the board, so 25 cells is 5 x 5 rows/columns
                var numRows = Math.ceil(Math.sqrt(game.board.cells.length));
                var numCols = Math.ceil(game.board.cells.length / numRows);

                for (var c=0; c < game.board.cells.length; c++)
                {
                    game.board.cells[c].cellIndex = c;

                    row.push(game.board.cells[c]);

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

                game.board.rows = rows;

                return game;
            }


            function pullGame(gameID)
            {
                if (!gameID)
                {
                    return $q.when(null);
                }

                viewService.pullingGame = true;

                return dalService.game.get({ gameID: gameID }).$promise

                    .then(function (result) {

                        viewService.game = convertGame(result);

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Could not fetch game', error));

                    })
                    .finally(function() { 
                        viewService.pullingGame = false;
                    });

            }  // pullGame



            function create() {

                return dalService.create.create({}, {}).$promise

                    .then(function (result) {

                        viewService.game = result;

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Game creation failure', error));

                    });

            }  // create


            function selectCell(cell) {

                var command = { gameID: viewService.game._id, cellID: cell.cellIndex };

                return dalService.play.move({}, command).$promise

                    .then(function (result) {
                        
                        viewService.game = convertGame(result);

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Game creation failure', error));

                    });

            }



        }  // outer function

    ]);

})(angular.module('codenames.app'));


