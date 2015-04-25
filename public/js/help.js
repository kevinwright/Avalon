$(document).ready(function() {
  $(".help.index .expand").bind("click", function() {
    if (navigator.vibrate) navigator.vibrate(10);
    var id = $(this).data("id");
    var table = $("#section-"+id+" .ui.table");
    if (table.is(":visible")) table.hide("fast");
    else table.show("fast");
    $(this).find(".icon").toggleClass("active");
  });

  var expandAll = false;
  $(".expand.all").bind("click", function() {
    var table = $(".help.index .ui.table");
    if (navigator.vibrate) navigator.vibrate(10);
    if (expandAll === false) {
      table.show("fast");
      $(".help.section .icon").addClass("active");
      expandAll = true;
      $(".expand.all .text").text("Compress All Sections");
    } else {
      table.hide("fast");
      $(".help.section .icon").removeClass("active");
      expandAll = false;
      $(".expand.all .text").text("Expand All Sections");
    }
  });
});