/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var q = require('q');

var BoardManager = require(__dirname + '/BoardManager');
var GameInvitationManager = require(__dirname + '/GameInvitationManager');

var CPU = require(__dirname + '/../../../js/users/CPU');

var Game = require(__dirname + '/../../../js/games/Game');
var GameDesc = require(__dirname + '/../../../js/games/GameDesc');
var Cell = require(__dirname + '/../../../js/games/Cell');
var Player = require(__dirname + '/../../../js/games/Player');
var Team = require(__dirname + '/../../../js/games/Team');
var Action = require(__dirname + '/../../../js/games/Action');
var Turn = require(__dirname + '/../../../js/games/Turn');
var Move = require(__dirname + '/../../../js/games/Move');
var Command = require(__dirname + '/../../../js/games/Command');

var COLLECTION_NAME = 'games';


class GameManager
{

    constructor(repo) {
    
        this.repo = repo;

    } 


    /// repo is the object thst knows how to insert a game into the database (or wherever)
    create(user) {

        logger.info("Create game");

        var game = new Game();
        
        game.created = Date.now();

        game.ownerID = user._id;

        // this will create a new player
        game.addPlayer(Player.fromUser(user));

        game.state = Game.STATES.SETUP;
        game.updated = Date.now();

        return this.repo.insert(game)

            .then(function(newGame) { 

                return { data: newGame };

            });
            

    }


    update(user, game) {

        // set this field for easy querying later
        game.needsCPUAction = this.needsCPUAction(game);
        
        // mark the last time it was updated
        game.updated = Date.now();

        return this.repo.update(game)

            .then((function(gameID) {

                return this.repo.fetchGame(gameID, user instanceof CPU ? null : user);
                
            }).bind(this));                

    }


    validateCommand(command)
    {
        // we must check that cellID is not null specifically, since it could be 0, and that is falsey
        return command && command.gameID;

        // we will need to check various
    }


    applyCommand(user, command) {

        if (user == null)
        {
            return q({ error: 'No user in session' });
        }

        if (!this.validateCommand(command))
        {
            return q({ error: 'Invalid command' });
        }

        return this.repo.fetchGame(command.gameID, user)
            
            .then((function(result) {

                var game = result.data;
                // logger.info('Fetched game');

                switch (command.action)
                {
                    case Command.actions.INVITE:        // invite a username to join the game
                        return this.invite(user, game, command.username);

                    case Command.actions.ACCEPT:        // used to accept an invitation to join a game
                        return this.accept(user, game);

                    case Command.actions.APPLY:         // used then the user has requested to be either Spy or Spymaster - see if the position is available
                        return this.apply(user, game, command.team, command.role);

                    case Command.actions.START:         // try to start the game
                        return this.startGame(user, game);

                    case Command.actions.CLUE:          // try to give a clue
                        return this.giveClue(user, game, command.word, command.numMatches);

                    case Command.actions.SELECT:        // select a word from the board
                        return this.selectWord(user, game, command.word);

                    case Command.actions.PASS:          // pass your turn rather than select a word
                        return this.passTurn(user, game);

                
                }  // end switch


                // we shouldn't get here, but....
                return { data: game };

            }).bind(this));


    }   // applyCommand


    invite(user, game, username) {

        return GameInvitationManager.invite(user, game, username)

            .then(function(result) {

                if (result.error)
                {
                    return result;
                }

                // save the updated game
                return this.update(user, result.data);
            
            });

    }   // invite


    accept(user, game) {

        return GameInvitationManager.accept(user, game)

            .then(function(result) {

                if (result.error)
                {
                    return result;
                }

                // save the updated game
                return this.update(user, result.data);
            
            });

    }   // accept


    apply(user, game, team, role) {

        if (team != Team.RED && team != Team.BLUE)
        {
            return q({ error: 'Unknown team ' + team });
        }

        if (role != Team.ROLES.SPYMASTER && role != Team.ROLES.SPY)
        {
            return q({ error: 'Unknown role ' + role });
        }

        if (!game.isPlaying(user.username))
        {
            return q({ error: 'Player ' + user.username + ' is not in the game' });
        }

        // there can only be one spymaster, so make sure no-one else is already doing that
        if (role == Team.ROLES.SPYMASTER)
        {
            for (let player of game.players)
            {
                if (player.team == team && player.role == role && !player.isUser(user._id))
                {
                    return q({ error: 'Player ' + player.username + ' is already the spymaster for that team' });
                }
            }

        }

        for (let player of game.players)
        {
            if (player.isUser(user._id))
            {
                // found the player, update his role
                player.team = team;
                player.role = role;
            }
        }

        // save the updated game
        return this.update(user, game);
            
    }   // apply


    startGame(user, game) {

        if (!game.isSettingUp())
        {
            return q({ error: 'Game is not in setup phase' });
        }

        if (!game.isOwner(user._id))
        {
            return q({ error: 'Only the game owner can start it' });
        }

        game.state = Game.STATES.PLAY;

        // rescind any invitations once the game has started
        game.invitations = [];

        // now create the game board...
        game.board = BoardManager.generate();

        // ...and set the first team's turn
        game.turn = new Turn({ team: game.board.first, action: Action.CLUE });

        return this.update(user, game);

    }   // startGame


