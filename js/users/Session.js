"use strict";

class Session {

    constructor(session) {

        this.hash = session.hash;
        this.userID = session.userID;
        this.username = session.username;
        this.first = session.first;
        this.last = session.last;
        this.email = session.email;

    }

    static fromUser(user) {

        return new Session(
        {
            userID: user._id,
            username: user.username,
            first: user.first,
            last: user.last,
            email: user.email
        })

    }

}

module.exports = Session;
