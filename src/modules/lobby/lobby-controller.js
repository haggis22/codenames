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

        }  // outer function

    ]);

})(angular.module('codenames.app'));


