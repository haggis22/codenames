(function(app) { 
    
    "use strict";

    app.controller('codenames.lobby.lobbyCtrl', ['$scope', '$q', 'codenames.constants', 'codenames.users.dalService', 'codenames.viewService',

        function ($scope, $q, 
                    constants, usersDALService, viewService) {

            $scope.viewService = viewService;



        }  // outer function

    ]);

}) (angular.module('codenames.app'));


