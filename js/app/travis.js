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
      //kickstart the Ember app
      utils.debug('travis::bootstrap:> calling App.start');
      App.start();
    });

  };

  return { bootstrap : bootstrap };
});
