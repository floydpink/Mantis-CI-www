define([
  'views/MainView',
  'hbs!favorites'
], function (MainView) {
  return MainView.extend({
    templateName     : 'favorites',
    attributeBindings: ['id'],
    'id'             : 'favorites'
  });
});