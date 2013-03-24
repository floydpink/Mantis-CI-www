define([
  'views/SplashView',
  'views/AboutView',
  'views/ReposView',
  'views/ReposListView',
  'views/SearchView',
  'views/RepoView',
  'views/BuildView'
], function (SplashView, AboutView, ReposView, ReposListView, SearchView, RepoView, BuildView) {
  return {
    SplashView   : SplashView,
    AboutView    : AboutView,
    ReposView    : ReposView,
    ReposListView: ReposListView,
    SearchView   : SearchView,
    RepoView     : RepoView,
    BuildView    : BuildView
  };
});