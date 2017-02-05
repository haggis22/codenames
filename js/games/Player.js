"use strict";

class Player {

    constructor(player) {

        if (player)
        {
            this._id = player._id;
            this.isOwner = player.isOwner;
            this.username = player.username;
            this.team = player.team;
            this.role = player.role;
        }

    }

    static fromUser(user, isOwner) {

        var player = new Player();
        player._id = user._id;
        player.username = user.username;

        return player;

    }


}  // end class declaration


module.exports = Player;
