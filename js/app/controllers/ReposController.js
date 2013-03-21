define([
  'ext/jquery.ext',
  'ember',
  'models/Repo',
  'ext/LimitedArray',
  'app/utils'
], function ($, Ember, Repo, LimitedArray, utils) {

  var ReposController = Ember.ArrayController.extend({
    updateInterval  : 1000,
    defaultTab      : 'recent',
    isLoadedBinding : 'content.isLoaded',
    init            : function () {
      this._super.apply(this, arguments);
      return Ember.run.later(this, this.updateTimes.bind(this), this.updateInterval);
    },
    recentRepos     : function () {
      return LimitedArray.create({
        content : Ember.ArrayProxy.extend(Ember.SortableMixin).create({
          sortProperties  : ['sortOrder'],
          content         : Repo.find(),
          isLoadedBinding : 'content.isLoaded'
        }),
        limit   : 25
      });
    }.property(),
    updateTimes     : function () {
      utils.debug('ReposController::updateTimes:>');
      var content = this.get('content');
      if (content) {
        content.forEach(function (r) {
          return r.updateTimes();
        });
      }
      return Ember.run.later(this, this.updateTimes.bind(this), this.updateInterval);
    },
    reload          : function () {
      this.set('content', Repo.find());
      this.activate();
    },
    activate        : function (tab, params) {
      utils.debug('ReposController::activate:>');
      tab = tab || this.defaultTab;
      return this['view' + ($.camelize(tab))](params);
    },
    viewRecent      : function () {
      utils.debug('ReposController::viewRecent:>');
      return this.set('content', this.get('recentRepos'));
    },
    viewSearch      : function (params) {
      utils.debug('ReposController::viewSearch:>');
      return this.set('content', Repo.search(params.search));
    },
    searchObserver  : function () {
      var search = this.get('search');
      if (search) {
        return this.searchFor(search);
      } else {
        this.activate('recent');
        return 'recent';
      }
    }.observes('search'),
    searchFor       : function (phrase) {
      if (this.searchLater) {
        Ember.run.cancel(this.searchLater);
      }
      return this.searchLater = Ember.run.later(this, function () {
        utils.debug('ReposController::searchFor::runLater:> phrase: ' + phrase);
        return this.activate('search', {
          search : phrase
        });
      }, 500);
    },
    clearSearch     : function () {
      this.set('search', '');
    }
  });

  return  ReposController;

});