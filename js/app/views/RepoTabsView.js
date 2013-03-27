define([
  'ember',
  'hbs!repo/tabs'
], function (Ember) {
  return Ember.View.extend({
    templateName      : 'repo/tabs',
    attributeBindings : ['id'],
    'id'              : 'repoTabs'
  });
});