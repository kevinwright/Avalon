var words = require(global.avalon.files.synonyms);

module.exports = function(title) {
  if (title in words) return words[title];
  return false;
}