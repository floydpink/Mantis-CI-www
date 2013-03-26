define([
  'routes/IndexRoute',
  'routes/SplashRoute',
  'routes/ReposRoute',
  'routes/RepoIndexRoute',
  'routes/RepoRoute',
  'routes/BuildRoute',
  'routes/BuildsRoute'
], function (IndexRoute, SplashRoute, ReposRoute, RepoIndexRoute, RepoRoute, BuildRoute, BuildsRoute) {
  return {
    IndexRoute     : IndexRoute,
    SplashRoute    : SplashRoute,
    ReposRoute     : ReposRoute,
    RepoIndexRoute : RepoIndexRoute,
    RepoRoute      : RepoRoute,
    BuildRoute     : BuildRoute,
    BuildsRoute    : BuildsRoute
  };
});