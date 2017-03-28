/*jshint node:true*/
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var Cloudant = require('cloudant');
var me = "fa20b553-dc7f-463f-889e-eca6f99bc67f-bluemix";
var password = "28813e1ff484a3c050d91738ba652c26b9bc8273de0569d0eacf315493c2f792";
var cloudant = Cloudant({account:me, password:password});
var stock = cloudant.db.use('stockdata');

/*Cloudant({account:me, password:password}, function(err, Cloudant) {
  if (err) {
    return console.log('Failed to initialize Cloudant: ' + err.message);
  }
console.log("database connected");
//Cloudant.db.list(function(err, allDbs) {

  //console.log('All my databases: %s', allDbs.join(', '))
//})
});*/

//var stock = Cloudant.db.use("stockdata");

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');
var router = express.Router();     


// create a new express server
var app = express();

app.use(express.static('static'));
// serve the files out of ./public as our main files
var path = require('path');




//get query index
stock.index(function(er, result) {
  if (er) {
    throw er;
  }

  console.log('The database has %d indexes', result.indexes.length);
  for (var i = 0; i < result.indexes.length; i++) {
    console.log('  %s (%s): %j', result.indexes[i].name, result.indexes[i].type, result.indexes[i].def);
  }

  //result.should.have.a.property('indexes').which.is.an.Array;
  //done();
});

//query 
router.route('/query').get(function(req, result) {
  //console.log(req);
  stock.find({selector:{Time:req.query.Time}}, function(er, response) {
    if (er) {
      throw er;
  }

  console.log('Found %d documents with time', response.docs.length);
  for (var i = 0; i < response.docs.length; i++) {
    console.log('  Doc id: %s', response.docs[i]._id);
  }
     result.send (response.docs);
})
});

//server connect
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname + '/static/query.html'));
	
});

app.use('/api', router);

// start server on the specified port and binding host
app.listen(8080); // start server

console.log('Listening on port 8080');
