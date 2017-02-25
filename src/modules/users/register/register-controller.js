(function (app) {

    "use strict";

    app.controller('codenames.users.registerCtrl', ['$scope', '$rootScope', '$state',
                                                    'codenames.Constants', 'codenames.userService', 'codenames.viewService',

        function ($scope, $rootScope, $state,
                    constants, userService, viewService) {

            $scope.viewService = viewService;

            userService.initializeUser();

            $scope.cancel = function () {

                $state.go('main.login');

            };  // cancel


            $scope.register = function () {

                viewService.user.submitted = true;

                if (!$scope.registerForm.$valid) {
                    return;
                }

                userService.register();

            };



        }  // outer function

    ]);

})(angular.module('codenames.app'));


