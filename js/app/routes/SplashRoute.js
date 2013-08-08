define([
  'jquery',
  'ember',
  'app/utils'
], function ($, Ember, utils) {
  return Ember.Route.extend({
    afterModel : function () {
      utils.debug('SplashRoute::afterModel:>');

      Ember.run.later(this, function () {
        utils.debug('SplashRoute::afterModel::run.later> Remove splash and redirect after timeout');
        $('#splash').fadeOut().detach();
        this.transitionTo('repos');
      }, 1500);
    }
  });
});