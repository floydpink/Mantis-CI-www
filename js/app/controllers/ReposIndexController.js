define([
  'ext/jquery.ext',
  'ember',
  'visibility',
  'models/Repo',
  'ext/LimitedArray',
  'ext/Helpers',
  'app/utils'
], function ($, Ember, Visibility, Repo, LimitedArray, Helpers, utils) {

  var ReposIndexController = Ember.ArrayController.extend({
    isLoadedBinding  : 'content.isLoaded',
    isLoadingBinding : 'content.isLoading',
    needs            : ['repos'],
    init             : function () {
      utils.debug('ReposIndexController::init');
      this._super.apply(this, arguments);
      return Visibility.every(Helpers.updateInterval, this.updateTimes.bind(this));
    },
    recentRepos      : function () {
      utils.debug('ReposIndexController::recentRepos');
      return LimitedArray.create({
        content : Ember.ArrayProxy.extend(Ember.SortableMixin).create({
          sortProperties  : ['sortOrder'],
          content         : Repo.withLastBuild(),
          isLoadedBinding : 'content.isLoaded'
        }),
        limit   : 30
      });
    }.property(),
    updateTimes      : function () {
      var content = this.get('content');
      if (content) {
        content.forEach(function (r) {
          return r.updateTimes();
        });
      }
    },
    activate         : function () {
      utils.debug('ReposIndexController::activate:>');
      this.get('controllers.repos').set('search', '');
      return this.set('content', this.get('recentRepos'));
    }
  });

  return  ReposIndexController;
});