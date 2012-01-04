var http = require('http')
,		request = require('request')
,		command = require('child_process').exec
;

// atomize obsessively, why don't you?

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
		request(host+':'+o_port+'/ping', function(e,r,b){
			self.checkup(e)
			self.nowIKnow(whoAmI(b))		
		})
	};
	
	var whoAmI = function(creds){
		self.creds = creds;
		return creds
	};
	
	this.response = function(req, res){
		res.writeHead('200');
		res.end('finish line my boy')
		console.log(req, res)
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
		command('open http://127.0.0.1:8001/home', console.log)
	};
	
	this.connect_to_central = function(){
		request(host+port, function(e,r,b){
		});
	};
	return this
};

var t = p2p();
t.authenticate_user()