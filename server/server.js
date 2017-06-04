/*jslint node: true */
var express = require('express');
var https = require('https');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// required to read the SSL files
var fs = require('fs');

var config = require(__dirname + '/config');

var log4js = require('log4js');
log4js.configure(config.logging.configFile);
var logger = log4js.getLogger(config.logging.main);



var app = express();

app.get('*', function (req, res, next) {

    if (config.forceHttps && (req.protocol != 'https')) {

        console.log('redirecting insecure request. hostname = ' + req.hostname + ', url = ' + req.url + ', path = ' + req.path);
        res.protocol = 'https';
        return res.redirect('https://' + req.hostname + req.url);
    }
    else {
        next();
    }
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

logger.info('__dirname = ' + __dirname);


// forward any request for the shared objects to the js folder
//app.use('/js', express.static(__dirname + '/js'));

// forward any request to the API to the REST services
app.use('/api', require(__dirname + '/routes/codeapi'));

// serve up the static/AngularJS content under the client folder
app.use(express.static(__dirname + '/../client'));

app.use(function (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send('There was a server error processing the request');
    next();
});

// set up the default index page when the file is not specified
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/../client' });
});

logger.info('__dirname = ' + __dirname);

for (let s = 0; s < config.servers.length; s++) {

    var server = config.servers[s];

    if (server.secure) {

        https.createServer({ key: fs.readFileSync(server.keyFile), cert: fs.readFileSync(server.certFile) }, app).listen(server.port, server.ip);
        logger.info('Listening to https at ' + server.ip + ':' + server.port + '...');

    }
    else {

        app.listen(server.port, server.ip);
        logger.info('Listening to http at ' + server.ip + ':' + server.port + '...');

    }

}
