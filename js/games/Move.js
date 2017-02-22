(function(isNode, isAngular) {

    "use strict";

    var MoveModule = function() {

        class Move {

            constructor(move) {
                
                if (move)
                {
                    this.team = move.team;
                    this.playerID = move.playerID;
                    this.action = move.action;
                    this.word = move.word;
                    this.numMatches = move.numMatches;
                    this.result = move.result;
                }

            }

        }  // end class declaration

        return Move;

    };   // MoveModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Move', [ MoveModule ]);

    }
    else if (isNode)
    {
        module.exports = MoveModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
