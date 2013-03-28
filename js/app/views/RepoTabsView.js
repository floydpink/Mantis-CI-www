define([
  'ext/jquery.ext',
  'ember',
  'ext/Helpers',
  'app/utils',
  'hbs!repo/tabs'
], function ($, Ember, Helpers, utils) {
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
    }.property('tab'),
    setVisibilities   : function () {
      utils.debug('RepoTabsView::setVisibilities:>');

      var $repoTabs = $('#repo-tabs'),
          $jobTab = $repoTabs.find('#tab_job:has(a.active)'),
          $buildTab = $repoTabs.find('#tab_build:has(a.active)'),
          leftTabId = $repoTabs.find('li.ui-block-a').attr('id'),
          rightTabId = $repoTabs.find('li.ui-block-b').attr('id'),
          nextVisible = true;

      this.set('previousVisible', leftTabId !== 'tab_current');

      switch (rightTabId) {
        case 'tab_job':
          nextVisible = false;
          break;
        case 'tab_build':
          nextVisible = !!$jobTab.length;
          break;
        case 'tab_branches':
          nextVisible = !!$jobTab.length || !!$buildTab.length;
          break;
      }

      this.set('nextVisible', nextVisible);
    },
    didInsertElement  : function () {
      utils.debug('RepoTabsView::didInsertElement:>');
      this.realignTabs();
    },
    tabObserver       : function () {
      utils.debug('RepoTabsView::tabObserver:>');
      this.realignTabs();
    }.observes('tab'),
    realignTabs       : function () {
      utils.debug('RepoTabsView::realignTabs:>');
      if (this.realignTabsLater) {
        Ember.run.cancel(this.realignTabsLater);
      }
      return this.realignTabsLater = Ember.run.next(this, function () {
        utils.debug('RepoTabsView::realignTabsLater:>');
        var $repoTabs = $('#repo-tabs');
        if ($repoTabs.length) {
          $repoTabs.find('li.ui-block').removeClass('ui-block-a').removeClass('ui-block-b').addClass('hidden');

          var $activeTab = $repoTabs.find('li.ui-block.active');
          $activeTab.addClass('ui-block-a').removeClass('hidden');

          var activeTabId = $activeTab.attr('id');
          if (activeTabId === 'tab_branches' || activeTabId === 'tab_build' || activeTabId === 'tab_job') {
            // active tab is the right-most visible one
            $activeTab.removeClass('ui-block-a').addClass('ui-block-b');
            $activeTab.prev().addClass('ui-block-a').removeClass('hidden');
          } else {
            $activeTab.next().addClass('ui-block-b').removeClass('hidden');
          }
          this.setVisibilities();
        }
      });
    },
    previousTab       : function () {
      var $leftTab = $('#repo-tabs').find('li.ui-block-a'),
          $rightTab = $leftTab.next();
      $leftTab.removeClass('ui-block-a').addClass('ui-block-b');
      $rightTab.addClass('hidden').removeClass('ui-block-b');
      $leftTab.prev().removeClass('hidden').addClass('ui-block-a');
      this.setVisibilities();
    },
    nextTab           : function () {
      var $rightTab = $('#repo-tabs').find('li.ui-block-b'),
          $leftTab = $rightTab.prev();
      $rightTab.removeClass('ui-block-b').addClass('ui-block-a');
      $leftTab.addClass('hidden').removeClass('ui-block-a');
      $rightTab.next().removeClass('hidden').addClass('ui-block-b');
      this.setVisibilities();
    }
  });
});