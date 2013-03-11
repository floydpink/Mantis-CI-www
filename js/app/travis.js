define([
  'jquery',
  'app/utils',
  'app/app',
  'jquery-cookie'
], function ($, utils, App) {
  "use strict";

  var bootstrap = function () {

    var seenSplashKey = 'seen-splash',
      seenSplash = $.cookie(seenSplashKey);

    // jQuery ready - DOM loaded
    $(document).ready(function () {

      if (!seenSplash) {
        $.cookie(seenSplashKey, "true");
        utils.debug('Setup splash');
        //setup splash
        var widthOrHeight = $(window).height() > $(window).width() ? 'width' : 'height';
        $('#splash-content').find('img').css(widthOrHeight, '70%');
        $('#splash').fadeIn();
      }

      //kickstart Ember app readiness
      utils.debug('App advanceReadiness');
      App.advanceReadiness();
    });

    //remove splash after a slight delay and show index
    setTimeout(function () {
      if (!seenSplash) {
        utils.debug('Remove splash after timeout');
        $('#splash').fadeOut().detach();
      }
      $('#repos').fadeIn();
    }, seenSplash ? 0 : 1500);

  };

  return { bootstrap: bootstrap };
});
