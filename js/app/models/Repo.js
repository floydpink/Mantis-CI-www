define([
  'jquery',
  'ember',
  'ember-data',
  'models/TravisModel',
  'models/Build',
  'models/Event',
  'app/utils',
  'ext/Helpers',
  'ext/ExpandableRecordArray',
  'ext/TravisAjax',
  'ext/jquery.ext'
], function ($, Ember, DS, TravisModel, Build, Event, utils, Helpers, ExpandableRecordArray, TravisAjax) {

  var Repo = TravisModel.extend({
    slug                : DS.attr('string'),
    description         : DS.attr('string'),
    lastBuildId         : DS.attr('number'),
    lastBuildNumber     : DS.attr('string'),
    lastBuildState      : DS.attr('string'),
    lastBuildStartedAt  : DS.attr('string'),
    lastBuildFinishedAt : DS.attr('string'),
    _lastBuildDuration  : DS.attr('number'),
    lastBuild           : DS.belongsTo('App.Build'),
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
        content : Ember.A([]),
        store   : this.get('store')
      });
      //utils.debug('Repo::builds_:> after array create');
      array.load(builds);
      //utils.debug('Repo::builds_:> after array load');
      id = this.get('id');
      array.observe(this.get('allBuilds'), function (build) {
        //utils.debug('Repo::builds_:> with array.observe');
        return build.get('isLoaded') && build.get('eventType') && build.get('repo.id') === id && !build.get('isPullRequest');
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
        content : Ember.A([]),
        store   : this.get('store')
      });
      array.load(builds);
      id = this.get('id');
      array.observe(this.get('allBuilds'), function (build) {
        return build.get('isLoaded') && build.get('eventType') && build.get('repo.id') === id && build.get('isPullRequest');
      });
      return array;
    }.property(),
    branches            : function () {
      return Build.branches({
        repoId : this.get('id')
      });
    }.property(),
    events              : function () {
      return Event.byRepoId(this.get('id'));
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
      return this.filter(function (repo) {
        return (!repo.get('incomplete') || repo.isAttributeLoaded('lastBuildId')) && repo.get('lastBuildId');
      });
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


