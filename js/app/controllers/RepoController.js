define([
  'ext/jquery.ext',
  'ember',
  'visibility',
  'ext/TravisUrls',
  'ext/Helpers',
  'ext/Favorites',
  'ext/LargeDeviceWarningDismissedMixin',
  'app/utils'
], function ($, Ember, Visibility, TravisUrls, Helpers, Favorites, LargeDeviceWarningDismissedMixin, utils) {

  var RepoController = Ember.Controller.extend(LargeDeviceWarningDismissedMixin, {
    bindings               : [],
    needs                  : ['repos', 'build'],
    slug                   : function () {
      return this.get('repo.slug');
    }.property('repo.slug'),
    gitHubUrl              : function () {
      return TravisUrls.githubRepo(this.get('repo.slug'));
    }.property('repo.slug'),
    faves                  : Favorites.getAll(),
    favorite               : function () {
      var favorite = $.inArray(this.get('repo.id'), this.get('faves')) !== -1;
      utils.debug('RepoController::favorite:> favorite: ' + favorite);
      return  favorite;
    }.property('repo.id', 'faves').volatile(),
    toggleFavorite         : function () {
      this.set('faves', '');
      Favorites.toggle(this.get('repo.id'));
      this.set('faves', Favorites.getAll());
    },
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
      return Visibility.every(Helpers.updateInterval, this.updateTimes.bind(this));
    },
    updateTimes            : function () {
      var build, builds, jobs;
      if (builds = this.get('builds')) {
        builds.forEach(function (b) {
          return Ember.run(function () {
            return b.updateTimes();
          });
        });
      }
      if (build = this.get('controllers.build.build')) {
        Ember.run(function () {
          return build.updateTimes();
        });
      }
      if (build && (jobs = build.get('jobs'))) {
        return jobs.forEach(function (j) {
          return j.updateTimes();
        });
      }
    },
    activate               : function (contentType) {
      utils.debug('RepoController::activate:> contentType: ' + contentType);
      //TODO:
      // this is hokey - refactor to add another function for doing stuff after
      // viewCurrent, viewBuild or viewBuilds
      Ember.run.next(this, Helpers.styleActiveNavbarButton);
      return this["view" + ($.camelize(contentType))]();
    },
    viewIndex              : function () {
      return this.connectTab('current');
    },
    viewCurrent            : function () {
      return this.connectTab('current');
    },
    viewBuilds             : function () {
      return this.connectTab('builds');
    },
    viewPullRequests       : function () {
      return this.connectTab('pull_requests');
    },
    viewBranches           : function () {
      return this.connectTab('branches');
    },
    viewBuild              : function () {
      utils.debug('RepoController::viewBuild:>');
      return this.connectTab('build');
    },
    viewJob                : function () {
      return this.connectTab('job');
    },
    connectTab             : function (tab) {
      return this.set('tab', tab);
    },
    urlGithub              : function () {
      return TravisUrls.githubRepo(this.get('repo.slug'));
    }.property('repo.slug')
  });

  return  RepoController;

});