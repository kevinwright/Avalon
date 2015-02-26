var avatars = require("/library/avatars.json");
var request = require("request");

module.exports = function(req, res, next) {
  var user = req.params["username"] || req.query["username"];
  var avatar = avatars[user];
  
  var url = "http://www.meetplace.net/ow_userfiles/plugins/base/avatars/avatar_big_"+avatar.id+"_"+avatar.avatar+".jpg";
  require('request').get(url).pipe(res); 
}