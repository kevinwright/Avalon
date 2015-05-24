(function(){

  var currentLang = 'en',
    snippets = [];

  function updateSnippets () {
    var i;

    moment.locale(currentLang);

    for (i = 0; i < snippets.length; i++) {
      snippets[i].render();
    }
  }

  function Snippet (el) {
    this.el = el;
    this.start = moment(el.attr("data-start"));
    this.start = moment(el.attr("data-end"));
    this.fulltimer = el.hasClass('fulltimer');
  }

  var parts = ['months', 'days', 'hours', 'minutes', 'seconds'];

  Snippet.prototype.mkTimer = function(when, now, full) {
    var duration = moment.duration( when.diff(now) );
    var values = [];
    var names = [];
    var past = false;
    var active = false;

    parts.forEach(function(name){
      var value = duration[name]();
      if (value !== 0) { active = true; }
      if (active) {
        var absval = Math.abs(value);
        values.push(absval);
        if(absval === 1 ) {
          names.push(name.substring(0,name.length-1));
        } else {
          names.push(name);
        }
        past = past || (value < 0);
      }
    });

    if(!full) {
      values = values.slice(0, 2);
      names = names.slice(0, 2);
    }
    if(past) {
      this.el.addClass('inpast');
      values.push("");
      names.push(" ago");
    }
    var th = "<tr><th>" + values.join("</th><th>")+ "</th></tr>";
    var tr = "<tr><td>" + names.join("</td><td>")+ "</td></tr>";
    return "<table><thead>" + th + "</thead><tbody>" + tr + "</tbody></table>";
  };

  Snippet.prototype.render = function () {
    var start = this.start;
    var end = this.end;
    var now = moment().tz("Europe/London");

    var html = "";

    if(end && end.isBefore(now)) {
      //complete
      html = "started: " + start.calendar + "<br/>" +
             "ended: " + start.calendar + "<br/>" +
             this.mkTimer(now,end,false);
    } else if (end && start && start.isBefore(now) && end.isAfter(now)) {
      //in progress
      html = "started: " + start.calendar + "<br/>" +
             this.mkTimer(now,start,true) + "<br/>" +
             "ends: " + start.calendar + "<br/>" +
             this.mkTimer(now,end,true);
    } else if (start && start.isAfter(now)) {
      //in progress
      html = "starts: " + start.calendar + "<br/>" +
        this.mkTimer(now,start,this.fulltimer) + "<br/>" +
        "ends: " + start.calendar;
    } else {
      html = ""
    }

    this.el.html(html);
  };


  function timedUpdate () {
    updateSnippets();
    setTimeout(timedUpdate, 1000);
  }

  $('.countdown').each(function () {
    snippets.push(new Snippet($(this)));
  });

  timedUpdate();

})();