define([
  'ember',
  'hbs!repo/tabs'
], function (Ember) {
  return Ember.View.extend({
    templateName      : 'repo/tabs',
    elementId         : 'repo-tabs',
    repoBinding       : 'controller.repo',
    buildBinding      : 'controller.build',
    jobBinding        : 'controller.job',
    tabBinding        : 'controller.tab',
    classCurrent      : function () {
      if (this.get('tab') === 'current') {
        return 'active';
      }
    }.property('tab'),
    classBuilds       : function () {
      if (this.get('tab') === 'builds') {
        return 'active';
      }
    }.property('tab'),
    classPullRequests : function () {
      if (this.get('tab') === 'pull_requests') {
        return 'active';
      }
    }.property('tab'),
    classBranches     : function () {
      if (this.get('tab') === 'branches') {
        return 'active';
      }
    }.property('tab'),
    classEvents       : function () {
      if (this.get('tab') === 'events') {
        return 'active';
      }
    }.property('tab'),
    classBuild        : function () {
      var classes, tab;
      tab = this.get('tab');
      classes = [];
      if (tab === 'build') {
        classes.push('active');
      }
      if (tab === 'build' || tab === 'job') {
        classes.push('display-inline');
      }
      return classes.join(' ');
    }.property('tab'),
    classJob          : function () {
      if (this.get('tab') === 'job') {
        return 'active display-inline';
      }
    }.property('tab')
  });
});