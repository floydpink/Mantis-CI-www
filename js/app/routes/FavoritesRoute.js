define([
         'ember',
         'ext/DontSetupModelForControllerMixin',
         'models/Repo',
         'ext/Favorites',
         'app/utils'
       ], function (Ember, DontSetupModelForControllerMixin, Repo, Favorites, utils) {
  return Ember.Route.extend(DontSetupModelForControllerMixin, {
    setupController : function () {
      utils.debug('FavoritesRoute::setupController:>');
      this.container.lookup('controller:favorites').favorites(Favorites.getAll());
    }
  });
});