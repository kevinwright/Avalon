var telnet = require("./telnet");

function CheckName() {
  var self = this;

  this.users = {};

  this.check = function(person, callback) {
    telnet.write("###checkname " + person + "\n", function(chunk) {
      var matchBad = /\#\#\#checkbad (-?\d+)/i.exec(chunk);
      var matchOk = /\#\#\#checkok/i.test(chunk);
      if (matchBad && matchBad[1])
        processBad(person, matchBad[1], callback);
      else if (matchOk)
        return callback(true);
    });
  };
  
  function processBad(person, result, callback) {
    console.log("- API CHECKBAD: ", person, result);
    self.users[person] = result;
    return callback(false, parseInt(result));
  }

}


module.exports = new CheckName();