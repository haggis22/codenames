(function(app) { 
    
    "use strict";

    app.controller('codenames.users.loginCtrl', ['$scope', '$state',
                                                    'codenames.constants', 'codenames.users.dalService', 'codenames.viewService',

        function ($scope, $state,
                    constants, usersDALService, viewService) {

            $scope.email = 'dshell@gmail.com';
            $scope.password = 'password';


            $scope.login = function() {

                usersDALService.login.login({}, { email: $scope.email, password: $scope.password })
                    .$promise
                    .then(function(result) {
                        
                        viewService.session = result;
                        return $state.go('main.lobby');

                    })
                    .catch(function(error) { 

                        $scope.error = error.data || error;

                    });
                

            };



        }  // outer function

    ]);

}) (angular.module('codenames.app'));


