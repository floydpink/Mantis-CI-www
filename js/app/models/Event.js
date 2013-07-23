/* globals App */
define([
  'ember-data',
  'models/TravisModel'
], function (DS, TravisModel) {
  var Event = TravisModel.extend({
    event     : DS.attr('string'),
    repoId    : DS.attr('number', {
      key: 'repository_id'
    }),
    sourceId  : DS.attr('number', {
      key: 'source_id'
    }),
    sourceType: DS.attr('string', {
      key: 'source_type'
    }),
    createdAt : DS.attr('string', {
      key: 'created_at'
    }),
    event_    : function () {
      return this.get('event');
    }.property('event'),
    state     : function () {
      return this.get('data.data.state');
    }.property('data.data.state'),
    message   : function () {
      return this.get('data.data.message');
    }.property('data.data.message'),
    source    : function () {
      var type;
      if (type = this.get('sourceType')) {
        return App[type].find(this.get('sourceId'));
      }
    }.property('sourceType', 'sourceId')
  });

  Event.reopenClass({
    byRepoId: function (id) {
      return this.find({
        repository_id: id
      });
    }
  });

  return Event;
});