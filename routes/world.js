var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");

var city = require("../controller/world/city.js");
var guild = require("../controller/world/guild.js");


// Routes
  router.get(['/world/', "/cities/", "/guilds/", "/world/index.html"], getIndex);
  router.get('/cities/:city', getCity);
  router.get('/guilds/:guild', getGuild);
  router.get("/citguilds", redirectIndex);
  router.get(["/citguilds/:page.html", "/citguilds/:page"], redirectCityGuilds);

// Methods
  function getIndex(req, res) {
    avalon.info("world.md", function(err, meta) {
      if (err) return console.log(err);
      console.log(err, meta);
      res.render('world/index', { avalon:avalon, meta: meta.meta, title: "The world of Avalon, Online RPG Game" });
    })
  }

  function getCity(req, res) {
    var cityPage = new city(req.params["city"]);
    res.render('world/city', { avalon:avalon, city: cityPage });
  }

  function getGuild(req, res) {
    var guildPage = new guild(req.params["guild"]);
    if (guildPage.error) return res.redirect("/world/");
    res.render('world/guild', { avalon:avalon, guild: guildPage });
  }

  function redirectIndex(req, res) {
    res.redirect("/world/");
  }

  var cities = ["Mercinae", "Thakria", "Parrius", "Silverfalls"];
  var academies = ["Orphanage", "Academy", "Institute", "College"];
  function redirectCityGuilds(req, res) {
    var par = req.params["page"];
    console.log(cap(par), academies);
    if (cities.indexOf(cap(par)) >= 0) return res.redirect("/cities/" + par.toLowerCase());
    if (academies.indexOf(cap(par)) >= 0) return res.redirect("/academies/" + par.toLowerCase());

    res.redirect("/guilds/" + par.toLowerCase());
  }

// Helpers

  function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

module.exports = router;
