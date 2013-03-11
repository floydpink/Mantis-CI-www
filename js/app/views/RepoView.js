define([
  'views/PageView',
  'hbs!repo'
], function (PageView) {
  return PageView.extend({
    templateName: 'repo',
    attributeBindings: ['id'],
    'id': 'repo'
  });
});