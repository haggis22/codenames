(function(isNode, isAngular) {

    "use strict";

    var CommandModule = function() {

        class Command {

            constructor(command) {

                if (command)
                {
                    this.gameID = command.gameID;
                    this.action = command.action;
                    this.cellID = command.cellID;
                }

            }  // constructor

            isValid() {

            }


        }  // end class declaration

        Command.actions =
        {
            START: 'start',
            WORD: 'word',
            SELECT: 'SELECT'
        };



        return Command;

    };   // CommandModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Command', [ CommandModule ]);
    }
    else if (isNode)
    {
        module.exports = CommandModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
