var mysql      = require('mysql');
var connection = mysql.createConnection({
      host     : 'meetplace.net',
      database : 'meetplac_oxw1',
      user     : 'meetplac_avalon',
      password : '!F2OHg9}HJW='
});

connection.connect();

connection.query("SELECT user.id, user.username, avatar.hash FROM  `dck_base_user` user INNER JOIN  `dck_base_avatar` avatar ON avatar.userId = user.id WHERE user.username =  'illyism' LIMIT 1",
function(err, rows, fields) {
  if (err) throw err;
  console.log(rows);
});

connection.end();
