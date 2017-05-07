"use strict";

var should = require('chai').should();

var CPU = require(__dirname + '/../../js/users/CPU');

function createCPU()
{
    return new CPU();

}  // createCPU


var tests = {};

tests.constructor = function() {

    let cpu = createCPU();

    should.exist(cpu);

};

module.exports = tests;
