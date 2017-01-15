(function(app) { 
    
    "use strict";

    app.controller('TestCtrl', ['$scope', '$q', 'codenames.constants',

        function ($scope, $q, constants) {

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



        }  // outer function

    ]);

}) (angular.module('codenames.App'));


