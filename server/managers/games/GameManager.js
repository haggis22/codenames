"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db);

var q = require('q');


var BoardManager = require(__dirname + '/BoardManager');
var Game = require(__dirname + '/../../../js/games/Game');
var GameDesc = require(__dirname + '/../../../js/games/GameDesc');
var Player = require(__dirname + '/../../../js/games/Player');

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
            players: 
            { 
                $elemMatch: 
                { 
                    _id: user._id
                }
            }
        };

        return GameManager.fetch(query);
            // turn the array of results to an array of GameDesc objects
            // return deferred.resolve({ data: result.map(function(row) { return new GameDesc(row); }) });

    }   // fetch

    
    // returns a promise to a particuluar game
    static fetchGame(user, gameID) {

        var query = 
        { 
            _id: gameID,

            players: 
            { 
                $elemMatch: 
                { 
                    _id: user._id
                }
            }
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
        

    }   // fetch


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

        // this will create a new player, identified as the owner of the game
        game.players.push(Player.fromUser(user, true));

        game.board = BoardManager.generate();

        // set the first team's turn
        game.turn = game.board.first;
        game.state = Game.STATE_SETUP;


        return this.insert(game)

            .then(function(newGame) { 

                return { data: newGame };

            });
            

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
            return { error: 'No user in session' };
        }

        if (!this.validateCommand(command))
        {
            return { error: 'Invalid command' };
        }

        return this.fetchGame(user, command.gameID)
            
            .then(function(result) {

                var game = result.data;
                logger.info('Fetched game');

                game.board.cells[command.cellID].revealed = true;

                return { data: game };

            });


    }   // applyCommand


}  // end class declaration


module.exports = GameManager;


