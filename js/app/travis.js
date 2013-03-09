define([
  'jquery',
  'app/utils',
  'app/app'
], function ($, utils, App) {
  "use strict";
  var bootstrap = (function () {

    return function () {

      // jQuery ready - DOM loaded
      $(document).ready(function () {
        utils.debug('$ document ready');
        var widthOrHeight = $(window).height() > $(window).width() ? 'width' : 'height';

        //setup splash
        $('#splash-content').find('img').css(widthOrHeight, '70%');
        $('#splash').fadeIn();

        //kickstart Ember app readiness
        utils.debug('Calling advanceReadiness');
        App.advanceReadiness();
      });

      // jQuery mobile config - on mobile init
      $(document).on('mobileinit', function () {
        utils.debug('mobileinit event');
        $.mobile.ajaxEnabled = false;
        // Prevents all anchor click handling including the addition of active button state and alternate link bluring.
        $.mobile.linkBindingEnabled = false;
        // Disabling this will prevent jQuery Mobile from handling hash changes
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;

        // Remove page from DOM when it's being replaced (if you use pages)
        $('div[data-role="page"]').on('pagehide', function (event) {
          $(event.currentTarget).remove();
        });
      });

      // jqm pageinit
      $(document).on('pageinit', function () {
        utils.debug('pageinit event');
      });

      // load jQuery Mobile
      require(['jqm'], function () {
        utils.debug('jqm loaded');
      });

      //remove splash after a slight delay and show index
      setTimeout(function () {
        $('#splash').fadeOut().detach();
        $('#index').fadeIn();
      }, 1500);

    };

  })();

  return { bootstrap: bootstrap };
});
