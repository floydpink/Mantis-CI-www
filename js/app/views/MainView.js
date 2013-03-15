define([
  'ember',
  'hbs!main'
], function (Ember) {
  return Ember.View.extend({
    templateName: 'main',
    attributeBindings: ['id', 'data-role', 'class'],
    'id': 'main',
    'data-role': 'page',
    'class': 'ui-page ui-body-c ui-page-active'
  });
});
