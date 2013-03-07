define([
  'views/PageView',
  'hbs!repos'
], function (PageView) {
  var ReposView = PageView.extend({
    attributeBindings: ['id'],
    'id': 'repos',
    templateName: 'repos'
  });
  return ReposView;
});