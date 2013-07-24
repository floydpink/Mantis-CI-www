define([
  'models/TravisModel',
  'models/Repo',
  'models/Job',
  'ember-data'
], function (TravisModel, Repo, Job, DS) {
  return TravisModel.extend({
    state       : DS.attr('string'),
    name        : DS.attr('string'),
    host        : DS.attr('string'),
    payload     : DS.attr('object'),
    number      : function () {
      return this.get('name').match(/\d+$/)[0];
    }.property('name'),
    isWorking   : function () {
      return this.get('state') === 'working';
    }.property('state'),
    jobId       : function () {
      return this.get('payload.build.id') || this.get('payload.job.id');
    }.property('payload.job.id', 'payload.build.id'),
    job         : function () {
      return Job.find(this.get('job_id'));
    }.property('jobId'),
    jobNumber   : function () {
      return this.get('payload.job.number');
    }.property('jobNumber'),
    repoData    : function () {
      return {
        id   : this.get('repoId'),
        slug : this.get('repoSlug')
      };
    }.property('repoSlug', 'repoId'),
    repo        : function () {
      return Repo.find(this.get('payload.repository.id') || this.get('payload.repo.id'));
    }.property('payload.repository.id', 'payload.repo.id'),
    repoSlug    : function () {
      return this.get('payload.repo.slug') || this.get('payload.repository.slug');
    }.property('payload.repo.slug', 'payload.repository.slug'),
    repoId      : function () {
      return this.get('payload.repo.id') || this.get('payload.repository.id');
    }.property('payload.repo.id', 'payload.repository.id'),
    nameForSort : function () {
      var id, match, name;
      if (name = this.get('name')) {
        match = name.match(/(.*?)-(\d+)/);
        if (match) {
          name = match[1];
          id = match[2].toString();
          if (id.length < 2) {
            id = "00" + id;
          } else if (id.length < 3) {
            id = "0" + id;
          }
          return "" + name + "-" + id;
        }
      }
    }.property('name')
  });
});