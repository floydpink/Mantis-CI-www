define([
  'models/TravisModel',
  'ember-data'
], function (TravisModel, DS) {

  return TravisModel.extend({
    buildId           : DS.attr('number'),
    sha               : DS.attr('string'),
    branch            : DS.attr('string'),
    message           : DS.attr('string'),
    compareUrl        : DS.attr('string'),
    authorName        : DS.attr('string'),
    authorEmail       : DS.attr('string'),
    committerName     : DS.attr('string'),
    committerEmail    : DS.attr('string'),
    pullRequestNumber : DS.attr('number'),
    build             : DS.belongsTo('App.Build')
  });

});