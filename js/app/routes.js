define([
  'routes/IndexRoute',
  'routes/SplashRoute',
  'routes/ReposRoute',
  'routes/RepoIndexRoute',
  'routes/RepoRoute',
  'routes/BuildRoute',
  'routes/AbstractBuildsRoute'
], function (IndexRoute, SplashRoute, ReposRoute, RepoIndexRoute, RepoRoute, BuildRoute, AbstractBuildsRoute) {
  return {
    IndexRoute        : IndexRoute,
    SplashRoute       : SplashRoute,
    ReposRoute        : ReposRoute,
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
    })
  };
});