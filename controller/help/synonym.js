var words = require("//help/library/pages/synonyms.js");

module.exports = function(title) {
  if (title in words) return words[title];
  return false;
}