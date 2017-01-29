"use strict";

class User {

    constructor(user) {

        console.log('Creating user from ' + JSON.stringify(user));

        this._id = user._id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.updated = user.updated;
        this.first = user.first;
        this.last = user.last;
        this.sessionHash = user.sessionHash;

    }

}  // end class declaration

module.exports = User;
