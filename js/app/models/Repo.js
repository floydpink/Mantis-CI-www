define([
  'ember-data'
], function (DS) {
  var Repo = DS.Model.extend({
    name: DS.attr('string'),
    tracks: DS.hasMany('App.Builds')
  });

  return Repo;
});