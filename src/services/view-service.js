(function (app) {

    "use strict";

    app.factory('codenames.viewService', [ 'codenames.Constants',

        function (constants) {

            return {

                options: loadOptions(),
                saveOptions: saveOptions

            };

            function loadOptions() {

                // it's stored as a string, so convert it back to JavaScript object
                var options = JSON.parse(localStorage.getItem(constants.STORAGE_KEY));

                if (options == null) {

                    options =
                    {   
                        zoom: 1.0,
                        showWords: false
                    };

                }  // options were not already saved

                return options;

            }

            function saveOptions() {

                // we need to stringify the JSON or it will just store "[Object object]"
                localStorage.setItem(constants.STORAGE_KEY, JSON.stringify(this.options));

            }


        }  // outer function

    ]);

})(angular.module('codenames.app'));


