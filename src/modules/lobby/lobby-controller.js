(function (app) {

    "use strict";

    app.controller('codenames.lobbyCtrl', ['$scope', '$q', '$state',
                                                'codenames.viewConstants', 'codenames.viewService', 'codenames.gameService',

        function ($scope, $q, $state,
                    viewConstants, viewService, gameService) {

            $scope.viewConstants = viewConstants;
            $scope.viewService = viewService;

            
            gameService.pullGames();


            $scope.selectTab = function (newTab) {

                viewService.tabs.lobby = newTab;

            };


            $scope.createGame = function () {

                gameService.create()

                    .then(function (newGame) {

                        return $state.go('main.game.setup', { gameID: newGame._id }, { reload: true });

                    });

            };   // createGame


            // Simple comment just to test checkin
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

                if (viewService.tabs.lobby == viewConstants.TABS.LOBBY.ACTIVE && $scope.getActiveGames().length == 0)
                {
                    // there are no active games to show
                    $scope.selectTab(null);
                }
                else if (viewService.tabs.lobby == viewConstants.TABS.LOBBY.SETUP && $scope.getSetupGames().length == 0)
                {
                    // there are no setting-up games to show
                    $scope.selectTab(null);
                }
                else if (viewService.tabs.lobby == viewConstants.TABS.LOBBY.FINISHED && $scope.getCompleteGames().length == 0)
                {
                    // there are no finished games to show
                    $scope.selectTab(null);
                }
                
                // if they don't have anything selected, then try to find them something
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
                    else
                    {
                        $scope.selectTab(viewConstants.TABS.LOBBY.SETUP);
                    }

                }

            };


            $scope.checkTab();


        }  // outer function

    ]);

})(angular.module('codenames.app'));


