define([
  'jquery',
  'ember',
  'ext/Helpers',
  'ext/TravisUrls',
  'hbs!repo/build',
  'hbs!repo/builds'
], function ($, Ember, Helpers, TravisUrls) {

  var BuildViews = {
    BuildView      : Ember.View.extend({
      templateName      : 'repo/build',
      classNames        : ['build'],
      classNameBindings : ['color'],
      color             : function () {
        return Helpers.colorForState(this.get('controller.build.state'));
      }.property('controller.build.state')
    }),
    BuildsView     : Ember.View.extend({
      templateName       : 'repo/builds',
      classNames         : ['build'],
      buildsBinding      : 'controller.builds',
      isPullRequestsList : function () {
        return this.get('controller.tab') === 'pull_requests';
      }.property('controller.tab'),
      toTop              : function () {
        return $(window).scrollTop(0);
      },
      ShowMoreButton     : Ember.View.extend({
        tagName           : 'a',
        classNames        : ['ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-up-d show-more'],
        template          : Ember.Handlebars.compile(
            ' <span class="ui-btn-inner">' +
                '   <span class="ui-btn-text">{{view.label}}</span>' +
                ' </span>'),
        classNameBindings : ['isLoading:ui-disabled'],
        isLoadingBinding  : 'controller.isLoading',
        label             : function () {
          if (this.get('isLoading')) {
            return 'Loading...';
          } else {
            return 'Show More...';
          }
        }.property('isLoading'),
        click             : function () {
          return this.get('controller').showMore();
        }
      })
    }),
    BuildsItemView : Ember.View.extend({
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
        return TravisUrls.githubPullRequest(this.get('repo.slug'), this.get('build.pullRequestNumber'));
      }.property('repo.slug', 'build.pullRequestNumber')
    })
  };

  return BuildViews;
});