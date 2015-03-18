var express = require('express');
var router = express.Router();
var avalon = require("../controller/avalon");
var util = require("../helper/util");

var city = require("../controller/world/city.js");
var guild = require("../controller/world/guild.js");



// Methods
  function getIndex(req, res, next) {
    avalon.info("world.md", function(err, meta) {
      if (err) return next(err);
      res.render('world/index', { avalon:avalon, meta: meta.meta, title: "The world of Avalon, Online RPG Game" });
    });
  }

  function getCity(req, res, next) {
    city(req.params.city, function(err, cityPage) {
      if (err) return next({
        err: err,
        type: "city",
        city: req.params.city
      });
      res.render('world/city', { avalon:avalon, city: cityPage });
    });
  }

  function getGuild(req, res, next) {
    guild(req.params.guild, function(err, guildPage) {
      if (err) return next({
        err: err,
        type: "guild",
        guild: req.params.guild
      });
      res.render('world/guild', { avalon:avalon, guild: guildPage });
    });
  }

  function redirectIndex(req, res) {
    res.redirect("/world/");
  }

  function affairs(req, res, next) {
    util.renderYAML("/library/affairs", function(err, content) {
      if (err) return next(err);
      res.render("world/affairs", {avalon: avalon, meta: content});
    });
  }

  var cities = ["Mercinae", "Thakria", "Parrius", "Silverfalls"];
  var academies = ["Orphanage", "Academy", "Institute", "College"];
  function redirectCityGuilds(req, res) {
    var par = req.params.page;
    if (cities.indexOf(util.cap(par)) >= 0) return res.redirect("/cities/" + par.toLowerCase());
    if (academies.indexOf(util.cap(par)) >= 0) return res.redirect("/academies/" + par.toLowerCase());

    res.redirect("/guilds/" + par.toLowerCase());
  }

// Routes
  router.get(['/world/', "/cities/", "/guilds/", "/world/index.html"], getIndex);
  router.get('/cities/:city', getCity);
  router.get('/guilds/:guild', getGuild);
  router.get("/citguilds", redirectIndex);
  router.get("/world/affairs", affairs);
  router.get(["/citguilds/:page.html", "/citguilds/:page"], redirectCityGuilds);


module.exports = router;
