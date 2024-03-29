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

var assignIcon = function(event) {
  event.icon = iconref[event.type] || "info";
};

var events = function(callback) {
  util.renderYAML(LIBDIR + "/webevents2", function(err, content) {
    if (err) return callback(err);

    var entries = {
      top: [],
      left: [],
      right: []
    };

    if (content.events.length > 0) {
      content.events[0].fulltimer = true;
    }
    content.events.forEach(function(event){
      assignIcon(event);
      if(event.start) {
        util.postProcessYamlDate(event.start);
      }
      if(event.end) {
        util.postProcessYamlDate(event.end);
      }

      if(event.end && event.end.inPast) {
        event.state = "complete"
      } else if (event.end && event.start && event.start.inPast && !event.end.inPast) {
        event.state = "in progress"
      } else if (event.start && !event.start.inPast) {
        event.state = "scheduled"
      } else {
        event.state = "unscheduled"
      }

      entries[event.position].push(event);
    });

    callback(null, entries);
  });
};

module.exports = events;