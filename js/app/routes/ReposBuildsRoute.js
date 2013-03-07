define([
  'ember',
  'models/Builds'
], function (Ember, Builds) {
  return Ember.Route.extend({
    model: function (param) {
      return Builds.find(param['build_id']);
    },
    setupController: function(controller, model){
      controller.set('content', model);
    }
  });
});