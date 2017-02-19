(function (app) {

    "use strict";

    app.controller('codenames.users.registerCtrl', ['$scope', '$rootScope', '$state',
                                                    'codenames.Constants', 'codenames.userService', 'codenames.viewService', 'codenames.errorParser',

        function ($scope, $rootScope, $state,
                    constants, userService, viewService, errorParser) {

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


