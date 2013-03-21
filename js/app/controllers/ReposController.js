define([
  'ember',
  'models/Repo',
  'ext/LimitedArray',
  'app/utils'
], function (Ember, Repo, LimitedArray, utils) {

  var updateInterval = 1000;

  var ReposController = Ember.ArrayController.extend({
    isLoadedBinding : 'content.isLoaded',
    init: function() {
      this._super.apply(this, arguments);
      return Ember.run.later(this, this.updateTimes.bind(this), updateInterval);
    },
    recentRepos     : function () {
      return LimitedArray.create({
        content : Ember.ArrayProxy.extend(Ember.SortableMixin).create({
          sortProperties  : ['sortOrder'],
          content         : Repo.find(),
          isLoadedBinding : 'content.isLoaded'
        }),
        limit   : 30
      });
    }.property(),
    updateTimes: function() {
      var content = this.get('content');
      if (content) {
        content.forEach(function(r) {
          return r.updateTimes();
        });
      }
      return Ember.run.later(this, this.updateTimes.bind(this), updateInterval);
    },
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
      utils.debug('ReposController::activate:>');
      this.set('content', Repo.find());
    }
  });

  return  ReposController;

});