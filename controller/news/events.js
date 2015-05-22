var helpParser = require("../help/parser");
var LIBDIR = global.avalon.dir.library;
var util = require("../../helper/util");
var _ = require("lodash");
var moment = require('moment-timezone');

var iconref = {
  ARENAQUEST:      "trophy",         // Arena Combat League
  BATTLESANDS:     "yellow trophy",  // Battleisle Sands Competition
  DEITYQUEST:      "trophy",         // Quest Completion and Experience Gain Competition
  FLAGQUEST:       "flag outline",   // The Flag Quest per GODHELP FLAGQUEST
  TORCHQUEST:      "fire",           // The Torch Quest per GODHELP TORCHQUEST
  GEMQUEST:        "diamond",        // Gem Quest Event: see GQ STATUS
  EGGQUEST:        "search",         // Golden Egg Gathering Quest
  SCEPTREQUEST:    "trophy",         // The Sceptre of Guilds Tournament
  UNDERQUEST:      "trophy",         // Battle Quest in the Underworld
  ORDINATION:      "diamond",        // The Amethyst Ordination
  IMMORTALSCOMBAT: "trophy",         // The Immortals Combat
  MULTIQUEST:      "trophy",         // Multiple Quests - Single League
  SANDSQUEST:      "wait",           // Sands Eliminator or Sands Contest
  COMBATQUEST:     "diamond",        // Generic Combat Quest (Ruby Gem Quest)
  QUIZ:            "blue idea",      // Question and Answer Quiz
  YEARQUEST:       "world",          // Quest across a whole Avalon Year
  EMERALDQUEST:    "green diamond",  // Quest for the Emerald Gem
  LEAGUEQUEST:     "trophy",         // Quest League of Combat (Seeded for Equality)
  CORALQUEST:      "diamond",        // Coral GemQuest or DROPROOM Lodge+Redeem Quest
  GUILDQUEST:      "trophy",         // Quest Event for a Guild or Between Guilds
  CITYQUEST:       "trophy",         // Quest Event for a City or Between Cities
  RACINGQUEST:     "checkered flag", // Contest of Racing and Speed
  GUILDTOURNAMENT: "trophy",         // Combat Tournament for Guild Champion
  CITYTOURNAMENT:  "trophy",         // Combat Tournament for City Champion
  TOURNAMENTQUEST: "trophy",         // Tournament Competition for Combat Champion
  EVENT:           "info",           // Any Event non-Quest/Competitive
  WEDDING:         "heterosexual",   // Wedding of Avalonwide Significance
  TEAMQUEST:       "trophy",         // Any Event Involving Teams (TEAM command)
  HILTQUEST:       "trophy",         // The Hilt Quest - Combat between Cities
  SPOONQUEST:      "checkered flag", // Egg and Spoon Race Competition
  EGGMELEE:        "trophy"          // The Crystal Egg Melee Quest
};

var events = function(callback) {
  util.readFile(LIBDIR + "/webevents2", function(err, data) {
    if (err) return callback(err);

    var events = {
      top: [],
      left: [],
      right: []
    };

    moment.locale('en-my-settings', {
      calendar : {
        lastDay : '[Yesterday at] LT',
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'llll'
      }
    });

    var regex = /^(\S+) @ (\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d) \/ (.*) ###participants=(\d+) ###potential=(\d+) ###position=(.*) ###title=(.*) ###description=(.*)$/;
    var preambleRegex = /^(\S+) ?@ ?(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d) \/ (.*) $/;

    var lines = data.split("\n");
    var first = true;
    lines.forEach(function(line) {
      var parts = line.split('###');
      var preamble = preambleRegex.exec(parts.shift()); //mutates parts
      if(preamble) {
        var type = preamble[1];
        var now = moment().tz("Europe/London");
        var timestamp = moment.tz(preamble[2], "Europe/London");

        var event = {
          fulltimer: first,
          type: type,
          icon: iconref[type] || "info",
          timestamp: timestamp,
          avdate: preamble[3],
          inPast: timestamp.isBefore(now)
        };

        parts.forEach(function(part){
          var nv = part.split('=');
          var name = nv.shift().trim();
          var value = nv.join('=').trim();
          event[name] = value;
        });
        events[event.position].push(event);
        first = false;
      }
    });

    callback(null, events);
  });
};

module.exports = events;