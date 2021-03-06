﻿"use strict";

var config = {};

config.forceHttps = true;

config.servers =
[
    { secure: false, port: 8080, ip: '0.0.0.0' },
    { secure: true, port: 4343, ip: '0.0.0.0', keyFile: './server/certs/privkey.pem', certFile: './server/certs/fullchain.pem' }
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
