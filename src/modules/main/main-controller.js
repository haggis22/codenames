(function (app) {

    "use strict";

    app.controller('codenames.mainCtrl', ['$scope', '$rootScope', '$state',
                                            'codenames.constants', 'codenames.viewService', 'codenames.userService',

        function ($scope, $rootScope, $state,
                    constants, viewService, userService) {

            $scope.viewService = viewService;


            $scope.$on(constants.events.SESSION_CHANGE, function (event, args) {

                if (!viewService.session) {
                    return $state.go('main.login');
                }

                // they are on the login screen and have just logged in, then send them to the lobby
                if ($state.is('main.login') && (viewService.session)) {
                    return $state.go('main.lobby');
                }

                // otherwise they have auto-logged in, so just leave them where they are
                return;

            });

            $scope.$on('raise-error', function (event, args) {

                //            $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not drop " + item.getName(true), result.message ) });
                console.error('Ooops: ' + args.error);

            });

            // always check for a logged-in user first.
            // This will handle bookmarked pages nicely - will always try to re-log in, or shunt them to the login page
            userService.checkSession();

            $scope.logout = function () {

                // TODO: log out on server, remove cookie
                viewService.session = null;

                $rootScope.$broadcast(constants.events.SESSION_CHANGE);

            };


        }  // outer function

    ]);

})(angular.module('codenames.app'));