    giveClue(user, game, word, numMatches) { 

        if (!(user instanceof CPU) && !game.isMyTurn(user._id, Action.CLUE))
        {
            return q({ error: 'It is not your turn' });
        }

        if (word == null || word.trim().length === 0)
        {
            return q({ error: 'Clue cannot be blank' });
        }

        var numWords = parseInt(numMatches);
        if (isNaN(numWords) || numWords < 1 || numWords > 9)
        {
            return q({ error: 'Number of matching words must be a numeric value between 1 and 9' });
        }

        game.moves.push(new Move({ team: game.turn.team, playerID: user._id, action: Action.CLUE, word: word, numMatches: numMatches }));

        // switch from clues to guessing
        game.turn.action = Action.GUESS;

        if (game.isThinking())
        {
            // switch from thinking to playing
            game.state = Game.STATES.PLAY;
        }
        
        // you always get one more guess than the number of matches stated
        game.turn.numGuesses = parseInt(numMatches, 10) + 1;

        return this.update(user, game);

    }  // giveClue

    
    selectWord(user, game, word) {

        if (!(user instanceof CPU) && !game.isMyTurn(user._id, Action.GUESS))
        {
            return q({ error: 'It is not your turn' });
        }

        if (word == null || word.trim().length === 0)
        {
            return q({ error: 'Chosen word cannot be blank' });
        }

        var selectedCell = null;

        for (let cell of game.board.cells)
        {
            if (cell.word == word && !cell.revealed)
            {
                selectedCell = cell;
            }
        }

        if (!selectedCell)
        {
            return q({ error: word.toUpperCase() + ' is not on the board' });
        }

        selectedCell.revealed = true;
        
        var result = null;
        var winner = null;

        var switchTeams = false;

        var myTeam = game.turn.team;
        var otherTeam = Team.findOpponent(myTeam);

        var assassinated = false;


        switch (selectedCell.role)
        {
            case myTeam:

                // you found one of your own!
                result = 'Success';

                game.board.remaining[myTeam]--;
                
                if (game.board.remaining[myTeam] === 0)
                {
                    winner = myTeam;
                }

                game.turn.numGuesses--;
                switchTeams = game.turn.numGuesses < 1;
                break;

            case Cell.roles.BYSTANDER_1:
            case Cell.roles.BYSTANDER_2:
                // hit a bystander
                result = 'Hit a bystander';
                switchTeams = true;
                break;

            case Cell.roles.ASSASSIN:
                // found the assassin
                result = 'Found the assassin';
                winner = otherTeam;
                break;

            case otherTeam:
                // found one of your opponent's!
                result = 'Found the enemy';
               
                game.board.remaining[otherTeam]--;

                if (game.board.remaining[otherTeam] === 0)
                {
                    winner = otherTeam;
                }

                switchTeams = true;
                break;

            default:
                result = 'Unknown result';
                break;

        }   // switch cell role

        game.moves.push(new Move({ team: game.turn.team, playerID: user._id, action: Action.GUESS, word: word, result: result }));

        // check for end of game situations
        if (winner)
        {
            game.winner = winner;
            delete game.turn;

            // turn all the cards over
            this.flipCards(game);
            game.state = Game.STATES.COMPLETE;

        }
        else if (switchTeams)
        {
            // switch teams & from guessing to clues
            game.turn.action = Action.CLUE;
            delete game.turn.numGuesses;
            game.turn.team = Team.findOpponent(game.turn.team);
        }

        if (game.isThinking())
        {
            // switch from thinking to playing
            game.state = Game.STATES.PLAY;
        }

        return this.update(user, game);

    }   // selectCell


    passTurn(user, game) {

        if (!(user instanceof CPU) && !game.isMyTurn(user._id, Action.GUESS))
        {
            return q({ error: 'It is not your turn' });
        }

        game.moves.push(new Move({ team: game.turn.team, playerID: user._id, action: Action.PASS }));

        // switch teams & from guessing to clues
        game.turn.action = Action.CLUE;
        delete game.turn.numGuesses;
        game.turn.team = Team.findOpponent(game.turn.team);

        return this.update(user, game);

    }   // passTurn


    needsCPUAction(game) {

        if (!game)
        {
            return false;
        }

        if (game.isThinking())
        {
            return false;
        }

        if (game.isTimeToClue())
        {
            // find the Spymaster of the current team. If there is no player, then it's the computer's turn
            return !game.findSpymaster(game.turn.team);

        }
        else if (game.isTimeToGuess())
        {
            return game.findSpies(game.turn.team).length === 0;
        }


    }

    checkMapForWord(map, word) {

        if (!map || !word)
        {
            return false;
        }

        for (let clue in map)
        {
            if (map.hasOwnProperty(clue) && clue.toUpperCase().indexOf(word.toUpperCase()) > -1)
            {
                return true;
            }

        }   // for each clue in the words so far

        return false;

    }   // checkMapForWord
 
    flipCards(game) { 

        if (game)
        {
            for (let cell of game.board.cells)
            {
                // this sets a special value that indicates that it is only revealed because
                // the game is over. This differentiates it from the cards revealed during
                // the course of the game.
                cell.revealedAfter = true;
            }

        }

    }


}  // end class declaration


module.exports = GameManager;


