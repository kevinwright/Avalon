(function(){


  $('.typelabel').click(function () {
    var $this = $(this);
    var favoured = $this.attr("data-type");
    if($this.hasClass('emphasise')) {
      //already highlighted
      $('.entry').removeClass('emphasise').removeClass('de-emphasise');
    } else {
      $('.entry').removeClass('emphasise').addClass('de-emphasise');
      $('.type-' + favoured).removeClass('de-emphasise').addClass('emphasise');
    }
  });

})();