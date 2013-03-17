define([
  'ember-data',
  'store/TravisAdapter'
], function (DS, Adapter) {
  return DS.Store.extend({
    revision: 11,
    adapter: Adapter.create({})
  });
});