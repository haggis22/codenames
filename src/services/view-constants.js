(function (app) {

    "use strict";

    app.constant('codenames.viewConstants', (function() {

        let constants = 
                {
                    TABS:
                    {
                        SETUP:
                        {
                            ROLES: 'roles',
                            INVITE: 'invite',
                            INVITEES: 'invitees'
                        },
                        LOBBY:
                        {
                            SETUP: 'setup',
                            ACTIVE: 'active',
                            FINISHED: 'finished'
                        }

                    }

                };

        return constants;

    })()  // outer function

    );

})(angular.module('codenames.app'));


