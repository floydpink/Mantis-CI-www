define([
  'jquery',
  'ember',
  'app/utils'
], function ($, Ember, utils) {
  return Ember.Route.extend({
    enter: function () {
      utils.debug('In SplashRoute enter');

      //remove splash after a slight delay and redirect to repos
      Ember.run.later(this, function () {
        utils.debug('Remove splash and redirect after timeout');
        $('#splash').fadeOut().detach();
        this.transitionTo('repos');
      }, 1500);
    }
  });
});