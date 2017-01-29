(function (app) {

    "use strict";

    app.directive('focusMe', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focusMe, function (value) {
                    if (value === true) {
                        // the timeout will give any container time to appear
                        $timeout(function () {
                            element[0].focus();
                        }, 200);
                    }
                });
            }
        };

    } ]);


})(angular.module('codenames.app'));


