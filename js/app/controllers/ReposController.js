define([
  'ext/jquery.ext',
  'ember',
  'visibility',
  'models/Repo',
  'ext/LimitedArray',
  'ext/Helpers',
  'ext/LargeDeviceWarningDismissedMixin',
  'app/utils'
], function ($, Ember, Visibility, Repo, LimitedArray, Helpers, LargeDeviceWarningDismissedMixin, utils) {

  var ReposController = Ember.ArrayController.extend(LargeDeviceWarningDismissedMixin, {
    defaultTab           : 'recent',
    isLoadedBinding      : 'content.isLoaded',
    isLoadingBinding     : 'content.isLoading',
    needs                : ['repo'],
    init                 : function () {
      utils.debug('ReposController::init');
      this._super.apply(this, arguments);
      return Visibility.every(Helpers.updateInterval, this.updateTimes.bind(this));
    },
    recentRepos          : function () {
      utils.debug('ReposController::recentRepos');
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
    },
    activate             : function (tab, params) {
      utils.debug('ReposController::activate:> tab: ' + tab);
      tab = tab || this.defaultTab;
      return this["view" + ($.camelize(tab))](params);
    },
    viewRecent           : function () {
      utils.debug('ReposController::viewRecent:>');
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
      utils.debug('ReposController::searchObserver');
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