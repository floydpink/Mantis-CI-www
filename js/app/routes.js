define([
  'routes/IndexRoute',
  'routes/SplashRoute',
  'routes/ReposRoute',
  'routes/RepoIndexRoute',
  'routes/RepoRoute',
  'routes/BuildRoute'
], function (IndexRoute, SplashRoute, ReposRoute, RepoIndexRoute, RepoRoute, BuildRoute) {
  return {
    IndexRoute    : IndexRoute,
    SplashRoute   : SplashRoute,
    ReposRoute    : ReposRoute,
    RepoIndexRoute: RepoIndexRoute,
    RepoRoute     : RepoRoute,
    BuildRoute    : BuildRoute
  };
});