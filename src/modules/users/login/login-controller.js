(function(app) { 
    
    "use strict";

    app.controller('codenames.users.loginCtrl', ['$scope', '$rootScope', '$state',
                                                    'codenames.constants', 'codenames.userService', 'codenames.viewService', 'codenames.errorParser',

        function ($scope, $rootScope, $state,
                    constants, userService, viewService, errorParser) {

            $scope.email = 'dshell@gmail.com';
            $scope.password = 'password';


            $scope.login = function() {

                $scope.loginSubmitted = true;

                if (!$scope.loginForm.$valid)
                {
                    return;
                }

                userService.login($scope.email, $scope.password)
                    .then(function(result) {

                        console.log('Made it here');

                    })
                    .catch(function(error) { 

                        $scope.error = error.data || error;

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Login failure', error));

                    });
                

            };



        }  // outer function

    ]);

}) (angular.module('codenames.app'));


