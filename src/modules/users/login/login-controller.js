(function(app) { 
    
    "use strict";

    app.controller('codenames.users.loginCtrl', ['$scope', '$rootScope', '$state',
                                                    'codenames.Constants', 'codenames.userService', 'codenames.viewService', 'codenames.errorParser',

        function ($scope, $rootScope, $state,
                    constants, userService, viewService, errorParser) {

            $scope.email = 'one@gmail.com';
            $scope.password = 'password';


            $scope.login = function() {

                $scope.loginSubmitted = true;

                if (!$scope.loginForm.$valid)
                {
                    return;
                }

                userService.login($scope.email, $scope.password);

            };



        }  // outer function

    ]);

}) (angular.module('codenames.app'));


