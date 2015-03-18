var BBDIR = global.avalon.dir.bb;
var avalon = require("../avalon");
var util = require("../../helper/util.js");
var path = require("path");
var parser = require("../help/parser");
var _ = require("lodash");

var hints = require("./hints");

function getPosts(board, page, callback) {
  util.renderJSON(path.resolve(BBDIR, board.href), function(err, posts) {
    if (err) return callback(err);
    posts = posts.posts;

    var top = board.posts - 20 * (page - 1);
    var bottom = board.posts - 20 * page;

    posts = _(posts)
      .filter(function(post) {
        return top > post.number && post.number > bottom;
      })
      .reverse()
      .value();

    callback(null, posts);
  });
}

function findParticipant(board, person, callback) {
  util.renderJSON(path.resolve(BBDIR, board.href), function(err, posts) {
    if (err) return callback(err);
    posts = posts.posts;

    posts = _(posts)
      .filter(function(post) {
        return person === post.from.shortname || person === post.to.shortname;
      })
      .reverse()
      .value();

    callback(null, posts);
  });
}

function readPost(boardId, postHref, callback) {
  var fileLocation = path.resolve(BBDIR, boardId.toString(), postHref.toString());
  util.readFile(fileLocation, callback);
}

function Controller() {
  var self = this;
  
  this.index = function(req, res, next) {
    util.renderJSON(BBDIR + "/boards.json", function(err, boards) {
      if (err) return next(err);

      boards = _.map(_.filter(boards.boards, function(board) {
        return board.public;
      }), function(board) {
        return _.defaults(board, {
          url: board.shortname,
          title: board.fullname,
          hint: hints[board.id] || board.fullname + " Bulletin Board",
        });
      });
      res.render("bb/index", {
        avalon: avalon,
        boards: boards
      });
    });
  };

  this.errorBoard = function(res, board) {
    res.status(404);
    res.render('bb/error', {
        message: "No such board: " + board,
        error: {},
        avalon: avalon
    });
  };

  this.errorPost = function(res, board, id) {
    res.status(404);
    res.render('bb/error', {
        message: "No such post: " + id,
        board: board,
        error: {},
        avalon: avalon
    });
  };

  // params: /bb/:board/
  this.board = function(req, res, next) {
    var param = req.params.board || req.query.board;

    util.renderJSON(BBDIR + "/boards.json", function(err, boards) {
      if (err) return self.errorBoard(res, param);

      var board = _.first(_(boards.boards)
        .filter(function(board) {
          return board.public && board.shortname === param;
        })
        .map(function(board) {
          return _.defaults(board, {
            url: board.shortname,
            title: board.fullname,
            hint: hints[board.id] || board.title + " Bulletin Board",
            count: board.posts
          });
        })
        .value());

      if (!board) return self.errorBoard(res, param);

      var page = parseInt(req.query.page) || 1;

      getPosts(board, page, function(err, posts) {
        if (err) return next(err);
        res.render("bb/board", {
          avalon: avalon,
          board: board,
          posts: posts,
          page: page
        });
      });
    });
  };

  // params: /bb/:board/participant/:person
  this.participant = function(req, res, next) {
    var param = req.params.board || req.query.board;
    var person = req.params.person || req.query.person;

    util.renderJSON(BBDIR + "/boards.json", function(err, boards) {
      if (err) return next(err);

      var board = _.first(_(boards.boards)
        .filter(function(board) {
          return board.public && board.shortname === param;
        })
        .map(function(board) {
          return _.defaults(board, {
            url: board.shortname,
            title: board.fullname,
            hint: hints[board.id] || board.title + " Bulletin Board",
            count: board.posts
          });
        })
        .value());

      if (!board) return self.errorBoard(res, param);

      findParticipant(board, person, function(err, posts) {
        if (err) return next(err);

        res.render("bb/participant", {
          avalon: avalon,
          board: board,
          posts: posts,
          participant: person
        });
      });
    });
  };

  // params: /bb/:board/:id/subject
  this.post = function(req, res, next) {
    var param = req.params.board || req.query.board;
    var id = req.params.id || req.query.id;
    id = parseInt(id);

    util.renderJSON(BBDIR + "/boards.json", function(err, boards) {
      if (err) return next(err);

      var board = _.first(_(boards.boards)
        .filter(function(board) {
          return board.public && board.shortname === param;
        })
        .map(function(board) {
          return _.defaults(board, {
            url: board.shortname,
            title: board.fullname,
            hint: hints[board.id] || board.title + " Bulletin Board",
            count: board.posts
          });
        })
        .value());

      if (!board) return self.errorBoard(res, param);
      util.renderJSON(path.resolve(BBDIR, board.href), function(err, posts) {
        if (err) return next(err);
        posts = posts.posts;
        
        var post = _.find(posts, function(post) {
          return post.number === id;
        });

        if (!post) return self.errorPost(res, board, id);
        readPost(board.id, post.body.href, function(err, content) {
          if (err) return self.errorPost(res, board, id);

          res.render("bb/post", {
            avalon: avalon,
            board: board,
            post: post,
            content: parser(content)
          });
        });
      });
    });
  };
}

module.exports = new Controller();