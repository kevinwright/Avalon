var app = require("../app");
var request = require('supertest');

describe('Avalon.Index', function(){

  it('Load BB Index', function(done){
    request(app)
      .get('/bb/')
      .expect(200)
      .expect(/Bulletin Boards/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load Public BB', function(done){
    request(app)
      .get('/bb/public/')
      .expect(200)
      .expect(/Public Bulletin Board/)
      .expect(/Showing posts \d+ to \d+/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });


  it('Load Participant', function(done){
    request(app)
      .get('/bb/public/participant/Genesis')
      .expect(200)
      .expect(/Showing \d+ posts out of \d+ concerning Genesis/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load Post', function(done){
    request(app)
      .get('/bb/public/1000/irrelevant')
      .expect(200)
      .expect(/Avalon Updates/)
      .expect(/Mon Mar 16 1992/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });


});