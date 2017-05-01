(function (app) {

    "use strict";

    app.controller('codenames.lobbyCtrl', ['$scope', '$q',
                                                'codenames.viewConstants', 'codenames.viewService', 'codenames.gameService',

        function ($scope, $q,
                    viewConstants, viewService, gameService) {

            $scope.viewConstants = viewConstants;
            $scope.viewService = viewService;

            gameService.pullGames();


            $scope.selectTab = function (newTab) {

                viewService.tabs.lobby = newTab;

            };


            $scope.createGame = function () {

                gameService.create()

                    .then(function () {

                        gameService.pullGames();

                    });

            };   // createGame


            $scope.getSetupGames = function () {

                if (viewService.games && viewService.session)
                {
                    return viewService.games.filter(g => g.isSettingUp());
                }

                return [];

            };  // getInvitedGames

            $scope.getActiveGames = function () {

                if (viewService.games && viewService.session)
                {
                    return viewService.games.filter(g => (g.isActive()) && g.isPlaying(viewService.session.username));
                }

                return [];

            };  // getActiveGames

            $scope.getCompleteGames = function () {

                if (viewService.games && viewService.session)
                {
                    return viewService.games.filter(g => g.isComplete() && g.isPlaying(viewService.session.username));
                }

                return [];

            };  // getCompleteGames

            $scope.checkTab = function() {

                if (!viewService.tabs.lobby)
                {
                    if ($scope.getActiveGames().length > 0)
                    {
                        $scope.selectTab(viewConstants.TABS.LOBBY.ACTIVE);
                    }

                    else if ($scope.getSetupGames().length > 0)
                    {
                        $scope.selectTab(viewConstants.TABS.LOBBY.SETUP);
                    }

                    else if ($scope.getSetupGames().length > 0)
                    {
                        $scope.selectTab(viewConstants.TABS.LOBBY.FINISHED);
                    }
                }

            };


            $scope.checkTab();


        }  // outer function

    ]);

})(angular.module('codenames.app'));


