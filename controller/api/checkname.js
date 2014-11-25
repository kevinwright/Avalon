var net = require('net');
var name = process.argv[2];

// Returns:
// True if no name exists
// False, StatusCode if bad name or name exists
function checkName(person, callback) {
  var client = net.connect(8080, "avalon-rpg.com",function(){
    client.setEncoding('utf8');
    client.on('data',function(chunk){
      var match = /\#\#\#check(.*)/i.exec(chunk)
      if (match && match[1])
        processAnswer(match[1], callback);
      client.end()
    });
    client.write("###checkname " + person+ "\n");
  });
}

function processAnswer(result, callback) {
  console.log(result);
  if (result === "ok") {
    return callback(true);
  } else {
    if (result.substr(0,3) === "bad") {
      return callback(false, parseInt(result.substr(4)));
    }
  }
}

if (name)
  checkName(name, function(result, code) {
    console.log(result, code);
  })

module.exports = checkName;