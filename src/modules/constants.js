(function (app) {

    "use strict";

    app.constant('codenames.constants',
        {
            events: 
            {
                SESSION_CHANGE: 'session-change',
                ERROR: 'raise-error'
            }

        });

})(angular.module('codenames.app'));



