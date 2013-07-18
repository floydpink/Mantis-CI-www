define([
  'ext/jquery.ext',
  'ember',
  'models/Repo',
  'ext/LimitedArray',
  'ext/Helpers',
  'ext/LargeDeviceWarningDismissedMixin',
  'app/utils'
], function ($, Ember, Repo, LimitedArray, Helpers, LargeDeviceWarningDismissedMixin, utils) {

  var ReposController = Ember.ArrayController.extend(LargeDeviceWarningDismissedMixin, {
    defaultTab           : 'recent',
    isLoadedBinding      : 'content.isLoaded',
    needs                : ['repo'],
    init                 : function () {
      this._super.apply(this, arguments);
      return Ember.run.later(this.updateTimes.bind(this), Helpers.updateInterval);
    },
    recentRepos          : function () {
      Repo.find();
      return LimitedArray.create({
        content : Ember.ArrayProxy.extend(Ember.SortableMixin).create({
          sortProperties  : ['sortOrder'],
          content         : Repo.withLastBuild(),
          isLoadedBinding : 'content.isLoaded'
        }),
        limit   : 30
      });
    }.property(),
    updateTimes          : function () {
      var content = this.get('content');
      if (content) {
        content.forEach(function (r) {
          return r.updateTimes();
        });
      }
      return Ember.run.later(this.updateTimes.bind(this), Helpers.updateInterval);
    },
    activate             : function (tab, params) {
      utils.debug('ReposController::activate:> tab: ' + tab);
      tab = tab || this.defaultTab;
      return this["view" + ($.camelize(tab))](params);
    },
    viewRecent           : function () {
      return this.set('content', this.get('recentRepos'));
    },
    viewSearch           : function (params) {
      utils.debug('ReposController::viewSearch:>');
      return this.set('content', Repo.search(params.search));
    },
    enterPressedOnSearch : function () {
      $('#search').blur();
    },
    searchObserver       : function () {
      var search = this.get('search');
      if (search) {
        return this.searchFor($.trim(search));
      } else {
        this.activate('recent');
        return 'recent';
      }
    }.observes('search'),
    searchFor            : function (phrase) {
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
    clearSearch          : function () {
      this.set('search', '');
    }
  });

  return  ReposController;

});