define([
  'ember',
  'hbs!page'
], function (Ember) {
  return Ember.View.extend({
    layoutName: 'page',
    attributeBindings: ['data-role'],
    'data-role': 'page'
  });
});