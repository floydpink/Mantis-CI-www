define([
  'views/SplashView',
  'views/AboutView',
  'views/ReposView',
  'views/ReposListView',
  'views/SearchView',
  'views/RepoView',
  'views/RepoTabsView',
  'views/BuildView',
  'views/BuildsView',
  'views/BuildsItemView',
  'views/JobsView',
  'views/JobsItemView',
  'views/JobView',
  'views/LogView'
], function (SplashView, AboutView, ReposView, ReposListView, SearchView, RepoView, RepoTabsView, BuildView, BuildsView, BuildsItemView, JobsView, JobsItemView, JobView, LogViews) {
  return {
    SplashView     : SplashView,
    AboutView      : AboutView,
    ReposView      : ReposView,
    ReposListView  : ReposListView,
    SearchView     : SearchView,
    RepoView       : RepoView,
    RepoTabsView   : RepoTabsView,
    BuildView      : BuildView,
    BuildsView     : BuildsView,
    BuildsItemView : BuildsItemView,
    JobsView       : JobsView,
    JobsItemView   : JobsItemView,
    JobView        : JobView,
    LogView        : LogViews.LogView,
    PreView        : LogViews.PreView
  };
});