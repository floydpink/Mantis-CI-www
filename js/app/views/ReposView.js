define([
         'views/MainView',
         'hbs!repos'
       ], function (MainView) {
  return MainView.extend({
                           templateName      : 'repos',
                           attributeBindings : ['id'],
                           'id'              : 'repos'
                         });
});