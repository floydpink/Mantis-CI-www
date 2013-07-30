/* global App */
define([
  'ext/jquery.ext',
  'ember-model',
  'models/TravisModel',
  'models/Repo',
  'models/Log',
  'ext/Helpers',
  'ext/DurationCalculations',
  'ext/TravisAjax'
], function ($, Ember, TravisModel, Repo, Log, Helpers, DurationCalculations, TravisAjax) {

  var Job = TravisModel.extend(DurationCalculations, {
    repoId   : Ember.attr('string', {key : 'repository_id'}),
    buildId  : Ember.attr('string'),
    commitId : Ember.attr('string'),
    logId    : Ember.attr('string'),

    queue        : Ember.attr('string'),
    state        : Ember.attr('string'),
    number       : Ember.attr(Number),
    startedAt    : Ember.attr('string'),
    finishedAt   : Ember.attr('string'),
    allowFailure : Ember.attr('boolean'),

    repositorySlug    : Ember.attr('string'),
    repo              : Ember.belongsTo('App.Repo', {key : 'repository_id'}),
    build             : Ember.belongsTo('App.Build'),
    commit            : Ember.belongsTo('App.Commit'),
    _config           : Ember.attr('object', {key : 'config'}),
    repoSlugDidChange : function () {
      var slug = this.get('repoSlug');
      if (slug) {
        return Repo.load([
          {
            id   : this.get('repoId'),
            slug : slug
          }
        ]);
      }
    }.observes('repoSlug'),
    log               : function () {
      this.set('isLogAccessed', true);
      return Log.create({
        job : this
      });
    }.property(),
    repoSlug          : function () {
      return this.get('repositorySlug');
    }.property('repositorySlug'),
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
    isPropertyLoaded : function (key) {
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
    queued  : function (queue) {
      this.find();
      return Ember.FilteredRecordArray.create({
        modelClass       : App.Job,
        filterFunction   : function (job) {
          var queued;
          queued = ['created', 'queued'].indexOf(job.get('state')) !== -1;
          return queued && (!queue || job.get('queue') === ("builds." + queue) || job.get('queue') === queue);
        },
        filterProperties : ['state', 'queue']
      });
    },
    running : function () {
      this.find({
        state : 'started'
      });
      return Ember.FilteredRecordArray.create({
        modelClass       : App.Job,
        filterFunction   : function (job) {
          return job.get('state') === 'started';
        },
        filterProperties : ['state']
      });
    }
  });

  return Job;
});