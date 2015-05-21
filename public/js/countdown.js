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
    this.to = moment(el.attr("data-to"));
  }

  var parts = ['months', 'days', 'hours', 'minutes', 'seconds'];

  Snippet.prototype.render = function () {
    var duration = moment.duration( this.to.diff(moment().tz("Europe/London")) );
    var output = [];
    var namesused = [];
    var past = false;

    parts.forEach(function(name){
      var value = duration[name]();
      if(value !== 0) {
        var absval = Math.abs(value);
        output.push(absval);
        if(absval === 1 ) {
          namesused.push(name.substring(0,name.length-1));
        } else {
          namesused.push(name);
        }
        past = past || (value < 0);
      }
    });

    output = output.slice(0,2);
    namesused = namesused.slice(0,2);
    if(past) {
      output.push("");
      namesused.push(" ago");
    }
    var th = "<tr><th>" + output.join("</th><th>")+ "</th></tr>";
    var tr = "<tr><td>" + namesused.join("</td><td>")+ "</td></tr>";
    var output_html = "<table><thead>" + th + "</thead><tbody>" + tr + "</tbody></table>";

    this.el.html(output_html);
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