$(document).ready(function() {
  $("#militaryTable").stupidtable();
  $("#militaryTable .expand").click(function(e) {
    var id = $(e.currentTarget).data("id");
    var all = $("#militaryTable .expandable");
    navigator.vibrate(10);
    var expandable = $("#militaryTable .expandable[data-id=" + id + "]");
    if (expandable.is(":visible")) {
      expandable.toggle();
    } else {
      all.hide();
      expandable.toggle();
    }
  });
});