﻿describe('User object', function () {

    var tests = require('./users/User');

    it('should be initialized by the object passed in the constructor', tests.constructor);
    it('should be create safeUser with a subset of fields', tests.safeUser);

});