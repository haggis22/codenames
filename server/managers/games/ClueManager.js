/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var request = require('request');
var q = require('q');


function lookupLink(wordArray, maxResults) {


	var deferred = q.defer();
	
	var params = wordArray.map(w => 'rel_trg=' + w).join('&');
	
	var url = 'http://api.datamuse.com/words?max=' + maxResults + '&' + params;
	

    var options = {
        url: url,
    };

    request(options, function (err, response, body) {

        if (err) {
            logger.error('Error response from datamuse: ' + err.stack);
            return deferred.reject(err);
        }
        if (response.statusCode == 200) {

        	var result = 
        	{
        		words: wordArray,
        		links: JSON.parse(body)
        	};
        	
            return deferred.resolve(result);
        }

        // logger.error('MarketDays service returned code ' + response.statusCode + ' for body ' + body);
        deferred.reject('DataMuse returned code ' + response.statusCode);

    });

	return deferred.promise;

}


function combinations(array) {
	
	var fn = function(active, rest, a) { 
		
		if (!active.length && !rest.length)
		{
			return;
		}
		if (!rest.length)
		{
			a.push(active);
		}
		else
		{
			fn(active.concat(rest[0]), rest.slice(1), a);
			fn(active, rest.slice(1), a);
		}
		return a;
	};
	
	return fn([], array, []);
}

function calculateMaxMatches() {

    var rnd = Math.random();

    if (rnd < 0.5)
    {
        return 1;
    }

    return 10;

}


class ClueManager
{

    static thinkOfClue(words, previousCluesMap) {

	    var combos = combinations(words);

        var maxMatches = calculateMaxMatches();

        // get rid of any combinations that have more words than maxMatches
        combos = combos.filter(combo => combo.length <= maxMatches);

	    var promiseArray = [];
	
	    let startTime = new Date();
	    console.log('Thinking...');
	
	    for (let combo of combos)
	    {
		    promiseArray.push(lookupLink(combo, 100));
	    }
	
	    return q.all(promiseArray)
            
		    .then(function(results) {
			
			    console.log('Time to run: ' + ((new Date()).getTime() - startTime.getTime()) + ' ms');
	
			    let best = 
			    {
				    words: null,
				    score: 0,
				    clue: null
			    };
	
			    let myScore = 0;
			
			    // each "result" is an object with the keys:
			    // "words": the array of words that were requested
			    // "links": the array of words that link them. This will be 0 or 1 elements long (since we cap the request at 1)
			    //				Each word of links has the format like {"word":"juice","score":1472}
			    for (let result of results)
			    {
				    if (result.links.length > 0)
				    {
					    // Take out any words...
                        // 1. that have a space in them
                        // 2. That we have used previously
                        for (let l of result.links)
                        {
                            if (previousCluesMap.hasOwnProperty(l.word))
                            {
                                console.log('We have seen the word ' + l.word + ' before, so we are going to filter it out so as not to give it again');
                            }
                        }

                        // jslint doesn't like the hasOwnProperty portion of this arrow function. It returns the following error on this line:
                        // Don't make functions within a loop
                        let filteredLinks = result.links.filter(l => l.word.indexOf(' ') == -1 && !previousCluesMap.hasOwnProperty(l.word));
            
                        if (filteredLinks.length > 0)
                        {
					        myScore = filteredLinks[0].score * result.words.length;
					        if (myScore > best.score)
					        {
						        best.score = myScore;
						        best.words = result.words;
						        best.clue = filteredLinks[0].word;
					        }

                        }  // if the filtered list still has some elements
	
				    }  // if these words have anything in common
	
			    }
					
                return best;

		    });

    }  // supplyClue



    // words is the array of words on the board (they will be sent lower-case already)
    static guessWord(words, clue)
    {
	    console.log('Thinking about clue ' + clue + '...');

        // first look to see whether any of the words show up in direct relation to the clue
        return lookupLink([ clue ], 1000)

            .then(function(directLinks) {

			    // directLinks is an object with the keys:
			    // "words": the array of words that were requested - in this case, it'll just be [ clue ]
			    // "links": the array of words related to the clue. This will be 0 or more elements long in the format {"word":"juice","score":1472}
                // They are sorted with the best matches first, so we're just going to go in order
                for (let link of directLinks.links)
                {
                    if (words.indexOf(link.word) > -1)
                    {
                        console.log('we found the word ' + link.word + ' as directly related to clue ' + clue);
                        
                        // we found a good guess at the words, so we're going to dump out right here
                        return link.word;
                    }
                
                }

                // we didn't find a direct hit, so look to see which word on the board has the best common links to the clue word
	            var promiseArray = [];
	
	            let startTime = new Date();
	
	            // for each word on the board, get its best association with the clue. Whichever
	            // word's best score
	            for (let word of words)
	            {
		            // we only care about the best match's score, so we only need the top match
		            promiseArray.push(lookupLink([ word, clue ], 100));
	            }
	
	            return q.all(promiseArray)

		            .then(function(results) {
			
			            console.log('Time to run for all matches guess: ' + ((new Date()).getTime() - startTime.getTime()) + ' ms');
	
			            var wordScores = [];
	
			            // each "result" is an object with the keys:
			            // "words": the array of words that were requested
			            // "links": the array of words that link them. This will be 0 or more elements long in the format {"word":"juice","score":1472}
			            for (let result of results)
			            {
				            // result.words is the 2-element array we passed in.
				            // result.words[0] = the word from the board
				            // result.words[1] = the clude that was given
				            if (result.links.length > 0)
				            {
					            wordScores.push({ word: result.words[0], score: result.links.reduce((totalScore, commonWord) => totalScore + commonWord.score, 0), common: result.links.map(c => c.word).join('|') });
				            }
	
			            }
					

			            if (wordScores.length > 0)
                        {
			                // sort them in reverse order
			                wordScores.sort((a, b) => { return b.score - a.score; });

                            console.log('Going with ' + wordScores[0].word);
                            return wordScores[0].word;
                        }

                        console.log('I give up');
                        return null;
                

		            });


            });


    }  // guessWord




}  // end class declaration


module.exports = ClueManager;


