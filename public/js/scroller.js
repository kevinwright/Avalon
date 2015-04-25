$(document).ready(function() {
  var current = 0;
  var slides = $(".ui.scroll .content");
  var dots = $(".ui.scroll .top .dot");

  function next() {
    $(slides.get(current)).removeClass("active").addClass("prev");
    $(dots.get(current)).removeClass("active").addClass("prev");
    current++;
    $(dots.get(current)).removeClass("prev").addClass("active");
    $(slides.get(current)).removeClass("prev").addClass("active");
    if (current >= slides.length) {
      current = 0;
      dots.removeClass("prev active");
      slides.removeClass("prev active");
      $(dots.get(current)).addClass("active"); 
      $(slides.get(current)).addClass("active"); 
    }
  }

  dots.click(function(e) {
    var target = $(e.currentTarget);
    var id = target.data("id");
    current = parseInt(id);

    dots.removeClass("prev active");
    slides.removeClass("prev active");
    $(dots.get(current)).addClass("active"); 
    $(slides.get(current)).addClass("active"); 

    interval = clearInterval(interval);
  });

  $(slides.get(current)).addClass("active"); 
  $(dots.get(current)).addClass("active"); 

  var interval = setInterval(function () {
    next();
  }, 10000);
});