(function (app) {

    "use strict";

    app.controller('codenames.game.SetupCtrl', ['$scope',
                                            'codenames.viewService', 'codenames.gameService',
                                            'codenames.Game',

        function ($scope,
                    viewService, gameService,
                    Game) {

            $scope.viewService = viewService;

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


        }  // outer function

    ]);

})(angular.module('codenames.app'));


