define([
  'routes/IndexRoute',
  'routes/SplashRoute',
  'routes/ReposRoute',
  'routes/RepoRoute',
  'routes/BuildsRoute'
], function (IndexRoute, SplashRoute, ReposRoute, RepoRoute, BuildsRoute) {
  return {
    IndexRoute: IndexRoute,
    SplashRoute: SplashRoute,
    ReposRoute: ReposRoute,
    RepoRoute: RepoRoute,
    BuildsRoute: BuildsRoute
  };
});