define([
  'views/PageView',
  'hbs!repos'
], function (PageView) {
  return PageView.extend({
    templateName: 'repos',
    attributeBindings: ['id','style'],
    'id': 'repos',
    'style':'display:none;'
  });
});