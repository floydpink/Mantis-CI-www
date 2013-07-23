define([
  'ember',
  'app/utils',
  'ext/LocalStorage',
  'store/TravisStore',
  'store/TravisAdapter',
  'app/pusher',
  'app/tailing',
  'ext/Helpers',
  'app/views',
  'app/routes',
  'app/controllers',
  'app/models'
], function (Ember, utils, localStorage, Store, Adapter, Pusher, Tailing, Helpers, views, routes, controllers, models) {

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
    start           : function () {
      utils.debug('app::start:> App start');
      this.store = this.Store.create({
        adapter : Adapter.create({})
      });
      this.pusher = new Pusher(Helpers.pusher_key);
      this.tailing = new Tailing();
      this.advanceReadiness();
    },
    reset           : function () {
      utils.debug(' >>>>> Resetting app >>>>>');
      this.start();
    },
    ready           : function () {
      utils.debug('app::init:> App ready');
    }
  });

//  // handle error
//  Ember.onerror = function (error) {
//    utils.error('Ember Error:');
//    utils.logObject(error);
//    App.reset();
//  };
//
  //Routes
  App.Router.map(function () {
    this.resource('splash');
    this.resource('about');
    this.resource('favorites');
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
    location : 'none'
  });

  utils.debug('app::> App created and App.Router.map set up');

  // routes
  App.ApplicationRoute = Ember.Route.extend({
    events : {
      largeDeviceWarningClose : function () {
        utils.debug('App::ApplicationRoute:events:largeDeviceWarningClose:>');
        this.controller.dismissLargeDeviceWarning();
      }
    }
  });
  App.reopen(routes);
  // models
  App.reopen(models);
  // views
  App.reopen(views);
  // controllers
  App.ApplicationController = Ember.Controller.extend({
    largeDeviceWarningDismissed       : function () {
      return !!localStorage.getItem('largeDeviceWarning');
    }.property('largeDeviceWarningDismissedPseudo'),
    largeDeviceWarningDismissedPseudo : '',
    dismissLargeDeviceWarning         : function () {
      utils.debug('App::ApplicationController:dismissLargeDeviceWarning:>');
      this.set('largeDeviceWarningDismissedPseudo', 'PSEUDO');
      localStorage.setItem('largeDeviceWarning', true);
    }
  });
  App.reopen(controllers);

  utils.debug('app::> App enriched with routes, models, views & controllers');

  //>>excludeStart('appBuildExclude', pragmas.appBuildExclude);
  //  Ember.LOG_BINDINGS = true;
  //>>excludeEnd('appBuildExclude');

  window.App = App;

  return App;
});
