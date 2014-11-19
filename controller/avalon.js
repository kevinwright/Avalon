var who = require("./api/who.js");

module.exports = {
  users: function() {return who.users;}
}