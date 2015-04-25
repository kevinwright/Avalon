var app = require("../app");
var request = require('supertest');
describe('Avalon.Index', function(){

  it('Load front page', function(done){
    request(app)
      .get('/')
      .expect(/Welcome to Avalon/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load introduction index', function(done){
    request(app)
      .get('/intro/')
      .expect(/From the first moment you enter Avalon, you embark upon a journey into the imagination/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load news index', function(done){
    request(app)
      .get('/news/')
      .expect(/Avalon is a vast, constantly evolving world/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load help index', function(done){
    request(app)
      .get('/help/')
      .expect(/This is the full, comprehensive Avalon manual/)
      .expect(/Purchasing equipment and services in real currency/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load history index', function(done){
    request(app)
      .get('/history/')
      .expect(/Avalon's 25th Anniversary/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });

  it('Load world index', function(done){
    request(app)
      .get('/world/')
      .expect(/All new Avalonians are born into one of four cities/)
      .expect(/Parrius was one of the earliest colonized settlements/)
      .expect(/The Bard is an enigmatic character/)
      .expect(/The newest of all the academies/)
      .expect(/Painting of the land/)
      .end(function(err){
        if (err) return done(err);
        done();
      });
  });



});