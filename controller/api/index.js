var checkName = require("./checkname.js");
var who = require("./who.js");

var api = {
  checkName : function(req, res) {
    var name = req.params["name"] || req.query["name"];
    var format = req.query["format"];
    console.log(req.ip)
    if (name == false) {
      if (format === "text") return res.send("BAD");
      else return res.jsonp({error: "No Name", status: -1});
    }
    checkName(name, function(result, status) {
      if (format === "text") {
        if (result === true) return res.send("OKAY");
        else if (result === false) {
          if (status === 2) return res.send("USED");
          return res.send("BAD");
        }
      } else {
        return res.jsonp({
          name: name,
          available: result,
          status: status
        })
      }
    });
  },

  who : function(req, req) {
    res.jsonp({
      count: who.users.length
    })
  }
}

module.exports = api;