define([
  'routes/IndexRoute',
  'routes/ReposRoute',
  'routes/RepoRoute',
  'routes/BuildsRoute'
], function (IndexRoute, ReposRoute, RepoRoute, BuildsRoute) {
  return {
    IndexRoute: IndexRoute,
    ReposRoute: ReposRoute,
    RepoRoute: RepoRoute,
    BuildsRoute: BuildsRoute
  };
});