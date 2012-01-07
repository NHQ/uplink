var http = require('http')
,		request = require('request')
,		command = require('child_process').exec
;

// atomize obsessively, why don't you?

var funky_date = function(){ return Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDay(), new Date().getUTCHours(), new Date().getUTCSeconds(), new Date().getUTCMilliseconds())}
var spacetime = function(){return new Date().getTime() - (new Date().getTimezoneOffset() * 60 * 1000)}

function p2p (){
	var self = this;
	
	var host = 'http://localhost'
	,		o_port = 8000
	,		i_port = 8001
	,		serversCount = 0
	;

	this.servers
	
	this.checkup = function(err){ // error handler
		if (err) console.log(err);
		return
	};
	
	this.authenticate_user = function(){
		request(host+':'+o_port+'/ping/'+ spacetime(), function(e,r,b){
			self.checkup(e)
			self.nowIKnow(whoAmI(b))
			self.keepAlive(b)		
		})
	};
	
	this.keepAlive = function(creds){
		
/*
			sending client data as url encoded json string
*/

		var options = {
		  host: 'localhost',
		  port: 8000,
		  path: '/keepAlive?id='+encodeURIComponent(creds),
		  method: 'POST',
			headers: {
				'content-type': 'application/json',
				'Transfer-Encoding', 'chunked'
			}
		};
		var buff = new Buffer(creds)
		console.log(buff.toString('utf8'))
		var req = http.request(options, function(res){
			res.on('data', function(data){
				console.log(data.toString('utf8'))
			})
		});
		req.on('error', console.log)
		req.end(buff)
	};
	
	var whoAmI = function(creds){
		self.creds = creds;
		return creds
	};
	
	this.response = function(req, res){
		res.writeHead('200');
		res.end(JSON.stringify(self.creds))
		return
	};
	
	this.createServer = function(){
		server = http.createServer();
		server.id = ++serversCount;
		server.on('request', self.response);
		return server
	};
	
	this.nowIKnow = function(cred){
		self.createServer().listen(i_port)
		command('open http://127.0.0.1:8001/home')
	};
	
	this.connect_to_central = function(){
		request(host+port, function(e,r,b){
		});
	};
	return this
};

var t = p2p();
t.authenticate_user()