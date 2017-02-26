(function(isNode, isAngular) {

    "use strict";

    var ActionModule = function() {

        class Action {

        }  // end class declaration


        Action.CLUE = 'clue';
        Action.GUESS = 'guess';
        Action.PASS = 'pass';

        return Action;

    };   // ActionModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Action', [ ActionModule ]);

    }
    else if (isNode)
    {
        module.exports = ActionModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
