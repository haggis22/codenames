(function (app) {

    "use strict";

    app.directive('enterAction', [ function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.enterAction);
                    });

                    event.preventDefault();
                }
            });
        };
        
    }]);

})(angular.module('codenames.app'));


