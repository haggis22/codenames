(function (app) {

    "use strict";

    app.controller('codenames.lobbyCtrl', ['$scope', '$q',
                                                'codenames.viewService', 'codenames.gameService',

        function ($scope, $q,
                    viewService, gameService) {

            $scope.viewService = viewService;


            gameService.pullGames();

            $scope.createGame = function () {

                gameService.create()

                    .then(function () {

                        gameService.pullGames();

                    });

            };   // createGame


            $scope.getInvitedGames = function () {

                if (viewService.games && viewService.session)
                {
                    return viewService.games.filter(g => g.isSettingUp() && g.isInvited(viewService.session.username));
                }

            };  // getInvitedGames

            $scope.getActiveGames = function () {

                if (viewService.games && viewService.session)
                {
                    return viewService.games.filter(g => g.isActive() && g.isPlaying(viewService.session.username));
                }

            };  // getActiveGames

            $scope.getCompleteGames = function () {

                if (viewService.games && viewService.session)
                {
                    return viewService.games.filter(g => g.isComplete() && g.isPlaying(viewService.session.username));
                }

            };  // getCompleteGames


        }  // outer function

    ]);

})(angular.module('codenames.app'));


