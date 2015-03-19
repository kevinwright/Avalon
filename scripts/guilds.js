#!/usr/bin/env node

var fs = require("fs");
var helpdir = "/help/help";

var regex = /^(\w+) Guild\s+\|\s+(\w+)\s+\((\d+)yr\)\s+\|\s+(\w+)\s+\|\s+(.*)$/;

var file = fs.readFileSync(helpdir + "/guilds").toString().split("\n");

var guilds = {};
for (var i = 0; i < file.length; i++) {
	var line = file[i];
	var matches = line.match(regex);
	if (matches) {
		var guild = {
			title: matches[1],
			guildmaster: matches[2],
			years: matches[3],
			patron: matches[4],
			location: matches[5]
		};
		guilds[guild.title.toLowerCase()] = guild;
	}
}

console.log(JSON.stringify(guilds, null, 2));