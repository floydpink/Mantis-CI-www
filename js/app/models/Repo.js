define([
  'jquery',
  'ember-model',
  'models/TravisModel',
  'models/Build',
  'app/utils',
  'ext/Helpers',
  'ext/ExpandableRecordArray',
  'ext/TravisAjax',
  'ext/jquery.ext'
], function ($, Ember, TravisModel, Build, utils, Helpers, ExpandableRecordArray, TravisAjax) {

  var Repo = TravisModel.extend({
    id                  : Ember.attr('string'),
    slug                : Ember.attr('string'),
    description         : Ember.attr('string'),
    lastBuildId         : Ember.attr('string'),
    lastBuildNumber     : Ember.attr(Number),
    lastBuildState      : Ember.attr('string'),
    lastBuildStartedAt  : Ember.attr('string'),
    lastBuildFinishedAt : Ember.attr('string'),
    _lastBuildDuration  : Ember.attr(Number, {
      key : 'last_build_duration'
    }),
    lastBuild           : Ember.belongsTo('App.Build', {
      key : 'last_build_id'
    }),
    lastBuildHash       : function () {
      return {
        id     : this.get('lastBuildId'),
        number : this.get('lastBuildNumber'),
        repo   : this
      };
    }.property('lastBuildId', 'lastBuildNumber'),
    allBuilds           : function () {
      utils.debug('Repo::allBuilds_:>');
      return Build.find();
    }.property(),
    //TODO: this should not belong in the model
    builds              : function () {
      utils.debug('Repo::builds_:>');
      var array, builds, id;
      id = this.get('id');
      builds = Build.byRepoId(id, {
        event_type : 'push'
      });
      //utils.debug('Repo::builds_:> after builds');
      array = ExpandableRecordArray.create({
        type    : Build,
        content : Ember.A([])
      });
      //utils.debug('Repo::builds_:> after array create');
      array.load(builds);
      //utils.debug('Repo::builds_:> after array load');
      id = this.get('id');
      array.observe(this.get('allBuilds'), function (build) {
        //utils.debug('Repo::builds_:> with array.observe');
        return build.get('isLoaded') && build.get('repo.id') === id && !build.get('isPullRequest');
      });
      //utils.debug('Repo::builds_:> just before return');
      return array;
    }.property(),
    pullRequests        : function () {
      var array, builds, id;
      id = this.get('id');
      builds = Build.byRepoId(id, {
        event_type : 'pull_request'
      });
      array = ExpandableRecordArray.create({
        type    : Build,
        content : Ember.A([])
      });
      array.load(builds);
      id = this.get('id');
      array.observe(this.get('allBuilds'), function (build) {
        return build.get('isLoaded') && build.get('repo.id') === id && build.get('isPullRequest');
      });
      return array;
    }.property(),
    branches            : function () {
      return Build.branches({
        repoId : this.get('id')
      });
    }.property(),
    owner               : function () {
      return (this.get('slug') || '').split('/')[0];
    }.property('slug'),
    name                : function () {
      return (this.get('slug') || '').split('/')[1];
    }.property('slug'),
    lastBuildDuration   : function () {
      var duration;
      duration = this.get('_lastBuildDuration');
      if (!duration) {
        duration = Helpers.durationFrom(this.get('lastBuildStartedAt'), this.get('lastBuildFinishedAt'));
      }
      return duration;
    }.property('_lastBuildDuration', 'lastBuildStartedAt', 'lastBuildFinishedAt'),
    newSortOrder        : function () {
      return -new Date(this.get('lastBuildStartedAt')).getTime();
    }.property('lastBuildStartedAt'),
    favoriteSortOrder   : function () {
      return this.get('slug');
    }.property('slug'),
    sortOrder           : function () {
      var lastBuildFinishedAt;
      if (lastBuildFinishedAt = this.get('lastBuildFinishedAt')) {
        return -new Date(lastBuildFinishedAt).getTime();
      } else {
        return -new Date('9999').getTime() - parseInt(this.get('lastBuildId'), 10);
      }
    }.property('lastBuildFinishedAt', 'lastBuildId'),
    stats               : function () {
      var _this = this;
      if (this.get('slug')) {
        return this.get('_stats') || $.get("https://api.github.com/repos/" + (this.get('slug')), function (data) {
          _this.set('_stats', data);
          return _this.notifyPropertyChange('stats');
        }) && {};
      }
    }.property('slug'),
    updateTimes         : function () {
      return this.notifyPropertyChange('lastBuildDuration');
    },
    regenerateKey       : function (options) {
      return TravisAjax.ajax('/repos/' + this.get('id') + '/key', 'post', options);
    }
  });

  Repo.reopenClass({
    recent        : function () {
      return this.find();
    },
    ownedBy       : function (login) {
      return this.find({
        owner_name : login,
        orderBy    : 'name'
      });
    },
    accessibleBy  : function (login) {
      return this.find({
        member  : login,
        orderBy : 'name'
      });
    },
    search        : function (query) {
      return this.find({
        search  : query,
        orderBy : 'name'
      });
    },
    withLastBuild : function () {
      utils.debug('Repo::withLastBuild:>');
      var filtered = Ember.FilteredRecordArray.create({
        modelClass       : Repo,
        filterFunction   : function (repo) {
          return repo.get('lastBuildId');
        },
        filterProperties : ['lastBuildId']
      });
      Repo.fetch().then(function () {
        utils.debug('Repo::withLastBuild::appRepoFetchThen>');
        filtered.updateFilter();
        return filtered.set('isLoaded', true);
      });
      utils.debug('Repo::withLastBuild::returning filtered> filtered:');
      return filtered;
    },
    bySlug        : function (slug) {
      utils.debug('Repo::bySlug:>');
      var repo;
      repo = $.select(this.find().toArray(), function (repo) {
        return repo.get('slug') === slug;
      });
      if (repo.length > 0) {
        return repo;
      } else {
        return this.find({
          slug : slug
        });
      }
    },
    favorites     : function (favorites) {
      var faves = Ember.ArrayProxy.extend({
        content  : favorites.map(function (id) {
          return Repo.find(id);
        }),
        isLoaded : function () {
          return this.everyProperty('isLoaded');
        }.property('@each.isLoaded')
      });
      return faves.create();
    }
  });

  return Repo;
});


