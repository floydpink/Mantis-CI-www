define([
  'ember-model',
  'models/TravisModel'
], function (Ember, TravisModel) {
  return TravisModel.extend({
    primaryKey : 'login',
    login      : Ember.attr('string'),
    name       : Ember.attr('string'),
    type       : Ember.attr('string'),
    reposCount : Ember.attr(Number),
    urlGithub  : function () {
      return "http://github.com/" + (this.get('login'));
    }.property()
  });
});