define([
  'views/PageView',
  'hbs!builds'
], function (PageView) {
  return PageView.extend({
    templateName: 'builds',
    attributeBindings: ['id'],
    'data-role': 'builds'
  });
});