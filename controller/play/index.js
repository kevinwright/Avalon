var checkName = require("../api/checkname.js");

var NEWCHARACTER = 0,
    BADNAME = 1,
    EXISTING = 2,
    BADINPUT = 3,
    BLANK = 4;


function PlayController() {
  this.post = function(req, res) {
    var name = req.body["user"];
    var password = req.body["password"];
    var client = req.body["client"];
    if (!name) {
      return res.render('play/index', { user: name, password: password, code: BLANK });
    }
    checkName(name, function(result, status) {
      if (result === true) {
        // available name, so make a new character
        return res.render('play/index', { user: name, password: password, code: NEWCHARACTER });
      } else {
        if (status === EXISTING) {
          // character exists, so check password and log in
          if (client === "lumiere")
            return res.redirect('play/lumiere', { user: name, password: password, code: EXISTING });
          else
            return res.render('play/javalon', { user: name, password: password, code: EXISTING });
        } else if (status === BADNAME) {
          // bad character name, so show the form
          return res.render('play/index', { user: name, password: password, code: BADNAME, message: "Bad character name. Try something else!" });
        } else {
          // bad user input, so show the form
          return res.render('play/index', { user: name, password: password, code: BADINPUT, message: "Bad input" });
        }
      }
    });
  }
}

module.exports = new PlayController();