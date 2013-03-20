define([
  'ember',
  'models/Repo',
  'ext/LimitedArray',
  'app/utils'
], function (Ember, Repo, LimitedArray, utils) {
  return Ember.ArrayController.extend({
    isLoadedBinding : 'content.isLoaded',
    recentRepos     : function () {
      utils.debug('ReposController::recentRepos:>');
      return LimitedArray.create({
        content : Ember.ArrayProxy.extend(Ember.SortableMixin).create({
          sortProperties  : ['sortOrder'],
          content         : Repo.withLastBuild(),
          isLoadedBinding : 'content.isLoaded'
        }),
        limit   : 30
      });
    }.property(),
    searchObserver  : function () {
      var search = this.get('search');
      if (search) {
        return this.searchFor(search);
      } else {
        this.set('content', this.get('recentRepos'));
      }
    }.observes('search'),
    searchFor       : function (phrase) {
      if (this.searchLater) {
        Ember.run.cancel(this.searchLater);
      }
      return this.searchLater = Ember.run.later(this, function () {
        this.set('content', Repo.search(phrase));
      }, 500);
    },
    clearSearch     : function () {
      this.set('search', '');
    },
    activate        : function () {
      return function () {
        this.set('content', this.get('recentRepos'));
      };
    }
  });
});