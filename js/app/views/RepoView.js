define([
  'ember',
  'hbs!repo'
], function (Ember) {
  return Ember.View.extend({
    templateName: 'repo',
    attributeBindings: ['id'],
    'id': 'repo'
  });
});