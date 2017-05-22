(function (app) {

    "use strict";

    app.controller('codenames.game.SetupCtrl', ['$scope',
                                            'codenames.viewConstants', 'codenames.viewService', 'codenames.gameService',
                                            'codenames.Game', 'codenames.Team',

        function ($scope,
                    viewConstants, viewService, gameService,
                    Game, Team) {

            $scope.viewConstants = viewConstants;
            $scope.viewService = viewService;
            $scope.Team = Team;

            $scope.startGame = function () {

                gameService.startGame();

            };

            $scope.selectTab = function (newTab) {

                viewService.tabs.setup = newTab;

            };

            gameService.clearInvitation();

            $scope.invite = function () {

                viewService.invitation.submitted = true;

                if ($scope.inviteForm.$invalid) {
                    return;
                }

                gameService.inviteUser();

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

                if (viewService.game) {
                    return viewService.game.findSpymaster(team);
                }

            };

            $scope.findSpies = function (team) {

                if (viewService.game) {
                    return viewService.game.findSpies(team);
                }

            };

            $scope.iAmSpyFor = function(team) {

                return viewService.game && viewService.game.findSpies(team).find(s => s._id == viewService.session.userID);

            };  // iAmSpy


        }  // outer function

    ]);

})(angular.module('codenames.app'));


