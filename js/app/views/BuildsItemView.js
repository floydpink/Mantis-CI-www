define([
         'ember',
         'ext/Helpers',
         'ext/TravisUrls'
       ], function (Ember, Helpers, TravisUrls) {
  return Ember.View.extend({
                             tagName              : 'div',
                             classNameBindings    : ['color'],
                             repoBinding          : 'controller.repo',
                             buildBinding         : 'context',
                             commitBinding        : 'build.commit',
                             isPullRequestsList   : function () {
                               return this.get('parentView.isPullRequestsList');
                             }.property('parentView.isPullRequestsList'),
                             color                : function () {
                               return Helpers.colorForState(this.get('build.state'));
                             }.property('build.state'),
                             urlGithubCommit      : function () {
                               return TravisUrls.githubCommit(this.get('repo.slug'), this.get('commit.sha'));
                             }.property('repo.slug', 'commit.sha'),
                             urlGithubPullRequest : function () {
                               return TravisUrls.githubPullRequest(this.get('repo.slug'), this.get('commit.pullRequestNumber'));
                             }.property('repo.slug', 'commit.pullRequestNumber')
                           });
});