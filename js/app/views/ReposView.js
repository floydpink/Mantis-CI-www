define([
  'ember',
  'hbs!repos'
], function (Ember) {
  return Ember.View.extend({
    templateName: 'repos',
    attributeBindings: ['id'],
    'id': 'repos'
  });
});