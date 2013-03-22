define([
  'ember',
  'app/utils',
  'store/TravisStore',
  'app/views',
  'app/routes',
  'app/controllers',
  'app/models'
], function (Ember, utils, Store, views, routes, controllers, models) {
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

  // analytics - http://codebrief.com/2012/10/ember-dot-js-analytics-integration/
  App.ApplicationController = Ember.Controller.extend({
    routeChanged: (function() {
      if (!window._gaq) {
        return;
      }
      return Em.run.next(function() {
        _gaq.push(['_trackPageview']);
        return mixpanel.track_pageview();
      });
    }).observes('currentPath')
  });

  //Routes
  App.Router.map(function () {
    this.resource('splash');
    this.resource('about');
    this.resource('repos', {path : '/repos/'});
    this.resource('repo', {path : '/repos/:owner/:name'});
  });

  App.Router.reopen({
    location : 'none'
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
