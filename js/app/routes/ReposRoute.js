define([
  'jquery',
  'ember',
  'ext/SetupLastBuildMixin',
  'models/Repo',
  'app/utils',
  'jquery-cookie'
], function ($, Ember, SetupLastBuildMixin, Repo, utils) {
  "use strict";
  var seenSplashKey = 'seen-splash';

  return Ember.Route.extend(SetupLastBuildMixin, {
    enter           : function () {
      var seenSplash = $.cookie(seenSplashKey);

      if (!seenSplash) {
        $.cookie(seenSplashKey, "true");
        utils.debug('IndexRoute::redirect:> Transition to splash');
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