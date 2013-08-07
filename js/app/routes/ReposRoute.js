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
    redirect        : function () {
      utils.debug('ReposRoute::redirect:> seenSplash before reading cookie: ' + seenSplash);
      seenSplash = seenSplash || $.cookie(seenSplashKey);
      utils.debug('ReposRoute::redirect:> seenSplash after reading cookie: ' + seenSplash);

      if (!seenSplash) {
        seenSplash = true;
        $.cookie(seenSplashKey, "true");
        utils.debug('ReposRoute::redirect:> Transition to splash');
        this.transitionTo('splash');
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