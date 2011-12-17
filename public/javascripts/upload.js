
	var ui = {}
	ui.sendFile = function(blob, i){

    var reader = new FileReader(); // not using this i don't think :/Z/         
		var blob = blob;
		reader.onloadend = function(event) {
				var data = new DataView(event.target.result);
				var uInt8Array = new Uint8Array(event.target.result);
				var byte3 = uInt8Array[4];
				var i = data.getUint8(4, 6);
				console.log('length',i, data, uInt8Array.length)
        $('#console').html(i)
				ui.socket.emit('blob', [i, uInt8Array])
    };

    reader.onerror = function(x) {
      console.log(x, 'error summin abt', file.fileSize)
    };

    reader.readAsArrayBuffer(blob);
		
				
	};
	ui.readFile = function (file) {

		var file = file;
		var name = file.name;
		var type = file.type;
		var size = file.size;
		var blockSize = 256;
		var blocks = Math.ceil(file.fileSize / blockSize);
		var sets = _.range(blocks);

		ui.socket.on('copy:'+name, function(data){
			sets.forEach(function(e,i){
				if(file.webkitSlice){
					var blob = file.webkitSlice(0 + (blocks * i), (blocks * i) + blockSize)	// only sending 1024 * 1024 of the file
				}
				if(file.mozSlice){
		     var blob = file.mozSlice(0 + (blocks * i), (blocks * i) + blockSize);	
				}
				console.log(blob)
				ui.sendFile(name, type, blocks * i, blocks, blob)
			})	
		})

		ui.socket.emit('inform', {name: name, type:type, blocks: blocks, blockSize: blockSize})
		
		
 //   reader.readAsArrayBuffer(blob);
  }
	ui.cancel = function (e) {
	  e.preventDefault()
	  return false
	};
	ui.drop = function (e) {
	  e.preventDefault();
	  var dt = e.dataTransfer;
	  var files = dt.files;
  	  var File = files[0];
  	  ui.readFile(File);
  	  return false
}
	ui.init = function(){
		this.socket = io.connect('http://localhost:8008');
		this.socket.on('connect', function(){
			console.log('connected')
		})
		this.socket.on('conf', function(e,r){
			console.log('conf', e, r)
		})
		var dropFile;

		dropFile = document.getElementById("dropFile");
		dropFile.addEventListener("dragenter", ui.cancel, false);
		dropFile.addEventListener("dragover", ui.cancel, false);
		dropFile.addEventListener("drop", ui.drop, false);
		
		this.x = window.innerHeight,
		this.y = window.innerWidth;
		$('#console').css({
			left : ( ui.y - 667 ) / 2
		})
		$(window).one('resize', function(e){	ui.init()})
	};
	ui.init()
