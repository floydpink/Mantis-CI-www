define([
  'jquery',
  'app/utils',
  'app/Travis'
], function ($, utils) {
  var appStart = function () {

    // jQuery ready - DOM loaded
    $(document).ready(function () {
      utils.log('$ document ready');
    });

    // jQuery mobile config - on mobile init
    $(document).on('mobileinit', function () {
      utils.log('mobileinit event');
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
      utils.log('pageinit event');
    });

    //remove splash
    $('#splash').detach();

    // load jQuery Mobile
    require(['jqm'], function () {
      utils.log('jqm loaded');
    });
  };

  return { start:appStart };
});
