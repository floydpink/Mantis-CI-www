define([
  'ember',
  'app/utils',
  'models/Store',
  'app/views',
  'app/routes',
  'app/controllers',
  'app/models'
], function (Ember, utils, Store, views, routes, controllers, models) {
  "use strict";
  //createWithMixins from here - https://github.com/emberjs/ember.js/issues/2184
  var App = Ember.Application.createWithMixins({
    //>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
    LOG_TRANSITIONS: true,
    //>>excludeEnd('appBuildExclude');
    VERSION: '0.0.1',
    Store: Store,
    init: function () {
      utils.debug('app::init:> App init');
      this.deferReadiness();
      this._super();
    },
    ready: function () {
      utils.debug('app::init:> App ready');
    }
  });

  //Routes
  App.Router.map(function () {
    this.resource('splash');
    this.resource('repos', {path: '/'});
    this.resource('repo', {path: '/:owner/:name'});
  });

  utils.debug('app::> App created and App.Router.map set up');

  // routes
  App.reopen(routes);
  // models
  App.reopen(models);
  // views
  App.reopen(views);
  // controllers
  App.reopen(controllers);

  utils.debug('app::> App enriched with routes, models, views & controllers');

//>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
  Ember.LOG_BINDINGS = true;
//>>excludeEnd('appBuildExclude');

  window.App = App;

  return App;
});
