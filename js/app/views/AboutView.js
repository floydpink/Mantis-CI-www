define([
  'views/MainView',
  'hbs!about'
], function (MainView) {
  return MainView.extend({
    templateName      : 'about',
    attributeBindings : ['id'],
    'id'              : 'about'
  });
});