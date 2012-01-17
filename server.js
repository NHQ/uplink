
/**
 * Module dependencies.
 */

var express = require('express')
,		_ = require('underscore')
,		request = require('request')
,		hash = require('../lib/hashlib/build/default/hashlib.node')
;

var app = module.exports = express.createServer();

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

Object.prototype.json = function(){return JSON.stringify(this)}

var spacetime = function(){return new Date().getTime() - (new Date().getTimezoneOffset() * 60 * 1000)}

var funky_time = function(){ return Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDay(), new Date().getUTCHours(), new Date().getUTCSeconds(), new Date().getUTCMilliseconds())}



function p2p_Server(){
	var self = this
	,		clients = {}
	;

	function Clientelle(req, res){
		var self = this
		,		delay = req.recd - parseInt(req.params.time)
				
		this._id = hash.hmac_sha1('noodle', Object.keys(clients).length),
		this.pingSent = parseInt(req.params.time),
		this.pingRecd = req.recd,
		this.delay = delay,
		this.remotePort = req.socket.remotePort,
		this.remoteAddress = req.socket.remoteAddress		
		return this
	}
	
	function add_new_client (req, res){
		console.log(res.socket.remoteAddress, res.socket)
//		req.socket.remoteAddress = res.socket.remoteAddress = 127.0.0.1;
//		req.socket.remotePort = req.socket.remotePort =  8000
		req.recd = spacetime()
		var client = new Clientelle(req, res);				
		clients[client._id] = client;		
		res.write(client.json());
		res.end()
	};
	
	function authenticate (req, res){
		hash()
	};
	function Handshake (client){
		if(self.handShakinProgress){return}
		// tell both clients who they are and when to sstart firing off request
		var client1 = _.find(clients, function(member){
					return client._id === member._id
				})
		,		client2 = _.find(clients, function(member){
					return client._id != member._id
				})
		;
		
		if(client1.lastAlive && client2.lastAlive){
			self.handShakinProgress = true



			client1.res.write(client2.json())
			client2.res.write(client1.json())			
		}

		
	};
	
	function keepAlive(req,res){
		res.writeHead('200')
		var id = req.body._id
		,		client = clients[id]
		;
				Object.defineProperty(client, 'req', {
					value: req,
					writeable: true,
					enumerable: false,
					configurable: true
				})
				Object.defineProperty(client, 'res', {
					value: res,
					writeable: true,
					enumerable: false,
					configurable: true
				})
		var heartBeat = function (client, res, req){ // use this to check for new contact log-ins
					var time = client.lastAlive = spacetime(); 
					
					// for now just check if there are two connected peers and try to handshake em
					console.log(client._id, Object.keys(clients).length)
					if (Object.keys(clients).length === 2) {
						res.write('there is another client!')
						Handshake(client)
						return
					}
					else
					res.write('last alive = ' + time.toString())
				}
		, 	deadBeat = function (client, res, req){
					if(req.connection.destroyed) {
						client.lastAlive = 0;
						clearInterval(client.heartBeat); 
						clearInterval(client.ekg);
					}
				}
		;
		
		client.heartBeat = setInterval(heartBeat, 1000, client, res, req);
		client.ekg = setInterval(deadBeat, 1500, client, req, res);
	};
	
	app.listen(8000);
	
	app.get('/ping/:time', add_new_client)
	
  app.get('/authenticate', authenticate)
	
	app.post('/keepAlive', keepAlive)
	
	return this	
};

p2p_Server();
