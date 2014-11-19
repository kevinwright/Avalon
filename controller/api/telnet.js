var net = require("net");


(function(global) {
  "use strict";
  var Telnet = function() {

    if ( Telnet.prototype._singletonInstance ) {
      return Telnet.prototype._singletonInstance;
    }
    Telnet.prototype._singletonInstance = this;

    var client = null;
    var evoke = null;

    this.connect = function() {
      client = net.connect(23, "avalon-rpg.com",function(){
        client.setKeepAlive(true);
        client.setEncoding('utf8');
        client.on("data", function(chunk) {
          if (evoke) evoke(chunk);
        });
        client.on("error", function(err) {console.error("- API ERROR: ", err)});
        client.on("close", function() {console.log("- API CLOSE")});
        client.on("end", function() {console.log("- API END")});
        client.write("###version 2\n");
        console.log("--- API Conected ---\n");
      });
    };

    this.write = function(data, callback) {
      evoke = callback;
      console.log("- API SEND: ", data);
      client.resume();
      client.write(data);
    }

    this.pause = function() {
      client.pause();
    }

  };

global.telnet = new Telnet();
telnet.connect();

}(root));

module.exports = telnet;