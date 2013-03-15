define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    model: function (params) {
      utils.debug('RepoRoute::model:> params: ' + JSON.stringify(params));
      return Repo.find(params['id']);
    }
  });
});