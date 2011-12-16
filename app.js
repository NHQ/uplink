
/**
 * Module dependencies.
 */

var express = require('express')
,		_ = require('underscore');

var app = module.exports = express.createServer();
app.listen(8008);
console.log('http://localhost:8008');
var	io = require('socket.io').listen(app);
io.set('log level', 0);
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

  // Routes
  
  app.get('/', function(req, res){
    res.render('interface', {
  		layout: false,
      title: 'Interface'
    });
  });

  io.sockets.on('connection', function (socket) {	
  	socket.on('blob', function(data){
  		var base64 = function (encoded) {
  			var buff = new Buffer(encoded, 'base64'),
  					end = buff.byteLength;
  		  return buff.write('utf8', 0, end);
  		};
  		if(typeof data === 'object'){
  		}
  		if(Array.isArray(data)){
  			var buff = new Buffer(data[1]);
  			console.log(buff.toString('utf8'))

  	//		buff.writeUInt8(data, xeon - 1);
  	//		console.log(buff.toString('utf8', xeon, xeon + 1 ))
  		}
  		this.emit('conf', 'aye aye!')
  	});

  });

