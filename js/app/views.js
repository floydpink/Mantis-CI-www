define([
  'views/SplashView',
  'views/AboutView',
  'views/ReposView',
  'views/SearchView',
  'views/RepoView'
], function (SplashView, AboutView, ReposView, SearchView, RepoView) {
  return {
    SplashView : SplashView,
    AboutView  : AboutView,
    ReposView  : ReposView,
    SearchView : SearchView,
    RepoView   : RepoView
  };
});