define([
  'jquery',
  'ember',
  'hbs!main'
], function ($, Ember) {
  return Ember.View.extend({
    layoutName        : 'main',
    attributeBindings : ['id', 'data-role', 'class', 'style'],
    'id'              : 'main',
    'data-role'       : 'page',
    'class'           : 'ui-page ui-body-c ui-page-active',
    'style'           : 'min-height: 100%;',
    didInsertElement  : function () {
      var $navbar = $('div[data-role="navbar"]');
      $navbar.find('a').removeClass('ui-btn-active');
      $navbar.find('a.active').addClass('ui-btn-active');
    }
  });
});
