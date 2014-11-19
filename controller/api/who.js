var telnet = require("./telnet");

function WhoList() {
  var self = this;

  this.users = [];
  this.updateUsers = function() {
    var body = "";
    telnet.write("###users\n", function(chunk) {
      body += chunk;
      if (/\#\#\#end/i.test(chunk)) {
        telnet.pause();
        parse(body);
      }
    });
  }

  function parse(body) {
    var processing = false;
    var lines = body.split("\r\n");
    var users = [];
    for (var i = 0; i<lines.length;i++) {
      var line = lines[i];
      if (/\#\#\#begin/i.test(line)) {processing = true; continue;}
      if (/\#\#\#end/i.test(line)) break;

      users.push(line.trim());
    }

    self.users = users;
    console.log("- API USERS:", self.users.length);
  }

  // check every 10 minutes 
  setInterval(this.updateUsers, 10 * 1000 * 60);
  setTimeout(this.updateUsers, 5000);
}


module.exports = new WhoList;