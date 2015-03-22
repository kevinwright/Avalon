var app = require("../app");
var request = require('supertest');

describe('Avalon.Error', function(){

  it('BB - Should return a 404', function(done){
    request(app)
      .get('/bb/test/1977.html')
      .expect(404)
      .expect(/No such board: test/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Intro - Should redirect', function(done) {
    request(app)
      .get('/intro/further-help/meetplace')
      .expect(302)
      .end(function(err){
        if (err) return done(err);
        done();
      });
    });

 it('Intro - Should provide an overview', function(done) {
  request(app)
    .get('/intro/test/com')
    .expect(404)
    .expect(/Perhaps you meant to view one of these/)
    .end(function(err){
      if (err) return done(err);
      done();
    });
  });

 it('Help - Should provide an overview', function(done) {
  request(app)
    .get('/help/pages/fa')
    .expect(404)
    .expect(/Perhaps you meant to view one of these/)
    .end(function(err){
      if (err) return done(err);
      done();
    });
  });

});