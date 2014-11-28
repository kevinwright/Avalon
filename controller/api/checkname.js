var telnet = require("./telnet");

function CheckName() {
  var self = this;

  this.users = {};

  this.check = function(person, callback) {
    telnet.write("###checkname " + person + "\n", function(chunk) {
      var match = /\#\#\#check(.*)/i.exec(chunk)
      if (match && match[1])
        processCheck(person, match[1], callback);
    });
  }

  function processCheck(person, result, callback) {
    console.log("- API CHECKNAME: ", person, result);
    self.users[person] = result;
    if (result === "ok") {
      return callback(true);
    } else {
      if (result.substr(0,3) === "bad") {
        return callback(false, parseInt(result.substr(4)));
      }
    }
  }
}


module.exports = new CheckName;