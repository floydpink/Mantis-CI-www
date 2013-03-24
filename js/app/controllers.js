define([
  'controllers/ReposController',
  'controllers/RepoController',
  'controllers/BuildController'
], function (ReposController, RepoController, BuildController) {
  return {
    ReposController: ReposController,
    RepoController : RepoController,
    BuildController: BuildController
  };
});