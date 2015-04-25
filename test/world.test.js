var app = require("../app");
var request = require('supertest');

var util = require("../helper/util");
var world = util.renderFileSync("/library/pages/world.md");
var cities = world.normal.meta.cities.cities;
var profs = world.normal.meta.guilds.professions;

describe('Avalon.World', function(){
  
  cities.forEach(function(city) {
    var re = new RegExp("The City of "+city.title);

    it('Load city ' + city.title, function(done){
      request(app)
        .get("/cities/"+city.title.toLowerCase())
        .expect(200)
        .expect(re)
        .end(function(err){
          if (err) return done(err);
          done();
        });
      });

  });

  profs.forEach(function(prof) {
    prof.guilds.forEach(function(guild) {
      var re = new RegExp("The "+guild+" Guild");

      it('Load guild ' + guild, function(done){
        request(app)
          .get("/guilds/"+guild.toLowerCase())
          .expect(200)
          .expect(re)
          .end(function(err){
            if (err) return done(err);
            done();
          });
        });
    });

  });
});