(function(app) { 
    
    "use strict";

    app.controller('codenames.mainCtrl', ['$scope', 'codenames.viewService',

        function ($scope, viewService) {

            $scope.viewService = viewService;

        }  // outer function

    ]);

}) (angular.module('codenames.app'));


