define([
  'app/PageView',
  'hbs!index'
],
  function (PageView) {
    var IndexView = PageView.extend({
      attributeBindings:['style', 'id'],
      'style':'display: none;',
      'id':'index',
      templateName:'index'
    });
    return IndexView;
  });