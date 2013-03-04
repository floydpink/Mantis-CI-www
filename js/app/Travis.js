define([
  'ember',
  'app/utils',
  'app/IndexView'
], function (Ember, utils, IndexView) {

  var Travis = Ember.Application.create({
//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
    LOG_TRANSITIONS:true,
//>>excludeEnd('appBuildExclude');
    ready:function () {
      utils.log('Ember is ready');
    },
    IndexView:IndexView
  });

  return Travis;
});
