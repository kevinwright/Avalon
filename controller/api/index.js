var checkName = require("./checkname.js");
var who = require("./who.js");
var util = require("../../helper/util.js");

var checkErrors = {
  2: "This username has already been used",
  1: "You can't use this username"
};

var api = {
  avatar: require("./avatar"),
  stats: function(req, res) {
    res.render("stats.jade", {
      stats: util.cache.file.getStats()
    });
  },
  editor: function(req, res) {
    res.render("editor.jade");
  },
  editorFeature: function(req, res, next) {
    util.render(req.body.text, function(err, blocks) {
      if (err) return next(err);

      var meta = null;
      if (blocks.normal) meta =  blocks.normal.meta;
      var featureOpts = {
        meta: meta,
        extra: blocks,
        page: {},
        cat: {items: []}
      }
      res.render("intro/feature", featureOpts);
    })
  },
  editorPost: function(req, res) {
    util.render(req.body.text, function(err, content) {
      if (err) return res.send(err);
      res.send(content);
    })
  },
  checkName : function(req, res) {
    try {
      var name = req.params.username || req.query.username;
      var format = req.query.format;
      if (!name) {
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
          });
        }
      });
    } catch(e) {
      console.error(e);
    }
  },

  who : function(req, res) {
    res.jsonp({
      count: who.users.length,
      players: who.users
    });
  }
};

module.exports = api;