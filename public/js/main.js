var canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;
if (canVibrate && !("vibrate" in navigator))
    navigator.vibrate = navigator.mozVibrate;

$(document).ready(function() {
  $("#mobile-menu").mmenu({
    extensions: ["theme-black", "border-none"],
    header: true,
    backButton: {
      close: true   
   },
   dragOpen: {
      open: $.mmenu.support.touch
   },
   footer: {
       add: true,
       title: "Share",
       content: $("#share-mobile"),
    }
  }, {
    transitionDuration: 200
  });

  
  $(".ui.button.google.plus").attr("href", "https://plus.google.com/share?url="+window.location.href);

});