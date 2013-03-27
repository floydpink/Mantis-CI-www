define([
  'ext/jquery.ext',
  'ember',
  'ext/TravisUrls',
  'ext/Helpers',
  'app/utils'
], function ($, Ember, TravisUrls, Helpers, utils) {

  var RepoController = Ember.Controller.extend({
    bindings               : [],
    needs                  : ['repos'],
    isError                : function () {
      return this.get('repo.isError');
    }.property('repo.isError'),
    slug                   : function () {
      return this.get('repo.slug');
    }.property('repo.slug'),
    gitHubUrl              : function () {
      return TravisUrls.githubRepo(this.get('repo.slug'));
    }.property('repo.slug'),
    shortDescription       : function () {
      utils.debug('RepoController::shortDescription:>');
      var description = this.get('repo.description'),
          shortDescription = $.truncate(description || '', 80),
          isDescriptionLong = description !== shortDescription;
      return isDescriptionLong ? shortDescription : '';
    }.property('repo.description'),
    fullDescriptionVisible : function () {
      utils.debug('RepoController::descriptionToggle:>');
      return !this.get('shortDescription');
    }.property('shortDescription'),
    toggleDescription      : function () {
      this.toggleProperty('fullDescriptionVisible');
      return false;
    },
    previousTab            : function () {
      utils.debug('Previous');
      Helpers.previousTab();
    },
    nextTab                : function () {
      utils.debug('Next');
      Helpers.nextTab();
    },
    isLoading              : function () {
      return this.get('repo.isLoading');
    }.property('repo.isLoading'),
    init                   : function () {
      this._super.apply(this, arguments);
      return Ember.run.later(this.updateTimes.bind(this), Helpers.updateInterval);
    },
    updateTimes            : function () {
      var build, builds, jobs;
      if (builds = this.get('builds')) {
        builds.forEach(function (b) {
          return b.updateTimes();
        });
      }
      if (build = this.get('build')) {
        build.updateTimes();
      }
      if (build && (jobs = build.get('jobs'))) {
        jobs.forEach(function (j) {
          return j.updateTimes();
        });
      }
      return Ember.run.later(this.updateTimes.bind(this), Helpers.updateInterval);
    },
    activate               : function (action) {
      utils.debug('RepoController::activate:> action: ' + action);
      this._unbind();
      //TODO:
      // this is hokey - refactor to add another function for doing stuff after
      // viewCurrent, viewBuild or viewBuilds
      Ember.run.later(this, Helpers.styleActiveNavbarButton, 50);
      return this["view" + ($.camelize(action))]();
    },
    viewIndex              : function () {
      this._bind('repo', 'controllers.repos.firstObject');
      this._bind('build', 'repo.lastBuild');
      return this.connectTab('current');
    },
    viewCurrent            : function () {
      this.connectTab('current');
      return this._bind('build', 'repo.lastBuild');
    },
    viewBuilds             : function () {
      this.connectTab('builds');
      return this._bind('builds', 'repo.builds');
    },
    viewPullRequests       : function () {
      this.connectTab('pull_requests');
      return this._bind('builds', 'repo.pullRequests');
    },
    viewBranches           : function () {
      this.connectTab('branches');
      return this._bind('builds', 'repo.branches');
    },
    viewEvents             : function () {
      this.connectTab('events');
      return this._bind('events', 'repo.events');
    },
    viewBuild              : function () {
      utils.debug('RepoController::viewBuild:>');
      return this.connectTab('build');
    },
    viewJob                : function () {
      this._bind('build', 'job.build');
      return this.connectTab('job');
    },
    connectTab             : function (tab) {
      return this.set('tab', tab);
    },
    _bind                  : function (to, from) {
      utils.debug('RepoController::_bind> to: ' + to + ' from: ' + from);
      return this.bindings.push(Ember.oneWay(this, to, from));
    },
    _unbind                : function () {
      var binding, _i, _len, _ref;
      _ref = this.bindings;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        binding.disconnect(this);
      }
      return this.bindings.clear();
    },
    urlGithub              : function () {
      return TravisUrls.githubRepo(this.get('repo.slug'));
    }.property('repo.slug')
  });

  return  RepoController;

});