define([
  'ember',
  'ext/Helpers',
  'ext/TravisUrls',
  'hbs!jobs/show'
], function (Ember, Helpers, TravisUrls) {
  var JobView = Ember.View.extend({
    templateName      : 'jobs/show',
    repoBinding       : 'controller.repo',
    jobBinding        : 'controller.job',
    commitBinding     : 'job.commit',
    currentItemBinding: 'job',
    color             : function () {
      return Helpers.colorForState(this.get('job.state'));
    }.property('job.state'),
    urlGithubCommit   : function () {
      return TravisUrls.githubCommit(this.get('repo.slug'), this.get('commit.sha'));
    }.property('repo.slug', 'commit.sha'),
    urlAuthor         : function () {
      return TravisUrls.email(this.get('commit.authorEmail'));
    }.property('commit.authorEmail'),
    urlCommitter      : function () {
      return TravisUrls.email(this.get('commit.committerEmail'));
    }.property('commit.committerEmail')
  });
  return JobView;
});
