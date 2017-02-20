(function (app) {

    "use strict";

    app.controller('codenames.game.SetupCtrl', ['$scope',
                                            'codenames.viewService', 'codenames.gameService',
                                            'codenames.Game', 'codenames.Team',

        function ($scope,
                    viewService, gameService,
                    Game, Team) {

            $scope.viewService = viewService;
            $scope.Team = Team;

            $scope.startGame = function () {

                gameService.startGame();

            };


            gameService.clearInvitation();

            $scope.invite = function () {

                viewService.invitation.submitted = true;

                if ($scope.inviteForm.$invalid) {
                    return;
                }

                gameService.inviteUser()

            };   // invite

            $scope.isOwner = function () {

                // these are strings, not ObjectIds
                return viewService.game && viewService.session && viewService.game.isOwner(viewService.session.userID);

            };

            $scope.acceptInvitation = function () {

                gameService.acceptInvitation();

            };   // acceptInvitation


            $scope.apply = function (team, role) {

                gameService.applyForPosition(team, role);

            };  // apply

            $scope.findSpymaster = function (team) {

                for (var player of viewService.game.players) {

                    if (player.team == team && player.role == Team.ROLES.SPYMASTER)
                    {
                        return player;
                    }
                }

                return null;

            };

            $scope.findSpies = function (team) {

                return viewService.game.players.filter(p => p.team == team && p.role == Team.ROLES.SPY);

            };


        }  // outer function

    ]);

})(angular.module('codenames.app'));


