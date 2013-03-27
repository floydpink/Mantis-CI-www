/* global App */
define([
  'ext/jquery.ext',
  'ember-data',
  'models/TravisModel',
  'models/Log',
  'ext/Helpers',
  'ext/DurationCalculations',
  'ext/TravisAjax'
], function ($, DS, TravisModel, Log, Helpers, DurationCalculations, TravisAjax) {
  var Job = TravisModel.extend(DurationCalculations, {
    repoId            : DS.attr('number'),
    buildId           : DS.attr('number'),
    commitId          : DS.attr('number'),
    logId             : DS.attr('number'),
    queue             : DS.attr('string'),
    state             : DS.attr('string'),
    number            : DS.attr('string'),
    startedAt         : DS.attr('string'),
    finishedAt        : DS.attr('string'),
    allowFailure      : DS.attr('boolean'),
    repositorySlug    : DS.attr('string'),
    repo              : DS.belongsTo('App.Repo'),
    build             : DS.belongsTo('App.Build'),
    commit            : DS.belongsTo('App.Commit'),
    fakeBuild         : DS.belongsTo('App.Build'),
    _config           : DS.attr('object'),
    log               : function () {
      this.set('isLogAccessed', true);
      return Log.create({
        job : this
      });
    }.property(),
    repoSlug          : function () {
      return this.get('repo.slug') || this.get('repositorySlug');
    }.property('repo.slug', 'repositorySlug'),
    repoData          : function () {
      return {
        id   : this.get('repoId'),
        slug : this.get('repoSlug')
      };
    }.property('repoSlug', 'repoId'),
    config            : function () {
      return Helpers.compact(this.get('_config'));
    }.property('_config'),
    isFinished        : function () {
      var _ref;
      return (_ref = this.get('state')) === 'passed' || _ref === 'failed' || _ref === 'errored' || _ref === 'canceled';
    }.property('state'),
    clearLog          : function () {
      if (this.get('isLogAccessed')) {
        return this.get('log').clear();
      }
    },
    configValues      : function () {
      var buildConfig, config, keys;
      config = this.get('config');
      buildConfig = this.get('build.config');
      if (config && buildConfig) {
        keys = $.intersect($.keys(buildConfig), Helpers.CONFIG_KEYS);
        return keys.map(function (key) {
          return config[key];
        });
      } else {
        return [];
      }
    }.property('config'),
    canCancel         : function () {
      return this.get('state') === 'created' || this.get('state') === 'queued';
    }.property('state'),
    cancel            : function () {
      return TravisAjax.post("/jobs/" + (this.get('id')), {
        _method : 'delete'
      });
    },
    requeue           : function () {
      return TravisAjax.post('/requests', {
        job_id : this.get('id')
      });
    },
    appendLog         : function (part) {
      return this.get('log').append(part);
    },
    subscribe         : function () {
      if (this.get('subscribed')) {
        return;
      }
      this.set('subscribed', true);
      return App.pusher.subscribe("job-" + (this.get('id')));
    },
    unsubscribe       : function () {
      if (!this.get('subscribed')) {
        return;
      }
      this.set('subscribed', false);
      return App.pusher.unsubscribe("job-" + (this.get('id')));
    },
    onStateChange     : function () {
      if (this.get('state') === 'finished' && App.pusher) {
        return App.pusher.unsubscribe("job-" + (this.get('id')));
      }
    }.observes('state'),
    isAttributeLoaded : function (key) {
      if (['finishedAt'].contains(key) && !this.get('isFinished')) {
        return true;
      } else if (key === 'startedAt' && this.get('state') === 'created') {
        return true;
      } else {
        return this._super(key);
      }
    }
  });

  Job.reopenClass({
    queued   : function (queue) {
      this.find();
      return App.store.filter(this, function (job) {
        var queued;
        queued = ['created', 'queued'].indexOf(job.get('state')) !== -1;
        // TODO: why queue is sometimes just common instead of build.common?
        return queued && (!queue || job.get('queue') === ("builds." + queue) || job.get('queue') === queue);
      });
    },
    running  : function () {
      this.find({
        state : 'started'
      });
      return App.store.filter(this, function (job) {
        return job.get('state') === 'started';
      });
    },
    findMany : function (ids) {
      return App.store.findMany(this, ids);
    }
  });

  return Job;
});