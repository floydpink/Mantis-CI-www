define([
  'ember-data'
], function (DS) {

  var Repo = DS.Model.extend({
    slug: DS.attr('string'),
    description: DS.attr('string'),
    public_key: DS.attr('string'),
    last_build_id: DS.attr('number'),
    last_build_number: DS.attr('string'),
    last_build_status: DS.attr('number'),
    last_build_result: DS.attr('number'),
    last_build_duration: DS.attr('number'),
    last_build_language: DS.attr('string'),
    last_build_started_at: DS.attr('date'),
    last_build_finished_at: DS.attr('date'),
    gitHubUrl: function () {
      return 'https://github.com/' + this.get('slug');
    }.property('slug')
  });

  Repo.reopenClass({
    'url': 'https://api.travis-ci.org/repos/'
  });

  return Repo;
});