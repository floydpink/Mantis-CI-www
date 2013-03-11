define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    model: function (params) {
      utils.debug('In RepoRoute model');
      return Repo.find(params['id']);
    }
  });
});