define([
  'routes/SplashRoute',
  'routes/FavoritesRoute',
  'routes/ReposRoute',
  'routes/ReposIndexRoute',
  'routes/SearchRoute',
  'routes/RepoIndexRoute',
  'routes/RepoRoute',
  'routes/BuildRoute',
  'routes/AbstractBuildsRoute',
  'routes/JobRoute'
], function (SplashRoute, FavoritesRoute, ReposRoute, ReposIndexRoute, SearchRoute, RepoIndexRoute, RepoRoute, BuildRoute, AbstractBuildsRoute, JobRoute) {
  return {
    SplashRoute       : SplashRoute,
    FavoritesRoute    : FavoritesRoute,
    ReposRoute        : ReposRoute,
    ReposIndexRoute   : ReposIndexRoute,
    SearchRoute       : SearchRoute,
    RepoIndexRoute    : RepoIndexRoute,
    RepoRoute         : RepoRoute,
    BuildRoute        : BuildRoute,
    BuildsRoute       : AbstractBuildsRoute.extend({
      contentType : 'builds'
    }),
    PullRequestsRoute : AbstractBuildsRoute.extend({
      contentType : 'pull_requests'
    }),
    BranchesRoute     : AbstractBuildsRoute.extend({
      contentType : 'branches'
    }),
    JobRoute          : JobRoute
  };
});