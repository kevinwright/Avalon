var net = require('net');
var client = net.connect(parseInt(process.argv[3]),process.argv[2],function(){
	client.setEncoding('utf8');
	console.log('Connected!!');
	client.on('data',function(chunk){
		console.log(chunk);
	});
	process.stdin.resume(); // Activate STDIN
	process.stdin.setEncoding('utf8'); // Set it to string encoding
	process.stdin.on('data',function(chunk){ // Pipe STDIN to Socket.out
		client.write(chunk);
	});
});