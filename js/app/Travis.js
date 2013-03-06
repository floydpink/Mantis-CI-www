define([
  'ember',
  'app/utils',
  'app/IndexView'
], function (Ember, utils, IndexView) {

  // check out this for debugging tips - http://www.akshay.cc/blog/2013-02-22-debugging-ember-js-and-ember-data.html
  var Travis = Ember.Application.create({
//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
    LOG_TRANSITIONS:true,
//>>excludeEnd('appBuildExclude');
    ready:function () {
      utils.log('Ember is ready');
    },
    IndexView:IndexView
  });

  //Routes
  Travis.Router.map(function(){
    this.resource('builds');
  });

//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
  Ember.LOG_BINDINGS = true;
//>>excludeEnd('appBuildExclude');

  return Travis;
});
