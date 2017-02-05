(function (app) {

    "use strict";

    app.directive('ajaxMessage', function () {
        return {
            // we want to create an isolate scope so that we can have multiple instances of this directive on a page
            scope: {},
            restrict: 'E',
            replace: true,
            templateUrl: '/directives/ajax-message/ajax-message.html?v=' + (new Date()).getTime(),

            link: function (scope, element, attributes) {

                attributes.$observe('message', function (value) {
                    scope.message = value;
                });

                // scope.message = attributes.message;

            }
        }
    });


})(angular.module('codenames.app'));


