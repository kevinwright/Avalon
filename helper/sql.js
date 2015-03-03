var mysql      = require('mysql');
var connection = mysql.createConnection(require("./sql.json"));

module.exports = function(name, callback) {
  connection.query("SELECT user.id, user.username, avatar.hash FROM  `dck_base_user` user INNER JOIN  `dck_base_avatar` avatar ON avatar.userId = user.id WHERE user.username =  ?? LIMIT 1",
  [name],  
  function(err, rows, fields) {
    if (err) return callback(err);
    callback(null, rows[0]);
  });
}