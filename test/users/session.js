"use strict";

var should = require('chai').should();

var User = require(__dirname + '/../../js/users/User');
var Session = require(__dirname + '/../../js/users/Session');

function createUser()
{
    let birthday = new Date(1971, 6, 22);

    let userInfo = 
    {
        _id: 'd305cce1-d1ab-438f-80fc-ce999f262068',
        username: 'haggis22',
        email: 'haggis22@yahoo.com',
        password: 'secret',
        updated: birthday,
        first: 'Daniel',
        last: 'Shell',
        sessionHash: '7E=R+&]{Nc,{NC~R'
    };

    return new User(userInfo);

}  // createUser

function createSession()
{
    let sessionInfo = 
    {
        hash: '9bdfb9b2-c87e-4b1c-a187-86974d705d7c',
        userID: '61779499-10cf-4e07-8d9b-b6645b07a4d8',
        username: 'haggis22',
        first: 'Daniel',
        last: 'Shell',
        email: 'haggis22@yahoo.com'
    };

    return new Session(sessionInfo);

}  // createSession


var tests = {};

tests.constructor = function() {

    let session = createSession();

    session.hash.should.equal('9bdfb9b2-c87e-4b1c-a187-86974d705d7c');
    session.userID.should.equal('61779499-10cf-4e07-8d9b-b6645b07a4d8');
    session.username.should.equal('haggis22');
    session.first.should.equal('Daniel');
    session.last.should.equal('Shell');
    session.email.should.equal('haggis22@yahoo.com');

};

tests.fromUser = function() {

    let user = createUser();
    let session = Session.fromUser(user);

    session.userID.should.equal(user._id);
    session.username.should.equal(user.username);
    session.first.should.equal(user.first);
    session.last.should.equal(user.last);
    session.email.should.equal(user.email);

    // these fields should NOT be copied from a user to the session
    should.not.exist(session._id);
    should.not.exist(session.password);
    should.not.exist(session.updated);
    should.not.exist(session.sessionHash);

};


module.exports = tests;
