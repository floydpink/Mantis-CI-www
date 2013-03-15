define([
  'routes/IndexRoute',
  'routes/SplashRoute',
  'routes/ReposRoute',
  'routes/RepoRoute'
], function (IndexRoute, SplashRoute, ReposRoute, RepoRoute) {
  return {
    IndexRoute: IndexRoute,
    SplashRoute: SplashRoute,
    ReposRoute: ReposRoute,
    RepoRoute: RepoRoute
  };
});