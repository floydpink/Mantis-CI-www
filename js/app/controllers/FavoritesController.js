define([
  'ember',
  'ext/Favorites',
  'models/Repo',
  'ext/LargeDeviceWarningDismissedMixin',
  'app/utils'
], function (Ember, Favorites, Repo, LargeDeviceWarningDismissedMixin, utils) {
  return Ember.ArrayController.extend(LargeDeviceWarningDismissedMixin, {
    needs                 : 'repo',
    repoBinding           : 'controllers.repo',
    isLoadedBinding       : 'content.isLoaded',
    favorites             : [],
    updateContent         : function () {
      var favorites = this.get('favorites');
      utils.debug('FavoritesController::updateContent:> favorites: ' + JSON.stringify(favorites));
      this.set('content', Repo.favorites(favorites));
    }.observes('favorites'),
    clearFavoritesVisible : function () {
      var favorites = this.get('favorites');
      utils.debug('FavoritesController::clearFavoritesVisible:> favorites: ' + JSON.stringify(favorites));
      return favorites.length;
    }.property('favorites'),
    activate              : function () {
      this.set('favorites', []);
      var favorites = Favorites.getAll();
      utils.debug('FavoritesController::favorites:> activate: ' + JSON.stringify(favorites));
      this.set('favorites', favorites);
    },
    clearFavorites        : function () {
      if (window.confirm('Are you sure you want to clear the list of Favorites?')) {
        utils.debug('FavoritesController::clearFavorites:>');
        this.set('favorites', []);
        this.set('content', []);
        this.set('content.isLoaded', true);
        Favorites.clear();
      }
    }
  });
});