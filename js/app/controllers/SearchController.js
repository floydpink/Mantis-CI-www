define([
  'ext/jquery.ext',
  'ember',
  'visibility',
  'models/Repo',
  'ext/LimitedArray',
  'ext/Helpers',
  'app/utils'
], function ($, Ember, Visibility, Repo, LimitedArray, Helpers, utils) {

  var SearchController = Ember.ArrayController.extend({
    isLoadedBinding  : 'content.isLoaded',
    isLoadingBinding : 'content.isLoading',
    needs            : ['repo'],
    init             : function () {
      utils.debug('SearchController::init');
      this._super.apply(this, arguments);
      return Visibility.every(Helpers.updateInterval, this.updateTimes.bind(this));
    },
    updateTimes      : function () {
      var content = this.get('content');
      if (content) {
        content.forEach(function (r) {
          return r.updateTimes();
        });
      }
    },
    activate         : function (phrase) {
      utils.debug('SearchController::activate:> phrase: ' + JSON.stringify(phrase));
      return this.set('content', Repo.search(phrase));
    }
  });

  return  SearchController;
});