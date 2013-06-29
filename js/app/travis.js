/* global cordova: true */
define([
         'jquery',
         'app/utils',
         'app/app',
         'jquery-cookie'
       ], function ($, utils, App) {
  "use strict";

  var bootstrap = function () {

//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
    if (cordova && cordova.level){
      cordova.level('DEBUG');
    }
//>>excludeEnd('appBuildExclude');

    // If this is a Phonegap device, capture its unique id
    document.addEventListener("deviceready", function () {
      var device = window.device,
          deviceId = device.platform + '-' + device.version + '-' + device.model + '-' + device.uuid;
      App.device = deviceId.replace(/\s+/g, '~');
      utils.debug('Device added to App with deviceId: ' + App.device);
    }, true);

    // jQuery ready - DOM loaded
    $(document).ready(function () {
      if (window.device) {
        // bind click events for anchor[rel=external] elements to redirect to PhoneGap InAppBrowser syntax
        $(document).on('click', 'a[rel=external]', function () {
          window.open($(this).attr('href'), '_system');
          return false;
        });
      }

      //kickstart Ember app readiness
      utils.debug('travis::bootstrap:> App advanceReadiness');
      App.advanceReadiness();
    });

  };

  return { bootstrap : bootstrap };
});
