define([
  'jquery',
  'ember-data',
  'models/TravisModel',
  'ext/DurationCalculations',
  'ext/Helpers',
  'ext/TravisAjax',
  'ext/I18n',
  'app/utils'
], function ($, DS, TravisModel, DurationCalculations, Helpers, TravisAjax, I18n, utils) {

  var Build = TravisModel.extend(DurationCalculations, {
    eventType         : DS.attr('string'),
    repoId            : DS.attr('number'),
    commitId          : DS.attr('number'),
    state             : DS.attr('string'),
    number            : DS.attr('number'),
    branch            : DS.attr('string'),
    message           : DS.attr('string'),
    _duration         : DS.attr('number'),
    _config           : DS.attr('object'),
    startedAt         : DS.attr('string'),
    finishedAt        : DS.attr('string'),
    repo              : DS.belongsTo('App.Repo'),
    commit            : DS.belongsTo('App.Commit'),
    commits           : DS.belongsTo('App.Commit'),
    jobs              : DS.hasMany('App.Job'),
    config            : function () {
      return Helpers.compact(this.get('_config'));
    }.property('_config'),
    isPullRequest     : function () {
      return this.get('eventType') === 'pull_request';
    }.property('eventType'),
    isMatrix          : function () {
      return this.get('jobs.length') > 1;
    }.property('jobs.length'),
    isFinished        : function () {
      var _ref;
      return (_ref = this.get('state')) === 'passed' || _ref === 'failed' || _ref === 'errored' || _ref === 'canceled';
    }.property('state'),
    requiredJobs      : function () {
      return this.get('jobs').filter(function (data) {
        return !data.get('allowFailure');
      });
    }.property('jobs.@each.allowFailure'),
    allowedFailureJobs: function () {
      return this.get('jobs').filter(function (data) {
        return data.get('allowFailure');
      });
    }.property('jobs.@each.allowFailure'),
    configKeys        : function () {
      var config, headers, key, keys;
      if (!(config = this.get('config'))) {
        return [];
      }
      keys = $.intersect($.keys(config), Helpers.CONFIG_KEYS);
      headers = (function () {
        var _i, _len, _ref, _results;
        _ref = ['build.job', 'build.duration', 'build.finished_at'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          _results.push(I18n.t(key));
        }
        return _results;
      })();
      return $.map(headers.concat(keys), function (key) {
        return $.camelize(key);
      });
    }.property('config'),
    canCancel         : function () {
      return this.get('state') === 'created';
    }.property('state'),
    cancel            : function () {
      return TravisAjax.post("/builds/" + (this.get('id')), {
        _method: 'delete'
      });
    },
    requeue           : function () {
      return TravisAjax.post('/requests', {
        build_id: this.get('id')
      });
    },
    isAttributeLoaded : function (key) {
      if (['_duration', 'finishedAt'].contains(key) && !this.get('isFinished')) {
        return true;
      } else {
        return this._super(key);
      }
    }
  });
  Build.reopenClass({
    byRepoId       : function (id, parameters) {
      return this.find($.extend(parameters || {}, {
        repository_id: id
      }));
    },
    branches       : function (options) {
      return this.find({
        repository_id: options.repoId,
        branches     : true
      });
    },
    olderThanNumber: function (id, build_number, type) {
      var options;
      utils.debug(type);
      options = {
        repository_id: id,
        after_number : build_number
      };
      if (type != null) {
        options.event_type = type.replace(/s$/, '');
      }
      return this.find(options);
    }
  });

  return Build;
});