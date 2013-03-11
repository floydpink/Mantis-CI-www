define([
  'views/SplashView',
  'views/ReposView',
  'views/RepoView',
  'views/BuildsView'
], function (SplashView, ReposView, RepoView, BuildsView) {
  return {
    SplashView: SplashView,
    ReposView: ReposView,
    RepoView: RepoView,
    BuildsView: BuildsView
  };
});