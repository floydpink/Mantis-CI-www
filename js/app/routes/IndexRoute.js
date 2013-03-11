define([
  'jquery',
  'ember',
  'app/utils',
  'jquery-cookie'
], function ($, Ember, utils) {
  "use strict";
  var seenSplashKey = 'seen-splash';

  return Ember.Route.extend({
    redirect: function () {
      utils.debug('In Index Route redirect');

      var seenSplash = $.cookie(seenSplashKey);

      if (!seenSplash) {
        $.cookie(seenSplashKey, "true");
        utils.debug('Transition to splash');
        this.transitionTo('splash');
      } else {
        utils.debug('Transition to repos');
        this.transitionTo('repos');
      }
    }
  });
});