/* globals App */
define([
  'ember-model',
  'models/TravisModel'
], function (Ember, TravisModel) {
  var Event = TravisModel.extend({
    event      : Ember.attr('string'),
    repoId     : Ember.attr('number', {
      key : 'repository_id'
    }),
    sourceId   : Ember.attr('number', {
      key : 'source_id'
    }),
    sourceType : Ember.attr('string', {
      key : 'source_type'
    }),
    createdAt  : Ember.attr('string', {
      key : 'created_at'
    }),
    event_     : function () {
      return this.get('event');
    }.property('event'),
    state      : function () {
      return this.get('data.data.state');
    }.property('data.data.state'),
    message    : function () {
      return this.get('data.data.message');
    }.property('data.data.message'),
    source     : function () {
      var type;
      if (type = this.get('sourceType')) {
        return App[type].find(this.get('sourceId'));
      }
    }.property('sourceType', 'sourceId')
  });

  Event.reopenClass({
    byRepoId : function (id) {
      return this.find({
        repository_id : id
      });
    }
  });

  return Event;
});