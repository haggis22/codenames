"use strict";

var config = {};

config.forceHttps = false;

config.servers =
[
    { secure: false, port: 5701, ip: 'localhost' },
//    { secure: false, port: 5701, ip: '192.168.10.189' },
//{ secure: false, port: 9619, ip: 'z-10929' }
//{ secure: true, port: 443, ip: 'z-10929', keyFile: './sslcerts/cert.key.pem', certFile: './sslcerts/cert.crt.pem' }
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
