var checkName = require("./checkname.js");

var api = {
	checkName : function(req, res) {
		var name = req.params["name"] || req.query["name"];
		if (name == false) return res.jsonp({error: "No Name", status: -1});
		checkName(req.params["name"], function(result, status) {
			res.jsonp({
				name: name,
				available: result,
				status: status
			})
		})
	}
}

module.exports = api;