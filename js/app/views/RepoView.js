define([
  'views/MainView',
  'hbs!repo'
], function (MainView) {
  return MainView.extend({
    templateName: 'repo',
    isLoadedBinding: 'App.Repo.isLoaded',
    attributeBindings: ['id'],
    'id': 'repo'
  });
});