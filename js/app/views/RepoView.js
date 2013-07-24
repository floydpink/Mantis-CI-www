define([
  'views/MainView',
  'hbs!repo'
], function (MainView) {
  return MainView.extend({
    templateName      : 'repo',
    attributeBindings : ['id'],
    'id'              : 'repo'
  });
});