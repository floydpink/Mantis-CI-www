define([
  'views/SplashView',
  'views/AboutView',
  'views/ReposView',
  'views/ReposListView',
  'views/SearchView',
  'views/RepoView',
  'views/BuildView',
  'views/BuildsView',
  'views/BuildsItemView'
], function (SplashView, AboutView, ReposView, ReposListView, SearchView, RepoView, BuildView, BuildsView, BuildsItemView) {
  return {
    SplashView     : SplashView,
    AboutView      : AboutView,
    ReposView      : ReposView,
    ReposListView  : ReposListView,
    SearchView     : SearchView,
    RepoView       : RepoView,
    BuildView      : BuildView,
    BuildsView     : BuildsView,
    BuildsItemView : BuildsItemView
  };
});