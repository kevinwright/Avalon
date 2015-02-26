var data = require("./avatar.log");

var avatars = {};
for (var i = 0; i < data.avatar.length; i++) {
  var avatar = data.avatar[i];
  avatars[avatar.userId] = avatar.hash;
}

var users = {};
for (var i = 0; i < data.users.length; i++) {
  var user = data.users[i];
  users[user.username.toLowerCase()] = {
    avatar: avatars[user.id],
    id: user.id
  };
};

console.log(JSON.stringify(users));