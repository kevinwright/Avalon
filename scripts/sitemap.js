#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var timer = new Date();
var total = 0;
var util = require("../helper/util");

global.avalon = {
  dir: {
    help: "/help/help",
    world: "/library/world/",
    rollcall: "/help/rollcall",
    autohelp: "/help/autohelp",
    bb: "/help/bb",
    library: "/library",
    library_pages: "/library/pages",
    library_help: "/library/help",
    intro: "/library/intro"
  },
  files: {
    menu: "/library/menu.js",
    synonyms: "/library/synonyms.js",
    pages: "/library/pages.js",
    toc: "/library/intro/toc.js"
  }
}

// /                                  Index
// /.*                                Pages
// /intro                             Intro
//   /:category                         Category
//     /:page                             Page
// /bb                                BB
//   /:board                            Board
//     /:post                             Post
//     /participant/:participant          Participant
// /help                              Help       
//   /sections/:section                 Sections             
//   /pages/:pages                      Pages         
//   /downloads/:download               Downloads
// /play                              Play
// /lumiere                           Lumiere
// /news                              News
// /rollcall                          Rollcall
//   /orders/:order                     Order
//   /guilds/:guild                     Guild
//   /cities/:city                      City
//   /list                              Active
//   /deities                           Gods
//   /characters/:character             Character
// /history                           History
//   /ancienthistory                    Ancient History      
//   /modernhistory                     Modern History     
//   /ordinations                       Ordinations
// /maps                              Maps
//   /:map                              File
// /world                             World
//   /cities/:city                      Cities
//   /guilds/:guild                     Guilds


// --------------------------------------------------------

var data = '<?xml version="1.0" encoding="UTF-8"?>';
data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

function writeUrl(urlpath, lm, changefreq, prior) {
  var url = "<url>";

  if (urlpath.indexOf("http") >= 0)
    url += "<loc>" + urlpath + "</loc>";
  else
    url += "<loc>http://www.avalon-rpg.com" + urlpath + "</loc>";

  if (lm) {
    var month = lm.getMonth() + 1;
    month = ('0' + month).slice(-2);

    var date = lm.getFullYear() + "-" + month + "-" + ('0' + lm.getDate()).slice(-2);
    url += "<lastmod>"+date+"</lastmod>";
  }

  if (changefreq) url += "<changefreq>"+changefreq+"</changefreq>";
  if (prior) url += "<priority>"+prior+"</priority>";
  url += "</url>";
  total++;
  return url;
}

function getHelp() {
  var auto = fs.readdirSync(global.avalon.dir.autohelp);
  var help = fs.readdirSync(global.avalon.dir.help);

  return auto.map(function(file) {
      return file.slice(0, file.length - 1); // remove 0
  }).filter(function(file) {
      return help.indexOf(file) != -1; // check if file also in help
  }).map(function(file) { // grab last modified
      var location = path.resolve(global.avalon.dir.help, file);
      try {
        return {
          file: file,
          lastmod: fs.statSync(location).mtime
        };
      } catch(err) {
        console.error("Error reading: ", err.path);
      }
  }).filter(function(file) { // clear files with errors
    return file;
  });
}

function getRollcall() {
  var characters = fs.readdirSync(global.avalon.dir.rollcall);
  return characters.map(function(file) {
    var location = path.resolve(global.avalon.dir.rollcall, file);
    try {
      return {
        file: file,
        lastmod: fs.statSync(location).mtime
      };
    } catch(err) {
      console.error(err);
    }
  }).filter(function(file) { // clear files with errors
    return file;
  });
}

function getRollcallSections() {
  return util.renderFileSync(global.avalon.dir.library_pages + "/rollcall.md");
}

function getMaps() {
  return util.renderFileSync(global.avalon.dir.library_pages + "/maps.md");
}


function getBBBoards() {
  var boards = require(global.avalon.dir.bb + "/boards.json").boards;
  return boards.map(function(board) {
    var location = path.resolve(global.avalon.dir.bb, board.href);
    try {
      return {
        url: board.shortname,
        id: board.id,
        file: board.href,
        lastmod: fs.statSync(location).mtime
      }
    } catch(err) {
      // console.error("No board file for: ", board.shortname);
    }
  }).filter(function(file) {return file});
}

function getPages() {
  return require(global.avalon.files.pages);
}

function getIntro() {
  var toc = require(global.avalon.files.toc);
  return toc;
}

//     ____                           
//    / __ \____ _____ ____  _____    
//   / /_/ / __ `/ __ `/ _ \/ ___/    
//  / ____/ /_/ / /_/ /  __(__  )     
// /_/    \__,_/\__, /\___/____/      
//             /____/                 

var pages = getPages();
console.warn("Pages: ", pages.length);
for (var i in pages) {
  var page = pages[i];
  if (page.canonical) data += writeUrl(page.canonical);
  else if (page.url) {
    if (typeof page.url == "object") data += writeUrl(page.url[0]);
    else data += writeUrl(page.url);
  }
}

