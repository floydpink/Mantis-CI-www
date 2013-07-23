define([
  'jquery',
  'app/utils',
  'app/app',
  'jquery-cookie'
], function ($, utils, App) {
  "use strict";

  var bootstrap = function () {

    // jQuery ready - DOM loaded
    $(document).ready(function () {
      if (window.device) {
        // bind click events for anchor[rel=external] elements to redirect to PhoneGap InAppBrowser syntax
        $(document).on('click', 'a[rel=external]', function () {
          utils.debug('click handler on devices fired for: ' + $(this).attr('href'));
          window.open($(this).attr('href'), '_system');
          return false;
        });
      }
      //kickstart Ember app readiness
      utils.debug('travis::bootstrap:> App advanceReadiness');
      App.advanceReadiness();
    });

  };

  return { bootstrap: bootstrap };
});
