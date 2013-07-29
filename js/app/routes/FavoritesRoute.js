define([
  'ember',
  'models/Repo',
  'app/utils'
], function (Ember, Repo, utils) {
  return Ember.Route.extend({
    setupController : function () {
      utils.debug('FavoritesRoute::setupController:>');
      this.container.lookup('controller:favorites').activate();
    }
  });
});