define([
  'ext/jquery.ext',
  'ember',
  'ext/TravisUrls'
], function ($, Ember, TravisUrls) {

  return Ember.Controller.extend({
    needs          : ['repo'],
    repoBinding    : 'controllers.repo.repo',
    buildBinding   : 'controllers.repo.build',
    commitBinding  : 'build.commit',
    isLoadedBinding: 'build.isLoaded',
    urlGithubCommit: function () {
      return TravisUrls.githubCommit(this.get('repo.slug'), this.get('commit.sha'));
    }.property('repo.slug', 'commit.sha'),
    urlAuthor      : function () {
      return TravisUrls.email(this.get('commit.authorEmail'));
    }.property('commit.authorEmail'),
    urlCommitter   : function () {
      return TravisUrls.email(this.get('commit.committerEmail'));
    }.property('commit.committerEmail'),
    buildMetaLess  : function () {
      return true;
    }.property(),
    toggleBuildMeta: function () {
      this.toggleProperty('buildMetaLess');
    }
  });

});