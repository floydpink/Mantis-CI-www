define([
  'ember',
  'hbs!repo'
], function (Ember) {
  return Ember.View.extend({
    templateName: 'repo',
    tagName: 'section',
    attributeBindings: ['id'],
    'id': 'repo'
  });
});