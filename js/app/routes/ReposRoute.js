define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    setupController:function(controller, model){
      utils.debug('RepoRoute::setupController:> controller: ' + controller);
      utils.debug('RepoRoute::setupController:> model: ' + model);
    },
    model: function () {
      utils.debug('ReposRoute::model:>');
      return Repo.find();
    }
  });
});