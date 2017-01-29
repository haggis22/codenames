(function (app) {

    "use strict";

    app.factory('codenames.errorParser', [

        function () {

            return {

                parse: parse

            };

            function parse(header, error) {

                var parsedError = { display: true, header: header, errors: [] };

                if (error) {

                    parsedError.errors.push(error.data || error);

                }
                else {
                    parsedError.errors.push("Unknown error");
                }

                // we wrap this in an outer error object so that it gets passed in the event args
                return { error: parsedError };

            }


        }  // outer function

    ]);

})(angular.module('codenames.app'));


