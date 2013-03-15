define([
  'ember-data',
  'store/Adapter'
], function (DS, Adapter) {
  return DS.Store.extend({
    revision: 11,
    adapter: Adapter
  });
});