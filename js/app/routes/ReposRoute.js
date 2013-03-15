define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    model: function () {
      utils.debug('ReposRoute::model:>');
      return Repo.find();
    }
  });
});