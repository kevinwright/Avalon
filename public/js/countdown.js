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

  var parts = ['days', 'hours', 'minutes', 'seconds'];

  Snippet.prototype.render = function () {
    var duration = moment.duration( this.to.diff(moment().tz("Europe/London")) );
    var output = [];

    parts.forEach(function(name){
      var value = duration[name]();
      if(value > 0) {
        output.push(value + " " + name);
      }
    });

    output = output.slice(0,2);

    this.el.html(output.join(', '));
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