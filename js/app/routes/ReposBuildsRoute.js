define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    model: function (param) {
      utils.debug('in RepoBuildsRoute model');
      var builds = Repo.find(param['repo_id']);
      return  builds;
    },
    setupController: function (controller, model) {
      utils.debug('in RepoBuildsRoute setupController');
      controller.set('content', model);
    }
  });
});