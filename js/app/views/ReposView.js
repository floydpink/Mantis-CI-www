define([
  'views/MainView',
  'ext/ember/handlebars',
  'hbs!repos'
], function (MainView) {
  return MainView.extend({
    templateName      : 'repos',
    attributeBindings : ['id'],
    'id'              : 'repos'
  });
});