﻿"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db.codenames);

var q = require('q');


var BoardManager = require(__dirname + '/BoardManager');
var GameInvitationManager = require(__dirname + '/GameInvitationManager');
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


class CPU
{
    constructor()
    {
//        this._id = "CPU";
    }

}

var userCPU = new CPU();


class GameManager
{

    // returns a promise to an array of modules
    static fetch(query) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.find(query, {}, function (err, result) {

            if (err) {
                logger.error('Could not load games from database: ' + err);
                return deferred.reject(err);
            }

            // turn the array of results to an array of Games
            return deferred.resolve({ data: result.map(function(row) { return new Game(row); }) });

        });

        return deferred.promise;

    }   // fetch


    // returns a promise to an array of game descriptions
    static fetchGamesForUser(user) {

        var query = 
        { 
            $or:
            [   
                { players: { $elemMatch: { _id: user._id } } },
                { invitations: { $in: [ user.username ] } }
            ]

        };

        return GameManager.fetch(query)
            
            .then(function(result) {

                // turn the array of results to an array of GameDesc objects
                // return { data: result.data.map(game => new GameDesc(game)) };
                return { data: result.data };

            });

    }   // fetchGamesForUser

    
    // returns a promise to a particuluar game
    static fetchGame(user, gameID) {

        var query = 
        { 
            _id: gameID,
        };

        if (!(user instanceof CPU))
        {
            query['$or'] = 
                [   
                    { players: { $elemMatch: { _id: user._id } } },
                    { invitations: { $in: [ user.username ] } }
                ];
        };

        return GameManager.fetch(query)

            .then(function(gameArray) {

                if (gameArray.error)
                {
                    return gameArray;
                }

                if (gameArray.data.length == 0)
                {
                    return { error: 'Could not find game' };
                }

                if (gameArray.data.length > 1)
                {
                    return { error: 'Matched more than one game' };
                }

                var result = { data: new Game(gameArray.data[0]) };

                return GameManager.checkForCPUAction(result);

            });
        

    }   // fetchGame


    static insert(game) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.insert(game, function (err, doc) {

            if (err) {
                logger.error('Could not insert game into database ' + err);
                return deferred.reject(err);
            }

            return deferred.resolve(new Game(doc));

        });

        return deferred.promise;

    }


    static create(user) {

        logger.info("Create game");

        var game = new Game();
        
        game.created = new Date();

        game.ownerID = user._id;

        // this will create a new player
        game.addPlayer(Player.fromUser(user));

        game.state = Game.STATES.SETUP;

        return GameManager.insert(game)

            .then(function(newGame) { 

                return { data: newGame };

            });
            

    }


    static update(user, game) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.update({ _id: game._id }, game, function (err, doc) {

            if (err) {
                logger.error('Could not update game in the database ' + err);
                return deferred.reject(err);
            }

            return deferred.resolve(GameManager.fetchGame(user, game._id));

        });

        return deferred.promise;

    }


    static validateCommand(command)
    {
        // we must check that cellID is not null specifically, since it could be 0, and that is falsey
        return command && command.gameID;

        // we will need to check various
    }


    static applyCommand(user, command) {

        if (user == null)
        {
            return q.resolve({ error: 'No user in session' });
        }

        if (!GameManager.validateCommand(command))
        {
            return q.resolve({ error: 'Invalid command' });
        }

        return GameManager.fetchGame(user, command.gameID)
            
            .then(function(result) {

                var game = result.data;
                logger.info('Fetched game');

                switch (command.action)
                {
                    case Command.actions.INVITE:
                        return GameManager.invite(user, game, command.username);

                    case Command.actions.ACCEPT:
                        return GameManager.accept(user, game);

                    case Command.actions.APPLY:
                        return GameManager.apply(user, game, command.team, command.role);

                    case Command.actions.START:
                        return GameManager.startGame(user, game);

                    case Command.actions.CLUE:
                        return GameManager.giveClue(user, game, command.word, command.numMatches);

                    case Command.actions.SELECT:
                        return GameManager.selectWord(user, game, command.word);

                    case Command.actions.PASS:
                        return GameManager.passTurn(user, game);

                
                }  // end switch


                // we shouldn't get here, but....
                return { data: game };

            });


    }   // applyCommand


    static invite(user, game, username) {

        return GameInvitationManager.invite(user, game, username)

            .then(function(result) {

                if (result.error)
                {
                    return result;
                }

                // save the updated game
                return GameManager.update(user, result.data);
            
            });

    }   // invite


    static accept(user, game) {

        return GameInvitationManager.accept(user, game)

            .then(function(result) {

                if (result.error)
                {
                    return result;
                }

                // save the updated game
                return GameManager.update(user, result.data);
            
            });

    }   // accept


    static apply(user, game, team, role) {

        if (team != Team.RED && team != Team.BLUE)
        {
            return q.resolve({ error: 'Unknown team ' + team });
        }

        if (role != Team.ROLES.SPYMASTER && role != Team.ROLES.SPY)
        {
            return q.resolve({ error: 'Unknown role ' + role });
        }

        if (!game.isPlaying(user.username))
        {
            return q.resolve({ error: 'Player ' + user.username + ' is not in the game' });
        }

        // there can only be one spymaster, so make sure no-one else is already doing that
        if (role == Team.ROLES.SPYMASTER)
        {
            for (var player of game.players)
            {
                if (player.team == team && player.role == role && !player.isUser(user._id))
                {
                    return q.resolve({ error: 'Player ' + player.username + ' is already the spymaster for that team' });
                }
            }

        }

        for (var player of game.players)
        {
            if (player.isUser(user._id))
            {
                // found the player, update his role
                player.team = team;
                player.role = role;
            }
        }

        // save the updated game
        return GameManager.update(user, game);
            
    }   // apply


    static startGame(user, game) {

        if (!game.isSettingUp())
        {
            return q.resolve({ error: 'Game is not in setup phase' });
        }

        if (!game.isOwner(user._id))
        {
            return q.resolve({ error: 'Only the game owner can start it' });
        }

        game.state = Game.STATES.PLAY;

        // rescind any invitations once the game has started
        game.invitations = [];

        // now create the game board...
        game.board = BoardManager.generate();

        // ...and set the first team's turn
        game.turn = new Turn({ team: game.board.first, action: Action.CLUE });

        return GameManager.update(user, game)

            .then(GameManager.checkForCPUAction);
            

    }   // startGame

    static endGame(user, game) {

    }


    static giveClue(user, game, word, numMatches) { 

        if (!(user instanceof CPU) && !game.isMyTurn(user._id, Action.CLUE))
        {
            return q.resolve({ error: 'It is not your turn' });
        }

        if (word == null || word.trim().length == 0)
        {
            return q.resolve({ error: 'Clue cannot be blank' });
        }

        var numWords = parseInt(numMatches);
        if (isNaN(numWords) || numWords < 1 || numWords > 9)
        {
            return q.resolve({ error: 'Number of matching words must be a numeric value between 1 and 9' });
        }

        game.moves.push(new Move({ team: game.turn.team, playerID: user._id, action: Action.CLUE, word: word, numMatches: numMatches }));

        // switch from clues to guessing
        game.turn.action = Action.GUESS;
        
        // you always get one more guess than the number of matches stated
        game.turn.numGuesses = parseInt(numMatches, 10) + 1;

        return GameManager.update(user, game)

            .then(GameManager.checkForCPUAction);


    }  // giveClue

    
    static selectWord(user, game, word) {

        if (!(user instanceof CPU) && !game.isMyTurn(user._id, Action.GUESS))
        {
            return q.resolve({ error: 'It is not your turn' });
        }

        if (word == null || word.trim().length == 0)
        {
            return q.resolve({ error: 'Chosen word cannot be blank' });
        }

        var selectedCell = null;

        for (var cell of game.board.cells)
        {
            if (cell.word == word && !cell.revealed)
            {
                selectedCell = cell;
            }
        }

        if (!selectedCell)
        {
            return q.resolve({ error: word.toUpperCase() + ' is not on the board' });
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
                
                if (game.board.remaining[myTeam] == 0)
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

                if (game.board.remaining[otherTeam] == 0)
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
            game.state = Game.STATES.COMPLETE;
        }
        else if (switchTeams)
        {
            // switch teams & from guessing to clues
            game.turn.action = Action.CLUE;
            delete game.turn.numGuesses;
            game.turn.team = Team.findOpponent(game.turn.team);
        }

        return GameManager.update(user, game)

            .then(GameManager.checkForCPUAction);


    }   // selectCell


    static passTurn(user, game) {

        if (!(user instanceof CPU) && !game.isMyTurn(user._id, Action.GUESS))
        {
            return q.resolve({ error: 'It is not your turn' });
        }

        game.moves.push(new Move({ team: game.turn.team, playerID: user._id, action: Action.PASS }));

        // switch teams & from guessing to clues
        game.turn.action = Action.CLUE;
        delete game.turn.numGuesses;
        game.turn.team = Team.findOpponent(game.turn.team);

        return GameManager.update(user, game)

            .then(GameManager.checkForCPUAction);

    }   // passTurn


    static isCPUTurn(game) {

        if (!game)
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

    static checkMapForWord(map, word) {

        if (!map || !word)
        {
            return false;
        }

        for (var clue in map)
        {
            if (map.hasOwnProperty(clue) && clue.toUpperCase().indexOf(word.toUpperCase()) > -1)
            {
                return true;
            }

        }   // for each clue in the words so far

        return false;

    }   // checkMapForWord
 

    static checkForCPUAction(result) {

        if (!GameManager.isCPUTurn(result.data)) {

            return result;
        
        }
        
        var game = result.data;
        var availableCells = null;
        var selectionIndex = null;

        if (game.isTimeToClue())
        {
            // find one of the computer's words and use that
            availableCells = game.board.cells.filter(cell => !cell.revealed && cell.role == game.turn.team);

            if (availableCells.length)
            {
                var word = null;

                // 50-50 chance of giving more than one clue
                if (availableCells.length > 1 && Math.random() < 0.5)
                {
                    var firstIndex = Math.floor(Math.random() * availableCells.length);
                    var secondIndex = firstIndex;

                    while (secondIndex == firstIndex)
                    {
                        secondIndex = Math.floor(Math.random() * availableCells.length);
                    }

                    word = availableCells[firstIndex].word + availableCells[secondIndex].word;

                }
                else
                {
                    // for now, give one of the words at random
                    selectionIndex = Math.floor(Math.random() * availableCells.length);

                    word = availableCells[selectionIndex].word;
                }

                return GameManager.giveClue(userCPU, game, word, 1);
            }

        }
        else if (game.isTimeToGuess())
        {

            var givenClues = {};

            // track all the clues that the CPU's team has been given
            for (var move of game.moves)
            {
                if (move.action == Action.CLUE && move.team == game.turn.team)
                {
                    givenClues[move.word.toUpperCase()] = true;
                }

            }

            // find one of the computer's words and use that
            var availableCells = game.board.cells.filter(cell => !cell.revealed && GameManager.checkMapForWord(givenClues, cell.word));
             
            if (availableCells.length)
            {
                // for now, give one of the words at random
                selectionIndex = Math.floor(Math.random() * availableCells.length);

                return GameManager.selectWord(userCPU, game, availableCells[selectionIndex].word);
            
            }
            else
            {
                return GameManager.passTurn(userCPU, game);
            }

        }

        // the game is not active, so it's definitely not the CPU's turn
        return result;



    }  // checkForCPUAction


}  // end class declaration


module.exports = GameManager;


