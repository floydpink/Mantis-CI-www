define([
  'ember-data',
  'models/Repo',
  'models/Build'
], function (DS, Repo, Build) {

  var RepoSummary = DS.Model.extend({
    slug: DS.attr('string'),
    description: DS.attr('string'),
    last_build_id: DS.attr('number'),
    last_build_number: DS.attr('string'),
    last_build_status: DS.attr('number'),
    last_build_result: DS.attr('number'),
    last_build_duration: DS.attr('number'),
    last_build_language: DS.attr('string'),
    last_build_started_at: DS.attr('date'),
    last_build_finished_at: DS.attr('date'),
    repo: DS.belongsTo(Repo),
    latestBuild: DS.belongsTo(Build)
  });

  RepoSummary.reopenClass({
    'url': 'https://api.travis-ci.org/repos/'
  });

  return RepoSummary;
});