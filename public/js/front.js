$(document).ready(function() {
  $(".ui.tabs .tabs .item").click(function(e) {
    var target = $(e.currentTarget);
    var id = target.data("id");

    $(".ui.tabs .content, .ui.tabs .tabs .item").removeClass("active");
    $(".ui.tabs .content[data-id="+id+"], .ui.tabs .tabs .item[data-id="+id+"]").addClass("active");

    navigator.vibrate(10);
  });
});