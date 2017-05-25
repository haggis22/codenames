(function (app) {

    "use strict";

    app.controller('codenames.users.loginCtrl', ['$scope', '$rootScope', '$state',
                                                    'codenames.Constants', 'codenames.userService', 'codenames.viewService',

        function ($scope, $rootScope, $state,
                    constants, userService, viewService) {

            // $scope.email = 'one@gmail.com';
            // $scope.password = 'password';


            $scope.login = function () {

                $scope.loginSubmitted = true;

                if (!$scope.loginForm.$valid) {
                    return;
                }

                userService.login($scope.username, $scope.password);

            };

            $scope.loginAsGuest = function () {

                userService.loginAsGuest();

            };  // loginAsGuest



        }  // outer function

    ]);

})(angular.module('codenames.app'));


