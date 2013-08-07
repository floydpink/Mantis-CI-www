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
    redirect : function () {
      utils.debug('ReposRoute::redirect:> seenSplash before reading cookie: ' + seenSplash);
      seenSplash = seenSplash || $.cookie(seenSplashKey);
      utils.debug('ReposRoute::redirect:> seenSplash after reading cookie: ' + seenSplash);

      if (!seenSplash) {
        seenSplash = true;
        $.cookie(seenSplashKey, "true");
        utils.debug('ReposRoute::redirect:> Transition to splash');
        this.transitionTo('splash');
      }
    }
  });
});