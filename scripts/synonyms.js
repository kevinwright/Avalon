#!/usr/bin/env node

var fs = require("fs");
var helpdir = "/help/help";

var regex = /^(\w+)\s+(\w+)/;
var file = fs.readFileSync(helpdir + "/contents").toString().split("\n");
var synonynms = {};

for (var i = 0; i < file.length; i++) {
	var match = file[i].match(regex);
	if (match) {
		synonynms[match[2].toLowerCase()] = match[1].toLowerCase();
	}
}

console.log(JSON.stringify(synonynms, null, 2));
