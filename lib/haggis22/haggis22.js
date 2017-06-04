"use strict";

angular.module('haggis22', []);


(function (mod) {

    "use strict";

    mod.directive('h22AjaxMessage', function () {
        return {
            // we want to create an isolate scope so that we can have multiple instances of this directive on a page
            scope: {},
            restrict: 'E',
            replace: true,
            template:'<div class="angular-loading-div-outer" title="{{ message }}..."><div class="angular-loading-div-inner"><img src="/images/ajax-loader-small.gif" alt="Loading..." height="16" width="16" style="vertical-align: middle;"> <span class="loading-message">{{ message }}...</span></div></div>',
            link: function (scope, element, attributes) {

                attributes.$observe('message', function (value) {
                    scope.message = value;
                });

                // scope.message = attributes.message;

            }
        }
    });


})(angular.module('haggis22'));



(function (mod) {

    "use strict";

    mod.directive('h22EnterAction', [ function () {
        return function (scope, element, attrs) {

            element.bind("keydown keypress", function (event) {
                
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.h22EnterAction);
                    });

                    event.preventDefault();
                }
            });
        };
        
    }]);

})(angular.module('haggis22'));



(function (mod) {

    "use strict";

    mod.directive('h22EscapeAction', ['$document',
        function ($document) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    $document.bind("keydown keypress", function (event) {

                        if (event.which === 27) {
                            scope.$apply(function () {
                                scope.$eval(attrs.h22EscapeAction);
                            });

                            event.preventDefault();
                        }
                    });

                }  // link
            };
        }  // 
    ]);

})(angular.module('haggis22'));



(function (mod) {

    "use strict";

    mod.directive('h22FocusMe', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.h22FocusMe, function (value) {
                    if (value) {
                        // the timeout will give any container time to appear
                        $timeout(function () {
                            element[0].focus();
                        }, 10);
                    }
                });
            }
        };

    } ]);


})(angular.module('haggis22'));



(function (mod) {

    "use strict";

    mod.directive('h22ErrorMessage', ['h22.errorService',

        function (errorService) {

            return {

                restrict: 'E',
                replace: true,
                template:'<div ng-show="errorService.error" class="popup error-popup" h22-escape-action="errorService.clearError()"><div class="error">{{ errorService.error.header }}</div><div style="font-size: 0.9em; margin-top: 10px;"><div ng-show="errorService.error.httpStatusCode != null"><span style="display: inline-block; width: 100px; font-weight: bold;">HTTP Code:</span>{{ errorService.error.httpStatusCode }}</div><div ng-show="errorService.error.responseCode != null"><span style="display: inline-block; width: 100px; font-weight: bold;">Error Code:</span>{{ errorService.error.responseCode }} <span ng-show="errorService.error.errorCodeText">({{ errorService.error.errorCodeText }})</span></div></div><div class="error-details" style="margin-top:"><div ng-repeat="message in errorService.error.errors">{{ message }}</div><div ng-show="!errorService.error.errors || errorService.error.errors.length == 0">No details available.</div></div><div class="buttons"><button type="button" ng-click="close()" h22-focus-me="errorService.error">OK</button></div></div>',

                link: function ($scope, $element, $attributes) {

                    $scope.errorService = errorService;

                    $element.draggable();

                    $scope.close = function () {

                        errorService.clearError();

                    };

                }

            };

        }

     ]);


})(angular.module('haggis22'));



(function (mod) {

    "use strict";

    mod.factory('h22.errorService', [

        function () {

            var NO_CONNECTION = -1;

            return {

                error: null,
                hasErrors: hasErrors,
                addError: addError,
                clearError: clearError

            };

            function addError(header, error) {

                this.error = parse(header, error);

            }

            function clearError() {
                this.error = null;
            }

            function hasErrors() {
                this.error != null;
            }

            function parse(header, error) {

                var parsedError = { header: header, errors: [] };

                if (error) {

                    if (error.data) {
                        parsedError.errors.push(error.data);
                    }
                    else if (error.status === NO_CONNECTION) {
                        parsedError.errors.push("Could not connect");
                    }
                    else {
                        // parsedError.errors.push(error);
                        parsedError.errors.push("Unknown error");
                    }

                }
                else {
                    parsedError.errors.push("Unknown error");
                }

                // we wrap this in an outer error object so that it gets passed in the event args
                return parsedError;

            }


        }

     ]);


})(angular.module('haggis22'));


