define([
  'ember',
  'app/utils'
], function (Ember, utils) {
  return Ember.ArrayController.extend({
    searchObserver: function () {
      var search = this.get('search');
      if (search) {
        utils.debug('ReposController::searchObserver:> search: ' + search);
        return this.searchFor(search);
      }
    }.observes('search'),
    searchFor: function (phrase) {
      if (this.searchLater) {
        Ember.run.cancel(this.searchLater);
      }
      return this.searchLater = Ember.run.later(this, function () {
        /*return this.activate('search', {
          search: phrase
        });*/
        // TODO add action for search here
        utils.debug('ReposController::searchFor:> searching for: ' + phrase);
      }, 500);
    }
  });
});