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
  'views/BuildsItemView'
], function (SplashView, AboutView, ReposView, ReposListView, SearchView, RepoView, RepoTabsView, BuildView, BuildsView, BuildsItemView) {
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
    BuildsItemView : BuildsItemView
  };
});