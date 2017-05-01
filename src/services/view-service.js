(function (app) {

    "use strict";

    app.factory('codenames.viewService', ['codenames.Constants', 'codenames.viewConstants',

        function (constants, viewConstants) {

            return {

                options: loadOptions(),
                saveOptions: saveOptions,

                tabs:
                {
                    setup: viewConstants.TABS.SETUP.ROLES,
                    lobby: null
                }

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
                localStorage.setItem(constants.STORAGE_KEY, JSON.stringify(this.options));      // <-- JSLint doesn't like the this. here in strict mode, but it works just fine

            }


        }  // outer function

    ]);

})(angular.module('codenames.app'));


