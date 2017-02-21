(function(isNode, isAngular) {

    "use strict";

    var CommandModule = function() {

        class Command {

            constructor(command) {

                if (command)
                {
                    this.gameID = command.gameID;
                    this.action = command.action;
                    this.word = command.word;
                    this.numMatches = command.numMatches;
                    this.username = command.username;
                    this.team = command.team;
                    this.role = command.role;
                }

            }  // constructor

            isValid() {

            }


        }  // end class declaration

        Command.actions =
        {
            INVITE: 'invite',
            ACCEPT: 'accept',
            APPLY: 'apply',
            START: 'start',
            CLUE: 'clue',
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
