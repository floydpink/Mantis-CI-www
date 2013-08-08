define([
  'views/SplashView',
  'views/AboutView',
  'views/FavoritesView',
  'views/RepoViews',
  'views/SearchViews',
  'views/RepoTabsView',
  'views/BuildViews',
  'views/JobViews',
  'views/LogView'
], function (SplashView, AboutView, FavoritesView, RepoViews, SearchViews, RepoTabsView, BuildViews, JobViews, LogViews) {
  return {
    SplashView           : SplashView,
    AboutView            : AboutView,
    FavoritesView        : FavoritesView,
    SearchView           : SearchViews.SearchView,
    SearchboxView        : SearchViews.SearchboxView,
    ReposView            : RepoViews.ReposView,
    ReposIndexView       : RepoViews.ReposIndexView,
    ReposListControlView : RepoViews.ReposListControlView,
    ReposListView        : RepoViews.ReposListView,
    RepoView             : RepoViews.RepoView,
    RepoTabsView         : RepoTabsView,
    BuildView            : BuildViews.BuildView,
    BuildsView           : BuildViews.BuildsView,
    BuildsItemView       : BuildViews.BuildsItemView,
    JobsView             : JobViews.JobsView,
    JobsItemView         : JobViews.JobsItemView,
    JobView              : JobViews.JobView,
    LogView              : LogViews.LogView,
    PreView              : LogViews.PreView
  };
});