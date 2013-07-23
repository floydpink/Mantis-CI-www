define([
  'routes/IndexRoute',
  'routes/SplashRoute',
  'routes/FavoritesRoute',
  'routes/ReposRoute',
  'routes/RepoIndexRoute',
  'routes/RepoRoute',
  'routes/BuildRoute',
  'routes/AbstractBuildsRoute',
  'routes/JobRoute'
], function (IndexRoute, SplashRoute, FavoritesRoute, ReposRoute, RepoIndexRoute, RepoRoute, BuildRoute, AbstractBuildsRoute, JobRoute) {
  return {
    IndexRoute       : IndexRoute,
    SplashRoute      : SplashRoute,
    FavoritesRoute   : FavoritesRoute,
    ReposRoute       : ReposRoute,
    RepoIndexRoute   : RepoIndexRoute,
    RepoRoute        : RepoRoute,
    BuildRoute       : BuildRoute,
    BuildsRoute      : AbstractBuildsRoute.extend({
      contentType: 'builds'
    }),
    PullRequestsRoute: AbstractBuildsRoute.extend({
      contentType: 'pull_requests'
    }),
    BranchesRoute    : AbstractBuildsRoute.extend({
      contentType: 'branches'
    }),
    JobRoute         : JobRoute
  };
});