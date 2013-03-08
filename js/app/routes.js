define([
  'routes/IndexRoute',
  'routes/ReposRoute'
], function (IndexRoute, ReposRoute) {
  return {
    IndexRoute: IndexRoute,
    ReposRoute: ReposRoute
  };
});