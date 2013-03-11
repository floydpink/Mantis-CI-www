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
      //kickstart Ember app readiness
      utils.debug('App advanceReadiness');
      App.advanceReadiness();
    });

  };

  return { bootstrap: bootstrap };
});
