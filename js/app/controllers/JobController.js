define([
         'ember',
         'ext/TravisUrls'
       ], function (Ember, TravisUrls) {
  return Ember.Controller.extend({
                                   needs              : ['repo'],
                                   jobBinding         : 'controllers.repo.job',
                                   repoBinding        : 'controllers.repo.repo',
                                   commitBinding      : 'job.commit',
                                   lineNumberBinding  : 'controllers.repo.lineNumber',
                                   currentItemBinding : 'job',
                                   urlGithubCommit    : function () {
                                     return TravisUrls.githubCommit(this.get('repo.slug'), this.get('commit.sha'));
                                   }.property('repo.slug', 'commit.sha'),
                                   urlAuthor          : function () {
                                     return TravisUrls.email(this.get('commit.authorEmail'));
                                   }.property('commit.authorEmail'),
                                   urlCommitter       : function () {
                                     return TravisUrls.email(this.get('commit.committerEmail'));
                                   }.property('commit.committerEmail'),
                                   logMetaLess        : function () {
                                     return true;
                                   }.property(),
                                   toggleLogMeta      : function () {
                                     this.toggleProperty('logMetaLess');
                                   }
                                 });
});