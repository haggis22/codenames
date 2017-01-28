(function (app) {

    "use strict";

    app.controller('codenames.mainCtrl', ['$scope', '$rootScope', '$state',
                                            'codenames.viewService',

        function ($scope, $rootScope, $state,
                    viewService) {

            $scope.viewService = viewService;


            //            $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not drop " + item.getName(true), result.message ) });




            $scope.$on('login', function (event, args) {

                return $state.go('main.lobby');

            });

            $scope.$on('raise-error', function (event, args) {

                console.error('Ooops: ' + args.error);

            });


        }  // outer function

    ]);

})(angular.module('codenames.app'));


