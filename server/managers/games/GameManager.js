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
var Game = require(__dirname + '/../../../js/games/game');

var COLLECTION_NAME = 'games';


class GameManager
{

    // returns a promise to an array of modules
    static fetch() {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.find({}, {}, function (err, result) {

            if (err) {
                logger.error('Could not load games from database: ' + err);
                return deferred.reject(err);
            }

            // turn the array of results to an array of Games
            return deferred.resolve({ data: result.map(function(row) { return new Game(row); }) });

        });

        return deferred.promise;

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


    static create() {

        logger.info("Create game");

        var game = new Game();
        game.board = BoardManager.generate();

        // set the first team's turn
        game.turn = game.board.first;
        game.state = Game.STATE_SETUP;


        return this.insert(game)

            .then(function(newGame) { 

                return { data: newGame };

            });
            

    }



}  // end class declaration


module.exports = GameManager;


