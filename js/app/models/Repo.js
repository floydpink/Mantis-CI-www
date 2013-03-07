define([
  'ember-data'
], function (DS) {
  return DS.Model.extend({
    name: DS.attr('string'),
    tracks: DS.hasMany('Travis.Builds')
  });
});