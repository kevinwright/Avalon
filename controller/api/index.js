// var checkName = require("./checkname.js");
// var who = require("./who.js");

var api = {
	checkName : function(req, res) {
		res.jsonp({});
		// var name = req.params["name"] || req.query["name"];
		// if (name == false) return res.jsonp({error: "No Name", status: -1});
		// checkName(name, function(result, status) {
		// 	res.jsonp({
		// 		name: name,
		// 		available: result,
		// 		status: status
		// 	})
		// });
	},

	who : function(req, req) {
		res.jsonp({
			count: 0//who.users.length
		})
	}
}

module.exports = api;