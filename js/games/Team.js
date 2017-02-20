(function(isNode, isAngular) {

    "use strict";

    var TeamModule = function() {

        class Team {

            constructor() {

            }

        }  // end class declaration

        Team.RED = 'red';
        Team.BLUE = 'blue';

        Team.ROLES =
        {
            SPYMASTER: 'spymaster',
            SPY: 'spy'
        };

        return Team;

    };   // TeamModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Team', [ TeamModule ]);

    }
    else if (isNode)
    {
        module.exports = TeamModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
