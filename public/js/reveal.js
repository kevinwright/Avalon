$(document).ready(function() {
  $(".ui.menu.reveal .head").click(function(e) {
    var targ = $(e.currentTarget).data("expand");
    navigator.vibrate(10);
    $(".ui.menu.reveal .menu[data-expand="+targ+"]").toggle("fast");
  });
});