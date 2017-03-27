/*jslint node: true */
"use strict";

var config = require(__dirname + '/config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var q = require('q');

var MongoGameRepository = require(__dirname + '/persistence/mongo/MongoGameRepository');
var GameManager = require(__dirname + '/managers/games/GameManager');


function pullCPUGames()
{
    let repo = new MongoGameRepository();
    let manager = new GameManager(repo);

    return repo.fetchGamesWaitingForCPU()

        .then(function (result) {

            if (result.data)
            {
                if (result.data.length)
                {
                    logger.info("Found " + result.data.length + " games ready for CPU action");
                }

                let promiseArray = result.data.map(game => manager.checkForCPUAction({ data: game }));

                return q.all(promiseArray)
                
                    .then(function() { 
                    
                        if (promiseArray.length)
                        {
                            logger.info('Finished running ' + promiseArray.length + ' game(s)');
                        }

                    });

            }
            else
            {
                logger.error("result.error in fetchGamesWaitingForCPU: " + result.error);
            }

        })
        .catch(function(error) {

            logger.error("Error in fetchGamesWaitingForCPU: " + error);

        });

}

function pullStuckCPUGames()
{
    let repo = new MongoGameRepository();
    let manager = new GameManager(repo);

    return repo.fetchStuckGames()

        .then(function (result) {

            if (result.data)
            {
                if (result.data.length)
                {
                    logger.info("Found " + result.data.length + " stuck games");
                }

                let promiseArray = result.data.map(game => manager.unstick({ data: game }));

                return q.all(promiseArray)
                
                    .then(function() { 
                    
                        if (promiseArray.length)
                        {
                            logger.info('Finished unsticking ' + promiseArray.length + ' game(s)');
                        }

                    });

            }
            else
            {
                logger.error("result.error in pullStuckCPUGames: " + result.error);
            }

        })
        .catch(function(error) {

            logger.error("Error in pullStuckCPUGames: " + error);

        });


}

setInterval(pullCPUGames, 1000);
setInterval(pullStuckCPUGames, 1000);
    
