var app = require("../app");
var request = require('supertest');

var pages = require("/library/pages.js");


describe('Avalon.Pages', function(){

  pages.forEach(function(page) {
    if (page.type === "library" || page.type === "html") {

      var url = page.url;
      if (typeof page.url === "object")
        url = page.url[0];

      it('Load page ' + url, function(done){
        request(app)
          .get(url)
          .expect(200)
          .end(function(err){
            if (err) return done(err);
            done();
          });
        });
    }

  });
});