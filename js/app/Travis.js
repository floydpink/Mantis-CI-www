define([
  'ember',
  'app/utils',
  'app/IndexView'
], function (Ember, utils, IndexView) {

  var Travis = Ember.Application.create({
    LOG_TRANSITIONS:true,
    ready:function () {
      utils.log('Ember is ready');
    },
    IndexView:IndexView
  });

  return Travis;
});
