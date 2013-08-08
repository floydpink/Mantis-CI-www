define([
  'ember-model',
  'app/utils',
  'ext/LocalStorage',
  'store/TravisAdapter',
  'app/pusher',
  'app/tailing',
  'ext/Helpers',
  'app/views',
  'app/routes',
  'app/controllers',
  'app/models'
], function (Ember, utils, localStorage, Adapter, Pusher, Tailing, Helpers, views, routes, controllers, models) {

  "use strict";

  //createWithMixins from here - https://github.com/emberjs/ember.js/issues/2184
  var App = Ember.Application.createWithMixins({
    //>>excludeStart('distBuildExclude', pragmas.distBuildExclude);
    LOG_TRANSITIONS : true,
    //>>excludeEnd('distBuildExclude');
    VERSION         : '0.0.1',
    init            : function () {
      utils.debug('app::init:> App init');
      this.deferReadiness();
      this._super();
    },
    currentPath     : '',
    mappings        : function () {
      return {
        broadcasts   : null,
        repositories : models.Repo,
        repository   : models.Repo,
        repos        : models.Repo,
        repo         : models.Repo,
        builds       : models.Build,
        build        : models.Build,
        commits      : models.Commit,
        commit       : models.Commit,
        jobs         : models.Job,
        job          : models.Job
      };
    }.property(),
    modelClasses    : [models.Build, models.Job, models.Repo, models.Commit],
    start           : function () {
      utils.debug('app::start:> App start');
      this.get('modelClasses').forEach(function (klass) {
        klass.adapter = Adapter.create();
        klass.url = "/" + (klass.pluralName());
      });
      this.pusher = new Pusher(Helpers.pusher_key);
      this.tailing = new Tailing();
      this.advanceReadiness();
    },
    reset           : function () {
      utils.debug(' >>>>> Resetting app >>>>>');
      this.get('modelClasses').forEach(function (klass) {
        klass.resetData();
      });
      this.start();
    },
    receive         : function (event, data) {
      var build, commit, job,
          _ref = event.split(':'),
          name = _ref[0],
          type = _ref[1];
      type = Ember.get(App, 'mappings')[name];
      if (event === 'build:started' && data.build.commit) {
        build = data.build;
        commit = {
          id              : build.commit_id,
          author_email    : build.author_email,
          author_name     : build.author_name,
          branch          : build.branch,
          committed_at    : build.committed_at,
          committer_email : build.committer_email,
          committer_name  : build.committer_name,
          compare_url     : build.compare_url,
          message         : build.message,
          sha             : build.commit
        };
        delete data.build.commit;
        this.loadOrMerge(models.Commit, commit);
      }
      if (event === 'job:log') {
        data = data.job;
        job = models.Job.find(data.id);
        return job.appendLog({
          number  : parseInt(data.number, 10),
          content : data._log,
          final   : data.final
        });
      } else if (data[type.singularName()]) {
        return this._loadOne(this, type, data);
      } else if (data[type.pluralName()]) {
        return this._loadMany(this, type, data);
      } else {
        if (!type) {
          throw "can't load data for " + name;
        }
      }
    },
    _loadOne        : function (store, type, json) {
      var data, reference, root;
      root = type.singularName();
      reference = this.loadOrMerge(type, json[root]);
      if (!reference.record) {
        type.loadRecordForReference(reference);
      }
      if (type === models.Build && (json.repository || json.repo)) {
        data = json.repository || json.repo;
        reference = this.loadOrMerge(models.Repo, data);
        if (!reference.record) {
          return models.Repo.loadRecordForReference(reference);
        }
      }
    },
    loadOrMerge     : function (type, hash, options) {
      var reference;
      if (!options) {
        options = {};
      }
      if (!type._idToReference) {
        type._idToReference = {};
      }
      reference = type._idToReference[hash.id];
      if (reference && options.skipIfExists) {
        return;
      }
      reference = type._referenceForId(hash.id);
      if (reference.record) {
        reference.record.merge(hash);
      } else {
        if (type.sideloadedData && type.sideloadedData[hash.id]) {
          Ember.merge(type.sideloadedData[hash.id], hash);
        } else {
          type.load([hash]);
        }
      }
      return reference;
    },
    ready           : function () {
      utils.debug('app::init:> App ready');
    }
  });

  //Routes
  App.Router.map(function () {
    this.resource('splash');
    this.resource('about');
    this.resource('favorites');
    this.resource('repos', {path : '/'}, function () {
      this.resource('search', {path : '/search/:phrase'});
    });
    this.resource('repo', {path : '/:owner/:name'}, function () {
      this.resource('build', {path : '/builds/:build_id'});
      this.resource('job', { path : '/jobs/:job_id' });
      this.resource('builds', {path : '/builds'});
      this.resource('pullRequests', { path : '/pull_requests' });
      this.resource('branches', { path : '/branches' });
    });
  });

  App.Router.reopen({
    location : 'hash'
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
    },
    updateCurrentPath                 : function () {
      // thanks to http://stackoverflow.com/a/15922707/218882
      utils.debug('ApplicationController::updateCurrentPath:> ' + this.get('currentPath'));
      App.set('currentPath', this.get('currentPath'));
    }.observes('currentPath')
  });
  App.reopen(controllers);

  utils.debug('app::> App enriched with routes, models, views & controllers');

  window.App = App;

  return App;
});
