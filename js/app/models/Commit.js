define([
  'models/TravisModel',
  'ember-model'
], function (TravisModel, Ember) {

  return TravisModel.extend({
    buildId           : Ember.attr('number'),
    sha               : Ember.attr('string'),
    branch            : Ember.attr('string'),
    message           : Ember.attr('string'),
    compareUrl        : Ember.attr('string'),
    authorName        : Ember.attr('string'),
    authorEmail       : Ember.attr('string'),
    committerName     : Ember.attr('string'),
    committerEmail    : Ember.attr('string'),
    build             : Ember.belongsTo('App.Build')
  });

});