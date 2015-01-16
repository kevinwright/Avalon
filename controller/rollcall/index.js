var ROLLCALLDIR = global.avalon.dir.rollcall;

var fs = require("fs");


function RollCallController() {
  var self = this;

  this.index = function(req, res) {
    res.render('rollcall/index', {
      title: "Rollcall",
      sections: self.sections
    });
  }

}

module.exports = new RollCallController();