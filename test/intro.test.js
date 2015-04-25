var app = require("../app");
var request = require('supertest');

var util = require("../helper/util.js");
var toc = util.renderYAMLSync("/library/test/intro/toc.yaml");


describe('Avalon.Intro', function(){

  toc.forEach(function(cat) {

    it('Load intro index ' + cat.content, function(done){
      request(app)
        .get("/intro/"+cat.short)
        .expect(302)
        .expect('Location', "/intro"+cat.items[0].url)
        .end(function(err){
          if (err) return done(err);
          done();
        });
      });

    cat.items.forEach(function(item) {
      it(' - Load ' + item.content, function(done){
        request(app)
          .get("/intro"+item.url)
          .expect(200)
          .end(function(err){
            if (err) return done(err);
            done();
          });
        });
    });

  });
});