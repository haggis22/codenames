(function(isNode, isAngular) {

    "use strict";

    var TurnModule = function() {

        class Turn {

            constructor(turn) {
                
                if (turn)
                {
                    this.team = turn.team;
                    this.action = turn.action;
                    this.numGuesses = turn.numGuesses;
                }

            }

        }  // end class declaration

        return Turn;

    };   // TurnModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Turn', [ TurnModule ]);

    }
    else if (isNode)
    {
        module.exports = TurnModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
