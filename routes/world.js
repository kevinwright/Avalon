var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");

var city = require("../controller/world/city.js");
var guild = require("../controller/world/guild.js");

router.get(['/world/', "/cities/", "/guilds/"], function(req, res) {
  res.render('world/index', { avalon:avalon, title: "The world of Avalon, Online RPG Game" });
});
router.get('/world/index.html', function(req, res) {
  res.render('world/index', { avalon:avalon, title: "The world of Avalon, Online RPG Game" });
});


router.get('/cities/:city', function(req, res) {
  var cityPage = new city(req.params["city"]);
  res.render('world/city', { avalon:avalon, city: cityPage });
});


router.get('/guilds/:guild', function(req, res) {
  var guildPage = new guild(req.params["guild"]);
  if (guildPage.error) return res.redirect("/world/");
  res.render('world/guild', { avalon:avalon, guild: guildPage });
});

router.get("/citguilds", function(req, res) {
  res.redirect("/world/");
})


function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var cities = ["Mercinae", "Thakria", "Parrius", "Silverfalls"];
var academies = ["Orphanage", "Academy", "Institute", "College"];
router.get(["/citguilds/:page.html", "/citguilds/:page"], function(req, res) {
  var par = req.params["page"];
  console.log(cap(par), academies);
  if (cities.indexOf(cap(par)) >= 0) return res.redirect("/cities/" + par.toLowerCase());
  if (academies.indexOf(cap(par)) >= 0) return res.redirect("/academies/" + par.toLowerCase());

  return res.redirect("/guilds/" + par.toLowerCase());
})

module.exports = router;
