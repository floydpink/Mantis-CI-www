define([
  'ember',
  'ext/Favorites',
  'models/Repo',
  'app/utils'
], function (Ember, Favorites, Repo, utils) {
  return Ember.ArrayController.extend({
    isLoadedBinding : 'content.isLoaded',
    favorites       : function (favorites) {
      utils.debug('FavoritesController::favorites:> favorites: ' + favorites);
      this.set('content', Repo.favorites(favorites));
    },
    clearFavorites  : function () {
      Favorites.clear();
    }
  });
});