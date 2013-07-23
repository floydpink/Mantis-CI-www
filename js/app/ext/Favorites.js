define([
  'jquery',
  'app/utils',
  'ext/LocalStorage'
], function ($, utils, localStorage) {
  var _favoritesKey = 'favorites',
      _favorites,
      remove = function (array, value) {
        var index;
        while ((index = array.indexOf(value)) !== -1) {
          array.splice(index, 1);
        }
        return array;
      };

  return {
    getAll: function () {
      if (!_favorites) {
        _favorites = JSON.parse(localStorage.getItem(_favoritesKey)) || [];
      }
      utils.debug('Favorites::getAll:> _favorites: ' + JSON.stringify(_favorites));
      return _favorites;
    },
    toggle: function (repoId) {
      if ($.inArray(repoId, this.getAll()) !== -1) {
        utils.debug('Favorites::toggle:> removing ' + repoId);
        _favorites = remove(_favorites, repoId);
      } else {
        utils.debug('Favorites::toggle:> adding ' + repoId);
        _favorites.push(repoId);
      }
      localStorage.setItem(_favoritesKey, JSON.stringify(_favorites));
    },
    clear : function () {
      utils.debug('Favorites::clear:>');
      _favorites = null;
      localStorage.removeItem(_favoritesKey);
    }
  };
});