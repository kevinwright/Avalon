(function(){


  $('.typelabel').click(function () {
    var favoured = $(this).attr("data-type");
    $('.entry').removeClass('emphasise').addClass('de-emphasise');
    $('.type-'+favoured).removeClass('de-emphasise').addClass('emphasise');
  });

})();