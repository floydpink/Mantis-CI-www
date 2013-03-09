define([
  'ember',
  'app/utils'
], function (Ember, utils) {
  "use strict";
  return Ember.Route.extend({
    redirect: function () {
      utils.debug('In Index Route redirect');
      this.transitionTo('repos');
    },
    enter: function () {
      utils.debug('In Index Route enter');
    }
  });
});