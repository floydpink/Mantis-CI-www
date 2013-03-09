define([
  'routes/IndexRoute',
  'routes/ReposRoute',
  'routes/ReposBuildsRoute'
], function (IndexRoute, ReposRoute, ReposBuildsRoute) {
  return {
    IndexRoute: IndexRoute,
    ReposRoute: ReposRoute,
    ReposBuildsRoute: ReposBuildsRoute
  };
});