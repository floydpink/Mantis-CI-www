define([
  'ember-data'
], function (DS) {
  return DS.Store.extend({
    revision: 11,
    adapter: 'DS.FixtureAdapter'
  });
});