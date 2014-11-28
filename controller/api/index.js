var checkName = require("./checkname.js");
var who = require("./who.js");

var checkErrors = {
  2: "This username has already been used",
  1: "You can't use this username"
}

var api = {
  checkName : function(req, res) {
    try {
      var name = req.params["username"] || req.query["username"];
      var format = req.query["format"];
      if (name == false) {
        if (format === "text") return res.send("BAD");
        else return res.jsonp({username: false, message: "Please fill in a name", status: -1});
      }
      checkName.check(name, function(result, status) {
        if (format === "text") {
          if (result === true) return res.send("OKAY");
          else if (result === false) {
            if (status === 2) return res.send("USED");
            return res.send("BAD");
          }
        } else if (format==="boolean") {
          return res.jsonp(result);
        } else {
          return res.jsonp({
            username: name,
            message: checkErrors[status],
            status: status
          })
        }
      });
    } catch(e) {console.error(e)}
  },

  who : function(req, req) {
    res.jsonp({
      count: who.users.length
    })
  }
}

module.exports = api;