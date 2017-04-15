"use strict";

var config = {};

config.forceHttps = false;

config.servers =
[
    { secure: false, port: 5701, ip: 'localhost' }
];


config.db =
{
    users: "localhost:27017/users",
    codenames: "localhost:27017/codenames"
};


config.logging =
{
    configFile: __dirname + "/log4js_config.json",
    main: "codenames"
};


module.exports = config;
