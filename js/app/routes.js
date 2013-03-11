define([
  'routes/IndexRoute',
  'routes/ReposRoute',
  'routes/BuildsRoute'
], function (IndexRoute, ReposRoute, BuildsRoute) {
  return {
    IndexRoute: IndexRoute,
    ReposRoute: ReposRoute,
    BuildsRoute: BuildsRoute
  };
});