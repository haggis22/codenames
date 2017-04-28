/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var mongo = require('mongodb');
var monk = require('monk');

var db = monk(config.db.codenames);

var q = require('q');


var Game = require(__dirname + '/../../../js/games/Game');

var COLLECTION_NAME = 'games';


class MongoGameRepository
{

    // returns a promise to an array of modules
    fetch(query) {

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
    fetchGamesForUser(user) {

        var query = 
        { 
            $or:
            [   
                { players: { $elemMatch: { _id: user._id } } },
                { invitations: { $in: [ user.username ] } }
            ]

        };

        return this.fetch(query)
            
            .then(function(result) {

                return { data: result.data };

            });

    }   // fetchGamesForUser

    
    fetchGamesWaitingForCPU() {

        var query = 
        { 
            needsCPUAction: true
        };

        return this.fetch(query)
            
            .then(function(result) {

                return { data: result.data };

            });

    }

    fetchStuckGames() {

        // pull anything that:
        // 1. has been in thinking mode for at least a minute
        // 2. OR is in an error status
        let query = 
        {
            $or:
                [   
                    { 
                        needsCPUAction: false,
                        state: Game.STATES.THINKING,
                        updated: { $lte: Date.now() - (1000 * 60) }        
                    },
                    { 
                        needsCPUAction: false,
                        state: Game.STATES.THINKING_ERROR
                    }
                ]
        }

        if (logger.isDebugEnabled) { logger.debug("Running query " + JSON.stringify(query)); }

        return this.fetch(query)
            
            .then(function(result) {

                if (logger.isDebugEnabled) {

                    if (Array.isArray(result.data)) {
                        logger.debug("Found " + result.data.length + " stuck game(s)");
                    }
                    else {
                        logger.debug("Did not find any stuck games");
                    }

                }

                return { data: result.data };

            });

    }

    
    // returns a promise to a particuluar game
    fetchGame(gameID, user) {

        var query = 
        { 
            _id: gameID,
        };

        // if we are pulling games for a specific user, then make sure they are a member of that game
        if (user)
        {
            // if it is not the computer loading the game, then make sure the player is either:
            // 1. playing 
            // 2. or has been invited to play
            query.$or = 
                [   
                    { players: { $elemMatch: { _id: user._id } } },
                    { invitations: { $in: [ user.username ] } }
                ];
        }

        return this.fetch(query)

            .then(function(gameArray) {

                if (gameArray.error)
                {
                    return gameArray;
                }

                if (gameArray.data.length === 0)
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




    insert(game) {

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


    update(game) {

        var deferred = q.defer();

        var collection = db.get(COLLECTION_NAME);

        collection.update({ _id: game._id }, game, function (err, doc) {

            if (err) {
                logger.error('Could not update game in the database ' + err);
                return deferred.reject(err);
            }

            return deferred.resolve(game._id);

        });

        return deferred.promise;

    }


}  // end class declaration


module.exports = MongoGameRepository;


