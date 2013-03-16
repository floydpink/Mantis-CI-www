define([
  'ember',
  'models/Repo'
], function (Ember, Repo) {
  return Ember.ArrayController.extend({
    searchObserver: function () {
      var search = this.get('search');
      if (search) {
        return this.searchFor(search);
      } else {
        this.set('content', Repo.find());
      }
    }.observes('search'),
    searchFor: function (phrase) {
      if (this.searchLater) {
        Ember.run.cancel(this.searchLater);
      }
      return this.searchLater = Ember.run.later(this, function () {
        this.set('content', Repo.search(phrase));
      }, 500);
    }
  });
});