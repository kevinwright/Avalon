var app = require("../app");
var request = require('supertest');

describe('Avalon.History', function(){

  it('Load timeline', function(done){
    request(app)
      .get('/history/timeline')
      .expect(200)
      .expect(/Avalon's 25th Anniversary/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load ordinations', function(done){
    request(app)
      .get('/history/ordinations')
      .expect(200)
      .expect(/Appointment of Elmaethor, god of the stars/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load ancient history', function(done){
    request(app)
      .get('/history/ancienthistory')
      .expect(200)
      .expect(/Thakria and the Count Agemmenion/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load modern history', function(done){
    request(app)
      .get('/history/modernhistory')
      .expect(200)
      .expect(/The first Guildmasters of the various/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load rollcall', function(done){
    request(app)
      .get('/rollcall')
      .expect(200)
      .expect(/Order Members of/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

});