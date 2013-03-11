define([
  'views/PageView',
  'hbs!repos'
], function (PageView) {
  return PageView.extend({
    templateName: 'repos',
    attributeBindings: ['id'],
    'id': 'repos'
  });
});