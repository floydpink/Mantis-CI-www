define([
         'jquery',
         'app/utils',
         'app/app',
         'app/phonegap',
         'jquery-cookie'
       ], function ($, utils, App, phonegap) {
  "use strict";

  var bootstrap = function () {

    App.phonegap = phonegap;

    document.addEventListener("deviceready", phonegap.deviceReady, true);

    // jQuery ready - DOM loaded
    $(document).ready(function () {
      //kickstart Ember app readiness
      utils.debug('travis::bootstrap:> App advanceReadiness');
      App.advanceReadiness();
    });

  };

  return { bootstrap : bootstrap };
});
