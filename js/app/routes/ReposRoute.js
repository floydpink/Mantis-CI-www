define([
  'jquery',
  'ember',
  'ext/SetupLastBuildMixin',
  'models/Repo',
  'app/utils',
  'jquery-cookie'
], function ($, Ember, SetupLastBuildMixin, Repo, utils) {
  "use strict";
  var seenSplash,
      seenSplashKey = 'seen-splash';

  return Ember.Route.extend(SetupLastBuildMixin, {
    enter           : function () {
      utils.debug('ReposRoute::enter:> seenSplash before reading cookie: ' + seenSplash);
      seenSplash = seenSplash || $.cookie(seenSplashKey);
      utils.debug('ReposRoute::enter:> seenSplash after reading cookie: ' + seenSplash);

      if (!seenSplash) {
        seenSplash = true;
        $.cookie(seenSplashKey, "true");
        utils.debug('ReposRoute::enter:> Transition to splash');
        this.replaceWith('splash');
      }
    },
    setupController : function (controller) {
      utils.debug('ReposRoute::setupController:> start');
      this._super.apply(this, arguments);
      //this.controllerFor('repos').activate();
      // For us the line below does the same job, so commenting out the last line
      controller.set('search', '');
      utils.debug('ReposRoute::setupController:> end');
    }
  });
});