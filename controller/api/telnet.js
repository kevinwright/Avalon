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
    var self = this;
    var lastData = null;

    this.connect = function(onConnect) {
      console.log("--- API CONNECTING ---");
      client = net.connect(23, "avalon-rpg.com",function(){
        client.setKeepAlive(true);
        client.on("data", function(chunk) {
          if (evoke) evoke(chunk);
        });
        client.on("error", function(err) {
          console.error("- API ERROR: ", err)
          if (err.code === "EPIPE") {
            self.connect(function() {
              client.write(lastData);
            });
          }
        });
        client.on("close", function() {
          console.log("- API CLOSE");
          //self.connect();
        });
        client.on("end", function() {console.log("- API END")});
        client.write("###version 2\n");
        console.log("--- API Conected ---\n");

        if (onConnect) onConnect();
      });
    };

    this.write = function(data, callback) {
      console.log("writing")
      evoke = callback;
      lastData = data;
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