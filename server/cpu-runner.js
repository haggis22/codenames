/*jslint node: true */
"use strict";

var config = require(__dirname + '/config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var q = require('q');

var Game = require(__dirname + '/../js/games/Game');
var Action = require(__dirname + '/../js/games/Action');

var CPU = require(__dirname + '/../js/users/CPU');

var MongoGameRepository = require(__dirname + '/persistence/mongo/MongoGameRepository');
var GameManager = require(__dirname + '/managers/games/GameManager');

var ClueManager = require(__dirname + '/managers/games/ClueManager');



var userCPU = new CPU();


class CPURunner
{
    constructor(gameManager, gameRepo)
    {
        this.gameManager = gameManager;
        this.gameRepo = gameRepo;
    }

    run() {

        setInterval(this.pullCPUGames.bind(this), 1000);
        setInterval(this.pullStuckCPUGames.bind(this), 1000);

    }


    pullCPUGames()
    {

        return this.gameRepo.fetchGamesWaitingForCPU()

            .then((function (result) {

                if (result.data)
                {
                    if (result.data.length)
                    {
                        logger.info("Found " + result.data.length + " games ready for CPU action");
                    }

                    let promiseArray = result.data.map(game => this.checkForCPUAction(game));

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

            }).bind(this))
            .catch(function(error) {

                logger.error("Error in fetchGamesWaitingForCPU: " + error);

            });

    }

    pullStuckCPUGames()
    {
        return this.gameRepo.fetchStuckGames()

            .then((function (result) {

                if (result.data)
                {
                    if (result.data.length)
                    {
                        logger.info("Found " + result.data.length + " stuck games");
                    }

                    let promiseArray = result.data.map(game => this.unstick({ data: game }));

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

            }).bind(this))
            .catch(function(error) {

                logger.error("Error in pullStuckCPUGames: " + error);

            });


    }

    checkForCPUAction(game) {

        // if we don't have a game, then there's nothing to do
        if (!game)
        {
            return q(game);
        }

        if (!this.gameManager.needsCPUAction(game)) {

            return q({});
        
        }
        
        if (game.isTimeToClue())
        {
            // kick off this action, but don't return. We want the computer to go off and do its thing, but
            // show the client the immediate result of the action
            return this.computerGiveClue(game);

        }
        else if (game.isTimeToGuess())
        {
            // kick off this action, but don't return. We want the computer to go off and do its thing, but
            // show the client the immediate result of the action
            return this.computerGuess(game);
        }

        // give the client the current state - if there is a CPU action they will get it on the next poll
        return q(game);

    }  // checkForCPUAction


    computerGiveClue(game)
    {
        // put it into thinking mode so another thread can't kick off a clue generation
        game.state = Game.STATES.THINKING;

        return this.gameManager.update(userCPU, game)

            .then((function(result) {

                if (!result.data)
                {
                    // we somehow didn't get a game object back from the update, so dump out
                    return result;
                }

                let thinkGame = result.data;

                // find one of the computer's words and use that
                let availableWords = thinkGame.board.cells.filter(cell => !cell.revealed && cell.role == thinkGame.turn.team).map(c => c.word);

                if (availableWords.length)
                {
                    // look for all our previous clues and convert that array to an array of words. We don't want to give any of those words again.
                    // Use a map for O(1) lookup
                    let previousCluesMap = {};

                    for (let previousClue of thinkGame.moves.filter(m => m.action == Action.CLUE && m.team == thinkGame.turn.team))
                    {
                        previousCluesMap[previousClue.word] = true;
                    }

                    return ClueManager.thinkOfClue(availableWords, previousCluesMap)
                    
                        .then((function(bestMatch) {

                            if (bestMatch.clue)
                            {
                                return this.gameManager.giveClue(userCPU, thinkGame, bestMatch.clue, bestMatch.words.length);
                            }
                            else
                            {
                                let selectedIndex = Math.floor(Math.random() * availableWords.length);

                                return this.gameManager.giveClue(userCPU, thinkGame, availableWords[selectedIndex], 1);
                            }

                        }).bind(this));

                }   // if they have any words

            }).bind(this));

    }

    computerGuess(game) {

        // the computer never makes an extra guess, so when it's down to 1 guess left, it's time to pass
        if (game.turn.numGuesses === 1)
        {
            return this.gameManager.passTurn(userCPU, game);
        }

        game.state = Game.STATES.THINKING;

        return this.gameManager.update(userCPU, game)

            .then((function(result) {

                if (!result.data)
                {
                    // we somehow didn't get a game object back from the update, so dump out
                    return result;
                }

                let thinkGame = result.data;

                // find the most recent clue for the CPU's team
                var ourClues = thinkGame.moves.filter(m => m.action == Action.CLUE && m.team == thinkGame.turn.team);

                var lastClue = ourClues[ourClues.length - 1];

                // look at all the unrevealed words and find the best match
                // Convert the cells to an array of lower-case words (so that we can easily compare them later)
                let availableWords = thinkGame.board.cells.filter(cell => !cell.revealed).map(c => c.word);

                if (availableWords.length)
                {
                    return ClueManager.guessWord(availableWords, lastClue.word)
                        .then((function(bestGuess) {

                            if (bestGuess != null)
                            {
                                return this.gameManager.selectWord(userCPU, thinkGame, bestGuess);
                            }
                            else
                            {
                                // otherwise, give one of the words at random
                                let selectionIndex = Math.floor(Math.random() * availableWords.length);
                                return this.gameManager.selectWord(userCPU, thinkGame, availableWords[selectionIndex]);
                            }

                        }).bind(this));

                }
                else
                {
                    return this.gameManager.passTurn(userCPU, thinkGame);
                }

            }).bind(this));     // THINKING update.then


    }




    unstick(result) {

        // if we don't have a game, then there's nothing to do
        if (!result.data)
        {
            return q(result);
        }

        let game = result.data;

        game.state = Game.STATES.PLAY;

        return this.gameManager.update(userCPU, game);

    }  // unstick

}  // class declaration

let gameRepo = new MongoGameRepository();
let gameManager = new GameManager(gameRepo);
let runner = new CPURunner(gameManager, gameRepo);

runner.run();


    
