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
          window.open($(this).attr('href'), '_system');
          return false;
        });
        $(document).on('deviceready', function () {
          var deviceId = device.platform + '-' + device.version + '-' + device.model + '-' + device.uuid;
          App.device = deviceId.replace(/\s+/g, '~');
          utils.debug('Device added to App with deviceId: ' + App.device);
        });
      }
      //kickstart Ember app readiness
      utils.debug('travis::bootstrap:> App advanceReadiness');
      App.advanceReadiness();
    });

  };

  return { bootstrap : bootstrap };
});
