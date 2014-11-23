var hints = require("./hints");

function Board(meta, posts) {
  this.id = meta.id;
  this.href = meta.href;
  this.shortname = this.url = meta.shortname;
  this.title = this.fullname = meta.fullname;
  this.hint = hints[this.id] || this.title + " Bulletin Board";

  this.posts = {};
  this.count = posts[posts.length - 1].number;
  for (var i = posts.length - 1; i >= 0; i--) {
    this.posts[posts[i].number] = posts[i];
  };
}

module.exports = Board;