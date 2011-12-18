
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
	console.log(req.socket.remoteAddress)
    res.render('interface', {
  		layout: false,
      title: 'Interface'
    });
  });

  io.sockets.on('connection', function (socket) {	
		
		socket.on('inform', function(meta){
			console.log(meta)
			var meta = meta
			,		buff = new Buffer(meta.size) // alt = use blockcount * blocksize
			,		recd = 0;
			
			this.on(meta.name, function(data){
				//++recd;
				console.log(Buffer.isBuffer(data[1]));
				var boof = new Buffer(data[1])
				for(x=0;y=31;++x){
					buff.writeUInt8(boof.slice(0),(8*x)+(256*data[0]))
				}
//				buff.fill(data[1],data[0]*256,(data[0]*256)+256)
				if(recd == meta.blockCount){
					console.log(buff.toString('utf8'))					
				}
			})
			
			this.emit('copy:'+meta.name)
		});
		
  	socket.on('blob', function(i, data){
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

