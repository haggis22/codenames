/*jslint node: true */
"use strict";

var config = require(__dirname + '/config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var q = require('q');

var GameManager = require(__dirname + '/managers/games/GameManager');


function pullCPUGames()
{
    return GameManager.fetchGamesWaitingForCPU()

        .then(function (result) {

            if (result.data)
            {
                logger.info("Found " + result.data.length + " games ready for CPU action");

                let promiseArray = result.data.map(game => GameManager.checkForCPUAction({ data: game }));

                return q.all(promiseArray)
                
                    .then(function() { 
                    
                        logger.info('Finished running ' + promiseArray.length + ' game(s)');

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
    return GameManager.fetchStuckGames()

        .then(function (result) {

            if (result.data)
            {
                logger.info("Found " + result.data.length + " stuck games");

                let promiseArray = result.data.map(game => GameManager.unstick({ data: game }));

                return q.all(promiseArray)
                
                    .then(function() { 
                    
                        logger.info('Finished unsticking ' + promiseArray.length + ' game(s)');

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
    
