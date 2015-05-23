var util = require("../../helper/util.js");
var _ = require("lodash");

var affairs = function(callback) {
  util.renderYAML("/library/affairs", function(err, content) {
    if (err) return callback(err);
    var data = content.affairs;
    _(data)
      .map(function(village) {
        if (village.legions) {
          village.legions = _.map(village.legions, function(legion) {
            var leg = legion.match(/^(\w+) (\w+) (\w+|\w+ Guild) x (\d+)$/);
            if (!leg) {
              return legion;
            }
            var name = leg[1];
            var structure = leg[2];
            var commander = leg[3];
            var size = leg[4];
            return {
              name: name,
              structure: structure,
              commander: commander,
              size: size
            };
          });

          village.legionsByCommand = _.map(_.groupBy(village.legions, "commander"), function(commander, key) {
            var count = _.sum(_.pluck(commander, "size"));
            return {
              commander: key,
              size: count
            };
          });

          if (village.occupied === 'conquered') {
            village.governance = village.city;
          } else if (village.occupied === 'not' && village.city === 'independent') {
            village.governance = 'independent';
          } else {
            village.governance = 'disputed';
          }
        }
      })
      .value();

    //console.log(villageLegions);

    return callback(null, data);
  });
};

module.exports = affairs;