(function(){


  $('.entry').click(function () {
    var favoured = moment(el.attr("data-type"));
    $('entry').addClass('de-emphasise');
    $('entry-'+favoured).removeClass('de-emphasise').addClass('emphasise');
  });

})();