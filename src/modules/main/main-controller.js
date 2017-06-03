(function (app) {

    "use strict";

    app.controller('codenames.mainCtrl', ['$scope', '$rootScope', '$state',
                                            'codenames.Constants', 'codenames.viewService', 'codenames.userService',

        function ($scope, $rootScope, $state,
                    constants, viewService, userService) {

            $scope.viewService = viewService;
            $scope.state = $state;

            function isInEntryway() {
                return $state.is('main.login') || $state.is('main.register');
            }

            // the TRUE 3rd parameter means to watch it deeply. If any of the options change, then persist the changes
            $scope.$watch('viewService.options', function () {

                viewService.saveOptions();

            }, true);


            $scope.$on(constants.events.SESSION_CHANGE, function (event, args) {

                if (!viewService.session) {

                    // leave them where they are if they are any of these pages, otherwise send them to the login page
                    if (!isInEntryway()) {
                        return $state.go('main.login');
                    }

                }

                // they are on the login screen and have just logged in, then send them to the lobby
                if (isInEntryway() && (viewService.session)) {
                    return $state.go('main.lobby');
                }

                // otherwise they have auto-logged in, so just leave them where they are
                return;

            });

            // always check for a logged-in user first.
            // This will handle bookmarked pages nicely - will always try to re-log in, or shunt them to the login page
            userService.checkSession();

            $scope.logout = function () {

                userService.logout();

            };

            $scope.isInLobby = function () {

                return $state.current && $state.current.name == 'main.lobby';

            };

            $scope.goToLobby = function () {

                // hide the menu
                viewService.menu.display = false;

                return $state.go('main.lobby');

            };


        }  // outer function

    ]);

})(angular.module('codenames.app'));


