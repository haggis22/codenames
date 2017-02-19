(function (app) {

    "use strict";

    app.controller('codenames.mainCtrl', ['$scope', '$rootScope', '$state',
                                            'codenames.Constants', 'codenames.viewService', 'codenames.userService',

        function ($scope, $rootScope, $state,
                    constants, viewService, userService) {

            $scope.viewService = viewService;


            function isInEntryway() {
                return $state.is('main.login') || $state.is('main.register');
            }

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

/*            
            $scope.$on('raise-error', function (event, args) {

                console.error('Ooops: ' + JSON.stringify(args.error));

            });
*/

            // always check for a logged-in user first.
            // This will handle bookmarked pages nicely - will always try to re-log in, or shunt them to the login page
            userService.checkSession();

            $scope.logout = function () {

                userService.logout();

            };


        }  // outer function

    ]);

})(angular.module('codenames.app'));


