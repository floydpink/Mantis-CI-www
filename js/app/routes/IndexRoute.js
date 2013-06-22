define([
         'jquery',
         'ember',
         'app/utils',
         'jquery-cookie'
       ], function ($, Ember, utils) {
  "use strict";
  var seenSplashKey = 'seen-splash';

  return Ember.Route.extend({
                              redirect : function () {
                                var seenSplash = $.cookie(seenSplashKey);

                                if (!seenSplash) {
                                  $.cookie(seenSplashKey, "true");
                                  utils.debug('IndexRoute::redirect:> Transition to splash');
                                  this.transitionTo('splash');
                                } else {
                                  utils.debug('IndexRoute::redirect:> Transition to repos');
                                  this.transitionTo('repos');
                                }
                              }
                            });
});