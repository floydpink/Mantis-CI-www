define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    setupController:function(controller, model){
      utils.debug('ReposRoute::setupController:> controller: ' + controller);
      utils.debug('ReposRoute::setupController:> model: ' + model);
      utils.logObject(model);
    },
    model: function () {
      utils.debug('ReposRoute::model:>');
      return Repo.find();
    }
  });
});