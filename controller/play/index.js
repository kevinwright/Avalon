var checkName = require("../api/checkname");
var avalon = require("../avalon");

/*
var NEWCHARACTER = 0,
    BADNAME = 1,
    EXISTING = 2,
    BADINPUT = 3,
    BLANK = 4;
*/

function PlayController() {
  this.get = function(req, res, next) {
    avalon.info("play.md", function(err, meta) {
      if (err) return next(err);
      res.render('play/index', {meta: meta.meta, avalon: avalon});
    });
  };

  var FormError = function(type, message) {
    this.type = type;
    this.message = message;
  };

  var showError = function(formError, req, res, next) {
    avalon.info("play.md", function(err, meta) {
      if (err) return next(err);

      res.render('play/index', {
        form: req.body,
        error: formError,
        meta: meta.meta,
        avalon: avalon
      });
    });
  };

  var check = function(form, callback) {
    if (!form.username)
      return callback(new FormError("username", "Fill in an username!"));
    if (!form.password)
      return callback(new FormError("password", "Fill in a password!"));
    if (form.create === "no") return callback(null, form);
    if (form.create === "yes") {
      if (!form.gender) 
        return callback(new FormError("gender", "Select a gender!"));
      if (!form.confirmpass)
        return callback(new FormError("confirmpass", "Confirm your password!"));
      if (form.confirmpass !== form.password)
        return callback(new FormError("confirmpass", "Your password is not the same."));
      return checkName.check(form.username, function(result, status) {
        if (result === true) return callback(null, form);
        console.log(result, status);
      });
    }

    return callback(new FormError("Unknown", "Something Went Wrong!"));
  };

  this.lumiere = function(req, res, next) {
    return check(req.body, function(err, form) {
      if (err) return showError(err, req, res, next);
      
      if (form.run === "lumiere") {
        var flashvars = {
          username: form.username,
          password: form.password,
          create: form.create,
          gender: form.gender,
          email: form.email
        };
        if (!flashvars) return res.redirect("/play/");
        if (!flashvars.username) return res.redirect("/play/");
        if (!flashvars.password) return res.redirect("/play/");
        return res.render('play/lumiere', { avalon:avalon, flashvars: flashvars});
      }



    });
  };
}

module.exports = new PlayController();