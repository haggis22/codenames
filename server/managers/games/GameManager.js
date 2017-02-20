"use strict";

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
var Player = require(__dirname + '/../../../js/games/Player');
var Command = require(__dirname + '/../../../js/games/Command');

var COLLECTION_NAME = 'games';


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
                return { data: result.data.map(game => new GameDesc(game)) };

            });

    }   // fetchGamesForUser

    
    // returns a promise to a particuluar game
    static fetchGame(user, gameID) {

        var query = 
        { 
            _id: gameID,

            $or:
            [   
                { players: { $elemMatch: { _id: user._id } } },
                { invitations: { $in: [ user.username ] } }
            ]
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

                return { data: new Game(gameArray.data[0]) };

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

        game.board = BoardManager.generate();

        // set the first team's turn
        game.turn = game.board.first;
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

                    case Command.actions.START:
                        return GameManager.startGame(user, game);

                    case Command.actions.WORD:
                        return GameManager.sayWord(user, game, command);

                    case Command.actions.SELECT:
                        return GameManager.selectCell(user, game, command);
                
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


    static startGame(user, game) {

        if (!game.isSettingUp())
        {
            return { error: 'Game is not in setup phase' };
        }

        if (!game.isOwner(user._id))
        {
            return { error: 'Only the game owner can start it' };
        }

        game.state = Game.STATES.PLAY;

        return GameManager.update(user, game);

    }   // startGame


    static sayWord(user, game, command) { 

        return { data: game };

    }  // sayWord

    static selectCell(user, game, command) {

        // TODO: verify it's your turn, yada yda
        game.board.cells[command.cellID].revealed = true;

        return GameManager.update(user, game);

    }   // selectCell

}  // end class declaration


module.exports = GameManager;


