(function(isNode, isAngular) {

    "use strict";

    var CPUModule = function() {

        class CPU
        {
            constructor()
            {
            }

        }  // end class declaration

        return CPU;

    };  // CPUModule

    if (isAngular) 
    {
        angular.module('codenames.app')
            .factory('codenames.CPU', [ CPUModule ]);
    }
    else if (isNode)
    {
        module.exports = CPUModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');

