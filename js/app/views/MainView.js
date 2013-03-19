define([
  'ember',
  'hbs!main'
], function (Ember) {
  return Ember.View.extend({
    layoutName        : 'main',
    attributeBindings : ['id', 'data-role', 'class', 'style'],
    'id'              : 'main',
    'data-role'       : 'page',
    'class'           : 'ui-page ui-body-c ui-page-active',
    'style'           : 'min-height: 100%;'
  });
});
