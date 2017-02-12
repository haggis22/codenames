(function (app) {

    "use strict";

    app.directive('errorMessage', ['codenames.Constants',

        function (constants) {

            return {
                scope: {},
                // we want the error variable to be two-directional
                //                    error: '='
                //                },
                restrict: 'E',
                replace: true,
                templateUrl: '/directives/error-message/error-message.html?v=' + (new Date()).getTime(),

                link: function ($scope, $element, $attributes) {

                    $element.draggable();

                    $scope.close = function () {
                        $scope.error.display = false;
                    };

                    $scope.$on(constants.events.ERROR, function (event, args) {

                        $scope.error = args.error;

                    });

                }

            };

        }

     ]);


})(angular.module('codenames.app'));


