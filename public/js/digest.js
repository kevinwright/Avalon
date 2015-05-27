(function(){


  $('.clickable.type').click(function () {
    var $this = $(this);
    var favoured = $this.attr("data-type");
    if($this.closest('.entry').hasClass('emphasise')) {
      //already highlighted
      $('.entry').removeClass('emphasise').removeClass('de-emphasise');
    } else {
      $('.entry').removeClass('emphasise').addClass('de-emphasise');
      $('.type-' + favoured).removeClass('de-emphasise').addClass('emphasise');
    }
  });

  $('.clickable.link').click(function () {
    var $this = $(this);
    var favoured = $this.attr("data-link");
    if($this.closest('.entry').hasClass('emphasise')) {
      //already highlighted
      $('.entry').removeClass('emphasise').removeClass('de-emphasise');
    } else {
      $('.entry').removeClass('emphasise').addClass('de-emphasise');
      $('.link-' + favoured).removeClass('de-emphasise').addClass('emphasise');
    }
  });

})();