define([
  'ember',
  'ext/DontSetupModelForControllerMixin',
  'models/Repo',
  'app/utils'
], function (Ember, DontSetupModelForControllerMixin, Repo, utils) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, {
    setupController : function () {
      utils.debug('FavoritesRoute::setupController:>');
      this.container.lookup('controller:favorites').activate();
    }
  });
});