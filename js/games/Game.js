(function(isNode, isAngular) {

    "use strict";

    var GameModule = function(Board, Player, Action, Turn, Move, Team) {

        class Game {

            constructor(game) {

                if (game)
                {
                    this._id = game._id;
            
                    this.ownerID = game.ownerID;

                    if (game.players)
                    {
                        this.players = game.players.map(p => new Player(p));
                    }

                    this.invitations = game.invitations;

                    this.board = new Board(game.board);

                    this.turn = new Turn(game.turn);
                    this.state = game.state;
                    this.winner = game.winner;
                    
                    if (game.moves)
                    {
                        this.moves = game.moves.map(m => new Move(m));
                    }

                    this.needsCPUAction = game.needsCPUAction;

                    this.created = game.created;
                    this.updated = game.updated;
                }

                this.players = this.players || [];
                this.moves = this.moves || [];
                this.invitations = this.invitations || [];

            }  // constructor

            isSettingUp() {

                return this.state == Game.STATES.SETUP;

            }

            isActive() { 

                return this.state == Game.STATES.PLAY || this.state == Game.STATES.THINKING || this.state == Game.STATES.THINKING_ERROR;

            }

            isThinking() {

                return this.state == Game.STATES.THINKING;
            }

            isStuckThinking() {

                return this.state == Game.STATES.THINKING_ERROR;
            }

            isComplete() { 

                return this.state == Game.STATES.COMPLETE;

            }

            isOwner(userID) {

                if (typeof this.ownerID === 'string' && typeof userID === 'string')
                {
                    return this.ownerID === userID;
                }

                if (typeof userID === 'string')
                {
                    return this.ownerID.toString() === userID;
                }

                return this.ownerID.equals(userID);
            
            }  // isOwner

            isInvited(username) {

                if (this.invitations)
                {
                    // game.invitations is an array of plain username strings
                    for (let invitee of this.invitations)
                    {
                        if (invitee == username)
                        {
                            return true;
                        }
                    }
                }

                return false;

            }  // isInvited

            isPlaying(username)
            {
                if (this.players)
                {

                    for (let player of this.players)
                    {
                        if (player.username == username)
                        {
                            return true;
                        }
                    }
                }

                return false;

            }  // isPlaying


            addPlayer(player) { 

                this.players.push(player);

            }

            findPlayer(userID) { 

                for (let player of this.players)
                {
                    if (player.isUser(userID))
                    {
                        return player;
                    }
                }

                return null;

            }


            isSpymaster(userID) {

                var player = this.findPlayer(userID);
                return player && player.role == Team.ROLES.SPYMASTER;

            }

            isSpy(userID) {

                var player = this.findPlayer(userID);
                return player && player.role == Team.ROLES.SPY;

            }

            isTimeToClue() {

                if (!this.isActive())
                {
                    return false;
                }

                return this.turn && this.turn.action === Action.CLUE;

            }

            isTimeToGuess() {

                if (!this.isActive())
                {
                    return false;
                }

                return this.turn && this.turn.action === Action.GUESS && this.turn.numGuesses > 0;

            }

            isTeamTurn(team) {

                return this.turn.team == team;

            }


            isMyTurn(userID, action) {

                if (!this.isActive())
                {
                    // game must be in progress
                    return false;
                }

                var player = this.findPlayer(userID);

                if (!player)
                {
                    // userID is not one of the players
                    return false;
                }

                if (this.turn.team != player.team)
                {
                    // not even your team's turn
                    return false;
                }

                if (action == Action.CLUE && this.isTimeToClue())
                {
                    return player.role == Team.ROLES.SPYMASTER;
                }

                if (action == Action.GUESS && this.isTimeToGuess())
                {
                    return player.role == Team.ROLES.SPY;
                }

                // otherwise, it's not your turn
                return false;

            }   // isMyTurn


            findSpymaster(team) {

                for (let player of this.players) {

                    if (player.team == team && player.role == Team.ROLES.SPYMASTER)
                    {
                        return player;
                    }
                }

                return null;

            }

            findSpies(team) {

                return this.players.filter(p => p.team == team && p.role == Team.ROLES.SPY);

            }


        }  // end class declaration

        Game.STATES =
        {
            SETUP: 'setup',
            PLAY: 'play',
            THINKING: 'thinking',
            THINKING_ERROR: 'thinking_error',
            COMPLETE: 'complete'
        };

        return Game;

    };   // GameModule

    if (isAngular)
    {
        angular.module('codenames.app')
            .factory('codenames.Game', [ 'codenames.Board', 'codenames.Player', 'codenames.Action', 'codenames.Turn', 'codenames.Move', 'codenames.Team', GameModule ]);
    }
    else if (isNode)
    {
        module.exports = GameModule(require(__dirname + '/Board'), 
                                    require(__dirname + '/Player'), 
                                    require(__dirname + '/Action'),
                                    require(__dirname + '/Turn'), 
                                    require(__dirname + '/Move'), 
                                    require(__dirname + '/Team'));
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined');
