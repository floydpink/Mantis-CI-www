define([
  'jquery',
  'ember',
  'models/Repo',
  'app/utils',
  'jquery-cookie'
], function ($, Ember, Repo, utils) {
  "use strict";
  var seenSplash,
      seenSplashKey = 'seen-splash';

  return Ember.Route.extend({
    afterModel : function () {
      //show the splash only if this is the web-hosted version
      if (!window.device) {
        utils.debug('ReposRoute::afterModel:> seenSplash before reading cookie: ' + seenSplash);
        seenSplash = seenSplash || $.cookie(seenSplashKey);
        utils.debug('ReposRoute::afterModel:> seenSplash after reading cookie: ' + seenSplash);

        if (!seenSplash) {
          seenSplash = true;
          $.cookie(seenSplashKey, "true");
          utils.debug('ReposRoute::afterModel:> Transition to splash');
          this.transitionTo('splash');
        }
      }
    }
  });
});