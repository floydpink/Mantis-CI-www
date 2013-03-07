define([
  'ember',
  'models/Repo'
], function (Ember, Repo) {
  return Ember.Route.extend({
    model: function () {
      return Repo.find();
    }
  });
});