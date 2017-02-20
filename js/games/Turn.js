(function(isNode, isAngular) {

    "use strict";

    var TurnModule = function() {

        class Turn {

            constructor(turn) {
                
                if (turn)
                {
                    this.team = turn.team;
                    this.action = turn.action;
                }

            }

        }  // end class declaration


        Turn.ACTIONS =
        {
            CLUE: 'clue',
            GUESS: 'guess'
        };

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
