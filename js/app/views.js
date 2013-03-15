define([
  'views/SplashView',
  'views/MainView',
  'views/ReposView',
  'views/RepoView',
  'views/BuildsView'
], function (SplashView, MainView, ReposView, RepoView, BuildsView) {
  return {
    SplashView: SplashView,
    MainView: MainView,
    ReposView: ReposView,
    RepoView: RepoView,
    BuildsView: BuildsView
  };
});