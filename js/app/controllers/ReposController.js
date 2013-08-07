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
    init                 : function () {
      utils.debug('ReposController::init');
      this._super.apply(this, arguments);
    },
    enterPressedOnSearch : function () {
      $('#search').blur();
    },
    searchObserver       : function () {
      var phrase = $.trim(this.get('search'));
      if (phrase) {
        this.searchFor(phrase);
      } else {
        this.transitionToRoute('repos.index');
        Ember.run.next(this, Helpers.styleActiveNavbarButton);
      }
    }.observes('search'),
    searchFor            : function (phrase) {
      if (this.searchLater) {
        Ember.run.cancel(this.searchLater);
      }
      return this.searchLater = Ember.run.later(this, function () {
        utils.debug('ReposController::searchFor::runLater:> phrase: ' + phrase);
        this.transitionToRoute('search', phrase);
        Ember.run.next(this, Helpers.styleActiveNavbarButton);
      }, 500);
    },
    clearSearch          : function () {
      this.set('search', '');
    }
  });

  return  ReposController;
});