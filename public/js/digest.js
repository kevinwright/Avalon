(function(){


  $('.clickable.typetoggle').click(function () {
    var $this = $(this);
    var type = $this.attr("data-type");
    var $icon=$('.vis-icon-'+type)
    if($icon.hasClass('unhide')) {
      // show => de-emph
      $icon.removeClass('unhide').addClass("hide");
      $('.type-' + type).addClass('de-emphasise-type').removeClass('hidden');
    } else if($icon.hasClass('hide')) {
      // de-emph => hide
      $icon.removeClass('hide').addClass("remove")
      $('.type-' + type).addClass("elide").removeClass('de-emphasise-type');
    } else {
      // hide => show
      $icon.removeClass('remove').addClass("unhide")
      $('.type-' + type).removeClass("elide").removeClass('de-emphasise-type');
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