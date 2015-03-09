var request = require("request");
var sql = require("../../helper/sql.js");

module.exports = function(req, res, next) {
  var user = req.params["username"] || req.query["username"];
  sql(user, function(err, avatar) {
    if (err || !avatar) return next(err);
    
    var url = "http://www.meetplace.net/ow_userfiles/plugins/base/avatars/avatar_big_"+avatar.id+"_"+avatar.hash+".jpg";
    request.get(url).pipe(res); 
  });
}