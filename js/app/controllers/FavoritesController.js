define([
  'ember',
  'ext/Favorites',
  'models/Repo',
  'ext/LargeDeviceWarningDismissedMixin',
  'app/utils'
], function (Ember, Favorites, Repo, LargeDeviceWarningDismissedMixin, utils) {
  return Ember.ArrayController.extend(LargeDeviceWarningDismissedMixin, {
    needs           : 'repo',
    repoBinding     : 'controllers.repo',
    isLoadedBinding : 'content.isLoaded',
    favorites       : function (favorites) {
      utils.debug('FavoritesController::favorites:> favorites: ' + favorites);
      this.set('content', Repo.favorites(favorites));
    },
    clearFavorites  : function () {
      if (window.confirm('Are you sure you want to clear the list of Favorites?')) {
        utils.debug('FavoritesController::clearFavorites:>');
        this.set('content', []);
        this.set('content.isLoaded', true);
        Favorites.clear(this);
      }
    }
  });
});