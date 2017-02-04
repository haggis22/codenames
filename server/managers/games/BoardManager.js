"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');


var WordManager = require(__dirname + '/WordManager');

var NUM_AGENTS = 8;
var NUM_CELLS = 25;

class BoardManager
{

    static generate() {

        var board =
        {
            cells: [],
            first: null
        }

        var usedWords = {};

        var word = null;

        for (var c=0; c < NUM_CELLS; c++)
        {
            board.cells.push({ word: WordManager.pickNewWord(usedWords) });
        }

        var taken = {};
        var cellIndex = 0;

        // assign the red spies
        for (var red=0; red < NUM_AGENTS; red++)
        {

            do
            {
                cellIndex = Math.floor(Math.random() * NUM_CELLS);
            }
            while (taken.hasOwnProperty(cellIndex));

            board.cells[cellIndex].role = 'red';

            // mark the word as assigned already
            taken[cellIndex] = true;

        }   // red team assigments

        // assign the blue spies
        for (var blue=0; blue < NUM_AGENTS; blue++)
        {

            do
            {
                cellIndex = Math.floor(Math.random() * NUM_CELLS);
            }
            while (taken.hasOwnProperty(cellIndex));

            board.cells[cellIndex].role = 'blue';

            // mark the word as assigned already
            taken[cellIndex] = true;

        }   // blue team assigments
        
        // assign the extra team member
        do
        {
            cellIndex = Math.floor(Math.random() * NUM_CELLS);
        }
        while (taken.hasOwnProperty(cellIndex));

        // determine which team will go first...
        board.first = Math.random() < 0.5 ? 'blue' : 'red';
        // ...and that team has the extra spy
        board.cells[cellIndex].role = board.first;
        // mark the word as assigned 
        taken[cellIndex] = true;

            
        // mark the assassin
        do
        {
            cellIndex = Math.floor(Math.random() * NUM_CELLS);
        }
        while (taken.hasOwnProperty(cellIndex));

        board.cells[cellIndex].role = 'assassin';

        // mark the word as assigned already
        taken[cellIndex] = true;

        // assign the rest to be bystanders of some sort
        for (var cell of board.cells)
        {
            if (!cell.role)
            {
                cell.role = Math.random() < 0.5 ? 'bystander1': 'bystander2';
            }
        }


        return board;

    }   // generate


}  // end class declaration


module.exports = BoardManager;


