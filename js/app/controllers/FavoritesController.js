define([
  'ember',
  'ext/Favorites',
  'models/Repo',
  'ext/LargeDeviceWarningDismissedMixin',
  'app/utils'
], function (Ember, Favorites, Repo, LargeDeviceWarningDismissedMixin, utils) {
  return Ember.ArrayController.extend(LargeDeviceWarningDismissedMixin, {
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