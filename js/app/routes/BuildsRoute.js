define([
  'ember',
  'models/Build',
  'app/utils'
], function (Ember, Build, utils) {
  return Ember.Route.extend({
    model: function (params) {
      utils.debug('In BuildsRoute model');
      return Build.find(params['id']);
    }
  });
});