define([
  'views/PageView',
  'hbs!index'
], function (PageView) {
  return PageView.extend({
    templateName: 'index',
    attributeBindings: ['style', 'id'],
    'style': 'display: none;',
    'id': 'index'
  });
});