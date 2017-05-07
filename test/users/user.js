"use strict";

var should = require('chai').should();

var User = require(__dirname + '/../../js/users/User');


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


var tests = {};

tests.constructor = function() {

    let user = createUser();

    user._id.should.equal('d305cce1-d1ab-438f-80fc-ce999f262068');
    user.username.should.equal('haggis22');
    user.email.should.equal('haggis22@yahoo.com');
    user.password.should.equal('secret');
    user.updated.getTime().should.equal(new Date(1971, 6, 22).getTime());
    user.first.should.equal('Daniel');
    user.last.should.equal('Shell');
    user.sessionHash.should.equal('7E=R+&]{Nc,{NC~R');

};

tests.safeUser = function() {

    let user = createUser();
    let safeUser = User.safeUser(user);

    safeUser.username.should.equal('haggis22');
    safeUser.first.should.equal('Daniel');
    safeUser.last.should.equal('Shell');

    // these fields should NOT be copied from a user to the safeUser
    should.not.exist(safeUser._id);
    should.not.exist(safeUser.email);
    should.not.exist(safeUser.password);
    should.not.exist(safeUser.updated);
    should.not.exist(safeUser.sessionHash);

};


module.exports = tests;
