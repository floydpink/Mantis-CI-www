define([
  'ember',
  'app/utils',
  'store/TravisStore',
  'store/TravisAdapter',
  'app/pusher',
  'ext/Helpers',
  'app/views',
  'app/routes',
  'app/controllers',
  'app/models'
], function (Ember, utils, Store, Adapter, Pusher, Helpers, views, routes, controllers, models) {
  "use strict";
  //createWithMixins from here - https://github.com/emberjs/ember.js/issues/2184
  var App = Ember.Application.createWithMixins({
    //>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
    LOG_TRANSITIONS : true,
    //>>excludeEnd('appBuildExclude');
    VERSION         : '0.0.1',
    Store           : Store,
    init            : function () {
      utils.debug('app::init:> App init');
      this.deferReadiness();
      this._super();
    },
    ready           : function () {
      utils.debug('app::init:> App ready');
    }
  });

  //Routes
  App.Router.map(function () {
    this.resource('splash');
    this.resource('about');
    this.resource('repos', {path : '/repos/'});
    this.resource('repo', {path : '/repos/:owner/:name'}, function () {
      this.resource('build', {path : '/builds/:build_id'});
      this.resource('job', { path : '/jobs/:job_id' });
      this.resource('builds', {path : '/builds'});
      this.resource('pullRequests', { path : '/pull_requests' });
      this.resource('branches', { path : '/branches' });
    });
  });

  App.Router.reopen({
    //location : 'none'
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
//  Ember.LOG_BINDINGS = true;
//>>excludeEnd('appBuildExclude');

  //setup instance of store
  App.store = App.Store.create({
    adapter : Adapter.create({})
  });

  //setup instance of pusher
  App.pusher = new Pusher(Helpers.pusher_key);

  window.App = App;

  return App;
});
