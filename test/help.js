var app = require("../app");
var request = require('supertest');


var fs = require("fs");
var _ = require("lodash");

describe('Avalon.Help', function(){

  it('Redirect to single', function(done){
    request(app)
      .get("/help/pages/levels")
      .expect(302)
      .expect("Location", "/help/pages/level")
      .end(function(err){
        if (err) return done(err);
        done();
      });
    });

  it('Load a synonym', function(done){
    request(app)
      .get("/help/pages/qq")
      .expect(200)
      .end(function(err){
        if (err) return done(err);
        done();
      });
    });

  var files =  _.map(fs.readdirSync("/help/autohelp"), function(file) {
    return _.trimRight(file, '0');
  });
  var helps = fs.readdirSync("/help/help");
  var validPages = _.intersection(files, helps);

  _.forEach(validPages, function(file) {
      it('Load help ' + file, function(done){
        request(app)
          .get("/help/pages/"+file)
          .expect(200)
          .end(function(err){
            if (err) return done(err);
            done();
          });
        });
  });

});