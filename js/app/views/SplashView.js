define([
  'jquery',
  'ember',
  'app/utils',
  'hbs!splash'
], function ($, Ember, utils) {
  return Ember.View.extend({
    templateName      : 'splash',
    attributeBindings : ['id', 'style'],
    'id'              : 'splash',
    'style'           : 'display: none',
    didInsertElement  : function () {
      //setup and show splash
      utils.debug('SplashView::didInsertElement:> Show splash');
      var widthOrHeight = $(window).height() > $(window).width() ? 'width' : 'height';
      $('#splash-content').find('img').css(widthOrHeight, '70%');
      $('#splash').fadeIn();
    }
  });
});