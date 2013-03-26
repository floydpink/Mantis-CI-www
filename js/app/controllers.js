define([
  'controllers/ReposController',
  'controllers/RepoController',
  'controllers/BuildController',
  'controllers/BuildsController'
], function (ReposController, RepoController, BuildController, BuildsController) {
  return {
    ReposController  : ReposController,
    RepoController   : RepoController,
    BuildController  : BuildController,
    BuildsController : BuildsController
  };
});