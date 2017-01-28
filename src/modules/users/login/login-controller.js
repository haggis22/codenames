﻿(function(app) { 
    
    "use strict";

    app.controller('codenames.users.loginCtrl', ['$scope', '$rootScope', '$state',
                                                    'codenames.constants', 'codenames.userService', 'codenames.viewService',

        function ($scope, $rootScope, $state,
                    constants, userService, viewService) {

            $scope.email = 'dshell@gmail.com';
            $scope.password = 'password';


            $scope.login = function() {

                userService.login($scope.email, $scope.password)
                    .then(function(result) {

                        console.log('Made it here');

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast('raise-error', { error: error.data || error });

                    });
                

            };



        }  // outer function

    ]);

}) (angular.module('codenames.app'));


