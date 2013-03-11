define([
  'ember',
  'models/RepoSummary',
  'app/utils'
], function (Ember, RepoSummary, utils) {
  return Ember.Route.extend({
    model: function () {
      utils.debug('In ReposRoute model');
      return RepoSummary.find();
    }
  });
});