data += writeUrl("/intro/", null, "weekly", 1);
data += writeUrl("/news/", null, "weekly", 1);
data += writeUrl("/help/", null, "weekly", 1);
data += writeUrl("/world/", null, "monthly", 1);
data += writeUrl("/play/", null, "monthly", 1);
data += writeUrl("/lumiere/", null, "monthly", 1);
data += writeUrl("/maps/", null, "monthly", 1);
data += writeUrl("/rollcall/", null, "daily", 1);
data += writeUrl("/bb/", null, "daily", 1);

data += writeUrl("/history/", null, "weekly", 1);
data += writeUrl("/history/modernhistory", null, "weekly", 0.7);
data += writeUrl("/history/ancienthistory", null, "weekly", 0.7);
data += writeUrl("/history/ordinations", null, "weekly", 0.7);


//     ____      __           
//    /  _/___  / /__________ 
//    / // __ \/ __/ ___/ __ \
//  _/ // / / / /_/ /  / /_/ /
// /___/_/ /_/\__/_/   \____/ 
                           

var intro = getIntro();
console.warn("Intro: ", intro.length);
for (var i in intro) {
  var category = intro[i];
  data += writeUrl("/intro/"+category.short);
  for (var j in category.items) {
    data += writeUrl("/intro"+category.items[j].url);
  }
  console.warn(" Intro %s: %s", category.short, category.items.length);
}



//     __  __     __    
//    / / / /__  / /___ 
//   / /_/ / _ \/ / __ \
//  / __  /  __/ / /_/ /
// /_/ /_/\___/_/ .___/ 
//             /_/ Sections

var helpFiles = getHelp();
console.warn("Help Files: ", helpFiles.length);
for (var i in require("../controller/help/hints")) {
  data += writeUrl("/help/sections/"+i, null, "monthly", 0.9);
}

data += writeUrl("/help/downloads/avman2h.htm", null, "never", 0.5);
data += writeUrl("/help/downloads/avman2h.zip", null, "never", 0.5);
data += writeUrl("/help/downloads/avman2w.doc", null, "never", 0.5);
data += writeUrl("/help/downloads/avman2w.zip", null, "never", 0.5);



//  _       __           __    __ 
// | |     / /___  _____/ /___/ /
// | | /| / / __ \/ ___/ / __  / 
// | |/ |/ / /_/ / /  / / /_/ /  
// |__/|__/\____/_/  /_/\__,_/   
// and rollcall                 

var rollcallFiles = getRollcall();
console.warn("Rollcall Files: ", rollcallFiles.length);


var rollcallSections = getRollcallSections().normal.meta
for (var i in rollcallSections.cities.cities) {
  var city = rollcallSections.cities.cities[i];
  data += writeUrl("/rollcall/cities/"+city.toLowerCase());
  data += writeUrl("/world/cities/"+city.toLowerCase(), null, "weekly", 0.9);
}
for (var i in rollcallSections.guilds.guilds) {
  var guild = rollcallSections.guilds.guilds[i];
  data += writeUrl("/rollcall/guilds/"+guild.toLowerCase());
  data += writeUrl("/world/guilds/"+city.toLowerCase(), null, "weekly", 0.9);
}
for (var i in rollcallSections.orders.orders) {
  var order = rollcallSections.orders.orders[i];
  data += writeUrl("/rollcall/orders/"+order.toLowerCase());
}


// Help files
for (var i in helpFiles) {
  var file = helpFiles[i];
  data += writeUrl("/help/pages/" + file.file, file.lastmod, "monthly", 0.8);
}


for (var i in rollcallFiles) {
  var file = rollcallFiles[i];
  data += writeUrl("/rollcall/characters/" + file.file, file.lastmod, "weekly", 0.2);
}

//     ____  ____ 
//    / __ )/ __ )
//   / __  / __  |
//  / /_/ / /_/ / 
// /_____/_____/  
               

var BBboards = getBBBoards();
for (var i in BBboards) {
  var file = BBboards[i];
  data += writeUrl("/bb/" + file.url, file.lastmod, "weekly", 0.3);
}
console.warn("Boards: ", BBboards.length);

for (var i in BBboards) {
  try {
    var BBposts = require(global.avalon.dir.bb + "/" + BBboards[i].file).posts;

    for (var j in BBposts) {
      var file = BBposts[j];
      var datetime = file.timestamp.split("T");
      var dA = datetime[0].split("-");
      var date = new Date(dA[2], dA[1]-1, dA[0]);

      data += writeUrl("/bb/" + BBboards[i].url + "/" + file.number + "/" + encodeURIComponent(file.subject), new Date(date), "never", 0.1);
    }

  } catch(err) {
    console.error(err);
  }

  console.warn("BB Posts: ", BBboards[i].url, BBposts.length);
}

var maps = getMaps();
for (var i in maps.normal.meta.maps) {
  for (var j in maps.normal.meta.maps[i].maps) {
    var map = maps.normal.meta.maps[i].maps[j];
    data += writeUrl("/maps/"+map.url, null, "never", 0.4);
  }
  console.warn("Maps: ", maps.normal.meta.maps[i].maps.length);
}

data += "</urlset>";
console.log(data);
console.warn("%s links in %sms", total, new Date() - timer);

