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


        }  // end class declaration

        Command.actions =
        {
            INVITE: 'invite',       // invite another play to join the game
            ACCEPT: 'accept',       // accept an invitation to join a game
            APPLY: 'apply',         // apply for a role in the game (Spymaster or spy, and picking a team)
            START: 'start',         // start the game
            CLUE: 'clue',           // try to give a clue
            SELECT: 'select',       // select a word, based on a clue
            PASS: 'pass'            // pass your turn
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
