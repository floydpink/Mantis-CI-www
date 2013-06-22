define([
         'jquery',
         'ember',
         'app/utils'
       ], function ($, Ember, utils) {
  return Ember.Route.extend({
                              enter : function () {
                                utils.debug('SplashRoute::enter:>');

                                Ember.run.later(this, function () {
                                  utils.debug('SplashRoute::enter::run.later> Remove splash and redirect after timeout');
                                  $('#splash').fadeOut().detach();
                                  this.transitionTo('repos');
                                }, 1500);
                              }
                            });
});