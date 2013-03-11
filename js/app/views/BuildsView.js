define([
  'ember',
  'hbs!builds'
], function (Ember) {
  return Ember.View.extend({
    templateName: 'builds',
    attributeBindings: ['id', 'style'],
    'id': 'builds'
  });
});