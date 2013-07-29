define([
  'jquery',
  'ember-model',
  'models/TravisModel',
  'ext/DurationCalculations',
  'ext/Helpers',
  'ext/TravisAjax',
  'ext/I18n',
  'app/utils'
], function ($, Ember, TravisModel, DurationCalculations, Helpers, TravisAjax, I18n, utils) {

  var Build = TravisModel.extend(DurationCalculations, {
    repositoryId             : Ember.attr('number'),
    commitId           : Ember.attr('number'),
    state              : Ember.attr('string'),
    number             : Ember.attr('number'),
    branch             : Ember.attr('string'),
    message            : Ember.attr('string'),
    _duration          : Ember.attr('number', {key: 'duration'}),
    _config            : Ember.attr('object', {key: 'config'}),
    startedAt          : Ember.attr('string'),
    finishedAt         : Ember.attr('string'),
    pullRequest        : Ember.attr('boolean'),
    pullRequestTitle   : Ember.attr('string'),
    pullRequestNumber  : Ember.attr('number'),
    repo               : Ember.belongsTo('App.Repo', {key: 'repository_id'}),
    commit             : Ember.belongsTo('App.Commit'),
    jobs               : Ember.hasMany('App.Job'),
    config             : function () {
      return Helpers.compact(this.get('_config'));
    }.property('_config'),
    isPullRequest      : function () {
      return this.get('eventType') === 'pull_request';
    }.property('eventType'),
    isMatrix           : function () {
      return this.get('jobs.length') > 1;
    }.property('jobs.length'),
    isFinished         : function () {
      var _ref;
      return (_ref = this.get('state')) === 'passed' || _ref === 'failed' || _ref === 'errored' || _ref === 'canceled';
    }.property('state'),
    requiredJobs       : function () {
      return this.get('jobs').filter(function (data) {
        return !data.get('allowFailure');
      });
    }.property('jobs.@each.allowFailure'),
    allowedFailureJobs : function () {
      return this.get('jobs').filter(function (data) {
        return data.get('allowFailure');
      });
    }.property('jobs.@each.allowFailure'),
    configKeys         : function () {
      var config, headers, keys;
      if (!(config = this.get('config'))) {
        return [];
      }
      keys = $.intersect($.keys(config), Helpers.CONFIG_KEYS);
      headers = (function () {
        //        var _i, _len, _ref, _results;
        //        _ref = ['build.job', 'build.duration', 'build.finished_at'];
        //        _results = [];
        //        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        //          key = _ref[_i];
        //          _results.push(I18n.t(key));
        //        }
        //        return _results;
        return ['Job', 'Duration, Finished'];
      })();
      return $.map(headers.concat(keys), function (key) {
        return $.camelize(key);
      });
    }.property('config'),
    canCancel          : function () {
      return this.get('state') === 'created';
    }.property('state'),
    cancel             : function () {
      return TravisAjax.post("/builds/" + (this.get('id')), {
        _method : 'delete'
      });
    },
    requeue            : function () {
      return TravisAjax.post('/requests', {
        build_id : this.get('id')
      });
    },
    isAttributeLoaded  : function (key) {
      if (['_duration', 'finishedAt'].contains(key) && !this.get('isFinished')) {
        return true;
      } else {
        return this._super(key);
      }
    }
  });

  Build.reopenClass({
    byRepoId        : function (id, parameters) {
      return this.find($.extend(parameters || {}, {
        repository_id : id
      }));
    },
    branches        : function (options) {
      return this.find({
        repository_id : options.repoId,
        branches      : true
      });
    },
    olderThanNumber : function (id, build_number, type) {
      var options;
      utils.debug(type);
      options = {
        repository_id : id,
        after_number  : build_number
      };
      if (type != null) {
        options.event_type = type.replace(/s$/, '');
      }
      return this.find(options);
    }
  });

  return Build;
});