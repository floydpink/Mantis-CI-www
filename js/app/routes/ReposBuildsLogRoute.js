define([
  'ember',
  'app/utils',
  'models/Builds'
], function (Ember, utils) {
  return Ember.Route.extend({
    setupController: function(controller, model){
      controller.set('content', model);
      setTimeout(function(){
        utils.debug('Log for ' + model);
      }, 500);
    }
  });
});