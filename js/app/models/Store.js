define([
  'ember-data',
  'models/Adapter'
], function (DS, Adapter) {
  return DS.Store.extend({
    revision: 11,
    adapter: Adapter
  });
});