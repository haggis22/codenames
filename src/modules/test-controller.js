(function(app) { 
    
    "use strict";

    app.controller('TestCtrl', ['$scope', '$q', 'codenames.constants', 'codenames.users.dalService',

        function ($scope, $q, constants, usersDALService) {

            bio()
                .then(function( [ name, age, eyes ]) {

                    $scope.name = name;
                    $scope.age = age;
                    $scope.eyes = eyes;


                });




            function bio()
            {
                return $q.when([ 'Daniel Alexander', 45, 'blue' ]);
            }

            $scope.login = function() {

                usersDALService.login.login({}, { email: $scope.email, password: $scope.password })
                    .$promise
                    .then(function(result) {
                        
                        $scope.result = result;
                    })
                    .catch(function(error) { 
                        $scope.error = error;
                        console.error(error);
                    });
                

            };



        }  // outer function

    ]);

}) (angular.module('codenames.app'));


