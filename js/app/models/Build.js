define([
  'ember-data'
], function (DS) {

  var Build = DS.Model.extend({
    repository_id: DS.attr('number'),
    number: DS.attr('string'),
    //config: DS.attr('object'), //??
    state: DS.attr('string'),
    result: DS.attr('number'),
    status: DS.attr('number'),
    started_at: DS.attr('date'),
    finished_at: DS.attr('date'),
    duration: DS.attr('number'),
    commit: DS.attr('string'),
    branch: DS.attr('string'),
    message: DS.attr('string'),
    committed_at: DS.attr('date'),
    author_name: DS.attr('string'),
    author_email: DS.attr('string'),
    committer_name: DS.attr('string'),
    committer_email: DS.attr('string'),
    compare_url: DS.attr('string'),
    event_type: DS.attr('string')
    //matrix: DS.attr('object'), //??
  });

  Build.reopenClass({
    'url': 'https://api.travis-ci.org/builds/'
  });

  return Build;
});