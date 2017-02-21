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

                return viewService.game.findSpymaster(team);

            };

            $scope.findSpies = function (team) {

                return viewService.game.findSpies(team);

            };


        }  // outer function

    ]);

})(angular.module('codenames.app'));


