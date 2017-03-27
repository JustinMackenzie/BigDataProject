/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    path = require('path'),
    fs = require('fs');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fetch = require('node-fetch');

var db;

var cloudant;

var fileToUpload;

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var fields = ["currencyPair", "timestamp", "bidBig", "bidPips", "offerBig", "offerPips", "high", "low", "open"]
var cachedData;
var connected = 0;

var interval = setInterval(updateData, 3000);

io.on('connection', function (socket) {
  connected++;
  io.sockets.emit('data', cachedData);
  socket.on('disconnect', function () {
    connected--;
  });
});

const processData = (fields, valid) => data => data.split("\n")
  .map(row => row.split(",")
  .reduce((acc, val, i) => { acc[fields[i]] = val; return acc }, {}))
  .filter(obj => obj.hasOwnProperty(valid))

function updateData() {
  fetch('http://webrates.truefx.com/rates/connect.html?f=csv')
    .then(response=>response.text())
    .then(processData(fields, "timestamp"))
    .then(result => {
      cachedData = result;
      io.emit('data', result);
  })
}

http.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
