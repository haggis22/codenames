﻿/*jslint node: true */
"use strict";

var config = require(__dirname + '/../../config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger('codenames');

var Cell = require(__dirname + '/../../../js/games/Cell');
var Board = require(__dirname + '/../../../js/games/Board');
var Team = require(__dirname + '/../../../js/games/Team');

var WordManager = require(__dirname + '/WordManager');


class BoardManager
{


    static generateBystander()
    {
        return Math.random() < 0.5 ? Cell.roles.BYSTANDER_1: Cell.roles.BYSTANDER_2;

    }  // generateBystander


    static generate() {

        var board = new Board();

        var usedWords = {};

        var word = null;

        for (let c=0; c < Board.NUM_CELLS; c++)
        {
            board.cells.push(new Cell({ word: WordManager.pickNewWord(usedWords) }));
        }

        var taken = {};
        var cellIndex = 0;

        // assign the red spies
        for (let red=0; red < Board.NUM_AGENTS; red++)
        {

            do
            {
                cellIndex = Math.floor(Math.random() * Board.NUM_CELLS);
            }
            while (taken.hasOwnProperty(cellIndex));

            board.cells[cellIndex].role = Team.RED;

            // mark the word as assigned already
            taken[cellIndex] = true;

        }   // red team assigments

        // assign the blue spies
        for (let blue=0; blue < Board.NUM_AGENTS; blue++)
        {

            do
            {
                cellIndex = Math.floor(Math.random() * Board.NUM_CELLS);
            }
            while (taken.hasOwnProperty(cellIndex));

            board.cells[cellIndex].role = Team.BLUE;

            // mark the word as assigned already
            taken[cellIndex] = true;

        }   // blue team assigments
        
        // assign the extra team member
        do
        {
            cellIndex = Math.floor(Math.random() * Board.NUM_CELLS);
        }
        while (taken.hasOwnProperty(cellIndex));

        // determine which team will go first...
        board.first = Math.random() < 0.5 ? Team.BLUE : Team.RED;
        // ...and that team has the extra spy
        board.cells[cellIndex].role = board.first;
        // mark the word as assigned 
        taken[cellIndex] = true;

        var remaining = {};
        remaining[Team.RED] = Board.NUM_AGENTS;
        remaining[Team.BLUE] = Board.NUM_AGENTS;
        // the team going first has an extra one remaining
        remaining[board.first]++;

        board.remaining = remaining;

            
        // mark the assassin
        do
        {
            cellIndex = Math.floor(Math.random() * Board.NUM_CELLS);
        }
        while (taken.hasOwnProperty(cellIndex));

        board.cells[cellIndex].role = Cell.roles.ASSASSIN;

        // mark the word as assigned already
        taken[cellIndex] = true;

        // assign the rest to be bystanders of some sort
        for (let cell of board.cells)
        {
            if (!cell.role)
            {
                cell.role = this.generateBystander();
            }
        }


        return board;

    }   // generate


    static getUnplayedWords(board)
    {
        return board.cells.filter(cell => !cell.revealed).map(c => c.word);
    }

    static getMyUnplayedWords(board, team)
    {
        return board.cells.filter(cell => !cell.revealed && cell.role == team).map(c => c.word);
    }



}  // end class declaration


module.exports = BoardManager;


