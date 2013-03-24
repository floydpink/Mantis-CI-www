define([
  'ext/jquery.ext',
  'ember',
  'ext/TravisUrls',
  'app/utils'
], function ($, Ember, TravisUrls, utils) {

  return Ember.Controller.extend({
    needs             : ['repo'],
    repoBinding       : 'controllers.repo.repo',
    buildBinding      : 'controllers.repo.build',
    commitBinding     : 'build.commit',
    currentItemBinding: 'build',
    loading           : function () {
      utils.debug('BuildController::loading:> ');
      return this.get('build.isLoading');
    }.property('build.isLoading'),
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

});