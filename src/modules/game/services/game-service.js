(function (app) {

    "use strict";

    app.factory('codenames.gameService', ['$rootScope', '$q',
                                            'h22.errorService',
                                            'codenames.Constants', 'codenames.games.dalService', 'codenames.viewService', 
                                            'codenames.Game', 'codenames.Command',

        function ($rootScope, $q,
                    errorService,
                    constants, dalService, viewService,
                    Game, Command) {

            return {

                pullGames: pullGames,
                pullGame: pullGame,
                create: create,
                clearInvitation: clearInvitation,
                inviteUser: inviteUser,
                acceptInvitation: acceptInvitation,
                applyForPosition: applyForPosition,
                startGame: startGame,
                isMyTurnToAct: isMyTurnToAct,
                selectCell: selectCell,
                clearClue: clearClue,
                giveClue: giveClue,
                passTurn: passTurn

            };


            function pullGames()
            {
                return dalService.games.query({}).$promise

                    .then(function (result) {

                        // map the game objects that come back to Game objects
                        viewService.games = result.map(g => new Game(g));

                    })
                    .catch(function(error) { 

                        errorService.addError('Could not fetch games', error);

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
                    viewService.game = null;
                    return $q.when(null);
                }

                viewService.pullingGame = true;

                return dalService.game.get({ gameID: gameID }).$promise

                    .then(function (game) {

                        viewService.game = convertGame(game);

                    })
                    .catch(function(error) { 

                        errorService.addError('Could not fetch game', error);

                    })
                    .finally(function() { 
                        viewService.pullingGame = false;
                    });

            }  // pullGame



            function create() {

                return dalService.create.create({}, {}).$promise

                    .then(function (result) {

                        viewService.game = convertGame(result);

                    })
                    .catch(function(error) { 

                        errorService.addError('Game creation failure', error);

                    });

            }  // create


            function selectCell(cell) {

                sendCommand(new Command({ gameID: viewService.game._id, action: Command.actions.SELECT, word: cell.word }))
                    .then(function(game) {
                        
                        viewService.game = game;

                    })
                    .catch(function(error) { 

                        errorService.addError('Could not select cell', error);

                    });


            }

            function sendCommand(command) {

                return dalService.command.give({}, command).$promise

                    .then(function (game) {
                        
                        return convertGame(game);

                    });

            }


            function clearInvitation() { 

                viewService.invitation = {};

            }


            function inviteUser() {

                if (!viewService.invitation || !viewService.invitation.username)
                {
                    return;
                }

                sendCommand(new Command({ gameID: viewService.game._id, action: Command.actions.INVITE, username: viewService.invitation.username }))
                    
                    .then(function(game) {
                        
                        clearInvitation();
                        viewService.game = game;


                    })
                    .catch(function(error) { 

                        errorService.addError('Could not invite user', error);

                    });

            }  // inviteUser


            function acceptInvitation() {

                sendCommand(new Command({ gameID: viewService.game._id, action: Command.actions.ACCEPT }))
                    
                    .then(function(game) {
                        
                        viewService.game = game;

                    })
                    .catch(function(error) { 

                        errorService.addError('Could not accept invitation', error);

                    });

            }  // acceptInvitation

            function applyForPosition(team, role) {

                sendCommand(new Command({ gameID: viewService.game._id, action: Command.actions.APPLY, team: team, role: role }))

                    .then(function(game) { 

                        viewService.game = game;

                    })
                    .catch(function(error) { 

                        errorService.addError('Could not assume role', error);

                    });


            }  // applyForPosition



            function startGame() {

                sendCommand(new Command({ gameID: viewService.game._id, action: Command.actions.START }))
                    
                    .then(function(game) {
                        
                        viewService.game = game;

                    })
                    .catch(function(error) { 

                        errorService.addError('Could not start game', error);

                    });

            }  // startGame

            
            function isMyTurnToAct(action) {

                if (!viewService.session || !viewService.game)
                {
                    return false;
                }
                
                return viewService.game.isMyTurn(viewService.session.userID, action);

            }

            function clearClue() {

                viewService.clue = {};

            }

            
            function giveClue() {

                sendCommand(new Command({ gameID: viewService.game._id, action: Command.actions.CLUE, word: viewService.clue.word, numMatches: viewService.clue.numMatches }))

                    .then(function(game) {
                        
                        viewService.game = game;
                        
                        // clear the clue for next time
                        clearClue();

                    })
                    .catch(function(error) { 

                        errorService.addError('Could not give clue', error);

                    });


            }


            function passTurn() {

                sendCommand(new Command({ gameID: viewService.game._id, action: Command.actions.PASS }))

                    .then(function(game) {
                        
                        viewService.game = game;

                    })
                    .catch(function(error) { 

                        errorService.addError('Could not pass turn', error);

                    });


            }


        }  // outer function

    ]);

})(angular.module('codenames.app'));


