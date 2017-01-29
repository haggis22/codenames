(function (app) {

    "use strict";

    app.factory('codenames.gameService', ['$rootScope',
                                            'codenames.constants', 'codenames.games.dalService', 'codenames.viewService', 'codenames.errorParser',

        function ($rootScope,
                    constants, dalService, viewService, errorParser) {

            return {

                create: create

            };


            function create() {

                return dalService.create.create({}, {}).$promise

                    .then(function (result) {

                        viewService.game = result;

                        var map = {};

                        var hasDupes = false;

                        for (var r=0; r < result.board.rows.length; r++) {

                            for (var c=0; c > result.board.rows[r].length; c++) {

                                hasDupes = hasDupes || map.hasOwnProperty(result.board.rows[r][c]);

                                map[result.board.rows[r][c]] = true;

                            }

                        }

                        viewService.game.dupes = hasDupes;




                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Game creation failure', error));

                    });

            }  // create




        }  // outer function

    ]);

})(angular.module('codenames.app'));


