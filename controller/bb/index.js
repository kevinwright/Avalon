var BBDIR = "/help/bb/";
var avalon = require("../avalon");
var fs = require("fs");
var parser = require("../help/parser");

var Board = require("./board.js");

function BBController() {
  var self = this;
  this.boards = parseSections();
  
  this.index = function(req, res) {
    res.render("bb/index", {
      avalon: avalon,
      boards: self.boards
    })
  }

  this.errorBoard = function(res, board) {
    res.render('bb/error', {
        message: "No such board: " + board,
        error: {},
        avalon: avalon
    });
  }

  this.errorPost = function(res, board, id) {
    res.render('bb/error', {
        message: "No such post: " + id,
        board: self.boards[board],
        error: {},
        avalon: avalon
    });
  }

  // params: /bb/:board/
  this.board = function(req, res) {
    var board = req.params["board"] || req.query["board"];
    if (!self.boards[board]) return self.errorBoard(res);
    var page = parseInt(req.query["page"]) || 1;

    res.render("bb/board", {
      avalon: avalon,
      board: self.boards[board],
      posts: getPosts(self.boards[board], page),
      page: page
    })
  }

  // params: /bb/:board/participant/:person
  this.participant = function(req, res) {
    var board = req.params["board"] || req.query["board"];
    var person = req.params["person"] || req.query["person"];

    if (!self.boards[board]) return self.errorBoard(res, board);

    res.render("bb/participant", {
      avalon: avalon,
      board: self.boards[board],
      posts: findParticipant(self.boards[board], person),
      participant: person
    })
  }

  // params: /bb/:board/:id/subject
  this.post = function(req, res) {
    var board = req.params["board"] || req.query["board"];
    var id = req.params["id"] || req.query["id"];

    if (!self.boards[board]) return self.errorBoard(res, board);
    if (!self.boards[board].posts[id]) return self.errorPost(res, board, id);

    var post = self.boards[board].posts[id];

    readPost(self.boards[board].id, post.body.href, function(err, content) {
      if (err) return self.errorPost(res, board, id);

      res.render("bb/post", {
        avalon: avalon,
        board: self.boards[board],
        post: post,
        content: parser(content)
      })
    })
  }
}

function getPosts(board, page) {
  var posts = [];

  var top = board.count - (20 * (page - 1));
  var bottom = board.count - (20 * page);

  for (var i = top; i > bottom; i--) {
    if (!board.posts[i]) continue;
    posts.push(board.posts[i]);
  }
  return posts;
}

function findParticipant(board, person) {
  var posts = [];
  for (var i = board.count - 1; i >= 0; i--) {
    if (!board.posts[i]) continue;
    if (board.posts[i].from.shortname.toLowerCase() === person.toLowerCase() ||
      board.posts[i].to.shortname.toLowerCase() === person.toLowerCase())
      posts.push(board.posts[i]);
  };
  return posts;
}

function parseSections() {
  var boards = {};

  var data = require(BBDIR + "boards.json").boards;
  for (var i = 0; i<data.length;i++) {
    try {
      var board = require(BBDIR + data[i].href);
    } catch(err) {continue;}
    
    var parseBoard = new Board(data[i], board.posts);
    boards[parseBoard.shortname] = parseBoard;
  }

  return boards;
}

function readPost(boardId, postHref, callback) {
  console.log(BBDIR + boardId + "/" + postHref);
  fs.readFile(BBDIR + boardId + "/" + postHref, "utf8", function(err, content) {
    if (err) return callback(err);
    callback(null, content);
  });
}

module.exports = new BBController();