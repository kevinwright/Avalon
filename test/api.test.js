var app = require("../app");
var request = require('supertest');

describe('Avalon.API.Checkname', function(){

  it('Checkname an used username', function(done){
    this.timeout(5000);
    setTimeout(function () {
      request(app)
        .get('/api/checkname/illyism?format=text')
        .expect("BAD")
        .end(function(err){
          if (err) return done(err);
          done();
        });
    }, 500);
  });

  it('Checkname an open username', function(done){
  	this.timeout(5000);
  	setTimeout(function () {
      request(app)
        .get('/api/checkname/abdfqsgqs?format=text')
        .expect("OKAY")
        .end(function(err){
          if (err) return done(err);
          done();
        });
    }, 500);
  });

  it('Checkname an bad username', function(done){
  	this.timeout(5000);
  	setTimeout(function () {
      request(app)
        .get('/api/checkname/test?format=text')
        .expect("BAD")
        .end(function(err){
          if (err) return done(err);
          done();
        });
    }, 500);
  });


});