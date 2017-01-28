(function(app) { 
    
    "use strict";

    app.controller('codenames.lobby.lobbyCtrl', ['$scope', '$q', 'codenames.viewService',

        function ($scope, $q, 
                    viewService) {

            $scope.viewService = viewService;



        }  // outer function

    ]);

}) (angular.module('codenames.app'));


